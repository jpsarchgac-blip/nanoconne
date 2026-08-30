<template>
  <nav v-if="session.started" class="dock" aria-label="アイスブレイク">
    <NuxtLink to="/icebreak" class="join-btn">
      アイスブレイクに参加
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const { session, refresh } = useRoom()

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  refresh()
  timer = setInterval(refresh, 2000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.dock {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 18px;
  border-top: 1px solid var(--line);
  margin-top: auto;
}

.join-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: min(320px, 88vw);
  padding: 16px 32px;
  border-radius: 999px;
  background: var(--sun);
  color: var(--ink);
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  box-shadow: 0 12px 28px rgb(239 178 42 / 0.35);
  transition: transform 0.2s ease, filter 0.2s ease;
}

.join-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.join-btn:active {
  transform: translateY(0);
}

@media (max-width: 720px) {
  .dock {
    padding-inline: 12px;
  }

  .join-btn {
    width: 100%;
    font-size: 16px;
    padding: 14px 24px;
  }
}
</style>
