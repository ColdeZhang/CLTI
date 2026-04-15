import { describe, it, expect, beforeEach } from 'vitest'
import { useQuiz } from '../../src/composables/useQuiz'
import { questions } from '../../src/data/questions'
import { DIMENSIONS } from '../../src/data/dimensions'
import { accumulateScores, computeMaxScores, normalizeScores } from '../../src/engine/scoring'

function expectedRelativeScores(scores: Record<string, number>): Record<string, number> {
  const total = DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.id] ?? 0), 0)
  const fallback = 1 / DIMENSIONS.length

  return Object.fromEntries(DIMENSIONS.map(dim => [
    dim.id,
    total > 0 ? (scores[dim.id] ?? 0) / total : fallback,
  ]))
}

function expectedRelativeTypeCode(scores: Record<string, number>): string {
  const relativeScores = expectedRelativeScores(scores)
  const threshold = 1 / DIMENSIONS.length

  return DIMENSIONS.map(dim => {
    return (relativeScores[dim.id] ?? 0) > threshold ? dim.letterHigh : dim.letterLow
  }).join('')
}

describe('useQuiz getResult', () => {
  beforeEach(() => {
    const { state } = useQuiz()
    state.currentIndex = 0
    state.answers = {}
    state.completed = false
  })

  it('derives type code from relative dimension shares', () => {
    const { state, getResult } = useQuiz()
    const answers = Object.fromEntries(questions.map(question => [question.id, 1]))

    state.answers = answers
    state.completed = true

    const rawScores = accumulateScores(questions, answers)
    const absoluteScores = normalizeScores(rawScores, computeMaxScores(questions))
    const expectedScores = expectedRelativeScores(absoluteScores)
    const expected = expectedRelativeTypeCode(absoluteScores)

    expect(expected).toBe('FCESD')
    expect(getResult()?.scores).toEqual(expectedScores)
    expect(getResult()?.typeCode).toBe(expected)
  })
})