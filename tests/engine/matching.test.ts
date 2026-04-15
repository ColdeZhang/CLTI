import { describe, it, expect } from 'vitest'
import {
  euclideanDistance,
  findMatch,
  findClosestAlternative,
  findMostDistant,
} from '../../src/engine/matching'
import type { LanguageProfile } from '../../src/types'

const dims = ['order', 'control', 'expression', 'teamwork', 'action']

function makeLang(id: string, vector: Record<string, number>): LanguageProfile {
  return {
    id,
    name: id,
    emoji: '🔤',
    vector,
    personalityLabel: 'label',
    tagline: 'tag',
    memeHook: 'meme',
    matchExplanation: 'explain',
    traits: ['t'],
    strengths: ['s'],
    contrastPoints: ['c'],
    rivals: [],
  }
}

const langA = makeLang('alpha', { order: 1, control: 0, expression: 0, teamwork: 0, action: 0 })
const langB = makeLang('beta',  { order: 0, control: 1, expression: 0, teamwork: 0, action: 0 })
const langG = makeLang('gamma', { order: 0.5, control: 0.5, expression: 0.5, teamwork: 0.5, action: 0.5 })
const langs = [langA, langB, langG]

describe('euclideanDistance', () => {
  it('returns 0 for identical vectors', () => {
    const v = { order: 0.5, control: 0.5, expression: 0, teamwork: 0, action: 0 }
    expect(euclideanDistance(v, v, dims)).toBe(0)
  })

  it('computes correct distance for orthogonal unit vectors', () => {
    expect(euclideanDistance(langA.vector, langB.vector, dims)).toBeCloseTo(Math.SQRT2)
  })

  it('treats missing keys as 0', () => {
    const a = { order: 1 }
    const b = { control: 1 }
    expect(euclideanDistance(a, b, dims)).toBeCloseTo(Math.SQRT2)
  })
})

describe('findMatch', () => {
  it('returns the closest language', () => {
    const user = { order: 0.9, control: 0.1, expression: 0, teamwork: 0, action: 0 }
    expect(findMatch(user, langs, dims).id).toBe('alpha')
  })

  it('prefers relative preference shape over raw score magnitude', () => {
    const specialist = makeLang('specialist', {
      order: 0.9,
      control: 0.1,
      expression: 0.1,
      teamwork: 0.1,
      action: 0.1,
    })
    const centroid = makeLang('centroid', {
      order: 0.25,
      control: 0.25,
      expression: 0.25,
      teamwork: 0.25,
      action: 0.25,
    })
    const user = {
      order: 0.45,
      control: 0.05,
      expression: 0.05,
      teamwork: 0.05,
      action: 0.05,
    }

    expect(findMatch(user, [specialist, centroid], dims).id).toBe('specialist')
  })

  it('uses alphabetical tie-break when distances are equal', () => {
    const user = { order: 0.5, control: 0.5, expression: 0, teamwork: 0, action: 0 }
    const dA = euclideanDistance(user, langA.vector, dims)
    const dB = euclideanDistance(user, langB.vector, dims)
    expect(dA).toBeCloseTo(dB)
    expect(findMatch(user, [langA, langB], dims).id).toBe('alpha')
  })

  it('returns the only language if list has one', () => {
    const user = { order: 0, control: 0, expression: 0, teamwork: 0, action: 0 }
    expect(findMatch(user, [langG], dims).id).toBe('gamma')
  })
})

describe('findClosestAlternative', () => {
  it('returns second closest, excluding the primary match', () => {
    const user = { order: 0.9, control: 0.1, expression: 0, teamwork: 0, action: 0 }
    const alt = findClosestAlternative(user, langs, dims, 'alpha')
    expect(alt.id).toBe('gamma')
  })
})

describe('findMostDistant', () => {
  it('returns the language farthest from user vector', () => {
    const user = { order: 1, control: 0, expression: 0, teamwork: 0, action: 0 }
    expect(findMostDistant(user, langs, dims).id).toBe('beta')
  })
})
