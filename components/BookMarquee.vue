<template>
  <div
    class="shelf"
    :style="{ '--marquee-duration': `${effectiveDuration}s` }"
  >
    <button
      type="button"
      class="nav nav--prev"
      aria-label="前の本へ"
      @click="nudge(-1)"
    >
      ‹
    </button>

    <div
      ref="marqueeRef"
      class="marquee"
      :class="{ 'marquee--dragging': isDragging, 'marquee--slow': slow }"
      @mouseenter="setSlow(true)"
      @mouseleave="setSlow(false)"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        ref="trackRef"
        class="marquee-track"
        :class="{ 'marquee-track--css': useCssFallback }"
      >
        <div class="group">
          <BookCover
            v-for="book in books"
            :key="`a-${book.id}`"
            large
            :book-id="book.id"
            :title="book.title"
            :kicker="book.kicker"
            :accent="book.accent"
            :progress-viewed="progressMap[book.id]?.viewed"
            :progress-total="progressMap[book.id]?.total"
            @open="emit('open', book.id)"
          />
        </div>
        <div class="group group--clone" aria-hidden="true">
          <BookCover
            v-for="book in books"
            :key="`b-${book.id}`"
            large
            :book-id="book.id"
            :title="book.title"
            :kicker="book.kicker"
            :accent="book.accent"
            :progress-viewed="progressMap[book.id]?.viewed"
            :progress-total="progressMap[book.id]?.total"
            tabindex="-1"
          />
        </div>
      </div>
    </div>

    <button
      type="button"
      class="nav nav--next"
      aria-label="次の本へ"
      @click="nudge(1)"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BookVisual } from "~/utils/bookVisual"

const props = withDefaults(
  defineProps<{
    books: BookVisual[]
    duration?: number
  }>(),
  { duration: 36 },
)

const emit = defineEmits<{
  open: [id: string]
}>()

const { bookProgress } = useBookProgress()

const progressMap = computed(() => {
  const map: Record<string, ReturnType<typeof bookProgress>> = {}
  for (const book of props.books) {
    map[book.id] = bookProgress(book.id)
  }
  return map
})

const marqueeRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const slow = ref(false)
const isDragging = ref(false)
const manualHold = ref(false)
const useCssFallback = ref(false)

const slowFactor = 3.5
let marqueeAnim: Animation | null = null
let manualResumeTimer: ReturnType<typeof setTimeout> | null = null
let watchdogTimer: ReturnType<typeof setInterval> | null = null
let resizeObserver: ResizeObserver | null = null
let dragStartX = 0
let dragStartTime = 0
let dragPointerId: number | null = null

const effectiveDuration = computed(() =>
  props.duration * (slow.value ? slowFactor : 1),
)

function loopDurationMs() {
  return effectiveDuration.value * 1000
}

function loopWidth() {
  return (trackRef.value?.offsetWidth ?? 0) / 2
}

function msPerPixel() {
  const width = loopWidth()
  const duration = loopDurationMs()
  if (!width || !duration) return 1
  return duration / width
}

function currentProgress() {
  const duration = loopDurationMs()
  if (!marqueeAnim || !duration) return 0
  const time = marqueeAnim.currentTime
  if (time === null) return 0
  return (time % duration) / duration
}

function setAnimTime(ms: number) {
  if (!marqueeAnim) return
  const duration = loopDurationMs()
  const normalized = ((ms % duration) + duration) % duration
  marqueeAnim.currentTime = normalized
}

function currentAnimTime() {
  if (!marqueeAnim) return 0
  return marqueeAnim.currentTime ?? 0
}

function bookStepPx() {
  const item = trackRef.value?.querySelector<HTMLElement>(".group:first-child .cover")
  if (!item) return 238
  return item.offsetWidth + 18
}

function supportsWaa() {
  return typeof HTMLElement !== "undefined"
    && typeof HTMLElement.prototype.animate === "function"
}

function startMarquee(progress = 0) {
  const track = trackRef.value
  if (!track || !track.offsetWidth || !props.books.length) return false

  useCssFallback.value = false
  marqueeAnim?.cancel()
  marqueeAnim = null

  if (!supportsWaa()) {
    useCssFallback.value = true
    return true
  }

  try {
    marqueeAnim = track.animate(
      [{ transform: "translate3d(0, 0, 0)" }, { transform: "translate3d(-50%, 0, 0)" }],
      {
        duration: loopDurationMs(),
        iterations: Infinity,
        easing: "linear",
      },
    )

    if (progress > 0) {
      marqueeAnim.currentTime = progress * loopDurationMs()
    }

    marqueeAnim.play()
    return marqueeAnim.playState === "running" || marqueeAnim.playState === "pending"
  } catch {
    useCssFallback.value = true
    marqueeAnim = null
    return true
  }
}

function syncMarquee(forceRestart = false) {
  const track = trackRef.value
  if (!track?.offsetWidth || !props.books.length) return false

  if (useCssFallback.value) return true

  if (!marqueeAnim || forceRestart) {
    return startMarquee(marqueeAnim ? currentProgress() : 0)
  }

  if (marqueeAnim.playState === "running") return true

  if (
    marqueeAnim.playState === "paused"
    && !isDragging.value
    && !manualHold.value
  ) {
    marqueeAnim.play()
    return marqueeAnim.playState === "running"
  }

  if (marqueeAnim.playState === "idle" || marqueeAnim.playState === "finished") {
    return startMarquee(currentProgress())
  }

  return false
}

function bootMarquee(retry = 0) {
  if (syncMarquee(true)) return
  if (retry >= 30) {
    useCssFallback.value = true
    return
  }
  requestAnimationFrame(() => bootMarquee(retry + 1))
}

function pauseForManual() {
  manualHold.value = true
  marqueeAnim?.pause()

  if (manualResumeTimer) clearTimeout(manualResumeTimer)
  manualResumeTimer = setTimeout(() => {
    manualHold.value = false
    manualResumeTimer = null
    if (!isDragging.value) marqueeAnim?.play()
  }, 1200)
}

function nudge(direction: -1 | 1) {
  if (useCssFallback.value) return
  if (!marqueeAnim) syncMarquee(true)
  if (!marqueeAnim) return

  marqueeAnim.pause()
  setAnimTime(currentAnimTime() + direction * bookStepPx() * msPerPixel())
  pauseForManual()
}

function setSlow(next: boolean) {
  if (slow.value === next) return
  const progress = currentProgress()
  slow.value = next

  if (useCssFallback.value) return

  startMarquee(progress)
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || useCssFallback.value) return
  if (!marqueeAnim) syncMarquee(true)
  if (!marqueeAnim) return

  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartTime = currentAnimTime()
}

function onPointerMove(event: PointerEvent) {
  if (dragPointerId !== event.pointerId || !marqueeAnim || useCssFallback.value) return

  const deltaX = event.clientX - dragStartX
  if (!isDragging.value && Math.abs(deltaX) < 8) return

  if (!isDragging.value) {
    isDragging.value = true
    manualHold.value = true
    marqueeAnim.pause()
    marqueeRef.value?.setPointerCapture(event.pointerId)
  }

  event.preventDefault()
  setAnimTime(dragStartTime - deltaX * msPerPixel())
}

function onPointerUp(event: PointerEvent) {
  if (dragPointerId !== event.pointerId) return

  if (isDragging.value) {
    isDragging.value = false
    marqueeRef.value?.releasePointerCapture(event.pointerId)
    pauseForManual()
  }

  dragPointerId = null
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") bootMarquee()
}

watch(trackRef, (track) => {
  resizeObserver?.disconnect()
  if (!track || typeof ResizeObserver === "undefined") return

  resizeObserver = new ResizeObserver(() => {
    if (!track.offsetWidth) return
    syncMarquee(false)
  })
  resizeObserver.observe(track)
}, { immediate: true })

onMounted(() => {
  bootMarquee()
  document.addEventListener("visibilitychange", onVisibilityChange)
  watchdogTimer = setInterval(() => {
    if (isDragging.value || manualHold.value) return
    syncMarquee(false)
  }, 2000)
})

onBeforeUnmount(() => {
  marqueeAnim?.cancel()
  marqueeAnim = null
  resizeObserver?.disconnect()
  if (manualResumeTimer) clearTimeout(manualResumeTimer)
  if (watchdogTimer) clearInterval(watchdogTimer)
  document.removeEventListener("visibilitychange", onVisibilityChange)
})

watch(
  () => props.duration,
  () => {
    if (useCssFallback.value) return
    startMarquee(currentProgress())
  },
)

watch(
  () => props.books.length,
  () => nextTick(() => bootMarquee()),
)
</script>

<style scoped>
.shelf {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 8px;
  --marquee-duration: 36s;
}

.marquee {
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
  cursor: grab;
  touch-action: pan-x;
  mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
}

.marquee--dragging {
  cursor: grabbing;
  user-select: none;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  pointer-events: none;
}

.marquee-track--css {
  animation: marquee-flow var(--marquee-duration, 36s) linear infinite;
}

.group {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  padding: 12px 9px 20px;
  flex: 0 0 auto;
  pointer-events: auto;
}

.group--clone {
  pointer-events: none;
}

.nav {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--ink);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 14px rgb(1 172 224 / 0.18);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav:hover {
  transform: scale(1.05);
}

@keyframes marquee-flow {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

@media (max-width: 720px) {
  .shelf {
    gap: 4px;
    padding: 0 4px;
  }

  .nav {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }
}
</style>
