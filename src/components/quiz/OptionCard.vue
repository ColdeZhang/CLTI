<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  description: string
  selected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    class="option-card"
    :class="{ selected }"
    @click="$emit('select')"
  >
    <div class="option-header">
      <span class="option-emoji">{{ emoji }}</span>
      <span class="option-title">{{ title }}</span>
    </div>
    <p class="option-desc">{{ description }}</p>
  </button>
</template>

<style scoped>
.option-card {
  width: 100%;
  padding: 18px 20px;
  text-align: left;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.option-card:hover {
  border-color: var(--color-accent-border);
  box-shadow: var(--shadow-card);
}

.option-card.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  box-shadow: var(--shadow-card);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-emoji {
  font-size: 1.3rem;
}

.option-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.option-desc {
  margin-top: 8px;
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
