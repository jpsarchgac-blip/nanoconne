<template>
  <IslandWindow>
    <div class="play">
      <header>
        <p class="kicker">参加初日</p>
        <h1>{{ headline }}</h1>
        <p v-if="session.topic && me && session.phase !== 'results'" class="topic">{{ session.topic.line }}</p>
        <p v-if="me && session.phase === 'draw'" class="bonus">
          書く時間
          <template v-if="bonusSec > 0"> +{{ bonusSec }}秒</template>
          <template v-else> 基本どおり</template>
        </p>
        <p v-if="clockLabel" class="clock-row">
          <PhaseRingTimer
            v-if="timerTotalMs > 0"
            :left-ms="timerLeftMs"
            :total-ms="timerTotalMs"
            :caption="timerCaption"
            :size="72"
          />
          <span class="clock">{{ clockLabel }}</span>
        </p>
      </header>

      <div
        class="stage-in"
        :class="{
          'stage-in--pad': me && session.phase === 'draw',
          'stage-in--vote': me && session.phase === 'vote',
          'stage-in--result': me && session.phase === 'results',
        }"
      >
        <template v-if="!session.started">
          <NanoGuide speak class="wait-guide" />
          <p class="lead">進行が開始すると、ここに入れます。探す人の通年プレイはありません。</p>
        </template>

        <form v-else-if="!me" class="join" @submit.prevent="join">
          <input v-model="nick" :maxlength="ICE_MAX_NICK_LEN" placeholder="ニックネーム" />
          <button type="submit">入る</button>
          <p v-if="error" class="err">{{ error }}</p>
        </form>

        <template v-else-if="session.phase === 'lobby'">
          <NanoGuide speak class="wait-guide" />
          <p class="lead">人が揃うと、お題が出ます。現地も Zoom も同じ場です。</p>
        </template>

        <template v-else-if="session.phase === 'prompt'">
          <p class="prompt-mark">お題</p>
          <p class="prompt-line">{{ session.topic?.line }}</p>
        </template>

        <template v-else-if="session.phase === 'draw'">
          <div class="pad-wrap">
            <DrawPad
              :key="session.round"
              ref="padRef"
              :locked="writeLocked"
            />
          </div>
          <p v-if="writeLocked" class="lead">書いたものを待っています。回収は一番長い時計で揃えます。</p>
          <p v-if="submitError" class="err">{{ submitError }}</p>
        </template>

        <template v-else-if="session.phase === 'vote'">
          <template v-if="currentBallot">
            <p class="ballot-index">{{ ballotIndex + 1 }} / {{ session.ballots.length }}枚</p>
            <img class="ballot" :src="currentBallot.image" alt="届いた絵" />
            <div class="axes">
              <div v-for="axis in ICE_AXES" :key="axis.id" class="axis">
                <p>{{ axis.label }}</p>
                <div class="stars">
                  <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    class="star"
                    :class="{ 'star--on': currentRating[axis.id] >= n }"
                    @click="rate(axis.id, n)"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>
            </div>
            <div class="ballot-nav">
              <button type="button" class="nav-btn" :disabled="ballotIndex === 0" @click="ballotIndex -= 1">
                前の絵
              </button>
              <button
                type="button"
                class="nav-btn"
                :disabled="ballotIndex >= session.ballots.length - 1"
                @click="ballotIndex += 1"
              >
                次の絵
              </button>
            </div>
          </template>
          <p v-else class="lead">今回は届きませんでした。次のお題を待ちます。</p>
        </template>

        <template v-else>
          <div v-if="session.mine" class="mine">
            <p class="mine-rank">{{ session.mine.rank }}位 · {{ session.mine.total.toFixed(1) }}</p>
            <ScoreChart
              :funny="session.mine.funny"
              :beauty="session.mine.beauty"
              :clear="session.mine.clear"
            />
          </div>
          <ol v-if="session.ranking.length" class="rank-list">
            <li
              v-for="(row, index) in session.ranking"
              :key="row.id"
              :class="{ 'rank-list--me': row.id === me?.id }"
            >
              <span>{{ index + 1 }}</span>
              <span>{{ row.nick }}</span>
              <span>{{ row.score.toFixed(1) }}</span>
            </li>
          </ol>
          <p class="lead">点はこの場限りです。</p>
        </template>
      </div>
    </div>
  </IslandWindow>
</template>

<script setup lang="ts">
import DrawPad from "~/components/DrawPad.vue"
import PhaseRingTimer from "~/components/PhaseRingTimer.vue"
import ScoreChart from "~/components/ScoreChart.vue"
import {
  emptyRating,
  ICE_AXES,
  ICE_MAX_NICK_LEN,
  playerClockLabel,
  shouldAutoSubmitDraw,
  writeBonusMs,
  type IceAxisId,
  type IceRating,
} from "~/utils/icebreak"

const PLAYER_KEY = "peratto-ice-player"

const nick = ref("")
const error = ref("")
const submitError = ref("")
const me = ref<{ id: string; nick: string; secret: string } | null>(null)
const { session, refresh } = useRoom({ player: me })
const padRef = ref<{ toImage: () => string | null } | null>(null)
const sentRound = ref(0)
const ballotIndex = ref(0)

const { rewardLevel, syncFromStorage } = useBookProgress()
const bonusSec = computed(() => writeBonusMs(rewardLevel.value.level) / 1000)

const {
  phaseLeftMs,
  writeLeftMs,
  writeLocked,
  timerTotalMs,
  timerLeftMs,
  timerCaption,
  syncFromSession,
} = useIcebreakClock(session, { mode: "player", bonusLevel: computed(() => rewardLevel.value.level) })

const clockLabel = computed(() => {
  if (!me.value) return ""
  return playerClockLabel(session.value, phaseLeftMs.value, writeLeftMs.value)
})

const headline = computed(() => {
  if (!session.value.started) return "まだ、窓は閉じています。"
  if (!me.value) return "ニックネームで、場に入る。"
  if (session.value.phase === "lobby") return "人が揃うまで、少し。"
  if (session.value.phase === "prompt") return "お題です。"
  if (session.value.phase === "draw") {
    return writeLocked.value ? "回収を待っています。" : "書いて。"
  }
  if (session.value.phase === "vote") return "3枚まで、5段階で。"
  return "あなたのスコアです。"
})

function applyView(forPlayerId?: string) {
  syncFromSession(session.value)
  if (!session.value.started) {
    me.value = null
    sessionStorage.removeItem(PLAYER_KEY)
    return
  }
  if (forPlayerId && !session.value.ranking.some((row) => row.id === forPlayerId)) {
    me.value = null
    sessionStorage.removeItem(PLAYER_KEY)
  }
}

async function refreshPlayer() {
  const playerId = me.value?.id
  await refresh()
  applyView(playerId)
}

useRoomPoll(refreshPlayer, () => session.value.phase, () => applyView(me.value?.id))

async function join() {
  error.value = ""
  try {
    const reconnect = me.value
      ? { playerId: me.value.id, playerSecret: me.value.secret }
      : undefined
    const result = await $fetch<{
      error?: string
      player?: { id: string; nick: string; secret: string }
      view?: import("~/utils/icebreak").IceRoomView
    }>("/api/room", {
      method: "POST",
      body: {
        action: "join",
        nick: nick.value,
        playerId: reconnect?.playerId,
        playerSecret: reconnect?.playerSecret,
      },
    })
    if (result.error) {
      error.value = result.error
      return
    }
    if (result.player) {
      me.value = result.player
      sessionStorage.setItem(PLAYER_KEY, JSON.stringify(result.player))
      if (result.view) {
        session.value = result.view
        applyView(result.player.id)
      } else {
        await refreshPlayer()
      }
    }
  } catch {
    error.value = "入れませんでした。もう一度どうぞ。"
  }
}

async function submitIfNeeded() {
  if (!me.value || session.value.phase !== "draw") return
  if (sentRound.value === session.value.round && session.value.submitted) return
  const image = padRef.value?.toImage()
  if (!image) return
  submitError.value = ""
  try {
    const result = await $fetch<{ error?: string; view?: import("~/utils/icebreak").IceRoomView }>(
      "/api/room",
      {
        method: "POST",
        body: {
          action: "submit",
          playerId: me.value.id,
          playerSecret: me.value.secret,
          image,
        },
      },
    )
    if (result.error) {
      submitError.value = result.error
      return
    }
    sentRound.value = session.value.round
    if (result.view) {
      session.value = result.view
      applyView(me.value.id)
    }
  } catch {
    submitError.value = "絵を送れませんでした。通信を確認してください。"
  }
}

const currentBallot = computed(() => session.value.ballots[ballotIndex.value] ?? null)

const currentRating = computed((): IceRating => {
  const id = currentBallot.value?.drawingId
  if (!id) return emptyRating()
  return session.value.ratings[id] ?? emptyRating()
})

async function rate(axis: IceAxisId, value: number) {
  if (!me.value || !currentBallot.value) return
  const next = { ...currentRating.value, [axis]: value }
  const result = await $fetch<{
    error?: string
    view?: import("~/utils/icebreak").IceRoomView
  }>("/api/room", {
    method: "POST",
    body: {
      action: "vote",
      playerId: me.value.id,
      playerSecret: me.value.secret,
      drawingId: currentBallot.value.drawingId,
      funny: next.funny || undefined,
      beauty: next.beauty || undefined,
      clear: next.clear || undefined,
    },
  })
  if (result.view) {
    session.value = result.view
    applyView(me.value.id)
  } else {
    await refreshPlayer()
  }
}

watch([writeLeftMs, phaseLeftMs], () => {
  if (
    shouldAutoSubmitDraw(
      session.value.phase,
      writeLeftMs.value,
      phaseLeftMs.value,
    )
  ) {
    submitIfNeeded()
  }
})

watch(
  () => session.value.round,
  () => {
    sentRound.value = 0
    ballotIndex.value = 0
  },
)

watch(
  () => session.value.ballots.length,
  () => {
    if (ballotIndex.value >= session.value.ballots.length) ballotIndex.value = 0
  },
)

onMounted(() => {
  syncFromStorage()
  const saved = sessionStorage.getItem(PLAYER_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as { id: string; nick: string; secret?: string }
      if (parsed.id && parsed.nick && parsed.secret) {
        me.value = parsed as { id: string; nick: string; secret: string }
        nick.value = parsed.nick
      } else {
        sessionStorage.removeItem(PLAYER_KEY)
      }
    } catch {
      me.value = null
    }
  }
})
</script>

<style scoped>
.play {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
}

header {
  padding: 32px 24px 24px 32px;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kicker {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  color: var(--nano);
  letter-spacing: 0.16em;
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 16px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.3;
}

.topic {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 700;
}

.bonus {
  margin: 10px 0 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: var(--nano);
}

.clock-row {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.clock {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}

.stage-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background: #e7f7fc;
  min-height: 0;
}

.stage-in--pad {
  justify-content: flex-start;
  align-items: stretch;
}

.pad-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.lead {
  margin: 0;
  color: var(--muted);
  text-align: center;
  line-height: 1.7;
  max-width: 20em;
}

.wait-guide {
  width: 140px;
  height: 140px;
}

.join {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(280px, 100%);
}

.join input {
  border: 0;
  background: var(--island);
  padding: 14px 16px;
  font-size: 16px;
}

.join button {
  appearance: none;
  border: 0;
  background: var(--nano);
  color: #fff;
  padding: 12px;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 700;
  cursor: pointer;
}

.prompt-mark {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--nano);
}

.prompt-line {
  margin: 0;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 700;
  line-height: 1.45;
  max-width: 14em;
}

.ballot {
  width: 100%;
  height: auto;
  max-height: 38%;
  object-fit: contain;
  background: #fff;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px var(--line);
}

.ballot-index {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: var(--nano);
}

.stage-in--vote,
.stage-in--result {
  justify-content: flex-start;
  overflow: auto;
}

.axes {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.axis p {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
}

.stars {
  display: flex;
  gap: 6px;
}

.star {
  appearance: none;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: var(--island);
  color: var(--muted);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--line);
}

.star--on {
  background: var(--nano);
  color: #fff;
  box-shadow: none;
}

.ballot-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  background: var(--island);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--line);
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.mine {
  width: 100%;
}

.mine-rank {
  margin: 0 0 8px;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 22px;
  font-weight: 800;
}

.rank-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rank-list li {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 8px;
  padding: 6px 8px;
  font-size: 14px;
}

.rank-list--me {
  background: #e7f7fc;
  font-weight: 700;
}

.err {
  margin: 0;
  color: #b42318;
  font-size: 13px;
}

@media (max-width: 720px) {
  .play {
    grid-template-columns: 1fr;
  }

  header {
    border-right: 0;
    padding: 22px 20px 8px;
  }

  .stage-in {
    min-height: 240px;
  }
}
</style>
