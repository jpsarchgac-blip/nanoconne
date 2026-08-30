<template>
  <IslandWindow>
    <BookReader
      v-if="canRead"
      :book-id="bookId"
      @close="navigateTo('/')"
    />
    <div v-else class="missing">
      <p>{{ missingMessage }}</p>
      <button type="button" @click="navigateTo('/')">もどる</button>
    </div>
  </IslandWindow>
</template>

<script setup lang="ts">
import { contentOf } from "~/utils/bookContent"
import { visualOf } from "~/utils/bookVisual"

const route = useRoute()
const bookId = computed(() => String(route.params.id))
const visual = computed(() => visualOf(bookId.value))
const content = computed(() => contentOf(bookId.value))

const { data: access } = await useFetch(() => `/api/books/${bookId.value}`)

const canRead = computed(
  () => Boolean(access.value?.readable && visual.value && content.value),
)

const missingMessage = computed(() => {
  if (!visual.value || !content.value) return "この本は見つかりませんでした。"
  if (access.value && !access.value.readable) return "この本は、いま公開されていません。"
  return "この本は見つかりませんでした。"
})
</script>

<style scoped>
.missing {
  height: 100%;
  display: grid;
  place-content: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
}

.missing button {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 10px 20px;
  background: var(--nano);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>
