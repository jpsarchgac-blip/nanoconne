<template>
  <div ref="swarmRef" class="swarm" aria-hidden="true">
    <span
      v-for="(ghost, index) in ghosts"
      :key="ghost.color"
      class="ghost"
      :style="{
        '--ghost-color': ghost.color,
        '--ghost-opacity': ghost.opacity,
        '--ghost-size': `${ghost.size}px`,
        transform: ghost.transform,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { bookVisuals } from "~/utils/bookVisual"

type Ghost = {
  color: string
  size: number
  opacity: number
  mirror: number
  scale: number
  roamer: boolean
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  spin: number
  phase: number
  driftSpeed: number
  transform: string
}

const SWARM_COLORS = [
  ...bookVisuals.map((book) => book.accent),
  "#0189B3",
  "#F5A0A8",
  "#A8B0F0",
  "#8EDFD0",
  "#F5D080",
].slice(0, 10)

const OUTSIDE_PAD = 140

const swarmRef = ref<HTMLElement>()
const ghosts = ref<Ghost[]>([])

let frameId = 0
let bounds = { w: 0, h: 0 }
let tickTime = 0

function createGhost(color: string, index: number): Ghost {
  const size = 52 + (index % 3) * 16
  const heading = Math.random() * Math.PI * 2
  const speed = 0.28 + Math.random() * 0.32
  return {
    color,
    size,
    opacity: 0.78 + (index % 3) * 0.06,
    mirror: index % 2 === 0 ? 1 : -1,
    scale: 0.88 + (index % 4) * 0.06,
    roamer: index >= 5,
    x: 0,
    y: 0,
    vx: Math.cos(heading) * speed,
    vy: Math.sin(heading) * speed,
    angle: (Math.random() - 0.5) * 40,
    spin: (Math.random() - 0.5) * 0.18,
    phase: Math.random() * Math.PI * 2,
    driftSpeed: 0.18 + Math.random() * 0.22,
    transform: "",
  }
}

function spawnOutside(width: number, height: number, size: number) {
  const edge = Math.floor(Math.random() * 4)
  const spread = OUTSIDE_PAD + Math.random() * 100
  switch (edge) {
    case 0:
      return { x: -spread, y: Math.random() * height }
    case 1:
      return { x: width - size + spread, y: Math.random() * height }
    case 2:
      return { x: Math.random() * width, y: -spread }
    default:
      return { x: Math.random() * width, y: height - size + spread }
  }
}

function buildGhosts(width: number, height: number) {
  const list = SWARM_COLORS.map((color, index) => createGhost(color, index))
  const innerMargin = width * 0.12
  const placed: Ghost[] = []

  for (const ghost of list) {
    if (ghost.roamer) {
      const spot = spawnOutside(width, height, ghost.size)
      ghost.x = spot.x
      ghost.y = spot.y
      placed.push(ghost)
      continue
    }

    let done = false
    for (let attempt = 0; attempt < 160; attempt++) {
      const x = innerMargin + Math.random() * (width - innerMargin * 2 - ghost.size)
      const y = innerMargin + Math.random() * (height - innerMargin * 2 - ghost.size)
      const ok = placed.every((other) => {
        const dx = x + ghost.size * 0.5 - (other.x + other.size * 0.5)
        const dy = y + ghost.size * 0.5 - (other.y + other.size * 0.5)
        return Math.hypot(dx, dy) >= (ghost.size + other.size) * 0.58
      })
      if (ok) {
        ghost.x = x
        ghost.y = y
        placed.push(ghost)
        done = true
        break
      }
    }

    if (!done) {
      const spot = spawnOutside(width, height, ghost.size)
      ghost.x = spot.x
      ghost.y = spot.y
      ghost.roamer = true
      placed.push(ghost)
    }
  }

  return list
}

function driftOffset(ghost: Ghost, time: number) {
  return {
    x: Math.sin(time * ghost.driftSpeed + ghost.phase) * 10,
    y: Math.cos(time * ghost.driftSpeed * 0.86 + ghost.phase) * 8,
  }
}

function ghostCenter(ghost: Ghost, time: number) {
  const drift = driftOffset(ghost, time)
  return {
    x: ghost.x + drift.x + ghost.size * 0.5,
    y: ghost.y + drift.y + ghost.size * 0.5,
  }
}

function isOnScreen(ghost: Ghost, time: number) {
  const drift = driftOffset(ghost, time)
  const x = ghost.x + drift.x
  const y = ghost.y + drift.y
  return x + ghost.size > -20 && x < bounds.w + 20 && y + ghost.size > -20 && y < bounds.h + 20
}

function ghostTransform(ghost: Ghost, time: number) {
  const sx = ghost.scale * ghost.mirror
  const sy = ghost.scale
  const drift = driftOffset(ghost, time)
  return `translate3d(${ghost.x + drift.x}px, ${ghost.y + drift.y}px, 0) rotate(${ghost.angle}deg) scale(${sx}, ${sy})`
}

function keepMoving(ghost: Ghost) {
  ghost.vx += (Math.random() - 0.5) * 0.018
  ghost.vy += (Math.random() - 0.5) * 0.018

  const speed = Math.hypot(ghost.vx, ghost.vy)
  const minSpeed = 0.12
  const maxSpeed = ghost.roamer ? 0.55 : 0.45

  if (speed < minSpeed) {
    const boost = Math.random() * Math.PI * 2
    ghost.vx += Math.cos(boost) * 0.1
    ghost.vy += Math.sin(boost) * 0.1
  } else if (speed > maxSpeed) {
    ghost.vx = (ghost.vx / speed) * maxSpeed
    ghost.vy = (ghost.vy / speed) * maxSpeed
  }
}

function separate(minGap: number) {
  const list = ghosts.value
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!
      const b = list[j]!
      if (!isOnScreen(a, tickTime) || !isOnScreen(b, tickTime)) continue

      const ac = ghostCenter(a, tickTime)
      const bc = ghostCenter(b, tickTime)
      let dx = bc.x - ac.x
      let dy = bc.y - ac.y
      let dist = Math.hypot(dx, dy)
      const minDist = (a.size + b.size) * minGap
      if (dist === 0) {
        dx = Math.random() - 0.5
        dy = Math.random() - 0.5
        dist = 0.01
      }
      if (dist >= minDist) continue

      const push = (minDist - dist) * 0.42
      const nx = dx / dist
      const ny = dy / dist
      a.x -= nx * push
      a.y -= ny * push
      b.x += nx * push
      b.y += ny * push
    }
  }
}

function wrapEdges(ghost: Ghost) {
  const pad = OUTSIDE_PAD
  if (ghost.x < -pad) ghost.x = bounds.w + pad * 0.35
  if (ghost.x > bounds.w + pad) ghost.x = -pad * 0.35
  if (ghost.y < -pad) ghost.y = bounds.h + pad * 0.35
  if (ghost.y > bounds.h + pad) ghost.y = -pad * 0.35
}

function tick(now: number) {
  if (!bounds.w || !bounds.h) {
    frameId = requestAnimationFrame(tick)
    return
  }

  tickTime = now * 0.001

  for (const ghost of ghosts.value) {
    keepMoving(ghost)
    ghost.x += ghost.vx
    ghost.y += ghost.vy
    ghost.angle += ghost.spin
    if (ghost.angle > 28 || ghost.angle < -28) ghost.spin *= -1
    wrapEdges(ghost)
    ghost.transform = ghostTransform(ghost, tickTime)
  }

  separate(0.54)
  frameId = requestAnimationFrame(tick)
}

function resetSwarm() {
  if (!swarmRef.value) return
  bounds = {
    w: swarmRef.value.clientWidth,
    h: swarmRef.value.clientHeight,
  }
  if (bounds.w < 1 || bounds.h < 1) return
  ghosts.value = buildGhosts(bounds.w, bounds.h).map((ghost) => ({
    ...ghost,
    transform: ghostTransform(ghost, tickTime),
  }))
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  resetSwarm()
  frameId = requestAnimationFrame(tick)

  resizeObserver = new ResizeObserver(() => {
    resetSwarm()
  })
  if (swarmRef.value) resizeObserver.observe(swarmRef.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.swarm {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.ghost {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--ghost-size);
  height: var(--ghost-size);
  background-color: var(--ghost-color);
  opacity: var(--ghost-opacity);
  mask-image: url("/sozai/nanosuke.png");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-mode: alpha;
  -webkit-mask-image: url("/sozai/nanosuke.png");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  will-change: transform;
  transform-origin: center center;
}

@media (prefers-reduced-motion: reduce) {
  .ghost {
    opacity: calc(var(--ghost-opacity) * 0.75);
  }
}
</style>
