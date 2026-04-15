import { reactive, computed } from 'vue'
import { questions } from '../data/questions'
import { languages } from '../data/languages'
import { DIMENSION_IDS } from '../data/dimensions'
import { accumulateScores, computeMaxScores, normalizeScores } from '../engine/scoring'
import { findMatch, findClosestAlternative, findMostDistant } from '../engine/matching'
import type { MatchResult } from '../types'

const STORAGE_KEY = 'clti-quiz-state'

interface QuizState {
  currentIndex: number
  answers: Record<string, number>
  completed: boolean
}

const state = reactive<QuizState>({
  currentIndex: 0,
  answers: {},
  completed: false,
})

function save(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    currentIndex: state.currentIndex,
    answers: state.answers,
    completed: state.completed,
  }))
}

function restore(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (typeof data.currentIndex !== 'number') return false
    state.currentIndex = data.currentIndex
    state.answers = data.answers ?? {}
    state.completed = data.completed ?? false
    return true
  } catch {
    return false
  }
}

function reset(): void {
  state.currentIndex = 0
  state.answers = {}
  state.completed = false
  localStorage.removeItem(STORAGE_KEY)
}

function selectOption(questionId: string, optionIndex: number): void {
  state.answers[questionId] = optionIndex
  save()
}

function nextQuestion(): void {
  if (state.currentIndex < questions.length - 1) {
    state.currentIndex++
    save()
  } else {
    state.completed = true
    save()
  }
}

const currentQuestion = computed(() => questions[state.currentIndex])
const progress = computed(() => (state.currentIndex + 1) / questions.length)
const isLastQuestion = computed(() => state.currentIndex === questions.length - 1)
const selectedOption = computed(() => {
  const qId = currentQuestion.value?.id
  return qId !== undefined ? state.answers[qId] : undefined
})

function getResult(): MatchResult | null {
  if (!state.completed) return null
  const rawScores = accumulateScores(questions, state.answers)
  const maxScores = computeMaxScores(questions)
  const userVector = normalizeScores(rawScores, maxScores)
  const language = findMatch(userVector, languages, DIMENSION_IDS)
  const closestAlternative = findClosestAlternative(userVector, languages, DIMENSION_IDS, language.id)
  const mostDistant = findMostDistant(userVector, languages, DIMENSION_IDS)
  return { language, scores: userVector, closestAlternative, mostDistant }
}

export function useQuiz() {
  return {
    state,
    currentQuestion,
    progress,
    isLastQuestion,
    selectedOption,
    totalQuestions: questions.length,
    restore,
    reset,
    selectOption,
    nextQuestion,
    getResult,
  }
}
