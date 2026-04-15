<script setup lang="ts">
import type { MatchResult } from '../../types'
import RadarChart from './RadarChart.vue'
import LanguageMiniCard from './LanguageMiniCard.vue'

defineProps<{
  result: MatchResult
}>()
</script>

<template>
  <div class="poster" id="clti-poster">
    <!-- Identity block -->
    <div class="poster-identity">
      <span class="poster-emoji">{{ result.language.emoji }}</span>
      <h1 class="poster-lang-name">{{ result.language.name }}</h1>
      <span class="poster-label-badge">{{ result.language.personalityLabel }}</span>
    </div>

    <!-- Meme hook -->
    <p class="poster-meme">「{{ result.language.memeHook }}」</p>

    <!-- Radar chart -->
    <div class="poster-section">
      <h3 class="poster-section-title">你的五维画像</h3>
      <div class="poster-chart-card">
        <RadarChart :scores="result.scores" />
      </div>
    </div>

    <!-- Match explanation -->
    <div class="poster-section">
      <h3 class="poster-section-title">为什么是你</h3>
      <div class="poster-text-card">
        <p>{{ result.language.matchExplanation }}</p>
      </div>
    </div>

    <!-- Traits + Strengths -->
    <div class="poster-section">
      <h3 class="poster-section-title">人格特征</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="t in result.language.traits" :key="t" class="poster-tag trait">{{ t }}</span>
        </div>
      </div>
    </div>

    <div class="poster-section">
      <h3 class="poster-section-title">核心优势</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="s in result.language.strengths" :key="s" class="poster-tag strength">{{ s }}</span>
        </div>
      </div>
    </div>

    <div class="poster-section">
      <h3 class="poster-section-title">反差面</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="c in result.language.contrastPoints" :key="c" class="poster-tag contrast">{{ c }}</span>
        </div>
      </div>
    </div>

    <!-- Secondary matches -->
    <div class="poster-section">
      <h3 class="poster-section-title">与你有关的语言</h3>
      <div class="poster-minis">
        <LanguageMiniCard :language="result.closestAlternative" label="最相似" />
        <LanguageMiniCard :language="result.mostDistant" label="最不像" />
      </div>
    </div>

    <!-- Branding -->
    <div class="poster-branding">
      <p>CLTI · 编程语言人格测试</p>
    </div>
  </div>
</template>

<style scoped>
.poster {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 28px 28px;
  background: linear-gradient(180deg, #FFF5F5 0%, #FFFBF0 50%, #F0F9FF 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
}

.poster-identity {
  text-align: center;
}

.poster-emoji {
  font-size: 4rem;
  display: block;
}

.poster-lang-name {
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 800;
}

.poster-label-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border: 1px solid var(--color-accent-border);
  border-radius: 50px;
}

.poster-meme {
  margin-top: 20px;
  text-align: center;
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.poster-section {
  margin-top: 24px;
}

.poster-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.poster-chart-card,
.poster-text-card {
  padding: 20px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
}

.poster-text-card p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.poster-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.poster-tag {
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.poster-tag.trait {
  background: #FFF0F0;
  color: #E74C3C;
}

.poster-tag.strength {
  background: #F0FFF4;
  color: #27AE60;
}

.poster-tag.contrast {
  background: #FFF8E1;
  color: #F39C12;
}

.poster-minis {
  display: flex;
  gap: 12px;
}

.poster-branding {
  margin-top: 28px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

@media (max-width: 480px) {
  .poster {
    padding: 28px 20px 20px;
    border-radius: var(--radius-md);
  }

  .poster-emoji {
    font-size: 3rem;
  }

  .poster-lang-name {
    font-size: 1.6rem;
  }

  .poster-minis {
    flex-direction: column;
  }
}
</style>
