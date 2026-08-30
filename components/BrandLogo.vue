<template>
  <span
    class="mark"
    :class="{ compact, iconOnly }"
    role="img"
    aria-label="ナノコネ"
  />
</template>

<script setup lang="ts">
defineProps<{
  compact?: boolean
  iconOnly?: boolean
}>()
</script>

<style scoped>
.mark {
  display: block;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  background: var(--nano);
  mask: url("/sozai/nanosuke.png") center / contain no-repeat;
  -webkit-mask: url("/sozai/nanosuke.png") center / contain no-repeat;
}

.compact {
  width: 56px;
  height: 56px;
}

.iconOnly {
  width: 52px;
  height: 52px;
}

.compact.iconOnly {
  width: 50px;
  height: 50px;
}
</style>
