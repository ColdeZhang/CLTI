<script setup lang="ts">
import ScatteredCards from '../components/landing/ScatteredCards.vue'
import HeroCard from '../components/landing/HeroCard.vue'
</script>

<template>
  <div class="landing">
    <ScatteredCards />
    <div class="landing-center">
      <HeroCard />
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-center {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
