<template>
  <svg
    class="chart"
    viewBox="0 0 220 210"
    role="img"
    :aria-label="`おもしろさ ${funny}、きれいさ ${beauty}、わかりやすさ ${clear}`"
  >
    <polygon
      v-for="ring in rings"
      :key="ring"
      class="grid"
      :points="polygon(ring)"
    />
    <polygon class="fill" :points="polygonPoints" />
    <line
      v-for="(pt, i) in axisEnds"
      :key="`a-${i}`"
      class="axis"
      x1="110"
      y1="108"
      :x2="pt.x"
      :y2="pt.y"
    />
    <text
      v-for="label in labels"
      :key="label.id"
      class="label"
      :x="label.x"
      :y="label.y"
      text-anchor="middle"
    >
      {{ label.text }}
    </text>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  funny: number
  beauty: number
  clear: number
}>()

const CX = 110
const CY = 108
const R = 72
const ANGLES = [-90, 30, 150]

const rings = [1, 2, 3, 4, 5]

function point(score: number, angleDeg: number) {
  const t = (Math.min(5, Math.max(0, score)) / 5) * R
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + Math.cos(rad) * t,
    y: CY + Math.sin(rad) * t,
  }
}

function polygon(score: number) {
  return ANGLES.map((angle) => {
    const p = point(score, angle)
    return `${p.x},${p.y}`
  }).join(" ")
}

const polygonPoints = computed(() =>
  [
    point(props.funny, ANGLES[0]!),
    point(props.beauty, ANGLES[1]!),
    point(props.clear, ANGLES[2]!),
  ]
    .map((p) => `${p.x},${p.y}`)
    .join(" "),
)

const axisEnds = computed(() => ANGLES.map((angle) => point(5, angle)))

const labels = computed(() => [
  { id: "funny", text: "おもしろさ", x: 110, y: 18 },
  { id: "beauty", text: "きれいさ", x: 188, y: 186 },
  { id: "clear", text: "わかりやすさ", x: 32, y: 186 },
])
</script>

<style scoped>
.chart {
  width: min(100%, 240px);
  height: auto;
  display: block;
  margin: 0 auto;
}

.grid {
  fill: none;
  stroke: rgb(22 52 60 / 0.12);
  stroke-width: 1;
}

.axis {
  stroke: rgb(22 52 60 / 0.18);
  stroke-width: 1;
}

.fill {
  fill: rgb(1 172 224 / 0.35);
  stroke: var(--nano, #01ace0);
  stroke-width: 2;
}

.label {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 11px;
  font-weight: 700;
  fill: var(--ink, #16343c);
}
</style>
