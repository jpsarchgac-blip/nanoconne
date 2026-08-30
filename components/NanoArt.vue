<template>
  <div class="art" :style="{ '--accent': accent }">
    <!-- 1ページ目：Mission / 社名の由来 -->
    <div v-if="scene === 'company-world'" class="demo demo--mission">
      <p class="mission-kicker">Mission</p>
      <h2 class="mission-title" aria-label="驚きを あなたのもとへ">
        <span class="mission-surprise">驚き</span>
        <span class="mission-to">を</span>
        <span class="mission-you">あなた</span>
        <span class="mission-tail">のもとへ</span>
      </h2>

      <div class="connect-net" aria-hidden="true">
        <svg class="connect-svg" viewBox="0 0 240 72" preserveAspectRatio="xMidYMid meet">
          <g v-for="(node, i) in connectNodes" :key="node.id">
            <line
              :x1="node.x"
              :y1="node.y"
              x2="120"
              y2="36"
              pathLength="1"
              class="connect-line"
              :style="{ '--d': i }"
            />
            <circle
              :cx="node.x"
              :cy="node.y"
              r="4"
              class="connect-end"
              :style="{ '--d': i }"
            />
          </g>
        </svg>
        <span class="net-core">つながり</span>
      </div>

      <div class="etymology">
        <span class="etym-piece">nano</span>
        <span class="etym-plus">+</span>
        <span class="etym-piece">connect</span>
        <p class="etym-mean">小さなつながりを大切に、大きな価値を生む</p>
      </div>
    </div>

    <!-- 製品ページ（2〜6） -->
    <article
      v-else-if="product"
      class="product"
      :class="`product--${product.id}`"
      :aria-label="product.name"
    >
      <div class="product-frame">
        <div class="product-media" :class="productMediaClass(product)">
          <img
            :src="product.image"
            :alt="product.name"
            class="product-img"
            :class="productImgClass(product)"
          >
        </div>
        <span class="product-tag">{{ product.tag }}</span>
        <span class="product-name">{{ product.name }}</span>
      </div>
      <ul class="chips">
        <li v-for="(chip, i) in product.chips" :key="chip" :style="{ '--d': i }">
          {{ chip }}
        </li>
      </ul>
    </article>

    <!-- 7ページ目：働き方 -->
    <article v-else-if="scene === 'work-style-seed'" class="product product--work">
      <div class="product-frame">
        <div class="product-media product-media--pan-x">
          <img
            :src="officePreview.image"
            :alt="officePreview.label"
            class="product-img product-img--pan-x"
          >
        </div>
        <span class="product-tag">23階 · 神戸</span>
        <span class="product-name">社内開発</span>
      </div>
      <ul class="chips">
        <li v-for="(chip, i) in workChips" :key="chip" :style="{ '--d': i }">
          {{ chip }}
        </li>
      </ul>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { SpreadScene } from "~/utils/bookContent"
import type { NanoProduct } from "~/utils/nanoProducts"
import { NANO_PRODUCTS } from "~/utils/nanoProducts"
import { ENGINEER_CHIPS, OFFICE_PREVIEW } from "~/utils/workCareer"

const props = defineProps<{
  scene: SpreadScene
  accent: string
}>()

const productSceneMap: Partial<Record<SpreadScene, keyof typeof NANO_PRODUCTS>> = {
  "product-skywalker": "skywalker",
  "product-linka": "linka",
  "product-mieroom": "mieroom",
  "product-jankara": "jankara",
  "product-automotive": "automotive",
}

const product = computed(() => {
  const key = productSceneMap[props.scene]
  return key ? NANO_PRODUCTS[key] : null
})

const officePreview = OFFICE_PREVIEW
const workChips = ENGINEER_CHIPS.slice(0, 4)

function productMediaClass(item: NanoProduct) {
  return `product-media--${item.imageMode ?? "pan-x"}`
}

function productImgClass(item: NanoProduct) {
  return `product-img--${item.imageMode ?? "pan-x"}`
}

const connectNodes = [
  { id: "nw", x: 20, y: 10 },
  { id: "ne", x: 220, y: 14 },
  { id: "sw", x: 10, y: 58 },
  { id: "se", x: 230, y: 56 },
  { id: "n", x: 72, y: 4 },
  { id: "s", x: 168, y: 68 },
]
</script>

<style scoped>
.art {
  position: absolute;
  inset: 0;
  color: #fff;
}

.demo {
  position: absolute;
  inset: 0;
}

/* ── 1ページ目 ── */
.demo--mission {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px 16px;
  text-align: center;
}

.mission-kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  opacity: 0.82;
  animation: pop 0.5s ease backwards;
}

.mission-title {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 4px 6px;
  line-height: 1.35;
}

.mission-surprise {
  padding: 6px 12px;
  border-radius: 12px;
  background: #fff;
  color: var(--accent);
  font-size: 26px;
  font-weight: 800;
  animation: surprisePop 0.7s ease 0.1s backwards, glow 2.4s ease-in-out 0.8s infinite;
}

.mission-to,
.mission-tail {
  font-size: 15px;
  font-weight: 700;
  animation: pop 0.5s ease 0.25s backwards;
}

.mission-you {
  padding: 6px 14px;
  border-radius: 999px;
  border: 2px solid rgb(255 255 255 / 0.85);
  font-size: 18px;
  font-weight: 800;
  animation: pop 0.55s ease 0.4s backwards, youPulse 2.2s ease-in-out 0.9s infinite;
}

.connect-net {
  position: relative;
  width: min(240px, 88%);
  height: 72px;
  margin: 4px 0;
}

.connect-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.connect-line {
  stroke: rgb(255 255 255 / 0.58);
  stroke-width: 1.5;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: connectDraw 1.4s ease-out forwards;
  animation-delay: calc(var(--d) * 0.35s + 0.2s);
}

.connect-end {
  fill: rgb(255 255 255 / 0.82);
  opacity: 0;
  animation: connectDot 0.6s ease forwards;
  animation-delay: calc(var(--d) * 0.35s + 0.75s);
}

.net-core {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.2);
  border: 1px solid rgb(255 255 255 / 0.28);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  animation: connectCore 0.7s ease 2.1s backwards;
}

.etymology {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  animation: pop 0.55s ease 0.65s backwards;
}

.etym-piece {
  padding: 5px 10px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
}

.etym-plus {
  font-size: 16px;
  font-weight: 800;
  opacity: 0.85;
}

.etym-mean {
  flex: 0 0 100%;
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.88;
}

/* ── 製品共通 ── */
.product {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 10px;
  box-sizing: border-box;
  animation: pop 0.5s ease backwards;
}

.product-frame {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 14px;
  overflow: hidden;
  background:
    linear-gradient(165deg, rgb(255 255 255 / 0.08), rgb(0 0 0 / 0.18)),
    rgb(0 0 0 / 0.1);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12);
}

.product-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.product-media--pan-x,
.product-media--pan-y,
.product-media--zoom,
.product-media--static {
  overflow: hidden;
}

.product-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.product-img--pan-x {
  animation: panImgX 22s linear infinite alternate;
  will-change: object-position;
}

.product-img--pan-y {
  animation: panImgY 22s linear infinite alternate;
  will-change: object-position;
}

.product-img--zoom {
  animation: panImgZoom 16s ease-in-out infinite alternate;
  will-change: transform;
}

.product-img--static {
  object-fit: contain;
  background: rgb(0 0 0 / 0.12);
}

.product-tag {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.product-name {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 2;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
  font-size: 14px;
  font-weight: 800;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chips li {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.22);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.3;
  animation: pop 0.45s ease backwards;
  animation-delay: calc(0.12s + var(--d) * 0.07s);
}

@keyframes connectDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes connectDot {
  to { opacity: 1; }
}

@keyframes connectCore {
  from { transform: translate(-50%, -50%) scale(0.92); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes pop {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes surprisePop {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 rgb(255 255 255 / 0); }
  50% { box-shadow: 0 0 18px rgb(255 255 255 / 0.45); }
}

@keyframes youPulse {
  0%, 100% { transform: scale(1); border-color: rgb(255 255 255 / 0.85); }
  50% { transform: scale(1.04); border-color: #fff; }
}

@keyframes panImgX {
  from { object-position: 100% center; }
  to { object-position: 0% center; }
}

@keyframes panImgY {
  from { object-position: center 100%; }
  to { object-position: center 0%; }
}

@keyframes panImgZoom {
  from { transform: scale(1); }
  to { transform: scale(1.12); }
}

@media (prefers-reduced-motion: reduce) {
  .mission-surprise,
  .mission-you {
    animation: none;
  }

  .connect-line,
  .connect-end,
  .net-core {
    animation-duration: 0.01ms;
    animation-delay: 0s;
  }
}
</style>
