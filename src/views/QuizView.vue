<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuiz } from '../composables/useQuiz'
import ProgressBar from '../components/quiz/ProgressBar.vue'
import OptionCard from '../components/quiz/OptionCard.vue'

const router = useRouter()
const {
  state,
  currentQuestion,
  isLastQuestion,
  isFirstQuestion,
  selectedOption,
  totalQuestions,
  restore,
  selectOption,
  nextQuestion,
  prevQuestion,
} = useQuiz()

onMounted(() => {
  if (state.completed) {
    router.replace('/result')
    return
  }
  if (state.currentIndex === 0 && Object.keys(state.answers).length === 0) {
    restore()
  }
})

function handleNext() {
  nextQuestion()
  if (state.completed) {
    router.push('/result')
  }
}
</script>

<template>
  <div class="quiz-page">
    <div class="quiz-container">
      <ProgressBar :current="state.currentIndex + 1" :total="totalQuestions" />

      <p class="quiz-counter">{{ state.currentIndex + 1 }} / {{ totalQuestions }}</p>

      <h2 class="quiz-question">{{ currentQuestion.text }}</h2>

      <div class="quiz-grid">
        <OptionCard
          v-for="(opt, i) in currentQuestion.options"
          :key="i"
          :emoji="opt.emoji"
          :title="opt.title"
          :description="opt.description"
          :selected="selectedOption === i"
          @select="selectOption(currentQuestion.id, i)"
        />
      </div>

      <div class="quiz-actions">
        <button
          class="quiz-prev"
          :disabled="isFirstQuestion"
          @click="prevQuestion"
        >
          ← 上一题
        </button>
        <button
          class="quiz-next"
          :disabled="selectedOption === undefined"
          @click="handleNext"
        >
          {{ isLastQuestion ? '查看结果 →' : '下一题 →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.quiz-container {
  max-width: 600px;
  width: 100%;
}

.quiz-counter {
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}

.quiz-question {
  margin-top: 20px;
  font-size: 1.35rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.5;
}

.quiz-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.quiz-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}

.quiz-prev {
  flex-shrink: 0;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  transition: opacity 0.2s, border-color 0.2s;
}

.quiz-prev:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.quiz-prev:not(:disabled):hover {
  border-color: var(--color-accent-border);
  color: var(--color-text);
}

.quiz-next {
  flex: 1;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-accent);
  border-radius: 50px;
  transition: opacity 0.2s, transform 0.15s;
}

.quiz-next:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.quiz-next:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}

@media (max-width: 480px) {
  .quiz-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .quiz-container {
    max-width: 720px;
  }

  .quiz-question {
    font-size: 1.5rem;
  }
}
</style>
