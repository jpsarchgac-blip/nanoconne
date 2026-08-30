<template>
  <div class="art" :style="{ '--accent': accent }">
    <div v-if="scene === 'service-shift'" class="demo demo--shift">
      <p class="kicker">しない</p>
      <div class="reject">
        <span class="score">9999 pts</span>
        <span class="reject-x" aria-hidden="true">×</span>
        <span class="reject-note">点数は、成果ではない</span>
      </div>
      <p class="kicker kicker--do">する</p>
      <div class="do">
        <span class="do-flip">めくる</span>
        <span class="do-arr">→</span>
        <span class="do-ok">分かった</span>
      </div>
      <p class="foot">この絵本が、GF でできている</p>
    </div>

    <div v-else-if="scene === 'user-core'" class="demo demo--user">
      <p class="kicker">いま来た人の知識に合わせる</p>
      <div class="lanes">
        <div class="lane lane--far">
          <span class="lane-label">遠い</span>
          <span class="lane-bar" />
          <span class="lane-end">専門家</span>
        </div>
        <div class="lane lane--you">
          <span class="you">あなた</span>
          <span class="lane-bar lane-bar--short" />
          <span class="lane-ok">できた</span>
        </div>
      </div>
      <p class="user-back">← わからなければ、戻れる</p>
      <p class="user-term">用語は、出たその場で説明する</p>
    </div>

    <GfTwelveScene v-else-if="scene === 'gf-twelve'" :accent="accent" />

    <div v-else-if="scene === 'gf-pick'" class="demo demo--pick">
      <p class="kicker">この絵本が使っている · {{ usedCount }} / 12</p>
      <div class="pick-board">
        <section v-for="group in groups" :key="group" class="pick-group">
          <small>{{ group }}</small>
          <div class="pick-row">
            <span
              v-for="el in gfByGroup(group)"
              :key="el.id"
              class="pick-cell"
              :class="{
                'pick-cell--on': isGfBookUsed(el.id),
                'pick-cell--off': !isGfBookUsed(el.id),
              }"
              :style="{ '--d': usedDelay(el.id) }"
            >{{ GF_SHORT[el.id] }}</span>
          </div>
        </section>
      </div>
      <p class="foot">白＝使う · 点線＝今回は置かない</p>
    </div>

    <div v-else-if="scene === 'site-mirror'" class="demo demo--mirror">
      <p class="kicker">いまめくった仕掛け</p>
      <div class="mirrors">
        <article class="mirror">
          <small>ファーストキャッチ</small>
          <div class="mini-shelf" aria-hidden="true"><i /><i /><i /><i /></div>
          <strong>本棚</strong>
        </article>
        <article class="mirror">
          <small>インターフェース</small>
          <div class="mini-flip" aria-hidden="true" />
          <strong>めくる</strong>
        </article>
        <article class="mirror">
          <small>可視化</small>
          <ol class="mini-rank">
            <li>1 あなた</li>
            <li>2 …</li>
            <li>3 …</li>
          </ol>
          <strong>順位</strong>
        </article>
      </div>
      <p class="sky">製品の土台にもしている · Skywalker</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import GfTwelveScene from "~/components/GfTwelveScene.vue"
import type { SpreadScene } from "~/utils/bookContent"
import {
  GF_BOOK_USED_IDS,
  GF_GROUP_ORDER,
  GF_SHORT,
  gfByGroup,
  isGfBookUsed,
} from "~/utils/gfElements"

defineProps<{
  scene: SpreadScene
  accent: string
}>()

const groups = GF_GROUP_ORDER
const usedCount = GF_BOOK_USED_IDS.length

function usedDelay(id: number) {
  const i = (GF_BOOK_USED_IDS as readonly number[]).indexOf(id)
  return i >= 0 ? i : 0
}
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 12px 12px 78px;
  box-sizing: border-box;
}

.demo--pick {
  justify-content: flex-start;
  gap: 6px;
  padding-top: 10px;
}

.kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  opacity: 0.8;
}

.kicker--do { margin-top: 4px; }

.reject {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.1);
  animation: pop 0.5s ease backwards;
}

.score {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.04em;
  opacity: 0.45;
  text-decoration: line-through;
}

.reject-x {
  position: absolute;
  right: 12px;
  top: 10px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgb(238 109 122 / 0.95);
  font-size: 16px;
  font-weight: 800;
}

.reject-note {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.85;
}

.do {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  animation: pop 0.5s ease 0.35s backwards;
}

.do-flip,
.do-ok {
  padding: 10px 16px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 14px;
  font-weight: 800;
}

.do-ok { animation: pulseOk 1.8s ease-in-out 0.8s infinite; }
.do-arr { font-size: 20px; opacity: 0.85; }

.foot {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  opacity: 0.88;
}

.lanes {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lane {
  position: relative;
  height: 44px;
}

.lane-label,
.lane-end {
  position: absolute;
  top: -14px;
  font-size: 10px;
  font-weight: 800;
  opacity: 0.55;
}

.lane-end { right: 0; }

.lane-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 18px;
  height: 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.18);
}

.lane-bar--short {
  width: 46%;
  background: #fff;
  animation: fillBar 1.1s ease forwards;
}

.you {
  position: absolute;
  left: 0;
  top: 6px;
  z-index: 1;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  animation: youRun 1.1s ease forwards;
}

.lane-ok {
  position: absolute;
  left: 46%;
  top: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  opacity: 0;
  animation: pop 0.4s ease 1s forwards;
}

.user-back,
.user-term {
  margin: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

.user-back { animation: pop 0.45s ease 0.5s backwards; }
.user-term { opacity: 0.85; animation: pop 0.45s ease 0.7s backwards; }

.pick-board {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pick-group small {
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.pick-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.pick-group:last-child .pick-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: 56%;
}

.pick-cell {
  display: grid;
  place-items: center;
  min-height: 28px;
  padding: 4px 3px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 800;
  text-align: center;
  line-height: 1.2;
}

.pick-cell--on {
  background: #fff;
  color: var(--accent);
  animation: pop 0.4s ease backwards;
  animation-delay: calc(0.08s + var(--d) * 0.08s);
}

.pick-cell--off {
  border: 1.5px dashed rgb(255 255 255 / 0.35);
  color: rgb(255 255 255 / 0.45);
}

.mirrors {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.mirror {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 8px 10px;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.92);
  color: var(--accent);
  animation: pop 0.5s ease backwards;
}

.mirror:nth-child(2) { animation-delay: 0.12s; }
.mirror:nth-child(3) { animation-delay: 0.24s; }

.mirror small {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.04em;
  opacity: 0.65;
}

.mirror strong {
  font-size: 13px;
}

.mini-shelf {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 36px;
}

.mini-shelf i {
  display: block;
  width: 10px;
  border-radius: 2px 2px 0 0;
  background: var(--accent);
  opacity: 0.75;
}

.mini-shelf i:nth-child(1) { height: 16px; }
.mini-shelf i:nth-child(2) { height: 28px; }
.mini-shelf i:nth-child(3) { height: 22px; }
.mini-shelf i:nth-child(4) { height: 30px; }

.mini-flip {
  width: 28px;
  height: 36px;
  border-radius: 2px 6px 6px 2px;
  background: var(--accent);
  transform-origin: left center;
  animation: flip 1.8s ease-in-out infinite;
}

.mini-rank {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.35;
}

.sky {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  animation: pop 0.45s ease 0.4s backwards;
}

@keyframes pop {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes fillBar {
  from { width: 0; }
  to { width: 46%; }
}

@keyframes youRun {
  from { left: 0; }
  to { left: calc(46% - 52px); }
}

@keyframes pulseOk {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes flip {
  0%, 100% { transform: perspective(200px) rotateY(0); }
  40% { transform: perspective(200px) rotateY(-70deg); }
}
</style>
