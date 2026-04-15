export interface Dimension {
  id: string
  publicName: string
  technicalName: string
}

export interface QuestionOption {
  emoji: string
  title: string
  description: string
  scores: Record<string, number>
}

export interface Question {
  id: string
  text: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
}

export interface LanguageProfile {
  id: string
  name: string
  emoji: string
  vector: Record<string, number>
  personalityLabel: string
  tagline: string
  memeHook: string
  matchExplanation: string
  traits: string[]
  strengths: string[]
  contrastPoints: string[]
  rivals: string[]
}

export interface MatchResult {
  language: LanguageProfile
  scores: Record<string, number>
  closestAlternative: LanguageProfile
  mostDistant: LanguageProfile
}
