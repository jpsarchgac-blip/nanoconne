<template>
  <div class="art" :style="{ '--accent': accent }">
    <!-- 1ページ目：色分けピラミッド -->
    <div v-if="scene === 'it-jobs-pyramid'" class="demo demo--pyramid">
      <p class="pyramid-label">上流工程 ↑</p>
      <div class="pyramid-wrap">
        <div class="pyramid">
          <article
            v-for="(layer, i) in layers"
            :key="layer.id"
            class="pyramid-layer"
            :class="[
              `pyramid-layer--${i + 1}`,
              { 'pyramid-layer--upstream': layer.upstream },
            ]"
            :style="{
              '--d': i,
              '--layer-tone': layer.tone,
              '--layer-text': layer.text,
            }"
          >
            <span v-if="layer.upstream" class="layer-badge">上流</span>
            <strong>{{ layer.phase }}</strong>
          </article>
        </div>
        <div class="scarcity-bar" aria-hidden="true">
          <span class="scarcity scarcity--few">少</span>
          <span class="scarcity-track" />
          <span class="scarcity scarcity--many">多</span>
        </div>
      </div>
      <p class="pyramid-foot">上ほど案件も企業も少ない</p>
    </div>

    <!-- 2ページ目：同じ山に職種名を乗せる -->
    <div v-else-if="scene === 'it-jobs-pyramid-annotate'" class="demo demo--annotate">
      <div class="annotate-rows">
        <div
          v-for="(layer, i) in layers"
          :key="layer.id"
          class="annotate-row"
          :class="{ 'annotate-row--on': annotateBeat >= i }"
          :style="{ '--d': i, '--layer-tone': layer.tone, '--layer-text': layer.text }"
        >
          <article
            class="pyramid-layer pyramid-layer--mini"
            :class="[`pyramid-layer--${i + 1}`, { 'pyramid-layer--focus': annotateBeat === i }]"
          >
            <strong>{{ layer.phase }}</strong>
          </article>
          <span class="dash-line" aria-hidden="true" />
          <article class="callout" :class="{ 'callout--on': annotateBeat >= i }">
            <div v-if="layer.id === 'build'" class="nest">
              <span class="nest-box nest-box--se">SE</span>
              <span class="nest-box nest-box--pg">PG</span>
              <span class="nest-box nest-box--qa">テスター</span>
            </div>
            <div v-else class="callout-tags">
              <span v-for="role in layer.roles" :key="role" class="callout-tag">{{ role }}</span>
            </div>
            <p class="callout-detail">{{ layer.detail }}</p>
          </article>
        </div>
      </div>
    </div>

    <!-- 3ページ目：BtoC / BtoB / inB -->
    <div v-else-if="scene === 'it-jobs-targets'" class="demo demo--targets">
      <article
        v-for="(target, i) in targets"
        :key="target.id"
        class="target-card"
        :class="[
          `target-card--${target.id}`,
          {
            'target-card--lit': isTargetLit(i),
            'target-card--dim': targetBeat >= 0 && targetBeat < targets.length && !isTargetLit(i),
          },
        ]"
        :style="{ '--d': i, '--target-tone': target.tone }"
      >
        <div class="target-icon" aria-hidden="true">
          <span v-if="target.icon === 'user'" class="ico ico--user">
            <span /><span /><span />
          </span>
          <span v-else-if="target.icon === 'building'" class="ico ico--building">
            <span /><span /><span />
          </span>
          <span v-else class="ico ico--office">
            <span /><span /><span />
          </span>
        </div>
        <div class="target-body">
          <p>{{ target.line }}</p>
          <strong :class="{ 'name-hide': !isTargetNamed(i) }">{{ target.label }}</strong>
          <small>{{ target.example }}</small>
        </div>
      </article>
      <p class="live-cap">{{ targetCaption }}</p>
      <p class="target-foot">1社が複数を手がけることもある</p>
    </div>

    <!-- 4ページ目：2・3ページの表 + ナノコネ一貫強調 -->
    <div v-else-if="scene === 'it-jobs-nano-targets'" class="demo demo--nano-slide">
      <div class="slide-viewport">
        <div class="slide-track" :style="{ transform: `translateX(-${nanoSlide * 100}%)` }">
          <article class="slide-panel slide-panel--annotate">
            <p class="slide-title">開発工程 — 全部やる</p>
            <div class="annotate-rows annotate-rows--compact">
              <div
                v-for="(layer, i) in layers"
                :key="layer.id"
                class="annotate-row"
                :class="{
                  'annotate-row--lit': isLayerLit(i),
                  'annotate-row--dim': nanoBeat >= 0 && !isLayerLit(i),
                }"
                :style="{ '--d': i, '--layer-tone': layer.tone, '--layer-text': layer.text }"
              >
                <article
                  class="pyramid-layer pyramid-layer--mini"
                  :class="`pyramid-layer--${i + 1}`"
                >
                  <strong>{{ layer.phase }}</strong>
                </article>
                <span class="dash-line" aria-hidden="true" />
                <article class="callout">
                  <div class="callout-tags">
                    <span v-for="role in layer.roles" :key="role" class="callout-tag">{{ role }}</span>
                  </div>
                </article>
              </div>
            </div>
            <span class="nano-badge" :class="{ 'nano-badge--show': nanoBeat >= layers.length }">ナノコネ</span>
          </article>
          <article class="slide-panel slide-panel--targets">
            <p class="slide-title">提供先 — すべて対応</p>
            <div class="slide-targets">
              <article
                v-for="(target, i) in targets"
                :key="target.id"
                class="target-card target-card--slide"
                :class="[
                  `target-card--${target.id}`,
                  {
                    'target-card--lit': isTargetLit(i),
                    'target-card--dim': nanoBeat >= 0 && !isTargetLit(i),
                  },
                ]"
                :style="{ '--d': i, '--target-tone': target.tone }"
              >
                <div class="target-icon" aria-hidden="true">
                  <span v-if="target.icon === 'user'" class="ico ico--user">
                    <span /><span /><span />
                  </span>
                  <span v-else-if="target.icon === 'building'" class="ico ico--building">
                    <span /><span /><span />
                  </span>
                  <span v-else class="ico ico--office">
                    <span /><span /><span />
                  </span>
                </div>
                <div class="target-body">
                  <strong>{{ target.label }}</strong>
                  <p>{{ target.line }}</p>
                  <small>{{ target.example }}</small>
                </div>
              </article>
            </div>
            <span class="nano-badge" :class="{ 'nano-badge--show': nanoBeat >= targets.length }">ナノコネ</span>
          </article>
        </div>
      </div>
      <div class="slide-dots">
        <button
          v-for="(_, i) in 2"
          :key="i"
          type="button"
          class="slide-dot"
          :class="{ 'slide-dot--on': nanoSlide === i }"
          :aria-label="`表 ${i + 1}`"
          @click="goNanoSlide(i)"
        />
      </div>
    </div>

    <!-- 5ページ目：募集 -->
    <div v-else-if="scene === 'it-jobs-recruit'" class="demo demo--recruit">
      <article
        v-for="(role, i) in recruitRoles"
        :key="role.name"
        class="role-card"
        :class="`role-card--${role.tag}`"
        :style="{ '--d': i }"
      >
        <span class="role-tag">{{ role.tag === 'main' ? '基本' : 'たまに' }}</span>
        <strong>{{ role.name }}</strong>
        <p>{{ role.line }}</p>
      </article>
      <p class="recruit-bridge">申込とコース選択は「インターンについて」の冊</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpreadScene } from "~/utils/bookContent"
import { IT_RECRUIT_ROLES } from "~/utils/itIndustry"
import { DELIVERY_TARGETS, DEV_PYRAMID_LAYERS } from "~/utils/itJobs"

const props = defineProps<{
  scene: SpreadScene
  accent: string
}>()

const layers = DEV_PYRAMID_LAYERS
const targets = DELIVERY_TARGETS
const recruitRoles = IT_RECRUIT_ROLES

const nanoSlide = ref(0)
const nanoBeat = ref(-1)
const targetBeat = ref(-1)
const annotateBeat = ref(-1)
let nanoSlideTimer: ReturnType<typeof setInterval> | null = null
let nanoBeatTimer: ReturnType<typeof setInterval> | null = null
let targetBeatTimer: ReturnType<typeof setInterval> | null = null
let annotateTimer: ReturnType<typeof setInterval> | null = null

const targetCaption = computed(() => {
  if (targetBeat.value < 0) return "誰向けのシステムか"
  if (targetBeat.value >= targets.length) return "ナノコネは3つとも手がける"
  const target = targets[targetBeat.value]
  return target ? `${target.line} → ${target.label}` : ""
})

function isLayerLit(index: number) {
  if (nanoBeat.value >= layers.length) return true
  if (nanoBeat.value < 0) return false
  return nanoBeat.value === index
}

function isTargetNamed(index: number) {
  return targetBeat.value >= index
}

function isTargetLit(index: number) {
  if (props.scene === "it-jobs-targets") {
    if (targetBeat.value >= targets.length) return true
    if (targetBeat.value < 0) return false
    return targetBeat.value === index
  }
  if (nanoBeat.value >= targets.length) return true
  if (nanoBeat.value < 0) return false
  return nanoBeat.value === index
}

function goNanoSlide(index: number) {
  nanoSlide.value = index
  nanoBeat.value = -1
  if (nanoSlideTimer) {
    clearInterval(nanoSlideTimer)
    nanoSlideTimer = null
  }
  setupNanoBeatTimer()
}

function resetNanoSlideTimer() {
  if (nanoSlideTimer) clearInterval(nanoSlideTimer)
  if (props.scene !== "it-jobs-nano-targets") return
  nanoSlideTimer = setInterval(() => {
    if (nanoSlide.value >= 1) {
      if (nanoSlideTimer) clearInterval(nanoSlideTimer)
      nanoSlideTimer = null
      return
    }
    nanoSlide.value += 1
    nanoBeat.value = -1
    setupNanoBeatTimer()
  }, 5000)
}

function setupNanoBeatTimer() {
  if (nanoBeatTimer) clearInterval(nanoBeatTimer)
  if (props.scene !== "it-jobs-nano-targets") return
  const count = nanoSlide.value === 0 ? layers.length : targets.length
  nanoBeatTimer = setInterval(() => {
    nanoBeat.value += 1
    if (nanoBeat.value >= count) {
      if (nanoBeatTimer) clearInterval(nanoBeatTimer)
      nanoBeatTimer = null
    }
  }, 750)
}

function setupTargetBeatTimer() {
  if (targetBeatTimer) clearInterval(targetBeatTimer)
  if (props.scene !== "it-jobs-targets") return
  targetBeat.value = -1
  targetBeatTimer = setInterval(() => {
    targetBeat.value += 1
    if (targetBeat.value >= targets.length) {
      if (targetBeatTimer) clearInterval(targetBeatTimer)
      targetBeatTimer = null
    }
  }, 1100)
}

function setupAnnotateTimer() {
  if (annotateTimer) clearInterval(annotateTimer)
  if (props.scene !== "it-jobs-pyramid-annotate") return
  annotateBeat.value = -1
  annotateTimer = setInterval(() => {
    annotateBeat.value += 1
    if (annotateBeat.value >= layers.length - 1) {
      if (annotateTimer) clearInterval(annotateTimer)
      annotateTimer = null
    }
  }, 1200)
}

function setupSceneTimers() {
  if (nanoSlideTimer) clearInterval(nanoSlideTimer)
  if (nanoBeatTimer) clearInterval(nanoBeatTimer)
  if (targetBeatTimer) clearInterval(targetBeatTimer)
  if (annotateTimer) clearInterval(annotateTimer)
  nanoSlideTimer = nanoBeatTimer = targetBeatTimer = annotateTimer = null

  if (props.scene === "it-jobs-nano-targets") {
    nanoSlide.value = 0
    nanoBeat.value = -1
    resetNanoSlideTimer()
    setupNanoBeatTimer()
  }
  if (props.scene === "it-jobs-targets") {
    setupTargetBeatTimer()
  }
  if (props.scene === "it-jobs-pyramid-annotate") {
    setupAnnotateTimer()
  }
}

onMounted(setupSceneTimers)
onBeforeUnmount(() => {
  if (nanoSlideTimer) clearInterval(nanoSlideTimer)
  if (nanoBeatTimer) clearInterval(nanoBeatTimer)
  if (targetBeatTimer) clearInterval(targetBeatTimer)
  if (annotateTimer) clearInterval(annotateTimer)
})
watch(() => props.scene, setupSceneTimers)
watch(nanoSlide, () => {
  if (props.scene === "it-jobs-nano-targets") {
    nanoBeat.value = -1
    setupNanoBeatTimer()
  }
})
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
.demo--pyramid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
}

.pyramid-label {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.88;
  animation: pop 0.45s ease backwards;
}

.pyramid-wrap {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: none;
}

.pyramid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.scarcity-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  width: 26px;
  padding: 6px 0;
  animation: pop 0.45s ease 0.5s backwards;
}

.scarcity {
  font-size: 10px;
  font-weight: 800;
  opacity: 0.85;
  line-height: 1;
}

.scarcity-track {
  flex: 1;
  width: 6px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.35), rgb(255 255 255 / 0.9));
}

.pyramid-layer {
  position: relative;
  display: grid;
  place-items: center;
  padding: 12px 10px;
  border-radius: 10px;
  background: var(--layer-tone);
  color: var(--layer-text);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  line-height: 1.35;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
  animation: layerIn 0.5s ease backwards;
  animation-delay: calc(var(--d) * 0.09s);
  min-height: 38px;
}

.pyramid-layer--1 { width: 44%; }
.pyramid-layer--2 { width: 60%; }
.pyramid-layer--3 { width: 76%; }
.pyramid-layer--4 { width: 92%; }

.layer-badge {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px 6px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.22);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.pyramid-foot {
  margin: 2px 0 0;
  font-size: 10px;
  font-weight: 700;
  opacity: 0.85;
  animation: pop 0.45s ease 0.4s backwards;
}

/* ── 2ページ目 ── */
.demo--annotate {
  padding: 8px 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 0;
  min-height: 0;
  height: 100%;
  box-sizing: border-box;
}

.demo--annotate .pyramid-label {
  font-size: 10px;
}

.annotate-grid {
  display: grid;
  grid-template-columns: 42% 1fr;
  gap: 6px;
  align-items: stretch;
  min-height: 0;
  flex: 1;
}

.demo--annotate .pyramid-layer {
  padding: 6px 4px;
  min-height: 22px;
  font-size: 9px;
}

.demo--annotate .callout {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding: 4px 6px;
  border-radius: 8px;
  background: rgb(255 255 255 / 0.12);
  border-left: 3px solid var(--layer-tone);
  opacity: 0;
  min-height: 0;
  transition: opacity 0.35s ease, box-shadow 0.35s ease;
}

.demo--annotate .callout {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 5px 7px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.12);
  border-left: 3px solid var(--layer-tone);
  opacity: 0;
  min-height: 0;
  transition: opacity 0.35s ease, box-shadow 0.35s ease;
}

.demo--annotate .pyramid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  min-height: 0;
}

.demo--annotate .callout--on { opacity: 1; }
.demo--annotate .callout--focus { box-shadow: 0 0 0 2px rgb(255 255 255 / 0.45); }

.callout-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  min-height: 0;
}

.callout-detail {
  margin: 0;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.35;
  opacity: 0.9;
}

.nest {
  display: flex;
  align-items: stretch;
  gap: 3px;
}

.nest-box {
  padding: 3px 4px;
  border-radius: 6px;
  background: var(--layer-tone);
  color: var(--layer-text);
  font-size: 8px;
  font-weight: 800;
  text-align: center;
}

.nest-box--se { flex: 1.4; }
.nest-box--pg { flex: 1.1; opacity: 0.9; }
.nest-box--qa { flex: 1; opacity: 0.75; }

.pyramid-layer--focus {
  box-shadow: 0 0 0 3px rgb(255 255 255 / 0.5);
}

.live-cap {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  min-height: 1.4em;
}

.name-hide { opacity: 0; }

.target-foot {
  margin: 0;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  opacity: 0.88;
}

.recruit-bridge {
  margin: 4px 0 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
}

.annotate-rows {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 100%;
}

.annotate-row {
  display: grid;
  grid-template-columns: 42% 10% 1fr;
  align-items: center;
  gap: 0 6px;
  min-height: 0;
  animation: callIn 0.5s ease backwards;
  animation-delay: calc(0.12s + var(--d) * 0.08s);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.annotate-row .callout {
  opacity: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  transition: opacity 0.35s ease;
}

.annotate-row--on .callout,
.annotate-row .callout--on {
  opacity: 1;
}

.annotate-row--lit .pyramid-layer,
.annotate-row--lit .callout {
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.55);
  animation: nanoGlow 0.85s ease-in-out infinite;
}

.annotate-row--dim { opacity: 0.42; }

.annotate-rows--compact { gap: 4px; }

.pyramid-layer--mini {
  padding: 8px 4px;
  font-size: 9px;
  min-height: 36px;
}

.annotate-row .pyramid-layer--1 { width: 58%; margin-inline: auto; }
.annotate-row .pyramid-layer--2 { width: 72%; margin-inline: auto; }
.annotate-row .pyramid-layer--3 { width: 86%; margin-inline: auto; }
.annotate-row .pyramid-layer--4 { width: 100%; margin-inline: auto; }

.dash-line {
  display: block;
  width: 100%;
  height: 0;
  border-top: 2px dashed rgb(255 255 255 / 0.85);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
  animation: dashIn 0.55s ease backwards;
  animation-delay: calc(0.18s + var(--d) * 0.08s);
}

.callout {
  display: flex;
  align-items: center;
  padding: 4px 6px;
  border-radius: 8px;
  background: rgb(255 255 255 / 0.1);
  border-left: 2px solid var(--layer-tone);
  min-height: 32px;
}

.callout-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.callout-tag {
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--layer-tone);
  color: var(--layer-text);
  font-size: 8px;
  font-weight: 800;
  line-height: 1.3;
}

/* ── 3ページ目 ── */
.demo--targets {
  padding: 10px 12px 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.target-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--target-tone) 82%, #fff);
  color: #1a2a3a;
  border: 2px solid var(--target-tone);
  animation: targetIn 0.55s ease backwards;
  animation-delay: calc(var(--d) * 0.12s);
  transition: box-shadow 0.35s ease, opacity 0.35s ease, transform 0.35s ease;
}

.target-card--lit {
  box-shadow: 0 0 0 3px rgb(255 255 255 / 0.45), 0 8px 18px rgb(0 0 0 / 0.16);
  transform: scale(1.02);
  animation: nanoGlow 0.85s ease-in-out infinite;
}

.target-card--dim { opacity: 0.42; transform: scale(0.98); }

.target-card--slide { width: 100%; box-sizing: border-box; }

.target-icon {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--target-tone);
  color: #fff;
}

.target-body strong {
  display: block;
  font-size: 17px;
}

.target-body p {
  margin: 2px 0 0;
  font-size: 11px;
}

.target-body small {
  display: block;
  margin-top: 3px;
  font-size: 9px;
  opacity: 0.75;
}

/* BtoC：人が順に現れる */
.ico {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  height: 22px;
}

.ico--user span,
.ico--building span,
.ico--office span {
  display: block;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.9);
  animation: iconPop 2.4s ease-in-out infinite;
}

.ico--user span {
  width: 6px;
  height: 10px;
}

.ico--user span:first-child { height: 14px; animation-delay: 0s; }
.ico--user span:nth-child(2) { animation-delay: 0.3s; }
.ico--user span:nth-child(3) { animation-delay: 0.6s; }

.ico--building span {
  width: 8px;
  background: rgb(255 255 255 / 0.85);
}

.ico--building span:first-child { height: 12px; animation-delay: 0s; }
.ico--building span:nth-child(2) { height: 18px; animation-delay: 0.25s; }
.ico--building span:nth-child(3) { height: 14px; animation-delay: 0.5s; }

.ico--office span {
  width: 10px;
  height: 8px;
  border-radius: 3px;
  animation: officeBlink 2.8s ease-in-out infinite;
}

.ico--office span:nth-child(2) { animation-delay: 0.4s; }
.ico--office span:nth-child(3) { animation-delay: 0.8s; }

.target-card--b2c .target-icon { animation: cardPulse 3s ease-in-out infinite; }
.target-card--b2b .target-icon { animation: cardPulse 3s ease-in-out 0.4s infinite; }
.target-card--inb .target-icon { animation: cardPulse 3s ease-in-out 0.8s infinite; }

/* ── 4ページ目 スライド ── */
.demo--nano-slide {
  padding: 10px 8px 64px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.slide-viewport {
  overflow: hidden;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.08);
  flex: 1;
  min-height: 0;
}

.slide-track {
  display: flex;
  height: 100%;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel {
  flex: 0 0 100%;
  padding: 12px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  position: relative;
}

.slide-panel--annotate,
.slide-panel--targets { padding-bottom: 36px; }

.nano-badge {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%) scale(0.92);
  padding: 6px 14px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.nano-badge--show {
  opacity: 1;
  transform: translateX(-50%) scale(1);
  animation: nanoGlow 0.85s ease-in-out infinite;
}

.slide-title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  text-align: center;
}

.slide-targets {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.slide-target {
  position: relative;
  padding: 14px 14px 12px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--target-tone) 78%, #fff);
  color: #1a2a3a;
  border: 2px solid var(--target-tone);
  animation: targetIn 0.5s ease backwards;
  animation-delay: calc(var(--d) * 0.1s);
}

.slide-target strong {
  display: block;
  font-size: 18px;
}

.slide-target p {
  margin: 4px 0 0;
  font-size: 11px;
}

.slide-target small {
  display: block;
  margin-top: 4px;
  font-size: 9px;
  opacity: 0.75;
}

.slide-check {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--target-tone);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
}

.slide-pyramid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.pyramid-layer--slide {
  width: auto;
  animation: layerIn 0.5s ease backwards;
}

.pyramid-layer--slide.pyramid-layer--1 { width: 48%; }
.pyramid-layer--slide.pyramid-layer--2 { width: 64%; }
.pyramid-layer--slide.pyramid-layer--3 { width: 80%; }
.pyramid-layer--slide.pyramid-layer--4 { width: 96%; }

.pyramid-layer--top {
  box-shadow: 0 0 16px rgb(255 255 255 / 0.35);
}

.pyramid-layer--slide small {
  display: block;
  margin-bottom: 2px;
  font-size: 8px;
  font-weight: 700;
  opacity: 0.9;
}

.slide-foot {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  opacity: 0.88;
}

.slide-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.slide-dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.3);
  cursor: pointer;
  transition: background 0.35s ease, transform 0.35s ease;
}

.slide-dot--on {
  background: #fff;
  transform: scale(1.2);
}

.demo--recruit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 16px 18px 72px;
}

.role-card {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  animation: pop 0.45s ease backwards;
  animation-delay: calc(var(--d) * 0.1s);
}

.role-card--opt {
  background: rgb(255 255 255 / 0.55);
  border: 2px dashed rgb(255 255 255 / 0.7);
  color: #fff;
}

.role-tag {
  display: inline-block;
  margin-bottom: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgb(80 136 198 / 0.15);
  font-size: 10px;
  font-weight: 800;
}

.role-card--opt .role-tag {
  background: rgb(255 255 255 / 0.2);
}

.role-card strong { font-size: 18px; }
.role-card p { margin: 6px 0 0; font-size: 12px; }

@keyframes pop {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes layerIn {
  from { transform: translateY(12px) scale(0.94); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes dashIn {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 0.85; }
}

@keyframes callIn {
  from { transform: translateX(10px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes targetIn {
  from { transform: translateX(-12px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes iconPop {
  0%, 100% { transform: translateY(0); opacity: 0.55; }
  50% { transform: translateY(-3px); opacity: 1; }
}

@keyframes officeBlink {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; box-shadow: 0 0 6px rgb(255 255 255 / 0.6); }
}

@keyframes cardPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes nanoGlow {
  0%, 100% { filter: drop-shadow(0 0 4px rgb(255 255 255 / 0.25)); }
  50% { filter: drop-shadow(0 0 12px rgb(255 255 255 / 0.65)); }
}

@keyframes rowIn {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes checkPop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes stackIn {
  from { opacity: 0; transform: scaleX(0.85); }
  to { opacity: 1; transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .pyramid-layer,
  .dash-line,
  .callout,
  .target-card,
  .slide-track,
  .target-icon,
  .ico span,
  .annotate-row--lit .pyramid-layer,
  .target-card--lit,
  .nano-badge {
    animation: none;
    transition: none;
  }
}
</style>
