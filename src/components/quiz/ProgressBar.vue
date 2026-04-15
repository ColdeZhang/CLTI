<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()
</script>

<template>
  <div class="progress-bar">
    <div
      v-for="i in total"
      :key="i"
      class="progress-segment"
      :class="{ filled: i <= current }"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  gap: 4px;
  width: 100%;
}

.progress-segment {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  transition: background 0.3s;
}

.progress-segment.filled {
  background: var(--color-accent);
}
</style>
