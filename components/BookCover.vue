<template>
  <button
    class="cover"
    :class="{ 'cover--lg': large, 'cover--done': isComplete }"
    type="button"
    :style="{ '--accent': accent }"
    :aria-label="isComplete ? `${title}（読了）` : title"
    @click="emit('open')"
  >
    <span v-if="isComplete" class="spine" aria-hidden="true" />
    <span v-if="isComplete" class="ribbon" aria-hidden="true" />
    <span v-if="isComplete" class="pages" aria-hidden="true"><i /><i /><i /></span>

    <span class="cover-art" aria-hidden="true">
      <template v-if="isComplete">
        <span class="motif" :class="`motif--${bookId}`">
          <span v-if="bookId === 'intern'" class="m-flag" />
          <span v-else-if="bookId === 'gf'" class="m-flip" />
          <span v-else-if="bookId === 'nano'" class="m-link">
            <i /><i />
          </span>
          <span v-else-if="bookId === 'it'" class="m-venn">
            <i /><i /><i />
          </span>
          <span v-else-if="bookId === 'it-jobs'" class="m-pyra" />
          <span v-else-if="bookId === 'work'" class="m-win">
            <i /><i /><i /><i />
          </span>
          <span v-else class="m-dot" />
        </span>
        <span class="stamp">読了</span>
      </template>
      <template v-else>
        <span class="cover-orb" />
        <span class="cover-bar" />
        <span v-if="(progressTotal ?? 0) > 0" class="cover-progress">
          <span class="cover-progress-fill" :style="{ width: `${progressPercent}%` }" />
        </span>
      </template>
    </span>

    <span class="cover-kicker">{{ isComplete ? `読了 · ${kicker}` : kicker }}</span>
    <span class="cover-title">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  bookId?: string
  title: string
  kicker: string
  accent: string
  large?: boolean
  progressViewed?: number
  progressTotal?: number
}>()

const progressPercent = computed(() => {
  const total = props.progressTotal ?? 0
  const viewed = props.progressViewed ?? 0
  if (!total) return 0
  return Math.round((viewed / total) * 100)
})

const isComplete = computed(() => {
  const total = props.progressTotal ?? 0
  const viewed = props.progressViewed ?? 0
  return total > 0 && viewed >= total
})

const emit = defineEmits<{
  open: []
}>()
</script>

<style scoped>
.cover {
  appearance: none;
  border: 0;
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 168px;
  height: 228px;
  flex: 0 0 auto;
  background: var(--island);
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  border-radius: 4px 18px 18px 4px;
  box-shadow: inset 0 0 0 1px var(--line);
  transition: transform 0.22s ease;
  position: relative;
}

.cover--lg {
  width: 220px;
  height: 300px;
  padding: 16px 16px 20px;
  gap: 10px;
}

.cover:hover,
.cover:focus-visible {
  transform: translateY(-10px);
  outline: none;
  box-shadow: inset 0 0 0 2px var(--accent);
}

.cover--done {
  background: #f7f2e8;
  padding-left: 22px;
  box-shadow: inset 0 0 0 1px rgb(22 52 60 / 0.12);
}

.cover--done:hover,
.cover--done:focus-visible {
  box-shadow: inset 0 0 0 2px var(--accent);
}

.spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  border-radius: 4px 0 0 4px;
  background: var(--accent);
}

.ribbon {
  position: absolute;
  top: -6px;
  right: 28%;
  z-index: 2;
  width: 12px;
  height: 46px;
  background: var(--accent);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
}

.cover--lg .ribbon {
  height: 56px;
  width: 14px;
}

.pages {
  position: absolute;
  right: 5px;
  top: 14px;
  bottom: 14px;
  width: 7px;
  display: flex;
  gap: 1px;
  pointer-events: none;
}

.pages i {
  flex: 1;
  background: rgb(22 52 60 / 0.14);
}

.cover-art {
  width: 100%;
  height: 92px;
  background: var(--accent);
  position: relative;
  overflow: hidden;
}

.cover--lg .cover-art {
  height: 148px;
}

.cover--done .cover-art {
  background: #efe8d8;
}

.cover-orb {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.35);
  right: -12px;
  top: -18px;
}

.cover-bar {
  position: absolute;
  left: 12px;
  bottom: 12px;
  width: 46%;
  height: 8px;
  background: rgb(255 255 255 / 0.7);
}

.cover-progress {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 8px;
  height: 4px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.25);
  overflow: hidden;
}

.cover-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: rgb(255 255 255 / 0.92);
  transition: width 0.35s ease;
}

.stamp {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 2px solid var(--accent);
  border-radius: 50%;
  color: var(--accent);
  background: rgb(247 242 232 / 0.72);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  transform: rotate(-16deg);
}

.cover--lg .stamp {
  width: 52px;
  height: 52px;
  font-size: 13px;
  right: 10px;
  bottom: 10px;
}

.motif {
  position: absolute;
  inset: 0;
  color: var(--accent);
}

.m-flag {
  position: absolute;
  left: 18%;
  bottom: 22%;
  width: 8px;
  height: 48px;
  background: var(--accent);
}

.m-flag::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  width: 36px;
  height: 22px;
  background: var(--accent);
  opacity: 0.7;
}

.m-flip {
  position: absolute;
  left: 22%;
  top: 22%;
  width: 42px;
  height: 56px;
  border-radius: 2px 10px 10px 2px;
  background: var(--accent);
  transform: rotate(-8deg);
}

.m-flip::after {
  content: "";
  position: absolute;
  right: -14px;
  top: 6px;
  width: 28px;
  height: 48px;
  border-radius: 2px 8px 8px 2px;
  background: var(--accent);
  opacity: 0.45;
  transform: rotate(18deg);
}

.m-link {
  position: absolute;
  left: 18%;
  top: 38%;
  display: flex;
  align-items: center;
  gap: 28px;
}

.m-link::before {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  height: 6px;
  background: var(--accent);
  opacity: 0.45;
}

.m-link i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
}

.m-venn {
  position: absolute;
  left: 16%;
  top: 28%;
  width: 70%;
  height: 54%;
}

.m-venn i {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.45;
}

.m-venn i:nth-child(1) { left: 0; top: 8px; }
.m-venn i:nth-child(2) { left: 22px; top: 0; opacity: 0.7; }
.m-venn i:nth-child(3) { left: 12px; top: 18px; opacity: 0.35; }

.m-pyra {
  position: absolute;
  left: 50%;
  top: 22%;
  width: 0;
  height: 0;
  border-left: 36px solid transparent;
  border-right: 36px solid transparent;
  border-bottom: 64px solid var(--accent);
  transform: translateX(-50%);
}

.m-win {
  position: absolute;
  left: 22%;
  top: 18%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 58%;
  height: 62%;
}

.m-win i {
  display: block;
  background: var(--accent);
  opacity: 0.55;
}

.m-win i:nth-child(1) { opacity: 0.85; }

.m-dot {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  transform: translate(-50%, -50%);
}

.cover-kicker {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--accent);
  font-weight: 700;
}

.cover-title {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.cover--lg .cover-title {
  font-size: 18px;
}
</style>
