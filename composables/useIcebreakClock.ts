import {
  estimateNow,
  ICE_CLOCK_TICK_MS,
  isWriteLocked,
  phaseRemainingMs,
  phaseTimerCaption,
  phaseTimerLeftMs,
  phaseTimerTotalMs,
  writeBonusMs,
  writeRemainingMs,
  type IceRoomView,
  type IceTimerMode,
} from "~/utils/icebreak"

type ClockOptions = {
  mode: IceTimerMode
  /** player モード: 読書リワード Lv（0〜5） */
  bonusLevel?: Ref<number>
}

/** サーバー時刻同期 + フェーズタイマー表示（screen / icebreak 共通） */
export function useIcebreakClock(session: Ref<IceRoomView>, options: ClockOptions) {
  const nowMs = ref(Date.now())
  const serverNow = ref(Date.now())
  const syncedAt = ref(Date.now())

  function syncFromSession(view: IceRoomView) {
    serverNow.value = view.serverNow
    syncedAt.value = Date.now()
  }

  const estimatedNow = computed(() =>
    estimateNow(serverNow.value, syncedAt.value, nowMs.value),
  )

  const bonusMs = computed(() =>
    options.mode === "player" && options.bonusLevel
      ? writeBonusMs(options.bonusLevel.value)
      : 0,
  )

  const phaseLeftMs = computed(() =>
    phaseRemainingMs(session.value.phaseEndsAt, estimatedNow.value),
  )

  const writeLeftMs = computed(() => {
    if (options.mode !== "player") return 0
    return writeRemainingMs(
      session.value.drawStartedAt,
      session.value.writeBaseMs,
      bonusMs.value,
      estimatedNow.value,
    )
  })

  const writeLocked = computed(() =>
    options.mode === "player"
      ? isWriteLocked(session.value.phase, writeLeftMs.value)
      : false,
  )

  const timerTotalMs = computed(() =>
    phaseTimerTotalMs(session.value, options.mode, {
      bonusMs: bonusMs.value,
      writeLocked: writeLocked.value,
    }),
  )

  const timerLeftMs = computed(() =>
    phaseTimerLeftMs(session.value, options.mode, estimatedNow.value, {
      bonusMs: bonusMs.value,
      writeLocked: writeLocked.value,
    }),
  )

  const timerCaption = computed(() =>
    phaseTimerCaption(session.value.phase, { writeLocked: writeLocked.value }),
  )

  onMounted(() => {
    const clock = setInterval(() => {
      nowMs.value = Date.now()
    }, ICE_CLOCK_TICK_MS)
    onUnmounted(() => clearInterval(clock))
  })

  return {
    phaseLeftMs,
    writeLeftMs,
    writeLocked,
    timerTotalMs,
    timerLeftMs,
    timerCaption,
    syncFromSession,
    bonusMs,
  }
}
