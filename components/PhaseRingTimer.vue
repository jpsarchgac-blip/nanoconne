<template>
  <div class="ring" :style="{ width: `${size}px`, height: `${size}px` }" role="timer" :aria-label="label">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="track" cx="50" cy="50" r="42" />
      <circle class="fill" cx="50" cy="50" r="42" :style="fillStyle" />
    </svg>
    <span class="sec">{{ secLabel }}</span>
    <span v-if="caption" class="cap">{{ caption }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    leftMs: number
    totalMs: number
    label?: string
    caption?: string
    size?: number
  }>(),
  {
    label: "",
    caption: "",
    size: 88,
  },
)

const R = 42
const C = 2 * Math.PI * R

const progress = computed(() => {
  if (props.totalMs <= 0) return 0
  return Math.max(0, Math.min(1, props.leftMs / props.totalMs))
})

const fillStyle = computed(() => ({
  strokeDasharray: `${C}`,
  strokeDashoffset: `${C * (1 - progress.value)}`,
}))

const secLabel = computed(() => `${Math.max(0, Math.ceil(props.leftMs / 1000))}`)
</script>

<style scoped>
.ring {
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.track {
  fill: none;
  stroke: rgb(1 172 224 / 0.16);
  stroke-width: 8;
}

.fill {
  fill: none;
  stroke: var(--nano, #01ace0);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.25s linear;
}

.sec {
  position: absolute;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--ink, #16343c);
  line-height: 1;
}

.cap {
  position: absolute;
  bottom: 4px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: var(--muted, #5b7178);
}
</style>
