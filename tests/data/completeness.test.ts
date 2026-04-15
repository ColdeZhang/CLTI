import { describe, it, expect } from 'vitest'
import { languages } from '../../src/data/languages'
import { DIMENSION_IDS } from '../../src/data/dimensions'

describe('language profile completeness', () => {
  for (const lang of languages) {
    describe(lang.name, () => {
      it('has all required string fields', () => {
        expect(lang.id).toBeTruthy()
        expect(lang.name).toBeTruthy()
        expect(lang.emoji).toBeTruthy()
        expect(lang.personalityLabel).toBeTruthy()
        expect(lang.tagline).toBeTruthy()
        expect(lang.memeHook).toBeTruthy()
        expect(lang.matchExplanation).toBeTruthy()
      })

      it('has a complete dimension vector', () => {
        for (const dim of DIMENSION_IDS) {
          expect(lang.vector[dim]).toBeGreaterThanOrEqual(0)
          expect(lang.vector[dim]).toBeLessThanOrEqual(1)
        }
      })

      it('has non-empty arrays', () => {
        expect(lang.traits.length).toBeGreaterThan(0)
        expect(lang.strengths.length).toBeGreaterThan(0)
        expect(lang.contrastPoints.length).toBeGreaterThan(0)
        expect(lang.rivals.length).toBeGreaterThan(0)
      })

      it('has rivals that reference existing language IDs', () => {
        const allIds = languages.map(l => l.id)
        for (const rival of lang.rivals) {
          expect(allIds).toContain(rival)
        }
      })
    })
  }
})
