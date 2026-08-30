<template>
  <div class="gf-play" :style="{ '--accent': accent }">
    <div class="motion" :key="active.motion" aria-hidden="true">
      <div v-if="active.motion === 'first-catch'" class="demo demo--catch">
        <span class="spark spark--1" />
        <span class="spark spark--2" />
        <span class="window">
          <span class="window-title">ペラっと。</span>
          <span class="window-books">
            <i /><i /><i /><i /><i />
          </span>
        </span>
      </div>

      <div v-else-if="active.motion === 'interface'" class="demo demo--ui">
        <button type="button" class="fake-btn" tabindex="-1">めくる</button>
        <span class="page-flip" />
      </div>

      <div v-else-if="active.motion === 'goal'" class="demo demo--goal">
        <span class="track" />
        <span class="runner" />
        <span class="flag">ゴール</span>
      </div>

      <div v-else-if="active.motion === 'visualize'" class="demo demo--viz">
        <p class="meter-label">きょうの歩み</p>
        <div class="meter">
          <span class="meter-fill" />
        </div>
        <p class="meter-num">3 / 5 冊</p>
      </div>

      <div v-else-if="active.motion === 'reward'" class="demo demo--reward">
        <span class="check">できた</span>
        <span class="star star--1">★</span>
        <span class="star star--2">★</span>
        <span class="star star--3">★</span>
      </div>

      <div v-else-if="active.motion === 'direction'" class="demo demo--dir">
        <span class="you">あなた</span>
        <span class="dir-arrow">→</span>
        <span class="next-hint">つぎへ</span>
      </div>

      <div v-else-if="active.motion === 'talk'" class="demo demo--talk">
        <span class="person person--a">あ</span>
        <span class="bubble bubble--a">見た！</span>
        <span class="person person--b">い</span>
        <span class="bubble bubble--b">すごい</span>
      </div>

      <div v-else-if="active.motion === 'level'" class="demo demo--level">
        <span class="step step--easy">かんたん</span>
        <span class="step step--ok">ふつう</span>
        <span class="step step--hard">むずかしい</span>
      </div>

      <div v-else-if="active.motion === 'pain'" class="demo demo--pain">
        <span class="pain-old">重い</span>
        <span class="pain-arr">→</span>
        <span class="pain-new">すっきり</span>
      </div>

      <div v-else-if="active.motion === 'desire'" class="demo demo--desire">
        <span class="peek" />
        <span class="peek-label">見たい</span>
      </div>

      <div v-else-if="active.motion === 'avg-user'" class="demo demo--avg">
        <span class="avg-ring" />
        <span class="avg-you">あなた</span>
        <span class="avg-tag">初めて</span>
      </div>

      <div v-else-if="active.motion === 'tune'" class="demo demo--tune">
        <span class="knob" />
        <span class="tune-label">直す</span>
      </div>
    </div>

    <article class="caption" aria-live="polite">
      <p class="caption-index">{{ active.group }} · {{ active.id }} / {{ GF_ELEMENTS.length }}</p>
      <h3 :key="active.id" class="caption-name">{{ active.name }}</h3>
      <p :key="`h-${active.id}`" class="caption-hint">{{ active.hint }}</p>
    </article>

    <div class="groups" role="tablist" aria-label="GFのグループ">
      <button
        v-for="group in GF_GROUP_ORDER"
        :key="group"
        type="button"
        class="group"
        :class="{ 'group--on': active.group === group }"
        role="tab"
        :aria-selected="active.group === group"
        @click="selectGroup(group)"
      >{{ group }}</button>
    </div>

    <div class="chips" role="tablist" aria-label="このグループの要素">
      <button
        v-for="el in groupEls"
        :key="el.id"
        type="button"
        class="chip"
        :class="{ 'chip--on': el.id === active.id }"
        :aria-label="el.name"
        :aria-selected="el.id === active.id"
        @click="goTo(el.id - 1, true)"
      >{{ GF_SHORT[el.id] }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GF_ELEMENTS,
  GF_GROUP_ORDER,
  GF_SHORT,
  gfByGroup,
  type GfGroup,
} from "~/utils/gfElements"

defineProps<{
  accent: string
}>()

const STEP_MS = 2600
const index = ref(0)
const active = computed(() => GF_ELEMENTS[index.value]!)
const groupEls = computed(() => gfByGroup(active.value.group))

let timer: ReturnType<typeof setInterval> | null = null

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function goTo(next: number, fromUser = false) {
  index.value = next
  if (fromUser) stop()
}

function selectGroup(group: GfGroup) {
  const first = GF_ELEMENTS.findIndex((el) => el.group === group)
  if (first >= 0) goTo(first, true)
}

function tick() {
  if (index.value >= GF_ELEMENTS.length - 1) {
    stop()
    return
  }
  index.value += 1
}

onMounted(() => {
  timer = setInterval(tick, STEP_MS)
})
onUnmounted(stop)
</script>

<style scoped>
.gf-play {
  position: absolute;
  inset: 0;
  color: #fff;
  display: grid;
  grid-template-rows: 1fr auto auto auto;
  padding: 10px 12px 64px;
  gap: 6px;
}

.motion {
  position: relative;
  min-height: 0;
}

.demo {
  position: absolute;
  inset: 0;
}

.caption {
  text-align: center;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgb(0 0 0 / 0.22);
}

.caption-index {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.12em;
  opacity: 0.75;
}

.caption-name {
  margin: 4px 0 0;
  font-size: clamp(16px, 2.8vw, 22px);
  line-height: 1.25;
  animation: nameIn 0.4s ease 0.85s backwards;
}

.caption-hint {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.4;
  animation: nameIn 0.4s ease 1.15s backwards;
}

.groups,
.chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.group,
.chip {
  margin: 0;
  padding: 6px 10px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.18);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.group--on,
.chip--on {
  background: #fff;
  color: var(--accent);
}

@keyframes nameIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}

/* first catch */
.window {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 200px;
  height: 132px;
  transform: translate(-50%, -50%) scale(0.6);
  border-radius: 18px;
  background: #fff;
  color: var(--accent);
  box-shadow: 0 10px 28px rgb(0 0 0 / 0.18);
  display: flex;
  flex-direction: column;
  padding: 14px;
  animation: popIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.window-title {
  font-weight: 800;
  font-size: 14px;
}

.window-books {
  margin-top: auto;
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 42px;
}

.window-books i {
  display: block;
  width: 14px;
  border-radius: 3px 3px 0 0;
  background: var(--accent);
  opacity: 0.75;
}

.window-books i:nth-child(1) { height: 22px; }
.window-books i:nth-child(2) { height: 34px; }
.window-books i:nth-child(3) { height: 28px; }
.window-books i:nth-child(4) { height: 38px; }
.window-books i:nth-child(5) { height: 26px; }

.spark {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  animation: twinkle 1.2s ease-in-out infinite;
}

.spark--1 { left: 22%; top: 22%; }
.spark--2 { right: 20%; top: 28%; animation-delay: 0.4s; }

/* interface */
.fake-btn {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 12px 28px;
  background: #fff;
  color: var(--accent);
  font-weight: 800;
  pointer-events: none;
  animation: press 1.8s ease-in-out infinite;
}

.page-flip {
  position: absolute;
  left: 58%;
  top: 58%;
  width: 54px;
  height: 70px;
  background: rgb(255 255 255 / 0.9);
  border-radius: 2px 8px 8px 2px;
  transform-origin: left center;
  animation: flip 1.8s ease-in-out infinite;
}

/* goal */
.track {
  position: absolute;
  left: 14%;
  right: 14%;
  top: 52%;
  height: 6px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.3);
}

.runner {
  position: absolute;
  left: 14%;
  top: 52%;
  width: 18px;
  height: 18px;
  margin-top: -6px;
  border-radius: 50%;
  background: #fff;
  animation: run 2.4s ease-in-out infinite;
}

.flag {
  position: absolute;
  right: 10%;
  top: 36%;
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
}

/* visualize */
.meter-label,
.meter-num {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-weight: 700;
}

.meter-label { top: 22%; font-size: 13px; }
.meter-num { bottom: 18%; font-size: 18px; }

.meter {
  position: absolute;
  left: 14%;
  right: 14%;
  top: 48%;
  height: 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.25);
  overflow: hidden;
}

.meter-fill {
  display: block;
  height: 100%;
  width: 0;
  border-radius: 999px;
  background: #fff;
  animation: fillBar 2s ease forwards;
}

/* reward */
.check {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  padding: 10px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.2);
  font-weight: 800;
}

.star {
  position: absolute;
  font-size: 22px;
  opacity: 0;
  animation: burst 1.6s ease-out infinite;
}

.star--1 { left: 28%; top: 24%; animation-delay: 0.35s; }
.star--2 { left: 48%; top: 16%; animation-delay: 0.5s; }
.star--3 { right: 26%; top: 26%; animation-delay: 0.65s; }

/* direction */
.you,
.next-hint {
  position: absolute;
  top: 46%;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 800;
}

.you {
  left: 12%;
  background: rgb(255 255 255 / 0.2);
}

.next-hint {
  right: 10%;
  background: #fff;
  color: var(--accent);
  animation: nudge 1.2s ease-in-out infinite;
}

.dir-arrow {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  animation: nudge 1.2s ease-in-out infinite;
}

/* talk */
.person {
  position: absolute;
  top: 48%;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  color: var(--accent);
  font-weight: 800;
  display: grid;
  place-items: center;
}

.person--a { left: 16%; }
.person--b { right: 16%; }

.bubble {
  position: absolute;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  opacity: 0;
}

.bubble--a {
  left: 22%;
  top: 24%;
  animation: fadeTalk 2.4s ease-in-out infinite;
}

.bubble--b {
  right: 18%;
  top: 28%;
  animation: fadeTalk 2.4s ease-in-out 0.7s infinite;
}

/* level */
.step {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  background: rgb(255 255 255 / 0.22);
}

.step--easy {
  top: 18%;
  animation: levelPop 2.4s ease infinite;
}

.step--ok {
  top: 42%;
  animation: levelPop 2.4s ease 0.35s infinite;
}

.step--hard {
  top: 66%;
  background: #fff;
  color: var(--accent);
  transform: translateX(-50%) scale(1.08);
  animation: levelPop 2.4s ease 0.7s infinite;
}

.pain-old,
.pain-new {
  position: absolute;
  top: 42%;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 800;
}

.pain-old {
  left: 12%;
  background: rgb(255 255 255 / 0.18);
  text-decoration: line-through;
  animation: fadePain 1.8s ease infinite;
}

.pain-new {
  right: 10%;
  background: #fff;
  color: var(--accent);
  animation: popIn 0.6s ease 0.4s backwards;
}

.pain-arr {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  font-size: 28px;
}

.peek {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 120px;
  height: 72px;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.2);
  overflow: hidden;
}

.peek::after {
  content: "";
  position: absolute;
  inset: 8px 40% 8px 8px;
  border-radius: 10px;
  background: #fff;
  animation: peekSlide 2s ease-in-out infinite;
}

.peek-label {
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-weight: 800;
  animation: pulseHint 1.2s ease-in-out infinite;
}

.avg-ring {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 120px;
  height: 120px;
  border: 6px solid rgb(255 255 255 / 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
}

.avg-you {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  padding: 10px 14px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-weight: 800;
}

.avg-tag {
  position: absolute;
  left: 50%;
  top: 68%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 800;
}

.knob {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  animation: knobTurn 2.4s ease-in-out infinite;
}

.knob::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 12px;
  width: 6px;
  height: 22px;
  margin-left: -3px;
  border-radius: 999px;
  background: var(--accent);
}

.tune-label {
  position: absolute;
  left: 50%;
  top: 64%;
  transform: translateX(-50%);
  font-weight: 800;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
  50% { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
}

@keyframes peekSlide {
  0%, 100% { transform: translateX(0); opacity: 0.55; }
  50% { transform: translateX(18px); opacity: 1; }
}

@keyframes fadePain {
  0%, 40% { opacity: 0.85; }
  70%, 100% { opacity: 0.25; }
}

@keyframes knobTurn {
  0%, 100% { transform: translate(-50%, -50%) rotate(-20deg); }
  50% { transform: translate(-50%, -50%) rotate(28deg); }
}

@keyframes popIn {
  to { transform: translate(-50%, -50%) scale(1); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes press {
  0%, 70%, 100% { transform: translate(-50%, -50%) scale(1); }
  78% { transform: translate(-50%, -50%) scale(0.92); }
}

@keyframes flip {
  0%, 55% { transform: rotateY(0deg); opacity: 0; }
  70% { transform: rotateY(-70deg); opacity: 1; }
  100% { transform: rotateY(0deg); opacity: 0.4; }
}

@keyframes run {
  0% { left: 14%; }
  70%, 100% { left: calc(86% - 18px); }
}

@keyframes fillBar {
  from { width: 0; }
  to { width: 62%; }
}

@keyframes burst {
  0% { opacity: 0; transform: translateY(8px) scale(0.4); }
  40% { opacity: 1; transform: translateY(-6px) scale(1.1); }
  100% { opacity: 0; transform: translateY(-18px) scale(0.8); }
}

@keyframes nudge {
  0%, 100% { transform: translate(-50%, -50%) translateX(0); }
  50% { transform: translate(-50%, -50%) translateX(8px); }
}

.dir-arrow {
  animation-name: nudge;
}

.next-hint {
  animation: pulseHint 1.2s ease-in-out infinite;
}

@keyframes pulseHint {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}

@keyframes fadeTalk {
  0%, 20% { opacity: 0; transform: translateY(6px); }
  40%, 70% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; }
}

@keyframes levelPop {
  0%, 100% { opacity: 0.55; }
  40% { opacity: 1; }
}
</style>
