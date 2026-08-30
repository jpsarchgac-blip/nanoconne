<template>
  <component :is="tag" :class="klass">
    <template v-for="(seg, i) in segments" :key="i">
      <strong v-if="seg.type === 'bold'" class="em-bold">{{ seg.value }}</strong>
      <mark v-else-if="seg.type === 'mark'" class="em-mark">{{ seg.value }}</mark>
      <template v-else>{{ seg.value }}</template>
    </template>
  </component>
</template>

<script setup lang="ts">
import { parseEmphasis } from "~/utils/bookEmphasis"

const props = withDefaults(
  defineProps<{
    text: string
    tag?: string
    klass?: string
  }>(),
  {
    tag: "span",
    klass: "",
  },
)

const segments = computed(() => parseEmphasis(props.text))
</script>

<style scoped>
.em-bold {
  font-weight: 800;
  color: var(--ink);
}

.em-mark {
  background: linear-gradient(transparent 55%, rgb(255 230 120 / 0.88) 55%);
  color: inherit;
  font-weight: inherit;
  padding: 0 0.06em;
  border-radius: 2px;
}
</style>
