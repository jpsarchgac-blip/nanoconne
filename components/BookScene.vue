<template>
  <div class="scene" :class="`scene--${scene}`" :style="{ '--accent': accent }">
    <!-- intern -->
    <InternArt
      v-if="isIntern"
      :scene="scene"
      :accent="accent"
      :portal="portal"
    />

    <!-- gf -->
    <GfArt v-else-if="isGf" :key="scene" :scene="scene" :accent="accent" />

    <NanoArt v-else-if="isNano" :key="scene" :scene="scene" :accent="accent" />
    <ItArt v-else-if="isIt" :key="scene" :scene="scene" :accent="accent" />
    <ItJobsArt v-else-if="isItJobs" :key="scene" :scene="scene" :accent="accent" />
    <WorkArt v-else-if="isWork" :key="scene" :scene="scene" :accent="accent" />
  </div>
</template>

<script setup lang="ts">
import GfArt from "~/components/GfArt.vue"
import InternArt from "~/components/InternArt.vue"
import ItArt from "~/components/ItArt.vue"
import ItJobsArt from "~/components/ItJobsArt.vue"
import NanoArt from "~/components/NanoArt.vue"
import WorkArt from "~/components/WorkArt.vue"
import type { SpreadScene } from "~/utils/bookContent"

const gfScenes: SpreadScene[] = [
  "service-shift",
  "user-core",
  "gf-value",
  "gf-framework",
  "gf-process",
  "gf-cases",
  "gf-twelve",
  "gf-pick",
  "gf-elements",
  "site-mirror",
]
const internScenes: SpreadScene[] = [
  "intern-poster",
  "compete-seed",
  "compete-flow",
  "schedule-flags",
  "intern-courses",
  "intern-video",
  "action-links",
]
const nanoScenes: SpreadScene[] = [
  "company-world",
  "product-skywalker",
  "product-linka",
  "product-mieroom",
  "product-jankara",
  "product-automotive",
  "work-style-seed",
]
const itScenes: SpreadScene[] = [
  "it-industry-venn",
  "it-tech-domains",
  "it-subcontract",
  "it-work-mix",
  "it-nano-summary",
]
const itJobsScenes: SpreadScene[] = [
  "it-jobs-pyramid",
  "it-jobs-pyramid-annotate",
  "it-jobs-targets",
  "it-jobs-nano-targets",
  "it-jobs-recruit",
]
const workScenes: SpreadScene[] = [
  "work-engineer",
  "work-office-outside",
  "work-office-inside",
  "work-meeting",
  "work-flex-day",
  "work-styles",
  "work-growth",
]

const props = defineProps<{
  scene: SpreadScene
  accent: string
  portal?: {
    period: string
    requiredDays: string
    optionalDays: string
    venue: string
    zoom: string
    courses: string
    prizeNote?: string
    taskOutline: string
    links: { label: string; href: string }[]
  } | null
}>()

const isIntern = computed(() => internScenes.includes(props.scene))
const isGf = computed(() => gfScenes.includes(props.scene))
const isNano = computed(() => nanoScenes.includes(props.scene))
const isIt = computed(() => itScenes.includes(props.scene))
const isItJobs = computed(() => itJobsScenes.includes(props.scene))
const isWork = computed(() => workScenes.includes(props.scene))
</script>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* intern */
.seed {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.35);
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  animation: pulse 2.4s ease-in-out infinite;
}

.seed--2 {
  width: 40px;
  height: 40px;
  left: 28%;
  top: 58%;
  animation-delay: 0.4s;
}

.seed--3 {
  width: 48px;
  height: 48px;
  left: 72%;
  top: 52%;
  animation-delay: 0.8s;
}

.seed--plan {
  left: 32%;
  background: rgb(255 255 255 / 0.5);
}

.seed--dev {
  left: 68%;
  animation-delay: 0.6s;
}

.flag {
  position: absolute;
  bottom: 28%;
  width: 36px;
  height: 52px;
  background: rgb(255 255 255 / 0.85);
  color: var(--accent);
  font-weight: 700;
  font-size: 14px;
  display: grid;
  place-items: center;
  border-radius: 4px 4px 0 0;
  animation: rise 0.8s ease backwards;
}

.flag--1 { left: 8%; animation-delay: 0.05s; }
.flag--2 { left: 22%; animation-delay: 0.15s; }
.flag--3 { left: 36%; animation-delay: 0.25s; }
.flag--4 { left: 50%; animation-delay: 0.35s; }
.flag--5 { left: 64%; animation-delay: 0.45s; }
.flag--6 { left: 78%; animation-delay: 0.55s; }

.step {
  position: absolute;
  top: 46%;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.28);
  font-size: 12px;
  font-weight: 700;
  animation: fadeUp 0.6s ease backwards;
}

.step--1 { left: 8%; animation-delay: 0.05s; }
.step--2 { left: 28%; animation-delay: 0.2s; }
.step--3 { left: 48%; animation-delay: 0.35s; }
.step--4 { left: 68%; animation-delay: 0.5s; }

.detail-card {
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  width: min(220px, 70%);
  padding: 20px 18px;
  border-radius: 18px;
  background: rgb(255 255 255 / 0.24);
  text-align: center;
  animation: fadeUp 0.7s ease backwards;
}

.detail-card strong {
  display: block;
  font-size: 22px;
}

.detail-card small {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.9;
}

.detail-card--plan::before,
.detail-card--dev::before {
  content: "";
  display: block;
  width: 48px;
  height: 48px;
  margin: 0 auto 10px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.35);
}

.portal {
  list-style: none;
  margin: 0;
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
  font-size: 12px;
  line-height: 1.45;
  max-height: 100%;
  overflow: auto;
}

.portal strong {
  display: inline-block;
  min-width: 3em;
  margin-right: 8px;
  opacity: 0.85;
}

.portal a {
  color: #fff;
  font-weight: 700;
}

.client {
  position: absolute;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.26);
  font-size: 12px;
  font-weight: 700;
  animation: fadeUp 0.5s ease backwards;
}

.client--1 { left: 12%; top: 28%; }
.client--2 { right: 10%; top: 24%; animation-delay: 0.15s; }
.client--3 { left: 18%; bottom: 28%; animation-delay: 0.3s; }
.client--4 { right: 16%; bottom: 24%; animation-delay: 0.45s; }

.term {
  position: absolute;
  width: 38%;
  padding: 12px 10px;
  text-align: center;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.24);
  font-size: 12px;
  font-weight: 700;
  animation: fadeUp 0.5s ease backwards;
}

.term--1 { left: 10%; top: 22%; }
.term--2 { right: 10%; top: 22%; animation-delay: 0.12s; }
.term--3 { left: 10%; bottom: 22%; animation-delay: 0.24s; }
.term--4 { right: 10%; bottom: 22%; animation-delay: 0.36s; }

.slot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.28);
  font-size: 12px;
  font-weight: 700;
  animation: fadeUp 0.5s ease backwards;
}

.slot--1 { top: 18%; animation-delay: 0.05s; }
.slot--2 { top: 36%; animation-delay: 0.2s; }
.slot--3 { top: 54%; animation-delay: 0.35s; }
.slot--4 { top: 72%; animation-delay: 0.5s; }

.moment {
  position: absolute;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.28);
  font-size: 13px;
  font-weight: 700;
  animation: fadeUp 0.5s ease backwards;
}

.moment--1 { left: 14%; top: 32%; }
.moment--2 { left: 50%; top: 48%; transform: translateX(-50%); animation-delay: 0.2s; }
.moment--3 { right: 12%; top: 62%; animation-delay: 0.35s; }

.mirror {
  position: absolute;
  width: 120px;
  height: 80px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.2);
  left: 20%;
  top: 32%;
  animation: float 3s ease-in-out infinite;
}

.mirror--2 {
  left: auto;
  right: 18%;
  top: 42%;
  animation-delay: 0.8s;
}

/* nano */
.city {
  position: absolute;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: rgb(255 255 255 / 0.9);
}

.spark {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.25);
  right: 18%;
  top: 24%;
  animation: pulse 2.2s ease-in-out infinite;
}

.box {
  position: absolute;
  left: 22%;
  top: 38%;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.3);
  font-weight: 700;
  animation: fadeUp 0.7s ease backwards;
}

.box--2 {
  left: auto;
  right: 20%;
  top: 48%;
  animation-delay: 0.25s;
}

.shadow {
  position: absolute;
  left: 28%;
  top: 40%;
  font-size: 36px;
  font-weight: 700;
  opacity: 0.35;
  animation: fadeUp 0.6s ease backwards;
}

.shadow--ai {
  left: auto;
  right: 24%;
  top: 48%;
  animation-delay: 0.3s;
}

/* it */
.slice {
  position: absolute;
  top: 28%;
  width: 28%;
  height: 44%;
  background: rgb(255 255 255 / 0.22);
  border-radius: 8px;
  animation: split 0.8s ease backwards;
}

.slice--a { left: 10%; animation-delay: 0.05s; }
.slice--b { left: 36%; animation-delay: 0.2s; }
.slice--c { left: 62%; animation-delay: 0.35s; }

.place,
.role,
.desk {
  position: absolute;
  top: 42%;
  width: 26%;
  padding: 16px 8px;
  text-align: center;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.25);
  font-weight: 700;
  animation: fadeUp 0.7s ease backwards;
}

.place:nth-child(1),
.role:nth-child(1),
.desk:nth-child(1) { left: 10%; animation-delay: 0.1s; }
.place:nth-child(2),
.role:nth-child(2),
.desk:nth-child(2) { left: 37%; animation-delay: 0.25s; }
.place:nth-child(3) { left: 64%; animation-delay: 0.4s; }
.role:nth-child(2) { left: auto; right: 10%; width: 32%; }

.tower {
  position: absolute;
  left: 50%;
  bottom: 18%;
  width: 100px;
  height: 140px;
  background: rgb(255 255 255 / 0.35);
  border-radius: 8px 8px 0 0;
  transform: translateX(-50%);
  animation: rise 0.9s ease backwards;
}

/* work */
.site {
  position: absolute;
  top: 40%;
  width: 36%;
  height: 36%;
  border-radius: 16px;
  background: rgb(255 255 255 / 0.25);
  display: grid;
  place-items: center;
  font-weight: 700;
  animation: spread 0.8s ease backwards;
}

.site--office { left: 12%; animation-delay: 0.1s; }
.site--home { right: 12%; animation-delay: 0.3s; }

.clock-face {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 140px;
  height: 140px;
  border: 6px solid rgb(255 255 255 / 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.clock-hand {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 4px;
  height: 50px;
  background: #fff;
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(20deg);
  animation: tick 4s linear infinite;
}

.tag {
  position: absolute;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgb(255 255 255 / 0.28);
  font-size: 12px;
  font-weight: 700;
  animation: fadeUp 0.5s ease backwards;
}

.tag:nth-child(1) { left: 14%; top: 24%; }
.tag:nth-child(2) { right: 12%; top: 30%; animation-delay: 0.15s; }
.tag:nth-child(3) { left: 20%; bottom: 26%; animation-delay: 0.3s; }
.tag:nth-child(5) { left: 50%; top: 50%; transform: translateX(-50%); animation-delay: 0.6s; }
.tag:nth-child(6) { right: 14%; bottom: 14%; animation-delay: 0.75s; }

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.85; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}

@keyframes rise {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes spread {
  from { transform: translateY(-50%) scaleX(0.6); opacity: 0; }
  to { transform: translateY(-50%) scaleX(1); opacity: 1; }
}

@keyframes fadeUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes split {
  from { transform: scaleY(0.3); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes tick {
  to { transform: translate(-50%, -100%) rotate(380deg); }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
  }
}
</style>
