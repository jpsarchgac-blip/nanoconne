<template>
  <div class="stage" :class="{ 'stage--screen': screen }">
    <div class="stage-sky" aria-hidden="true" />
    <div class="stage-disc" aria-hidden="true" />
    <NanosukeSwarm v-if="!screen" />
    <div class="island-wrap">
      <button
        v-if="!screen"
        type="button"
        class="island-nav island-nav--back"
        aria-label="前のページへ"
        :disabled="!canBack"
        @click="back"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <div class="island-shell">
        <section class="island" :class="{ 'island--screen': screen }">
          <div class="island-body">
            <slot />
          </div>
        </section>
        <div class="island-rest" aria-hidden="true" />
      </div>
      <button
        v-if="!screen"
        type="button"
        class="island-nav island-nav--forward"
        aria-label="次のページへ"
        :disabled="!canForward"
        @click="forward"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  screen?: boolean
}>()

const { canBack, canForward, back, forward } = useHistoryNav()
</script>

<style scoped>
.island-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.island-shell {
  position: relative;
  flex: 0 1 auto;
  min-width: 0;
}

.island-nav {
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 2px solid var(--nano);
  border-radius: 50%;
  background: var(--island);
  color: var(--nano);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 28px;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgb(1 172 224 / 0.12);
  transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;
}

.island-nav span {
  display: block;
  margin-top: -2px;
}

.island-nav:hover:not(:disabled) {
  background: #e7f7fc;
  transform: scale(1.05);
}

.island-nav:active:not(:disabled) {
  transform: scale(0.96);
}

.island-nav:disabled {
  opacity: 0.32;
  cursor: default;
  box-shadow: none;
}

@media (max-width: 720px) {
  .island-wrap {
    gap: 8px;
  }

  .island-nav {
    width: 38px;
    height: 38px;
    font-size: 24px;
  }
}
</style>
