<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import type { MatchResult } from '../../types'
import RadarChart from './RadarChart.vue'
import LanguageMiniCard from './LanguageMiniCard.vue'

defineProps<{
  result: MatchResult
}>()

const qrDataUrl = ref('')

onMounted(async () => {
  qrDataUrl.value = await QRCode.toDataURL('https://clti.lunadeer.cn/', {
    width: 120,
    margin: 1,
    color: { dark: '#2D3436', light: '#00000000' },
  })
})
</script>

<template>
  <div class="poster" id="clti-poster">
    <!-- Hero: Identity + Chart -->
    <div class="poster-hero">
      <div class="poster-identity">
        <span class="poster-emoji">{{ result.language.emoji }}</span>
        <h1 class="poster-lang-name">{{ result.language.name }}</h1>
        <span class="poster-label-badge">{{ result.language.personalityLabel }}</span>
        <p class="poster-type-code">{{ result.typeCode }}</p>
        <p class="poster-meme">「{{ result.language.memeHook }}」</p>
      </div>

      <div class="poster-chart-section">
        <h3 class="poster-section-title">你的五维画像</h3>
        <div class="poster-chart-card">
          <RadarChart :scores="result.scores" />
        </div>
      </div>
    </div>

    <!-- Match explanation -->
    <div class="poster-section">
      <h3 class="poster-section-title">为什么是你</h3>
      <div class="poster-text-card">
        <p>{{ result.language.matchExplanation }}</p>
      </div>
    </div>

    <!-- Traits + Strengths + Contrast in a row on desktop -->
    <div class="poster-tag-grid">
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
    </div>

    <!-- Secondary matches -->
    <div class="poster-section">
      <h3 class="poster-section-title">与你有关的语言</h3>
      <div class="poster-minis">
        <LanguageMiniCard :language="result.closestAlternative" label="最相似" />
        <LanguageMiniCard :language="result.mostDistant" label="最不像" />
      </div>
    </div>

    <!-- Branding + QR code -->
    <div class="poster-footer">
      <div class="poster-footer-text">
        <p class="poster-branding-title">CLTI · 编程语言人格测试</p>
        <p class="poster-branding-hint">扫码测测你是哪门语言</p>
      </div>
      <img v-if="qrDataUrl" :src="qrDataUrl" class="poster-qr" alt="QR Code" />
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

.poster-hero {
  display: flex;
  flex-direction: column;
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

.poster-type-code {
  margin-top: 10px;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--color-text);
}

.poster-meme {
  margin-top: 16px;
  text-align: center;
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.poster-chart-section {
  margin-top: 24px;
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

.poster-tag-grid {
  display: flex;
  flex-direction: column;
}

.poster-tag-grid .poster-section {
  margin-top: 24px;
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

.poster-footer {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.poster-footer-text {
  text-align: right;
}

.poster-branding-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.poster-branding-hint {
  margin-top: 2px;
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.poster-qr {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
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

@media (min-width: 768px) {
  .poster {
    max-width: 680px;
    padding: 40px 36px 32px;
  }

  .poster-hero {
    flex-direction: row;
    align-items: center;
    gap: 32px;
  }

  .poster-identity {
    flex: 1;
  }

  .poster-chart-section {
    margin-top: 0;
    flex: 1;
  }

  .poster-tag-grid {
    flex-direction: row;
    gap: 16px;
  }

  .poster-tag-grid .poster-section {
    flex: 1;
    margin-top: 24px;
  }
}
</style>
