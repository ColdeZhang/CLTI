import type { LanguageProfile } from '../types'

export function normalizeRelativeVector(
  vector: Record<string, number>,
  dimensions: string[],
): Record<string, number> {
  const total = dimensions.reduce((sum, dim) => sum + Math.max(vector[dim] ?? 0, 0), 0)
  const fallback = dimensions.length > 0 ? 1 / dimensions.length : 0
  const normalized: Record<string, number> = {}

  for (const dim of dimensions) {
    if (total > 0) {
      normalized[dim] = (vector[dim] ?? 0) / total
    } else {
      normalized[dim] = fallback
    }
  }

  return normalized
}

export function euclideanDistance(
  a: Record<string, number>,
  b: Record<string, number>,
  dimensions: string[],
): number {
  let sum = 0
  for (const dim of dimensions) {
    const diff = (a[dim] ?? 0) - (b[dim] ?? 0)
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

export function findMatch(
  userVector: Record<string, number>,
  languages: LanguageProfile[],
  dimensionIds: string[],
): LanguageProfile {
  const normalizedUser = normalizeRelativeVector(userVector, dimensionIds)
  let best = languages[0]
  let bestDist = Infinity
  for (const lang of languages) {
    const dist = euclideanDistance(
      normalizedUser,
      normalizeRelativeVector(lang.vector, dimensionIds),
      dimensionIds,
    )
    if (dist < bestDist || (dist === bestDist && lang.id < best.id)) {
      best = lang
      bestDist = dist
    }
  }
  return best
}

export function findClosestAlternative(
  userVector: Record<string, number>,
  languages: LanguageProfile[],
  dimensionIds: string[],
  excludeId: string,
): LanguageProfile {
  return findMatch(userVector, languages.filter(l => l.id !== excludeId), dimensionIds)
}

export function findMostDistant(
  userVector: Record<string, number>,
  languages: LanguageProfile[],
  dimensionIds: string[],
): LanguageProfile {
  const normalizedUser = normalizeRelativeVector(userVector, dimensionIds)
  let worst = languages[0]
  let worstDist = -1
  for (const lang of languages) {
    const dist = euclideanDistance(
      normalizedUser,
      normalizeRelativeVector(lang.vector, dimensionIds),
      dimensionIds,
    )
    if (dist > worstDist || (dist === worstDist && lang.id < worst.id)) {
      worst = lang
      worstDist = dist
    }
  }
  return worst
}
