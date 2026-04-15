import { describe, it, expect } from 'vitest'
import { languages } from '../../src/data/languages'
import { questions } from '../../src/data/questions'
import { DIMENSION_IDS } from '../../src/data/dimensions'
import { findMatch } from '../../src/engine/matching'

describe('language coverage', () => {
  it('has exactly 25 languages', () => {
    expect(languages.length).toBe(25)
  })

  it('has no duplicate language IDs', () => {
    const ids = languages.map(l => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every language is reachable (vector matches self)', () => {
    for (const lang of languages) {
      const result = findMatch(lang.vector, languages, DIMENSION_IDS)
      expect(result.id).toBe(lang.id)
    }
  })
})

describe('question coverage', () => {
  it('has 15 questions', () => {
    expect(questions.length).toBe(15)
  })

  it('has no duplicate question IDs', () => {
    const ids = questions.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each question has exactly 4 options', () => {
    for (const q of questions) {
      expect(q.options.length).toBe(4)
    }
  })

  it('all five dimensions are covered by questions', () => {
    const covered = new Set<string>()
    for (const q of questions) {
      for (const opt of q.options) {
        for (const dim of Object.keys(opt.scores)) {
          covered.add(dim)
        }
      }
    }
    for (const dim of DIMENSION_IDS) {
      expect(covered.has(dim)).toBe(true)
    }
  })
})
