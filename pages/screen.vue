<script setup lang="ts">
import { iceSessionHeadline } from "~/utils/icebreak"

const { session, refresh } = useRoom()
const { timerTotalMs, timerLeftMs, timerCaption, syncFromSession } = useIcebreakClock(session, {
  mode: "screen",
})

const headline = computed(() => iceSessionHeadline(session.value, "screen"))

async function refreshScreen() {
  await refresh()
  syncFromSession(session.value)
}

useRoomPoll(refreshScreen, () => session.value.phase)
</script>

<template>
  <IslandWindow screen>
    <div class="board">
      <header>
        <p class="kicker">会場スクリーン</p>
        <div class="head-row">
          <div>
            <h1>{{ headline }}</h1>
            <p v-if="session.topic && session.phase !== 'results'" class="topic">
              {{ session.topic.line }}
            </p>
          </div>
          <PhaseRingTimer
            v-if="timerTotalMs > 0"
            :left-ms="timerLeftMs"
            :total-ms="timerTotalMs"
            :caption="timerCaption"
            :size="96"
          />
        </div>
      </header>

      <div v-if="session.phase === 'results' && session.spotlight.length" class="spotlight">
        <article
          v-for="(item, index) in session.spotlight"
          :key="`${item.nick}-${index}`"
          class="spot"
          :class="{ 'spot--lead': index === 0 }"
        >
          <p class="spot-rank">{{ index + 1 }}</p>
          <img :src="item.image" :alt="item.nick" />
          <p class="spot-nick">{{ item.nick }}</p>
        </article>
      </div>

      <ol v-if="session.ranking.length">
        <li
          v-for="(row, index) in session.ranking"
          :key="row.id"
          :class="{ lead: index === 0 }"
        >
          <span class="rank">{{ index + 1 }}</span>
          <span class="nick">{{ row.nick }}</span>
          <span class="score">{{ Number(row.score).toFixed(1) }}</span>
        </li>
      </ol>
      <p v-else class="empty">ニックネームが、ここに並びます。</p>
    </div>
  </IslandWindow>
</template>

<style scoped>
.board {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px 36px 22px;
  color: var(--ink);
  min-height: 0;
}

.kicker {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  letter-spacing: 0.16em;
  color: var(--nano);
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 8px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: clamp(28px, 4vw, 40px);
}

.head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.topic {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 700;
}

.spotlight {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0 12px;
}

.spot {
  min-width: 0;
  background: #e7f7fc;
  border-radius: 14px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spot--lead {
  background: #fff3c4;
}

.spot-rank {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: var(--nano);
}

.spot img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
}

.spot-nick {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
}

ol {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: auto;
  min-height: 0;
}

li {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  padding: 8px 8px 8px 4px;
  border-bottom: 1px solid var(--line);
  font-size: 20px;
}

.lead {
  background: #e7f7fc;
  border-bottom: 0;
  padding: 12px 12px;
}

.rank {
  font-family: "M PLUS Rounded 1c", sans-serif;
  color: var(--nano);
  font-weight: 700;
}

.nick {
  font-weight: 700;
}

.score {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-variant-numeric: tabular-nums;
}

.empty {
  margin: auto 0;
  color: var(--muted);
  font-size: 18px;
}
</style>
