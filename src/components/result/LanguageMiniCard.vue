<script setup lang="ts">
import type { LanguageProfile } from '../../types'

defineProps<{
  language: LanguageProfile
  label: string
}>()
</script>

<template>
  <div class="mini-card">
    <p class="mini-label">{{ label }}</p>
    <div class="mini-body">
      <span class="mini-emoji">{{ language.emoji }}</span>
      <div>
        <p class="mini-name">{{ language.name }}</p>
        <p class="mini-tag">{{ language.personalityLabel }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-card {
  flex: 1;
  padding: 16px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
}

.mini-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mini-body {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-emoji {
  font-size: 1.8rem;
}

.mini-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.mini-tag {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
</style>
