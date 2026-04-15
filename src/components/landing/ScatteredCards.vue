<script setup lang="ts">
import { languages } from '../../data/languages'

const cards = languages.map((lang, i) => ({
  emoji: lang.emoji,
  name: lang.name,
  style: {
    left: `${(i * 17 + 7) % 90}%`,
    top: `${(i * 23 + 11) % 85}%`,
    transform: `rotate(${((i * 37) % 31) - 15}deg)`,
    opacity: 0.15 + (i % 5) * 0.08,
  },
}))
</script>

<template>
  <div class="scattered">
    <div
      v-for="card in cards"
      :key="card.name"
      class="scattered-card"
      :style="card.style"
    >
      <span class="scattered-emoji">{{ card.emoji }}</span>
      <span class="scattered-name">{{ card.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.scattered {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.scattered-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  font-size: 0.85rem;
  white-space: nowrap;
  user-select: none;
}

.scattered-emoji {
  font-size: 1.2rem;
}

.scattered-name {
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>
