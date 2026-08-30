<template>
  <div class="art" :style="{ '--accent': accent }">
    <div v-if="scene === 'work-engineer'" class="demo demo--chips">
      <p class="lead">社内開発</p>
      <ul class="chips">
        <li v-for="(chip, i) in engineerChips" :key="chip" :style="{ '--d': i }">
          {{ chip }}
        </li>
      </ul>
      <p class="foot">常駐なし · テレワーク×フレックス</p>
    </div>

    <div v-else-if="scene === 'work-office-outside'" class="demo demo--gallery">
      <figure
        v-for="(slide, i) in officeOutside"
        :key="slide.image"
        class="shot"
        :class="`shot--${i + 1}`"
      >
        <img :src="slide.image" :alt="slide.label">
        <figcaption>
          <strong>{{ slide.label }}</strong>
          <span>{{ slide.caption }}</span>
        </figcaption>
      </figure>
    </div>

    <div v-else-if="scene === 'work-office-inside'" class="demo demo--gallery demo--gallery-3">
      <figure
        v-for="(slide, i) in officeInside"
        :key="slide.image"
        class="shot"
        :class="`shot--${i + 1}`"
      >
        <img :src="slide.image" :alt="slide.label">
        <figcaption>
          <strong>{{ slide.label }}</strong>
          <span>{{ slide.caption }}</span>
        </figcaption>
      </figure>
    </div>

    <div v-else-if="scene === 'work-meeting'" class="demo demo--hero">
      <img
        src="/sozai/office/04_office_kaigi.jpg"
        alt="会議室から見える神戸"
        class="hero-img"
      >
      <div class="hero-cap">
        <strong>会議室</strong>
        <span>神戸の街を見ながら、企画と開発を話す</span>
      </div>
      <ul class="mini-tags">
        <li v-for="item in culture" :key="item">{{ item }}</li>
      </ul>
    </div>

    <div v-else-if="scene === 'work-flex-day'" class="demo demo--day">
      <div v-for="(slot, i) in flexDay" :key="slot.time" class="slot" :style="{ '--d': i }">
        <strong>{{ slot.time }}</strong>
        <p>{{ slot.line }}</p>
      </div>
    </div>

    <div v-else-if="scene === 'work-styles'" class="demo demo--styles">
      <article class="style-hero">
        <img :src="activeStyle.image" :alt="activeStyle.name" class="style-hero-img">
        <div class="style-hero-body">
          <small>{{ styleIndex + 1 }} / {{ workStyles.length }}</small>
          <strong>{{ activeStyle.name }}</strong>
          <p>{{ activeStyle.line }}</p>
        </div>
      </article>
      <div class="style-rail">
        <button
          v-for="(item, i) in workStyles"
          :key="item.name"
          type="button"
          class="style-thumb"
          :class="{ 'style-thumb--on': i === styleIndex }"
          :aria-label="item.name"
          @click="selectStyle(i)"
        >
          <img :src="item.image" alt="">
          <span>{{ item.name }}</span>
        </button>
      </div>
    </div>

    <div v-else-if="scene === 'work-growth'" class="demo demo--recruit">
      <img
        src="/sozai/office/04_kobe.png"
        alt="神戸の街"
        class="recruit-bg"
      >
      <div class="recruit-panel">
        <p class="recruit-kicker">制度 · 育つ仕組み</p>
        <h3 class="recruit-title">募集要項</h3>
        <ul class="benefit-chips">
          <li v-for="item in workBenefits" :key="item">{{ item }}</li>
        </ul>
        <dl class="recruit-list">
          <div
            v-for="item in growthHighlights"
            :key="item.label"
            class="recruit-row"
          >
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <p class="recruit-note">詳細は採用ページで確認</p>
        <a
          :href="recruitUrl"
          class="recruit-link"
          target="_blank"
          rel="noopener"
        >採用ページで全文を見る</a>
      </div>
    </div>

    <!-- legacy scenes (unused) -->
    <div v-else-if="scene === 'office-home'" class="demo demo--sites">
      <article class="site">
        <strong>Office</strong>
        <p>神戸本社。対話と、たまたまの学び</p>
      </article>
      <span class="link">ハイブリッド</span>
      <article class="site">
        <strong>Home</strong>
        <p>集中と、生活の両立</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpreadScene } from "~/utils/bookContent"
import {
  ENGINEER_CHIPS,
  FLEX_DAY,
  OFFICE_INSIDE,
  OFFICE_OUTSIDE,
  RECRUIT_ENGINEER_URL,
  WORK_BENEFITS,
  WORK_CULTURE,
  WORK_GROWTH_HIGHLIGHTS,
  WORK_STYLES,
} from "~/utils/workCareer"

const engineerChips = ENGINEER_CHIPS
const officeOutside = OFFICE_OUTSIDE
const officeInside = OFFICE_INSIDE
const flexDay = FLEX_DAY
const workStyles = WORK_STYLES
const growthHighlights = WORK_GROWTH_HIGHLIGHTS
const workBenefits = WORK_BENEFITS
const recruitUrl = RECRUIT_ENGINEER_URL
const culture = WORK_CULTURE

const props = defineProps<{
  scene: SpreadScene
  accent: string
}>()

const styleIndex = ref(0)
let styleTimer: ReturnType<typeof setInterval> | null = null
const activeStyle = computed(() => workStyles[styleIndex.value] ?? workStyles[0])

function selectStyle(index: number) {
  styleIndex.value = index
  restartStyleTimer()
}

function restartStyleTimer() {
  if (styleTimer) clearInterval(styleTimer)
  styleTimer = null
  if (props.scene !== "work-styles") return
  styleTimer = setInterval(() => {
    styleIndex.value = (styleIndex.value + 1) % workStyles.length
  }, 2800)
}

watch(() => props.scene, restartStyleTimer, { immediate: true })
onBeforeUnmount(() => {
  if (styleTimer) clearInterval(styleTimer)
})
</script>

<style scoped>
.art {
  position: absolute;
  inset: 0;
  color: #fff;
}

.demo { position: absolute; inset: 0; }

.demo--chips {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 34px 20px;
}

.lead {
  margin: 0;
  text-align: center;
  font-size: 13px;
  letter-spacing: 0.16em;
  opacity: 0.85;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chips li {
  padding: 10px 12px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  animation: pop 0.45s ease backwards;
  animation-delay: calc(var(--d) * 0.08s);
}

.foot {
  margin: 0;
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.9;
}

.demo--gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  padding: 14px;
}

.demo--gallery-3 {
  grid-template-rows: 1.1fr 0.9fr;
}

.shot {
  position: relative;
  margin: 0;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  animation: pop 0.5s ease backwards;
}

.shot--1 { animation-delay: 0.04s; }
.shot--2 { animation-delay: 0.12s; }
.shot--3 { animation-delay: 0.2s; grid-column: 1 / -1; }

.shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shot figcaption {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  padding: 6px 8px;
  border-radius: 10px;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(4px);
}

.shot strong {
  display: block;
  font-size: 11px;
}

.shot span {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.4;
  opacity: 0.92;
}

.demo--hero {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-img {
  flex: 1;
  min-height: 0;
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  animation: pop 0.55s ease backwards;
}

.hero-cap {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.14);
}

.hero-cap strong {
  display: block;
  font-size: 14px;
}

.hero-cap span {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  line-height: 1.45;
}

.mini-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mini-tags li {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
}

.demo--day {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 24px 18px;
}

.slot {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  animation: pop 0.4s ease backwards;
  animation-delay: calc(var(--d) * 0.1s);
}

.slot strong { font-size: 12px; }
.slot p { margin: 0; font-size: 12px; line-height: 1.45; }

.demo--styles {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  box-sizing: border-box;
}

.style-hero {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.16);
}

.style-hero-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.style-hero-body {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.94);
  color: var(--accent);
}

.style-hero-body small {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  opacity: 0.62;
}

.style-hero-body strong {
  display: block;
  margin-top: 2px;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}

.style-hero-body p {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.4;
}

.style-rail {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 4px;
  flex: 0 0 auto;
}

.style-thumb {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.style-thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.55;
  outline: 2px solid transparent;
}

.style-thumb span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 8px;
  font-weight: 800;
  line-height: 1.2;
  opacity: 0.75;
}

.style-thumb--on img {
  opacity: 1;
  outline-color: #fff;
}

.style-thumb--on span {
  opacity: 1;
}

.demo--recruit {
  padding: 12px;
}

.recruit-bg {
  position: absolute;
  inset: 12px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  border-radius: 14px;
  object-fit: cover;
}

.recruit-panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 48px);
  max-height: calc(100% - 52px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 12px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.94);
  color: var(--accent);
  box-sizing: border-box;
  box-shadow: 0 8px 28px rgb(0 0 0 / 0.18);
  backdrop-filter: blur(6px);
}

.recruit-kicker {
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  opacity: 0.72;
}

.recruit-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.3;
}

.benefit-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.benefit-chips li {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgb(47 190 166 / 0.14);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.3;
}

.recruit-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recruit-row {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 8px;
  align-items: start;
}

.recruit-row dt {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.35;
  opacity: 0.88;
}

.recruit-row dd {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
}

.recruit-note {
  margin: 0;
  font-size: 10px;
  line-height: 1.4;
  opacity: 0.72;
}

.recruit-link {
  display: block;
  margin-top: auto;
  padding: 9px 12px;
  border-radius: 10px;
  background: rgb(47 190 166 / 0.16);
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
}

.demo--sites {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 36px 20px;
}

.site {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
}

.site strong { font-size: 20px; }
.site p { margin: 6px 0 0; font-size: 13px; }

.link {
  align-self: center;
  font-size: 12px;
  letter-spacing: 0.12em;
  opacity: 0.85;
}

@keyframes pop {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
</style>
