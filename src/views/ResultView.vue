<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuiz } from '../composables/useQuiz'
import ResultPoster from '../components/result/ResultPoster.vue'
import type { MatchResult } from '../types'

const router = useRouter()
const { getResult, reset, restore } = useQuiz()
const result = ref<MatchResult | null>(null)

onMounted(() => {
  restore()
  result.value = getResult()
  if (!result.value) {
    router.replace('/')
  }
})

async function savePoster() {
  const el = document.getElementById('clti-poster')
  if (!el) return
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(el, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  })
  const link = document.createElement('a')
  link.download = `clti-${result.value?.language.id ?? 'result'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function retake() {
  reset()
  router.push('/')
}
</script>

<template>
  <div class="result-page" v-if="result">
    <ResultPoster :result="result" />

    <div class="result-actions">
      <button class="action-btn primary" @click="savePoster">
        📸 保存海报
      </button>
      <button class="action-btn secondary" @click="retake">
        🔄 重新测试
      </button>
      <router-link to="/explore" class="action-btn secondary">
        🌐 查看全部语言
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-actions {
  margin-top: 24px;
  max-width: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  text-align: center;
  transition: transform 0.15s, box-shadow 0.15s;
}

.action-btn.primary {
  background: var(--color-accent);
  color: #fff;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}

.action-btn.secondary {
  background: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: var(--color-accent-border);
  box-shadow: var(--shadow-card);
}

@media (min-width: 768px) {
  .result-actions {
    flex-direction: row;
    max-width: 600px;
  }
}
</style>
