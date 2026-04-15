import type { Question } from '../types'

export function accumulateScores(
  questions: Question[],
  answers: Record<string, number>,
): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const question of questions) {
    const optionIndex = answers[question.id]
    if (optionIndex === undefined) continue
    const option = question.options[optionIndex]
    for (const [dim, value] of Object.entries(option.scores)) {
      scores[dim] = (scores[dim] ?? 0) + value
    }
  }
  return scores
}

export function computeMaxScores(
  questions: Question[],
): Record<string, number> {
  const maxScores: Record<string, number> = {}
  for (const question of questions) {
    const questionMax: Record<string, number> = {}
    for (const option of question.options) {
      for (const [dim, value] of Object.entries(option.scores)) {
        questionMax[dim] = Math.max(questionMax[dim] ?? 0, value)
      }
    }
    for (const [dim, value] of Object.entries(questionMax)) {
      maxScores[dim] = (maxScores[dim] ?? 0) + value
    }
  }
  return maxScores
}

export function normalizeScores(
  rawScores: Record<string, number>,
  maxScores: Record<string, number>,
): Record<string, number> {
  const normalized: Record<string, number> = {}
  for (const dim of Object.keys(maxScores)) {
    const raw = rawScores[dim] ?? 0
    const max = maxScores[dim]
    normalized[dim] = max > 0 ? raw / max : 0
  }
  return normalized
}
