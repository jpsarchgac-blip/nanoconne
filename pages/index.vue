<template>

  <IslandWindow>

    <div class="home">

      <header class="top">

        <div class="brand">

          <div class="brand-mark">

            <BrandLogo compact icon-only />

          </div>

          <div class="titles">

            <h1 class="name">ペラっと。</h1>

            <p class="lead">めくって、ナノコネを知る。</p>

          </div>

        </div>

        <NanoGuide speak interactive overlay-bubble class="mascot" />

      </header>

      <RewardTrack />

      <BookMarquee v-if="shown.length" :books="shown" :duration="42" @open="openBook" />



      <IslandDock />

    </div>

  </IslandWindow>

</template>



<script setup lang="ts">

import { bookVisuals } from "~/utils/bookVisual"



useHead({

  title: "ペラっと | Peratto",

})



const { data: books } = await useFetch("/api/books")



const shown = computed(() =>

  bookVisuals.filter((visual) => books.value?.find((book) => book.id === visual.id)?.visible),

)



function openBook(id: string) {

  navigateTo(`/book/${id}`)

}

const { syncFromStorage } = useBookProgress()

onMounted(() => {
  syncFromStorage()
})

</script>



<style scoped>

.home {

  height: 100%;

  display: flex;

  flex-direction: column;

  min-height: 0;

}



.top {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  padding: 20px 24px 12px;

}



.brand {

  display: flex;

  align-items: center;

  gap: 12px;

  min-width: 0;

  max-width: min(440px, 64vw);

  padding: 0;

}



.brand-mark {

  flex: 0 0 auto;

  display: grid;

  place-items: center;

  line-height: 0;

}



.titles {

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 6px;

}



.name {

  margin: 0;

  font-family: "Komorebi Gothic", "komorebi-gothic", sans-serif;

  font-size: clamp(30px, 5vw, 44px);

  font-weight: normal;

  line-height: 1;

  letter-spacing: 0.06em;

  color: var(--ink);

}



.lead {

  margin: 0;

  color: var(--muted);

  font-size: 12px;

  line-height: 1.5;

  letter-spacing: 0.02em;

}



.mascot {

  flex: 0 0 auto;

}



@media (max-width: 720px) {

  .top {

    align-items: flex-end;

    padding: 14px 14px 8px;

    gap: 12px;

  }



  .brand {

    max-width: min(300px, 70vw);

    gap: 10px;

  }



  .name {

    font-size: 28px;

    letter-spacing: 0.04em;

  }



  .lead {

    font-size: 11px;

  }



  .mascot {

    margin-bottom: 2px;

  }

}

</style>

