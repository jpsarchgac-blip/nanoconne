<template>
  <div class="art" :style="{ '--accent': accent }">
    <div v-if="scene === 'it-industry-venn'" class="demo demo--venn">
      <div class="venn-layout" :class="{ 'venn-layout--done': vennDone }">
        <svg class="venn-svg" viewBox="0 0 260 248" aria-label="IT業界4分類ベン図">
          <g
            v-for="(circle, i) in vennCircles"
            :key="circle.id"
            class="venn-circle"
            :style="{ '--d': i, '--venn-tone': circle.tone }"
          >
            <circle
              :cx="circle.cx"
              :cy="circle.cy"
              :r="vennRadius"
              class="venn-fill"
              :class="[
                `venn-fill--${circle.id}`,
                vennCircleClass(circle),
              ]"
            />
            <text
              :x="circle.cx"
              :y="circle.titleY"
              text-anchor="middle"
              class="venn-title"
              :class="{
                'venn-title--out': !circle.nano,
                'venn-title--hide': !isVennNamed(circle.id),
              }"
            >
              {{ circle.short }}
            </text>
            <text
              :x="circle.cx"
              :y="circle.subY"
              text-anchor="middle"
              class="venn-sub"
              :class="{
                'venn-sub--out': !circle.nano,
                'venn-title--hide': !isVennNamed(circle.id),
              }"
            >
              {{ circle.examplesShort }}
            </text>
          </g>
          <g
            v-for="(overlap, i) in vennOverlaps"
            :key="overlap.id"
            class="venn-overlap"
            :class="[`venn-overlap--${overlap.id}`, { 'venn-overlap--hide': !vennShowOverlap }]"
            :style="{ '--d': i }"
          >
            <rect
              :x="overlap.x - 28"
              :y="overlap.y - 14"
              width="56"
              height="26"
              rx="6"
              class="venn-overlap-bg"
            />
            <text :x="overlap.x" :y="overlap.y - 1" text-anchor="middle" class="venn-overlap-label">{{ overlap.label }}</text>
            <text :x="overlap.x" :y="overlap.y + 10" text-anchor="middle" class="venn-overlap-line">{{ overlap.line }}</text>
          </g>
        </svg>
        <span
          class="nano-pin nano-pin--venn"
          :class="{ 'nano-pin--show': vennDone }"
        >
          <span class="nano-pin-dot" />ナノコネ
        </span>
      </div>
      <p class="live-cap" aria-live="polite">{{ vennCaption }}</p>
    </div>

    <div v-else-if="scene === 'it-tech-domains'" class="demo demo--domains">
      <div class="domain-stage" :class="{ 'domain-stage--done': domainDone }">
        <article
          v-for="(domain, i) in techDomains"
          :key="domain.id"
          class="domain"
          :class="domainCardClass(domain)"
          :style="{ '--d': i, '--domain-tone': domain.tone }"
        >
          <strong :class="{ 'name-hide': !isDomainNamed(domain.id) }">{{ domain.name }}</strong>
          <p :class="{ 'name-hide': !isDomainNamed(domain.id) }">{{ domain.line }}</p>
          <span class="domain-ex" :class="{ 'name-hide': !isDomainNamed(domain.id) }">{{ domain.examples }}</span>
        </article>
        <span
          class="nano-pin nano-pin--domain"
          :class="{ 'nano-pin--show': domainDone }"
        >
          <span class="nano-pin-dot" />ナノコネ
        </span>
      </div>
      <p v-if="domainShowOverlap" class="overlap-banner">{{ domainOverlap.label }} · {{ domainOverlap.name }} · {{ domainOverlap.line }}</p>
      <p class="live-cap" aria-live="polite">{{ domainCaption }}</p>
    </div>

    <div v-else-if="scene === 'it-subcontract'" class="demo demo--sub">
      <p class="sub-head">下へ渡るほど、お金も期限も減る</p>
      <div class="contract" :class="{ 'contract--nano': currentContract.nano }">
        <span class="contract-label">いまの契約</span>
        <strong>{{ currentContract.tier }}</strong>
        <div class="contract-meters">
          <div class="meter">
            <span>お金</span>
            <div class="meter-track"><i :style="{ width: currentContract.money + '%' }" /></div>
            <em>{{ currentContract.money }}%</em>
          </div>
          <div class="meter meter--week">
            <span>期限</span>
            <div class="meter-track"><i :style="{ width: weekPct(currentContract) + '%' }" /></div>
            <em>{{ currentContract.deadline }}</em>
          </div>
        </div>
      </div>
      <div class="funnel">
        <article
          v-for="(node, i) in subcontractChain"
          :key="node.tier"
          class="layer"
          :class="{
            'layer--on': !subFinished && flowIndex === i,
            'layer--passed': subFinished ? !node.nano : flowIndex > i,
            'layer--nano': node.nano,
            'layer--focus': subFinished && node.nano,
          }"
          :style="{ '--w': weekPct(node) + '%', '--d': i }"
        >
          <span class="layer-name">{{ node.short }}</span>
          <span class="layer-week">{{ node.deadline }}</span>
          <span class="layer-pay">{{ node.money }}%</span>
        </article>
      </div>
      <p class="sub-caption">
        <template v-if="subFinished">ナノコネは 1次請けで受け取る · オフショア / ニアショアも同じ構造</template>
        <template v-else>
          {{ currentContract.tier }}：{{ currentContract.role }}
          <span v-if="currentContract.place"> · {{ currentContract.place }}</span>
        </template>
      </p>
    </div>

    <div v-else-if="scene === 'it-work-mix'" class="demo demo--mix">
      <article class="mix-block">
        <small>業界全体</small>
        <div class="bar">
          <span
            v-for="(item, i) in workMix.industry"
            :key="item.label"
            class="bar-seg"
            :class="{ 'bar-seg--on': mixBeat >= i, 'bar-seg--wait': mixBeat < i }"
            :style="{ flex: item.ratio, background: item.color }"
          >{{ item.ratio }}%</span>
        </div>
        <ul class="mix-legend">
          <li
            v-for="(item, i) in workMix.industry"
            :key="item.label"
            :class="{ 'mix-legend--on': mixBeat >= i }"
          >
            <span class="legend-dot" :style="{ background: item.color }" />{{ item.label }} · {{ item.risk }}
          </li>
        </ul>
      </article>
      <article class="mix-block mix-block--nano" :class="{ 'mix-block--show': mixShowNano }">
        <small>ナノコネ</small>
        <div class="bar">
          <span v-for="item in workMix.nano" :key="item.label" class="bar-seg" :style="{ flex: item.ratio, background: item.color }">{{ item.ratio }}%</span>
        </div>
        <p class="mix-foot">2 次受けは 2〜3 社 · ほぼ 1 次請け</p>
      </article>
      <p class="live-cap" aria-live="polite">{{ mixCaption }}</p>
    </div>

    <div v-else-if="scene === 'it-nano-summary'" class="demo demo--coord">
      <p class="coord-head">ここまでの表でまとめ · 次は「IT業界での職種」</p>
      <div class="coord-viewport">
        <div class="coord-track" :style="{ transform: `translateX(-${coordSlide * 100}%)` }">
          <article class="coord-slide coord-slide--venn">
            <p class="coord-slide-title">IT 業界の分類</p>
            <div class="venn-layout venn-layout--compact venn-layout--done">
              <svg class="venn-svg" viewBox="0 0 260 248" aria-label="IT業界4分類ベン図">
                <g v-for="(circle, i) in vennCircles" :key="circle.id" class="venn-circle" :style="{ '--d': i, '--venn-tone': circle.tone }">
                  <circle :cx="circle.cx" :cy="circle.cy" :r="vennRadius" :class="[`venn-fill--${circle.id}`, vennCircleClass(circle)]" />
                  <text :x="circle.cx" :y="circle.titleY" text-anchor="middle" class="venn-title" :class="{ 'venn-title--out': !circle.nano }">{{ circle.short }}</text>
                  <text :x="circle.cx" :y="circle.subY" text-anchor="middle" class="venn-sub" :class="{ 'venn-sub--out': !circle.nano }">{{ circle.examplesShort }}</text>
                </g>
                <g v-for="(overlap, i) in vennOverlaps" :key="overlap.id" class="venn-overlap" :class="`venn-overlap--${overlap.id}`" :style="{ '--d': i }">
                  <rect :x="overlap.x - 28" :y="overlap.y - 14" width="56" height="26" rx="6" class="venn-overlap-bg" />
                  <text :x="overlap.x" :y="overlap.y - 1" text-anchor="middle" class="venn-overlap-label">{{ overlap.label }}</text>
                  <text :x="overlap.x" :y="overlap.y + 10" text-anchor="middle" class="venn-overlap-line">{{ overlap.line }}</text>
                </g>
              </svg>
              <span class="nano-pin nano-pin--venn nano-pin--show"><span class="nano-pin-dot" />ナノコネ</span>
            </div>
          </article>

          <article class="coord-slide coord-slide--domains">
            <p class="coord-slide-title">技術領域の分類</p>
            <div class="domain-stage domain-stage--compact domain-stage--done">
              <article
                v-for="(domain, i) in techDomains"
                :key="domain.id"
                class="domain"
                :class="domainCardClass(domain)"
                :style="{ '--d': i, '--domain-tone': domain.tone }"
              >
                <strong>{{ domain.name }}</strong>
                <p>{{ domain.line }}</p>
                <span class="domain-ex">{{ domain.examples }}</span>
              </article>
              <span class="nano-pin nano-pin--domain nano-pin--show"><span class="nano-pin-dot" />ナノコネ</span>
            </div>
          </article>

          <article class="coord-slide coord-slide--sub">
            <p class="coord-slide-title">下請けの仕組み</p>
            <div class="funnel funnel--compact">
              <article
                v-for="(node, i) in subcontractChain"
                :key="node.tier"
                class="layer"
                :class="{
                  'layer--nano': node.nano,
                  'layer--focus': node.nano,
                  'layer--passed': !node.nano && i > 1,
                }"
                :style="{ '--w': weekPct(node) + '%', '--d': i }"
              >
                <span class="layer-name">{{ node.short }}</span>
                <span class="layer-week">{{ node.deadline }}</span>
                <span class="layer-pay">{{ node.money }}%</span>
              </article>
            </div>
            <span class="nano-pin nano-pin--sub nano-pin--show"><span class="nano-pin-dot" />ナノコネ · 1次請け</span>
          </article>
        </div>
      </div>
      <div class="coord-dots">
        <button
          v-for="(_, i) in 3"
          :key="i"
          type="button"
          class="coord-dot"
          :class="{ 'coord-dot--on': coordSlide === i }"
          :aria-label="`表 ${i + 1}`"
          @click="goCoordSlide(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpreadScene } from "~/utils/bookContent"
import {
  IT_DOMAIN_OVERLAP,
  IT_INDUSTRY_TYPES,
  IT_SUBCONTRACT_CHAIN,
  IT_TECH_DOMAINS,
  IT_VENN_CIRCLE_LAYOUT,
  IT_VENN_OVERLAPS,
  IT_VENN_RADIUS,
  IT_WORK_MIX,
} from "~/utils/itIndustry"

const VENN_BEAT_MS = 1300
const DOMAIN_BEAT_MS = 1200
const SUB_FLOW_MS = 1500
const COORD_SLIDE_MS = 5500
const MIX_BEAT_MS = 1100
const VENN_LAST = 5
const DOMAIN_LAST = 5
const MIX_LAST = 3
const VENN_NAME_ORDER = IT_INDUSTRY_TYPES.map((item) => item.id)

const props = defineProps<{ scene: SpreadScene; accent: string }>()

const vennRadius = IT_VENN_RADIUS
const vennOverlaps = IT_VENN_OVERLAPS
const vennCircles = IT_VENN_CIRCLE_LAYOUT.map((layout) => {
  const type = IT_INDUSTRY_TYPES.find((item) => item.id === layout.id)!
  const examplesShort = type.examples.split(" · ")[0] + " 等"
  return { ...layout, ...type, examplesShort }
})
const techDomains = IT_TECH_DOMAINS
const domainOverlap = IT_DOMAIN_OVERLAP
const subcontractChain = IT_SUBCONTRACT_CHAIN
const workMix = IT_WORK_MIX

const flowIndex = ref(0)
const subFinished = ref(false)
const coordSlide = ref(0)
const vennStep = ref(-1)
const domainStep = ref(-1)
const mixBeat = ref(-1)
let flowTimer: ReturnType<typeof setInterval> | null = null
let coordTimer: ReturnType<typeof setInterval> | null = null
let vennTimer: ReturnType<typeof setInterval> | null = null
let domainTimer: ReturnType<typeof setInterval> | null = null
let mixTimer: ReturnType<typeof setInterval> | null = null

const vennDone = computed(() => vennStep.value >= VENN_LAST)
const vennShowOverlap = computed(() => vennStep.value >= 4)
const domainDone = computed(() => domainStep.value >= DOMAIN_LAST)
const domainShowOverlap = computed(() => domainStep.value >= 4)
const mixShowNano = computed(() => mixBeat.value >= MIX_LAST)

const vennCaption = computed(() => {
  if (vennStep.value < 0) return "4つの分かれ方"
  if (vennStep.value <= 3) {
    const type = IT_INDUSTRY_TYPES[vennStep.value]
    return type ? `${type.name}：${type.hint}` : ""
  }
  if (vennStep.value === 4) return "重なり：1社が複数の顔を持つことも"
  return "ナノコネはハード以外の3つ"
})

const domainCaption = computed(() => {
  if (domainStep.value < 0) return "技術の切り口"
  if (domainStep.value <= 3) {
    const domain = techDomains[domainStep.value]
    return domain ? `${domain.name}：${domain.hint}` : ""
  }
  if (domainStep.value === 4) return `${domainOverlap.label}：${domainOverlap.name}（${domainOverlap.line}）`
  return "ナノコネは汎用系以外が中心"
})

const mixCaption = computed(() => {
  if (mixBeat.value < 0) return "業界全体の割合"
  if (mixBeat.value < workMix.industry.length) {
    const item = workMix.industry[mixBeat.value]
    return item ? `${item.label} ${item.ratio}% · ${item.risk}` : ""
  }
  return "ナノコネ：研究 10% · 受託 40% · 常駐 50%"
})

const currentContract = computed(() => {
  if (subFinished.value) return subcontractChain.find((node) => node.nano) ?? subcontractChain[1]
  return subcontractChain[flowIndex.value] ?? subcontractChain[0]
})

function weekPct(node: { weeks: number }) {
  return Math.round(42 + (node.weeks / 52) * 58)
}

function isVennNamed(id: string) {
  if (props.scene === "it-nano-summary") return true
  const index = VENN_NAME_ORDER.indexOf(id)
  return index >= 0 && vennStep.value >= index
}

function isDomainNamed(id: string) {
  if (props.scene === "it-nano-summary") return true
  const index = techDomains.findIndex((item) => item.id === id)
  return index >= 0 && domainStep.value >= index
}

function vennCircleClass(circle: { id: string; nano: boolean }) {
  if (!circle.nano) return "venn-fill--out"
  if (props.scene === "it-nano-summary" || vennDone.value) return "venn-fill--nano-lit venn-fill--nano-final"
  if (vennStep.value >= 0 && vennStep.value <= 3 && VENN_NAME_ORDER[vennStep.value] === circle.id) {
    return "venn-fill--nano-lit"
  }
  return "venn-fill--nano-dim"
}

function domainCardClass(domain: { id: string; nano: boolean }) {
  const named = isDomainNamed(domain.id)
  const done = props.scene === "it-nano-summary" || domainDone.value
  const active = domainStep.value >= 0 && domainStep.value <= 3 && techDomains[domainStep.value]?.id === domain.id

  return {
    "domain--nano": domain.nano,
    "domain--out": !domain.nano,
    "domain--active": domain.nano && active && props.scene !== "it-nano-summary",
    "domain--idle": domain.nano && named && !done && !active,
    "domain--done": domain.nano && done,
    "domain--blank": !named,
  }
}

function goCoordSlide(index: number) {
  coordSlide.value = index
  resetCoordAutoTimer()
}

function resetCoordAutoTimer() {
  if (coordTimer) clearInterval(coordTimer)
  if (props.scene !== "it-nano-summary") return
  coordTimer = setInterval(() => {
    if (coordSlide.value >= 2) {
      if (coordTimer) clearInterval(coordTimer)
      coordTimer = null
      return
    }
    coordSlide.value += 1
  }, COORD_SLIDE_MS)
}

function setupSceneTimers() {
  if (flowTimer) clearInterval(flowTimer)
  if (coordTimer) clearInterval(coordTimer)
  if (vennTimer) clearInterval(vennTimer)
  if (domainTimer) clearInterval(domainTimer)
  if (mixTimer) clearInterval(mixTimer)
  flowTimer = coordTimer = vennTimer = domainTimer = mixTimer = null

  if (props.scene === "it-subcontract") {
    flowIndex.value = 0
    subFinished.value = false
    flowTimer = setInterval(() => {
      if (flowIndex.value >= subcontractChain.length - 1) {
        subFinished.value = true
        flowIndex.value = 1
        if (flowTimer) clearInterval(flowTimer)
        flowTimer = null
        return
      }
      flowIndex.value += 1
    }, SUB_FLOW_MS)
  }
  if (props.scene === "it-nano-summary") {
    coordSlide.value = 0
    resetCoordAutoTimer()
  }
  if (props.scene === "it-industry-venn") {
    vennStep.value = -1
    vennTimer = setInterval(() => {
      vennStep.value += 1
      if (vennStep.value >= VENN_LAST) {
        if (vennTimer) clearInterval(vennTimer)
        vennTimer = null
      }
    }, VENN_BEAT_MS)
  }
  if (props.scene === "it-tech-domains") {
    domainStep.value = -1
    domainTimer = setInterval(() => {
      domainStep.value += 1
      if (domainStep.value >= DOMAIN_LAST) {
        if (domainTimer) clearInterval(domainTimer)
        domainTimer = null
      }
    }, DOMAIN_BEAT_MS)
  }
  if (props.scene === "it-work-mix") {
    mixBeat.value = -1
    mixTimer = setInterval(() => {
      mixBeat.value += 1
      if (mixBeat.value >= MIX_LAST) {
        if (mixTimer) clearInterval(mixTimer)
        mixTimer = null
      }
    }, MIX_BEAT_MS)
  }
}

onMounted(setupSceneTimers)
onBeforeUnmount(() => {
  if (flowTimer) clearInterval(flowTimer)
  if (coordTimer) clearInterval(coordTimer)
  if (vennTimer) clearInterval(vennTimer)
  if (domainTimer) clearInterval(domainTimer)
  if (mixTimer) clearInterval(mixTimer)
})
watch(() => props.scene, setupSceneTimers)
</script>

<style scoped>
.art { position: absolute; inset: 0; color: #fff; }
.demo { position: absolute; inset: 0; }

.demo--venn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 8px 72px;
}
.venn-layout { position: relative; width: 100%; height: 78%; max-height: 300px; }
.venn-svg { display: block; width: 100%; height: 100%; overflow: visible; }
.venn-circle { animation: vcIn 0.55s ease backwards; animation-delay: calc(var(--d) * 0.08s); }
.venn-fill {
  fill: color-mix(in srgb, var(--venn-tone) 44%, rgb(255 255 255 / 0.15));
  stroke: var(--venn-tone);
  stroke-width: 2.5;
}
.venn-fill--out {
  fill: rgb(136 136 136 / 0.22);
  stroke: rgb(255 255 255 / 0.45);
  stroke-dasharray: 5 4;
}
.venn-fill--nano-lit {
  fill: color-mix(in srgb, var(--venn-tone) 72%, #fff);
  stroke: #fff;
  stroke-width: 3;
  filter: drop-shadow(0 0 8px rgb(255 255 255 / 0.45));
  transition: fill 0.45s ease, stroke 0.45s ease, opacity 0.45s ease, filter 0.45s ease;
}
.venn-fill--nano-final {
  filter: drop-shadow(0 0 12px rgb(255 255 255 / 0.65));
}
.venn-fill--nano-dim {
  opacity: 0.5;
  transition: opacity 0.45s ease;
}
.venn-layout--done .venn-fill--nano-lit {
  opacity: 1;
}
.venn-title {
  fill: #fff;
  font-size: 15px;
  font-weight: 800;
  font-family: "M PLUS Rounded 1c", sans-serif;
  paint-order: stroke fill;
  stroke: rgb(0 0 0 / 0.35);
  stroke-width: 3px;
}
.venn-title--hide { opacity: 0; }
.venn-overlap--hide { opacity: 0 !important; }
.live-cap {
  margin: 0;
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  line-height: 1.4;
  min-height: 1.4em;
}
.overlap-banner {
  margin: 0 4px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.22);
  font-size: 10px;
  font-weight: 800;
  text-align: center;
}
.name-hide { opacity: 0; }
.domain--blank { min-height: 72px; }
.venn-sub {
  fill: rgb(255 255 255 / 0.92);
  font-size: 9px;
  font-weight: 700;
  font-family: "M PLUS Rounded 1c", sans-serif;
  paint-order: stroke fill;
  stroke: rgb(0 0 0 / 0.3);
  stroke-width: 2px;
}
.venn-sub--out { fill: rgb(255 255 255 / 0.55); }
.venn-overlap { animation: overlapIn 0.5s ease backwards; animation-delay: calc(0.35s + var(--d) * 0.08s); }
.venn-overlap-bg { fill: rgb(0 0 0 / 0.42); }
.venn-overlap-label {
  fill: #fff;
  font-size: 7px;
  font-weight: 800;
  font-family: "M PLUS Rounded 1c", sans-serif;
}
.venn-overlap-line {
  fill: rgb(255 255 255 / 0.88);
  font-size: 6.5px;
  font-weight: 600;
  font-family: "M PLUS Rounded 1c", sans-serif;
}
.nano-pin {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.nano-pin--show {
  opacity: 1;
  transform: scale(1);
}
.nano-pin--venn { position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%) scale(0.92); }
.nano-pin--venn.nano-pin--show { transform: translate(-50%, -50%) scale(1); }
.nano-pin--domain { position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%) scale(0.92); }
.nano-pin--domain.nano-pin--show { transform: translateX(-50%) scale(1); }
.nano-pin--sub { display: inline-flex; margin: 6px auto 0; }
.nano-pin-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.venn-layout--done .nano-pin-dot,
.domain-stage--done .nano-pin-dot,
.nano-pin--show .nano-pin-dot { opacity: 1; transform: none; }

.demo--domains {
  padding: 8px 8px 72px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.domain-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  padding-bottom: 34px;
}
.domain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 9px;
  border-radius: 12px;
  animation: domainIn 0.5s ease backwards;
  animation-delay: calc(var(--d) * 0.08s);
  transition: box-shadow 0.25s ease, opacity 0.25s ease, border-color 0.25s ease;
}

.domain--nano.domain--active {
  z-index: 2;
  opacity: 1;
  box-shadow: 0 0 0 3px rgb(255 255 255 / 0.5), 0 6px 16px rgb(0 0 0 / 0.16);
}

.domain--nano.domain--idle {
  opacity: 0.5;
}

.domain--nano.domain--done {
  opacity: 1;
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.35);
}
.domain--out {
  background: rgb(255 255 255 / 0.08);
  border: 2px dashed rgb(255 255 255 / 0.35);
  color: rgb(255 255 255 / 0.55);
}
.domain strong { font-size: 15px; }
.domain p { margin: 4px 0 0; font-size: 10px; line-height: 1.4; }
.domain-ex {
  display: block;
  margin-top: 8px;
  padding: 5px 7px;
  border-radius: 8px;
  background: rgb(0 0 0 / 0.06);
  font-size: 9px;
  font-weight: 700;
  line-height: 1.35;
}
.domain--out .domain-ex { background: rgb(255 255 255 / 0.06); }

.domain--nano {
  background: #fff;
  color: #1a2a3a;
  border: 2px solid var(--domain-tone);
}
.domain-stage--compact { padding-bottom: 28px; gap: 6px; }
.domain-stage--compact .domain strong { font-size: 13px; }
.domain-stage--compact .domain p { font-size: 9px; }
.domain-stage--compact .domain-ex { font-size: 8px; margin-top: 6px; padding: 4px 6px; }
.venn-layout--compact { max-height: 260px; }
.venn-layout--compact .venn-title { font-size: 13px; }
.venn-layout--compact .venn-sub { font-size: 8px; }

.demo--sub {
  padding: 10px 10px 72px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-height: 0;
}
.sub-head { margin: 0; font-size: 11px; font-weight: 800; text-align: center; opacity: 0.9; letter-spacing: 0.06em; }
.contract {
  flex: 0 0 auto;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.14);
  transition: background 0.35s ease, color 0.35s ease;
}
.contract--nano {
  background: #fff;
  color: var(--accent);
}
.contract-label {
  display: block;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
  opacity: 0.7;
}
.contract strong {
  display: block;
  margin: 2px 0 8px;
  font-size: 16px;
  line-height: 1.2;
}
.contract-meters { display: flex; flex-direction: column; gap: 6px; }
.meter {
  display: grid;
  grid-template-columns: 28px 1fr 36px;
  gap: 6px;
  align-items: center;
  font-size: 9px;
  font-weight: 800;
}
.meter-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgb(255 255 255 / 0.2);
}
.contract--nano .meter-track { background: rgb(47 190 166 / 0.16); }
.meter-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #E8A838;
  transition: width 0.7s ease;
}
.meter--week .meter-track i { background: #EE6D7A; }
.meter em { font-style: normal; text-align: right; }
.funnel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  flex: 1;
  justify-content: center;
}
.funnel--compact { flex: 1; gap: 3px; }
.layer {
  width: var(--w);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.16);
  border: 1.5px solid rgb(255 255 255 / 0.28);
  transition: width 0.7s ease, background 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease;
  animation: nodeIn 0.4s ease backwards;
  animation-delay: calc(var(--d, 0) * 0.05s);
}
.layer-name { font-size: 11px; font-weight: 800; }
.layer-week { font-size: 10px; font-weight: 800; opacity: 0.85; }
.layer-pay { font-size: 10px; font-weight: 800; }
.layer--on {
  background: rgb(255 255 255 / 0.28);
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.45);
}
.layer--passed { opacity: 0.45; }
.layer--nano {
  background: #fff;
  color: var(--accent);
  border-color: #fff;
}
.layer--focus {
  box-shadow: 0 0 0 3px #fff, 0 0 16px rgb(255 255 255 / 0.35);
}
.sub-caption { margin: 0; font-size: 10px; font-weight: 700; text-align: center; opacity: 0.9; }

.demo--mix { padding: 12px 14px 72px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
.mix-block { padding: 12px; border-radius: 14px; background: rgb(255 255 255 / 0.14); animation: pop 0.5s ease backwards; }
.mix-block--nano {
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.mix-block--nano.mix-block--show { opacity: 1; transform: none; }
.mix-block small { display: block; margin-bottom: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; }
.bar { display: flex; height: 28px; border-radius: 999px; overflow: hidden; background: rgb(255 255 255 / 0.15); }
.bar-seg { display: grid; place-items: center; min-width: 0; color: #fff; font-size: 10px; font-weight: 800; text-shadow: 0 1px 2px rgb(0 0 0 / 0.25); }
.bar-seg--wait { opacity: 0.28; }
.mix-legend, .coord-mix-legend {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10px;
  line-height: 1.4;
}
.mix-legend li { opacity: 0.38; transition: opacity 0.35s ease; }
.mix-legend--on { opacity: 1; }
.legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
.mix-foot { margin: 8px 0 0; font-size: 11px; font-weight: 700; }

.demo--coord { padding: 10px 8px 64px; display: flex; flex-direction: column; gap: 8px; justify-content: center; min-height: 0; }
.coord-head { margin: 0; font-size: 10px; font-weight: 800; text-align: center; opacity: 0.85; letter-spacing: 0.08em; }
.coord-viewport { overflow: hidden; width: 100%; border-radius: 14px; background: rgb(255 255 255 / 0.08); flex: 1; min-height: 0; }
.coord-track { display: flex; height: 100%; transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform; }
.coord-slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  padding: 10px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  align-items: stretch;
}
.coord-slide-title { margin: 0; font-size: 14px; font-weight: 800; text-align: center; flex-shrink: 0; }
.coord-slide--venn,
.coord-slide--domains { justify-content: center; }
.coord-slide--sub { justify-content: flex-start; }
.coord-dots { display: flex; justify-content: center; gap: 8px; flex-shrink: 0; }
.coord-dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.3);
  cursor: pointer;
  transition: background 0.35s ease, transform 0.35s ease;
}
.coord-dot--on { background: #fff; transform: scale(1.15); }

@keyframes pop { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes domainIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes bridgePulse { 0%, 100% { opacity: 0.45; transform: scaleX(0.85); } 50% { opacity: 1; transform: scaleX(1.1); } }
@keyframes vcIn { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes overlapIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes pinPulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.05); } }
@keyframes nanoPinPulse { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.05); } }
@keyframes dotBlink { 0%, 100% { opacity: 0.5; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes nanoGlow {
  0%, 100% { filter: drop-shadow(0 0 6px rgb(255 255 255 / 0.35)); }
  50% { filter: drop-shadow(0 0 14px rgb(255 255 255 / 0.75)); }
}
@keyframes nodeIn { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes packetTravel {
  0% { left: 6%; opacity: 0; transform: translate(-50%, -50%) scale(0.75); }
  12% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  88% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { left: 94%; opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
}

@media (prefers-reduced-motion: reduce) {
  .venn-fill, .venn-overlap, .layer, .domain--active, .coord-track, .coord-dot, .meter-track i { animation: none; transition: none; }
}
</style>
