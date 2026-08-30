<template>
  <div
    ref="rootRef"
    class="nanosuke"
    :class="{ talking: speak, interactive, hovering }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onClick"
  >
    <Teleport v-if="overlayBubble" to="body">
      <Transition name="bubble">
        <p
          v-if="speak && line"
          :key="line"
          class="bubble bubble--overlay"
          :style="bubbleStyle"
        >
          {{ line }}
        </p>
      </Transition>
    </Teleport>
    <Transition v-else name="bubble">
      <p v-if="speak && line" :key="line" class="bubble">{{ line }}</p>
    </Transition>
    <span class="wrap">
      <img
        ref="guideRef"
        class="guide"
        src="/sozai/nanosuke.png"
        alt="ナノ助"
        width="1000"
        height="1000"
        decoding="async"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { pickNanosukeLine } from "~/utils/nanosukeLines"

const props = withDefaults(
  defineProps<{
    speak?: boolean
    intervalMs?: number
    interactive?: boolean
    overlayBubble?: boolean
  }>(),
  {
    speak: false,
    intervalMs: 4200,
    interactive: false,
    overlayBubble: false,
  },
)

type MotionKind = "byo" | "gyu" | "bounce" | "wobble"

const line = ref("")
const hovering = ref(false)
const rootRef = ref<HTMLElement>()
const guideRef = ref<HTMLImageElement>()
const bubbleStyle = ref<Record<string, string>>({})

let timer: ReturnType<typeof setInterval> | undefined
let resizeObserver: ResizeObserver | undefined
let motionAnim: Animation | null = null

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickSign() {
  return Math.random() > 0.5 ? 1 : -1
}

function tf(scaleX: number, scaleY: number, rotate = 0, translateY = 0) {
  return `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg) translateY(${translateY}px)`
}

function clearMotion() {
  motionAnim?.cancel()
  motionAnim = null
  guideRef.value?.getAnimations().forEach((anim) => anim.cancel())
  if (guideRef.value) guideRef.value.style.transform = ""
}

function pickMotion(): MotionKind {
  const kinds: MotionKind[] = ["byo", "gyu", "bounce", "wobble"]
  return kinds[Math.floor(Math.random() * kinds.length)]!
}

function buildKeyframes(kind: MotionKind, sign: number): Keyframe[] {
  switch (kind) {
    case "byo":
      return [
        { transform: tf(1, 1, 0, 0), offset: 0 },
        { transform: tf(0.58, 2.05, sign * 2, -18), offset: 0.12 },
        { transform: tf(0.58, 2.05, sign * 2, -18), offset: 0.3 },
        { transform: tf(1.18, 0.62, sign * 6, 6), offset: 0.52 },
        { transform: tf(0.9, 1.18, sign * 4, 0), offset: 0.76 },
        { transform: tf(1, 1, sign * 5, 0), offset: 1 },
      ]
    case "gyu":
      return [
        { transform: tf(1, 1, 0, 0), offset: 0 },
        { transform: tf(1.92, 0.42, sign * 4, 0), offset: 0.14 },
        { transform: tf(1.92, 0.42, sign * 4, 0), offset: 0.32 },
        { transform: tf(0.62, 1.45, sign * -2, -5), offset: 0.54 },
        { transform: tf(1.12, 0.78, sign * 3, 0), offset: 0.78 },
        { transform: tf(1, 1, sign * 4, 0), offset: 1 },
      ]
    case "bounce":
      return [
        { transform: tf(1, 1, sign * 4, 0), offset: 0 },
        { transform: tf(1.04, 0.94, sign * 5, -20), offset: 0.22 },
        { transform: tf(0.98, 1.04, sign * 5, 0), offset: 0.44 },
        { transform: tf(1.03, 0.96, sign * 5, -10), offset: 0.66 },
        { transform: tf(1, 1, sign * 5, 0), offset: 1 },
      ]
    case "wobble":
      return [
        { transform: tf(1, 1, 0, 0), offset: 0 },
        { transform: tf(1.04, 0.98, sign * 20, 0), offset: 0.2 },
        { transform: tf(0.98, 1.04, sign * -16, -2), offset: 0.4 },
        { transform: tf(1.02, 0.96, sign * 12, 0), offset: 0.6 },
        { transform: tf(1, 1, sign * -8, 0), offset: 0.8 },
        { transform: tf(1, 1, sign * 4, 0), offset: 1 },
      ]
  }
}

function playRandomMotion() {
  const guide = guideRef.value
  if (!guide || !props.interactive) return

  clearMotion()

  const sign = pickSign()
  const kind = pickMotion()
  const keyframes = buildKeyframes(kind, sign)

  motionAnim = guide.animate(keyframes, {
    duration: kind === "byo" || kind === "gyu" ? rand(1300, 1700) : rand(1000, 1400),
    easing: "cubic-bezier(0.34, 1.45, 0.64, 1)",
    fill: "forwards",
  })
}

function startBob() {
  const guide = guideRef.value
  if (!guide || !props.speak || hovering.value) return

  clearMotion()
  motionAnim = guide.animate(
    [{ transform: tf(1, 1, 0, 0) }, { transform: tf(1, 1, 0, -5) }, { transform: tf(1, 1, 0, 0) }],
    { duration: 2400, iterations: Infinity, easing: "ease-in-out" },
  )
}

function resetMotion() {
  const guide = guideRef.value
  if (!guide) return

  const current = getComputedStyle(guide).transform
  motionAnim?.cancel()
  motionAnim = guide.animate([{ transform: current }, { transform: tf(1, 1, 0, 0) }], {
    duration: 280,
    easing: "ease-out",
    fill: "forwards",
  })
  motionAnim.addEventListener(
    "finish",
    () => {
      guide.style.transform = ""
      startBob()
    },
    { once: true },
  )
}

function nextLine() {
  line.value = pickNanosukeLine(line.value)
}

function placeBubble() {
  if (!props.overlayBubble || !props.speak || !rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  bubbleStyle.value = {
    top: `${Math.round(rect.top - 10)}px`,
    left: `${Math.round(rect.right)}px`,
    maxWidth: `${Math.min(280, Math.max(200, rect.width * 2))}px`,
  }
}

function onEnter() {
  if (!props.interactive) return
  hovering.value = true
  playRandomMotion()
}

function onLeave() {
  hovering.value = false
  resetMotion()
}

function onClick() {
  if (!props.speak) return
  nextLine()
  if (props.interactive) playRandomMotion()
}

if (import.meta.client && props.speak) {
  nextLine()
}

watch(line, async () => {
  await nextTick()
  placeBubble()
})

onMounted(() => {
  if (props.speak) {
    if (!line.value) nextLine()
    timer = setInterval(nextLine, props.intervalMs)
    startBob()
  }

  if (!props.overlayBubble) return

  placeBubble()
  window.addEventListener("resize", placeBubble)
  window.addEventListener("scroll", placeBubble, true)

  if (rootRef.value) {
    resizeObserver = new ResizeObserver(placeBubble)
    resizeObserver.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  clearMotion()
  if (!props.overlayBubble) return
  window.removeEventListener("resize", placeBubble)
  window.removeEventListener("scroll", placeBubble, true)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.nanosuke {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 4px;
  z-index: 2;
  margin: 0;
  max-width: min(240px, 52vw);
  padding: 10px 14px;
  background: var(--island);
  border: 2px solid var(--nano);
  border-radius: 18px 18px 4px 18px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--ink);
  white-space: normal;
  box-shadow: 0 8px 24px rgb(1 172 224 / 0.12);
}

.bubble--overlay {
  position: fixed;
  bottom: auto;
  right: auto;
  z-index: 30;
  pointer-events: none;
  transform: translate(-100%, -100%);
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.bubble--overlay.bubble-enter-from,
.bubble--overlay.bubble-leave-to {
  transform: translate(-100%, calc(-100% + 6px));
}

.interactive {
  cursor: pointer;
}

.wrap {
  display: inline-block;
  line-height: 0;
  width: 128px;
  height: 128px;
}

.guide {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  mix-blend-mode: screen;
  transform-origin: 50% 88%;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .guide {
    animation: none !important;
  }
}
</style>
