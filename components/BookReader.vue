<template>
  <div v-if="visual && content" class="reader">
    <article class="page page--text">
      <p class="phase">{{ spread.phase }}</p>
      <p class="kicker">{{ visual.kicker }} · {{ index + 1 }}/{{ content.spreads.length }}</p>
      <h1><BookRichText :text="spread.title" /></h1>
      <p class="body"><BookRichText :text="spread.body" /></p>
      <ul v-if="spread.points?.length" class="points">
        <li v-for="point in spread.points" :key="point">
          <BookRichText :text="point" />
        </li>
      </ul>
      <p v-if="spread.note" class="footnote">
        <a
          v-if="isUrl(spread.note)"
          :href="spread.note"
          target="_blank"
          rel="noopener"
        >{{ spread.note }}</a>
        <BookRichText v-else :text="spread.note" />
      </p>

      <div class="dots" aria-hidden="true">
        <span
          v-for="(_, i) in content.spreads"
          :key="i"
          class="dot"
          :class="{
            'dot--on': i === index,
            'dot--read': isSpreadViewed(bookId, i),
          }"
        />
      </div>

      <div class="nav">
        <button type="button" class="btn btn--ghost" :disabled="index === 0" @click="prev">
          前へ
        </button>
        <button v-if="index < content.spreads.length - 1" type="button" class="btn" @click="next">
          次へ
        </button>
        <button v-else type="button" class="btn btn--ghost" @click="emit('close')">
          とじる
        </button>
      </div>
    </article>

    <aside class="page page--art" :style="{ '--accent': visual.accent }">
      <BookScene :scene="spread.scene" :accent="visual.accent" :portal="portal" />
      <NanoGuide class="guide" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { contentOf } from "~/utils/bookContent"
import { visualOf } from "~/utils/bookVisual"

type PortalData = {
  period: string
  requiredDays: string
  optionalDays: string
  venue: string
  zoom: string
  courses: string
  prizeNote?: string
  taskOutline: string
  links: { label: string; href: string }[]
}

const props = defineProps<{
  bookId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const visual = computed(() => visualOf(props.bookId))
const content = computed(() => contentOf(props.bookId))
const index = ref(0)
const { markSpreadViewed, isSpreadViewed, syncFromStorage } = useBookProgress()

const spread = computed(() => content.value!.spreads[index.value]!)

function recordSpreadView() {
  if (!content.value) return
  markSpreadViewed(props.bookId, index.value)
}

const portal = ref<PortalData | null>(null)

async function loadPortal() {
  if (props.bookId !== "intern") {
    portal.value = null
    return
  }
  portal.value = await $fetch("/api/portal")
}

function next() {
  if (!content.value) return
  if (index.value < content.value.spreads.length - 1) {
    index.value += 1
    recordSpreadView()
  }
}

function prev() {
  if (index.value > 0) index.value -= 1
}

function isUrl(text: string) {
  return /^https?:\/\//.test(text)
}

watch(
  () => props.bookId,
  () => {
    index.value = 0
    loadPortal()
    nextTick(recordSpreadView)
  },
  { immediate: true },
)

onMounted(() => {
  syncFromStorage()
})
</script>

<style scoped>
.reader {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
}

.page {
  min-width: 0;
  min-height: 0;
}

.page--text {
  padding: 32px 28px 20px 32px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.phase {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--nano);
}

.kicker {
  margin: 8px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--muted);
  font-weight: 700;
}

h1 {
  margin: 16px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.35;
}

h1 :deep(.em-bold) {
  font-weight: 900;
}

h1 :deep(.em-mark) {
  background: linear-gradient(transparent 62%, rgb(255 230 120 / 0.82) 62%);
}

.body :deep(.em-bold),
.points :deep(.em-bold),
.footnote :deep(.em-bold) {
  font-weight: 800;
}

.body {
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--ink);
}

.points {
  margin: 14px 0 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 1.65;
  color: rgb(22 52 60 / 0.92);
}

.points li::marker {
  color: var(--nano);
}

.footnote {
  margin: 14px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgb(1 172 224 / 0.08);
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.footnote a {
  color: var(--nano);
  word-break: break-all;
}

.dots {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--line);
}

.dot--on {
  background: var(--nano);
  transform: scale(1.15);
}

.dot--read {
  background: var(--leaf);
}

.dot--read.dot--on {
  background: var(--nano);
  box-shadow: 0 0 0 2px rgb(47 190 166 / 0.35);
}

.nav {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding-top: 20px;
}

.btn {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 12px 20px;
  min-height: var(--touch-min);
  background: var(--nano);
  color: #fff;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn--ghost {
  background: transparent;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--line);
}

.page--art {
  background: var(--accent);
  position: relative;
  overflow: hidden;
}

.page--art :deep(.scene) {
  position: absolute;
  inset: 0;
}

.guide {
  position: absolute;
  right: 20px;
  bottom: 16px;
  width: 100px;
  height: 100px;
  opacity: 0.9;
  pointer-events: none;
}

@media (max-width: 720px) {
  .reader {
    grid-template-columns: 1fr;
  }

  .page--text {
    padding: 20px 16px;
  }

  .page--art {
    min-height: clamp(180px, 38dvh, 280px);
  }

  .nav {
    position: sticky;
    bottom: 0;
    background: var(--island);
    padding-bottom: 8px;
  }
}
</style>
