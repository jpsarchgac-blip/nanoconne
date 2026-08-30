<template>
  <section
    class="reward"
    :class="{ 'reward--pulse': pulse }"
    aria-label="読書リワード"
  >
    <div class="row">
      <p class="kicker">リワード</p>
      <span class="lv">Lv.{{ reward.level }} · 書く +{{ bonusSec }}秒</span>
    </div>

    <div
      class="bar"
      role="progressbar"
      :aria-valuenow="viewed"
      :aria-valuemin="0"
      :aria-valuemax="total"
    >
      <span class="bar-fill" :style="{ width: `${percent}%` }" />
    </div>

    <div class="foot">
      <p class="message">{{ reward.label }}</p>
      <p class="count">{{ viewed }} / {{ total }}</p>
    </div>
    <p v-if="pagesLeft > 0" class="hint">次の段階まで {{ pagesLeft }} ページ · アイスブレイクの書く時間が最大 +{{ bonusSec }}秒</p>
    <p v-else class="hint">アイスブレイクの書く時間が最大 +{{ bonusSec }}秒</p>
  </section>
</template>

<script setup lang="ts">
const { viewedCount, totalSpreads, progressRatio, rewardLevel, pagesUntilNext, syncFromStorage } =
  useBookProgress()

const viewed = computed(() => viewedCount.value)
const total = computed(() => totalSpreads.value)
const percent = computed(() => Math.round(progressRatio.value * 100))
const reward = computed(() => rewardLevel.value)
const pagesLeft = computed(() => pagesUntilNext.value)
const bonusSec = computed(() => reward.value.level * 2)

const pulse = ref(false)
let pulseTimer: ReturnType<typeof setTimeout> | undefined

watch(viewedCount, (next, prev) => {
  if (next <= prev) return
  pulse.value = true
  clearTimeout(pulseTimer)
  pulseTimer = setTimeout(() => {
    pulse.value = false
  }, 700)
})

onMounted(() => {
  syncFromStorage()
})

onBeforeUnmount(() => {
  clearTimeout(pulseTimer)
})
</script>

<style scoped>
.reward {
  margin: 0 24px 8px;
  padding: 12px 16px 12px;
  background: var(--island);
  box-shadow: inset 0 0 0 1px var(--line);
  border-radius: 18px;
  transition: box-shadow 0.35s ease;
}

.reward--pulse {
  box-shadow: inset 0 0 0 2px var(--nano);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.kicker {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--nano);
}

.lv {
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--nano);
  color: #fff;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.bar {
  height: 8px;
  margin-top: 10px;
  border-radius: 999px;
  background: rgb(1 172 224 / 0.14);
  overflow: hidden;
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--nano);
  transition: width 0.45s ease;
}

.foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.message {
  margin: 0;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--ink);
}

.count {
  margin: 0;
  flex: 0 0 auto;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
}

.hint {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--muted);
}

@media (max-width: 720px) {
  .reward {
    margin: 0 14px 6px;
    padding: 10px 14px;
  }
}
</style>
