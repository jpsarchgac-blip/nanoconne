import { bookContents, contentOf } from "~/utils/bookContent"

const STORAGE_KEY = "peratto-progress"

/** 読書リワード Lv 判定の閾値（localStorage のみ・デバイス間非共有） */
const REWARD_THRESHOLDS = {
  level2Pages: 5,
  level3Ratio: 0.5,
  level4Ratio: 0.75,
} as const

type ProgressState = {
  viewed: Record<string, number[]>
}

function emptyState(): ProgressState {
  return { viewed: {} }
}

function loadState(): ProgressState {
  if (!import.meta.client) return emptyState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
  } catch {
    /* ignore */
  }
  return emptyState()
}

function saveState(state: ProgressState) {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export type BookProgressSlice = {
  viewed: number
  total: number
  ratio: number
}

export type RewardLevel = {
  level: number
  label: string
  nextAt: number
}

export function useBookProgress() {
  const state = useState<ProgressState>("book-progress", emptyState)

  function syncFromStorage() {
    state.value = loadState()
  }

  if (import.meta.client) {
    onMounted(syncFromStorage)
  }

  function markSpreadViewed(bookId: string, spreadIndex: number) {
    if (!contentOf(bookId)) return
    const total = contentOf(bookId)!.spreads.length
    if (spreadIndex < 0 || spreadIndex >= total) return

    const current = state.value.viewed[bookId] ?? []
    if (current.includes(spreadIndex)) return

    state.value = {
      viewed: {
        ...state.value.viewed,
        [bookId]: [...current, spreadIndex].sort((a, b) => a - b),
      },
    }
    saveState(state.value)
  }

  const totalSpreads = computed(() =>
    bookContents.reduce((sum, book) => sum + book.spreads.length, 0),
  )

  const viewedCount = computed(() =>
    Object.values(state.value.viewed).reduce((sum, indices) => sum + indices.length, 0),
  )

  const progressRatio = computed(() => {
    if (!totalSpreads.value) return 0
    return viewedCount.value / totalSpreads.value
  })

  const completedBooks = computed(() =>
    bookContents.filter((book) => {
      const viewed = state.value.viewed[book.id]?.length ?? 0
      return viewed >= book.spreads.length
    }).length,
  )

  function bookProgress(bookId: string): BookProgressSlice {
    const total = contentOf(bookId)?.spreads.length ?? 0
    const viewed = state.value.viewed[bookId]?.length ?? 0
    return {
      viewed,
      total,
      ratio: total ? viewed / total : 0,
    }
  }

  function isSpreadViewed(bookId: string, spreadIndex: number) {
    return state.value.viewed[bookId]?.includes(spreadIndex) ?? false
  }

  const rewardLevel = computed((): RewardLevel => {
    const viewed = viewedCount.value
    const total = totalSpreads.value

    if (viewed === 0) {
      return { level: 0, label: "本をめくって、リワードをためよう", nextAt: 1 }
    }
    if (viewed >= total) {
      return { level: 5, label: "全部読んだ！リワード満タン", nextAt: total }
    }
    if (viewed >= Math.ceil(total * REWARD_THRESHOLDS.level4Ratio)) {
      return { level: 4, label: "もうすぐ全部の本", nextAt: total }
    }
    if (viewed >= Math.ceil(total * REWARD_THRESHOLDS.level3Ratio)) {
      return { level: 3, label: "半分以上、見えてきた", nextAt: Math.ceil(total * REWARD_THRESHOLDS.level4Ratio) }
    }
    if (viewed >= REWARD_THRESHOLDS.level2Pages) {
      return { level: 2, label: "リワードがたまってきた", nextAt: Math.ceil(total * REWARD_THRESHOLDS.level3Ratio) }
    }
    return { level: 1, label: "最初のページ！", nextAt: REWARD_THRESHOLDS.level2Pages }
  })

  const pagesUntilNext = computed(() =>
    Math.max(0, rewardLevel.value.nextAt - viewedCount.value),
  )

  return {
    state,
    syncFromStorage,
    markSpreadViewed,
    isSpreadViewed,
    bookProgress,
    viewedCount,
    totalSpreads,
    progressRatio,
    completedBooks,
    rewardLevel,
    pagesUntilNext,
  }
}
