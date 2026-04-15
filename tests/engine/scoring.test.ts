import { describe, it, expect } from 'vitest'
import { accumulateScores, computeMaxScores, normalizeScores } from '../../src/engine/scoring'
import type { Question } from '../../src/types'

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Question 1',
    options: [
      { emoji: '📦', title: 'A', description: 'd', scores: { order: 3, teamwork: 1 } },
      { emoji: '🚀', title: 'B', description: 'd', scores: { action: 3 } },
      { emoji: '🎨', title: 'C', description: 'd', scores: { expression: 3 } },
      { emoji: '🔧', title: 'D', description: 'd', scores: { control: 3 } },
    ],
  },
  {
    id: 'q2',
    text: 'Question 2',
    options: [
      { emoji: '📏', title: 'A', description: 'd', scores: { order: 3 } },
      { emoji: '🎭', title: 'B', description: 'd', scores: { expression: 3 } },
      { emoji: '⚡', title: 'C', description: 'd', scores: { action: 3 } },
      { emoji: '🔬', title: 'D', description: 'd', scores: { control: 3, order: 1 } },
    ],
  },
]

describe('accumulateScores', () => {
  it('sums scores for selected options', () => {
    const answers: Record<string, number> = { q1: 0, q2: 0 }
    const result = accumulateScores(mockQuestions, answers)
    expect(result).toEqual({ order: 6, teamwork: 1 })
  })

  it('handles different selections across dimensions', () => {
    const answers: Record<string, number> = { q1: 1, q2: 2 }
    const result = accumulateScores(mockQuestions, answers)
    expect(result).toEqual({ action: 6 })
  })

  it('skips unanswered questions', () => {
    const answers: Record<string, number> = { q1: 0 }
    const result = accumulateScores(mockQuestions, answers)
    expect(result).toEqual({ order: 3, teamwork: 1 })
  })

  it('returns empty object when no answers', () => {
    const result = accumulateScores(mockQuestions, {})
    expect(result).toEqual({})
  })
})

describe('computeMaxScores', () => {
  it('computes per-dimension max achievable', () => {
    const max = computeMaxScores(mockQuestions)
    expect(max.order).toBe(6)
    expect(max.teamwork).toBe(1)
    expect(max.action).toBe(6)
    expect(max.expression).toBe(6)
    expect(max.control).toBe(6)
  })
})

describe('normalizeScores', () => {
  it('normalizes raw scores to 0-1 range', () => {
    const raw = { order: 6, teamwork: 1 }
    const max = { order: 6, teamwork: 1, action: 6, expression: 6, control: 6 }
    const result = normalizeScores(raw, max)
    expect(result.order).toBe(1)
    expect(result.teamwork).toBe(1)
    expect(result.action).toBe(0)
    expect(result.expression).toBe(0)
    expect(result.control).toBe(0)
  })

  it('handles partial scores', () => {
    const raw = { order: 3 }
    const max = { order: 6, action: 6 }
    const result = normalizeScores(raw, max)
    expect(result.order).toBe(0.5)
    expect(result.action).toBe(0)
  })

  it('handles zero max gracefully', () => {
    const raw = { order: 0 }
    const max = { order: 0 }
    const result = normalizeScores(raw, max)
    expect(result.order).toBe(0)
  })
})
