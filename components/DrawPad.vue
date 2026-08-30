<template>
  <div class="pad">
    <div v-if="!locked" class="tools" role="toolbar" aria-label="お絵かき">
      <div class="swatches" role="group" aria-label="色">
        <button
          v-for="item in COLORS"
          :key="item.id"
          type="button"
          class="swatch"
          :class="{ 'swatch--on': tool === 'pen' && color === item.hex }"
          :style="{ '--swatch': item.hex }"
          :aria-label="item.name"
          :aria-pressed="tool === 'pen' && color === item.hex"
          @click="pickColor(item.hex)"
        />
      </div>

      <button
        type="button"
        class="tool"
        :class="{ 'tool--on': tool === 'erase' }"
        :aria-pressed="tool === 'erase'"
        @click="tool = 'erase'"
      >
        消しゴム
      </button>

      <div class="history">
        <button type="button" class="tool" :disabled="!canUndo" @click="undo">戻す</button>
        <button type="button" class="tool" :disabled="!canRedo" @click="redo">進める</button>
      </div>

      <button type="button" class="tool tool--clear" :disabled="!hasInk" @click="clear">
        全部消す
      </button>
    </div>

    <canvas
      ref="canvasRef"
      class="board"
      :class="{ 'board--locked': locked, 'board--erase': !locked && tool === 'erase' }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    />
  </div>
</template>

<script setup lang="ts">
const COLORS = [
  { id: "ink", name: "紺", hex: "#16343c" },
  { id: "nano", name: "青", hex: "#01ace0" },
  { id: "coral", name: "赤", hex: "#ee6d7a" },
  { id: "sun", name: "黄", hex: "#efb22a" },
  { id: "leaf", name: "緑", hex: "#2fbea6" },
  { id: "violet", name: "紫", hex: "#6b79e4" },
] as const

const HISTORY_MAX = 12

const props = defineProps<{
  locked?: boolean
}>()

const emit = defineEmits<{
  ink: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const hasInk = ref(false)
const drawing = ref(false)
const stroked = ref(false)
const tool = ref<"pen" | "erase">("pen")
const color = ref<string>(COLORS[0].hex)
const canUndo = ref(false)
const canRedo = ref(false)

let last: { x: number; y: number } | null = null
const past: ImageData[] = []
const future: ImageData[] = []
let resizeObserver: ResizeObserver | undefined

function syncCanvasSize() {
  const canvas = canvasRef.value
  if (!canvas) return

  const cssWidth = Math.max(1, Math.round(canvas.clientWidth))
  const cssHeight = Math.max(1, Math.round(canvas.clientHeight))
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const pixelWidth = Math.round(cssWidth * dpr)
  const pixelHeight = Math.round(cssHeight * dpr)

  if (canvas.width === pixelWidth && canvas.height === pixelHeight) return

  const snapshot = canvas.width > 0 ? capture() : null
  canvas.width = pixelWidth
  canvas.height = pixelHeight

  const context = ctx()
  if (!context) return
  fillWhite()

  if (snapshot) {
    context.putImageData(snapshot, 0, 0)
    pushHistory()
    return
  }

  pushHistory()
}

function ctx() {
  return canvasRef.value?.getContext("2d", { willReadFrequently: true })
}

function fillWhite() {
  const context = ctx()
  const canvas = canvasRef.value
  if (!context || !canvas) return
  context.globalCompositeOperation = "source-over"
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function capture(): ImageData | null {
  const context = ctx()
  const canvas = canvasRef.value
  if (!context || !canvas) return null
  return context.getImageData(0, 0, canvas.width, canvas.height)
}

function restore(data: ImageData) {
  ctx()?.putImageData(data, 0, 0)
}

function pushHistory() {
  const shot = capture()
  if (!shot) return
  past.push(shot)
  if (past.length > HISTORY_MAX) past.shift()
  future.length = 0
  syncHistory()
}

function syncHistory() {
  canUndo.value = past.length > 1
  canRedo.value = future.length > 0
}

function markInk() {
  if (!hasInk.value) {
    hasInk.value = true
    emit("ink")
  }
}

function pickColor(hex: string) {
  color.value = hex
  tool.value = "pen"
}

function undo() {
  if (props.locked || past.length <= 1) return
  const current = past.pop()
  if (current) future.push(current)
  const prev = past[past.length - 1]
  if (prev) restore(prev)
  hasInk.value = past.length > 1
  syncHistory()
}

function redo() {
  if (props.locked || !future.length) return
  const next = future.pop()
  if (!next) return
  past.push(next)
  restore(next)
  hasInk.value = past.length > 1
  syncHistory()
}

function point(event: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  }
}

function paint(from: { x: number; y: number }, to: { x: number; y: number }) {
  const context = ctx()
  if (!context) return
  if (tool.value === "erase") {
    context.globalCompositeOperation = "destination-out"
    context.strokeStyle = "rgba(0,0,0,1)"
    context.lineWidth = 18
  } else {
    context.globalCompositeOperation = "source-over"
    context.strokeStyle = color.value
    context.lineWidth = 5.5
  }
  context.lineCap = "round"
  context.lineJoin = "round"
  context.beginPath()
  context.moveTo(from.x, from.y)
  context.lineTo(to.x, to.y)
  context.stroke()
  stroked.value = true
  if (tool.value === "pen") markInk()
}

function onDown(event: PointerEvent) {
  if (props.locked) return
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.setPointerCapture(event.pointerId)
  drawing.value = true
  stroked.value = false
  last = point(event)
  paint(last, last)
}

function onMove(event: PointerEvent) {
  if (props.locked || !drawing.value || !last) return
  const next = point(event)
  paint(last, next)
  last = next
}

function onUp() {
  if (drawing.value && stroked.value) {
    pushHistory()
    if (tool.value === "erase") {
      hasInk.value = past.length > 1
    }
  }
  drawing.value = false
  last = null
}

function clear() {
  if (props.locked) return
  fillWhite()
  hasInk.value = false
  past.length = 0
  future.length = 0
  pushHistory()
}

function toImage() {
  const canvas = canvasRef.value
  if (!canvas || !hasInk.value) return null
  return canvas.toDataURL("image/jpeg", 0.72)
}

function reset() {
  fillWhite()
  hasInk.value = false
  drawing.value = false
  last = null
  past.length = 0
  future.length = 0
  pushHistory()
}

function onKey(event: KeyboardEvent) {
  if (props.locked) return
  const mod = event.ctrlKey || event.metaKey
  if (!mod) return
  if (event.key === "z" && event.shiftKey) {
    event.preventDefault()
    redo()
  } else if (event.key === "z") {
    event.preventDefault()
    undo()
  } else if (event.key === "y") {
    event.preventDefault()
    redo()
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(() => syncCanvasSize())
  if (canvasRef.value) resizeObserver.observe(canvasRef.value)
  syncCanvasSize()
  window.addEventListener("keydown", onKey)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener("keydown", onKey)
})

defineExpose({
  toImage,
  reset,
  hasInk,
})
</script>

<style scoped>
.pad {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.swatches {
  display: flex;
  gap: 6px;
}

.swatch {
  appearance: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  background: var(--swatch);
  border: 2px solid #fff;
  box-shadow: inset 0 0 0 1px rgb(22 52 60 / 0.18);
  cursor: pointer;
}

.swatch--on {
  box-shadow: 0 0 0 2px var(--nano);
}

.tool {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  min-height: var(--touch-min);
  background: var(--island);
  color: var(--ink);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--line);
}

.tool--on {
  background: var(--nano);
  color: #fff;
  box-shadow: none;
}

.tool:disabled {
  opacity: 0.35;
  cursor: default;
}

.history {
  display: flex;
  gap: 6px;
}

.tool--clear {
  margin-left: auto;
}

.board {
  flex: 1;
  min-height: 0;
  width: 100%;
  aspect-ratio: 3 / 2;
  max-height: 100%;
  display: block;
  background: #fff;
  border-radius: 16px;
  touch-action: none;
  cursor: crosshair;
  box-shadow: inset 0 0 0 1px var(--line);
}

.board--erase {
  cursor: cell;
}

.board--locked {
  cursor: default;
  filter: saturate(0.92);
}

@media (max-width: 720px) {
  .tools {
    position: sticky;
    top: 0;
    z-index: 1;
    padding-bottom: 4px;
    background: linear-gradient(#e7f7fc 70%, rgb(231 247 252 / 0));
  }

  .swatch {
    width: 32px;
    height: 32px;
  }

  .tool--clear {
    margin-left: 0;
    flex: 1 1 100%;
  }
}
</style>
