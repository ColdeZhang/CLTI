<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import { languages } from '../data/languages'
import type { LanguageProfile, MatchResult } from '../types'

const { getResult, restore } = useQuiz()
const result = ref<MatchResult | null>(null)

onMounted(() => {
  restore()
  result.value = getResult()
})

const selected = ref<LanguageProfile | null>(null)

function selectLang(lang: LanguageProfile) {
  selected.value = selected.value?.id === lang.id ? null : lang
}

function cardClass(lang: LanguageProfile) {
  if (!result.value) return ''
  if (lang.id === result.value.language.id) return 'highlight-match'
  if (lang.id === result.value.mostDistant.id) return 'highlight-distant'
  return ''
}
</script>

<template>
  <div class="explore-page">
    <div class="explore-header">
      <h1 class="explore-title">全部语言图鉴</h1>
      <p class="explore-desc" v-if="result">
        你的结果是 <strong>{{ result.language.emoji }} {{ result.language.name }}</strong>
      </p>
      <div class="explore-nav">
        <router-link to="/result" class="nav-link" v-if="result">← 返回结果</router-link>
        <router-link to="/" class="nav-link">🏠 首页</router-link>
      </div>
    </div>

    <div class="lang-grid">
      <button
        v-for="lang in languages"
        :key="lang.id"
        class="lang-card"
        :class="[cardClass(lang), { expanded: selected?.id === lang.id }]"
        @click="selectLang(lang)"
      >
        <div class="lang-card-header">
          <span class="lang-emoji">{{ lang.emoji }}</span>
          <div>
            <p class="lang-name">{{ lang.name }}</p>
            <p class="lang-label">{{ lang.personalityLabel }}</p>
          </div>
        </div>
        <div class="lang-detail" v-if="selected?.id === lang.id">
          <p class="lang-tagline">{{ lang.tagline }}</p>
          <p class="lang-meme">「{{ lang.memeHook }}」</p>
          <div class="lang-tags">
            <span v-for="t in lang.traits" :key="t" class="lang-tag">{{ t }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.explore-page {
  max-width: 740px;
  margin: 0 auto;
  padding: 32px 16px;
}

.explore-header {
  text-align: center;
  margin-bottom: 28px;
}

.explore-title {
  font-size: 1.6rem;
  font-weight: 800;
}

.explore-desc {
  margin-top: 8px;
  color: var(--color-text-secondary);
}

.explore-nav {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.nav-link {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.nav-link:hover {
  color: var(--color-accent);
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.lang-card {
  width: 100%;
  padding: 16px;
  text-align: left;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.lang-card:hover {
  box-shadow: var(--shadow-card);
}

.lang-card.highlight-match {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.lang-card.highlight-distant {
  border-color: #B2BEC3;
  background: #F8F9FA;
}

.lang-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang-emoji {
  font-size: 1.6rem;
}

.lang-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.lang-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.lang-detail {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.lang-tagline {
  font-size: 0.85rem;
  color: var(--color-text);
  font-weight: 500;
}

.lang-meme {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.lang-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.lang-tag {
  padding: 3px 10px;
  font-size: 0.75rem;
  background: #F0F0F0;
  border-radius: 50px;
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .explore-page {
    max-width: 960px;
  }
}
</style>
