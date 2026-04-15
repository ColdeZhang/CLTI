# CLTI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pure-frontend Vue personality test that matches users to one of 25 programming languages via a five-dimension scoring model, with a highly shareable result poster card.

**Architecture:** Single-page Vue 3 app with five views (Landing → Quiz Intro → Quiz → Result → Explore). All state lives in a reactive composable with localStorage backup. A pure-function scoring engine accumulates per-dimension scores from quiz answers and matches the resulting user vector to the closest language vector via Euclidean distance.

**Tech Stack:** Vue 3 (Composition API), Vue Router 4, TypeScript, Vite, Vitest, html2canvas

---

## File Structure

```
(repo root)
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── vite-env.d.ts
│   ├── router/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   ├── dimensions.ts
│   │   ├── languages.ts
│   │   └── questions.ts
│   ├── engine/
│   │   ├── scoring.ts
│   │   └── matching.ts
│   ├── composables/
│   │   └── useQuiz.ts
│   ├── views/
│   │   ├── LandingView.vue
│   │   ├── QuizIntroView.vue
│   │   ├── QuizView.vue
│   │   ├── ResultView.vue
│   │   └── ExploreView.vue
│   ├── components/
│   │   ├── landing/
│   │   │   ├── HeroCard.vue
│   │   │   └── ScatteredCards.vue
│   │   ├── quiz/
│   │   │   ├── ProgressBar.vue
│   │   │   └── OptionCard.vue
│   │   └── result/
│   │       ├── ResultPoster.vue
│   │       ├── RadarChart.vue
│   │       └── LanguageMiniCard.vue
│   └── styles/
│       ├── variables.css
│       └── global.css
└── tests/
    ├── engine/
    │   ├── scoring.test.ts
    │   └── matching.test.ts
    └── data/
        ├── completeness.test.ts
        └── coverage.test.ts
```

**Responsibilities:**

| Path | Responsibility |
|------|---------------|
| `src/types/index.ts` | All TypeScript interfaces |
| `src/data/dimensions.ts` | Five dimension definitions |
| `src/data/languages.ts` | 25 language profile objects |
| `src/data/questions.ts` | 15 quiz questions with options and score maps |
| `src/engine/scoring.ts` | Accumulate raw scores, compute max, normalize to 0-1 |
| `src/engine/matching.ts` | Euclidean distance, find match, closest alt, most distant |
| `src/composables/useQuiz.ts` | Module-level reactive quiz state, localStorage persistence, result computation |
| `src/router/index.ts` | Five routes with navigation guards |
| `src/components/landing/*` | Frosted-glass hero + scattered floating language cards |
| `src/components/quiz/*` | Progress bar + option card |
| `src/components/result/*` | Poster card + SVG radar chart + language mini card |
| `src/views/*` | One view per stage, compose components |
| `src/styles/*` | CSS custom properties + global resets |
| `tests/engine/*` | Unit tests for scoring and matching |
| `tests/data/*` | Content completeness and language coverage tests |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`

- [ ] **Step 1: Scaffold Vite project**

Run from repo root:

```bash
npm create vite@latest . -- --template vue-ts
```

If prompted about non-empty directory, choose **"Ignore files and continue"**.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install vue-router@4 html2canvas@1
```

- [ ] **Step 3: Add Vitest to vite.config.ts**

Replace the generated `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Update tsconfig.app.json to include tests**

In `tsconfig.app.json`, change the `include` array to:

```json
"include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "tests/**/*.ts"]
```

- [ ] **Step 5: Remove default boilerplate**

```bash
rm src/components/HelloWorld.vue
rm src/style.css
rm -r src/assets
```

- [ ] **Step 6: Replace src/App.vue with a minimal shell**

```vue
<script setup lang="ts">
</script>

<template>
  <div>CLTI</div>
</template>
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Page shows "CLTI" at `http://localhost:5173`.

- [ ] **Step 8: Verify test runner works**

```bash
npx vitest run
```

Expected: "No test files found" (no error).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + Vue 3 + TypeScript project"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create type definitions**

```ts
// src/types/index.ts

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
```

- [ ] **Step 2: Verify types compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add core type definitions"
```

---

### Task 3: Dimension Data

**Files:**
- Create: `src/data/dimensions.ts`

- [ ] **Step 1: Create dimension data**

```ts
// src/data/dimensions.ts
import type { Dimension } from '../types'

export const DIMENSIONS: Dimension[] = [
  { id: 'order',      publicName: '秩序欲',  technicalName: '类型与规则严格性' },
  { id: 'control',    publicName: '掌控欲',  technicalName: '底层控制权 / 抽象层级' },
  { id: 'expression', publicName: '表达欲',  technicalName: '语法表现力 / 范式自由度' },
  { id: 'teamwork',   publicName: '团队脑',  technicalName: '工程协作性 / 生态规范化' },
  { id: 'action',     publicName: '行动派',  technicalName: '反馈速度 / 原型推进效率' },
]

export const DIMENSION_IDS = DIMENSIONS.map(d => d.id)
```

- [ ] **Step 2: Verify compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/dimensions.ts
git commit -m "feat: add five-dimension definitions"
```

---

### Task 4: Scoring Engine (TDD)

**Files:**
- Create: `src/engine/scoring.ts`
- Create: `tests/engine/scoring.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/engine/scoring.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/engine/scoring.test.ts
```

Expected: FAIL — module `../../src/engine/scoring` not found.

- [ ] **Step 3: Implement the scoring engine**

```ts
// src/engine/scoring.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/engine/scoring.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/scoring.ts tests/engine/scoring.test.ts
git commit -m "feat: implement scoring engine with tests"
```

---

### Task 5: Matching Engine (TDD)

**Files:**
- Create: `src/engine/matching.ts`
- Create: `tests/engine/matching.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/engine/matching.test.ts
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

  it('uses alphabetical tie-break when distances are equal', () => {
    const user = { order: 0.5, control: 0.5, expression: 0, teamwork: 0, action: 0 }
    const dA = euclideanDistance(user, langA.vector, dims)
    const dB = euclideanDistance(user, langB.vector, dims)
    expect(dA).toBeCloseTo(dB)
    expect(findMatch(user, langs, dims).id).toBe('alpha')
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/engine/matching.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the matching engine**

```ts
// src/engine/matching.ts
import type { LanguageProfile } from '../types'

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
  let best = languages[0]
  let bestDist = Infinity
  for (const lang of languages) {
    const dist = euclideanDistance(userVector, lang.vector, dimensionIds)
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
  let worst = languages[0]
  let worstDist = -1
  for (const lang of languages) {
    const dist = euclideanDistance(userVector, lang.vector, dimensionIds)
    if (dist > worstDist || (dist === worstDist && lang.id < worst.id)) {
      worst = lang
      worstDist = dist
    }
  }
  return worst
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/engine/matching.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/engine/matching.ts tests/engine/matching.test.ts
git commit -m "feat: implement matching engine with tests"
```

---

### Task 6: Language Profiles Data

**Files:**
- Create: `src/data/languages.ts`

- [ ] **Step 1: Create the 25 language profiles**

```ts
// src/data/languages.ts
import type { LanguageProfile } from '../types'

export const languages: LanguageProfile[] = [
  {
    id: 'python',
    name: 'Python',
    emoji: '🐍',
    vector: { order: 0.3, control: 0.2, expression: 0.8, teamwork: 0.85, action: 0.95 },
    personalityLabel: '万能瑞士军刀',
    tagline: '人生苦短，我用 Python',
    memeHook: '什么都能做，就是别问运行速度',
    matchExplanation: '你追求快速出成果，不喜欢被繁琐规则束缚，偏爱用最少的代码解决问题。你是团队里最先拿出原型的人，哪怕它跑得没那么快。',
    traits: ['实用主义者', '快速出成果', '什么都想试试'],
    strengths: ['极低入门门槛', '全场景覆盖', '生态极其丰富'],
    contrastPoints: ['运行速度一般', '类型系统全靠自觉'],
    rivals: ['rust', 'java'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '🌐',
    vector: { order: 0.2, control: 0.15, expression: 0.75, teamwork: 0.8, action: 0.9 },
    personalityLabel: '无处不在的社牛',
    tagline: '充满惊喜（和惊吓）',
    memeHook: '0.1 + 0.2 ≠ 0.3，但这不影响我统治世界',
    matchExplanation: '你适应力极强，在任何环境都能快速融入并产出。偶尔制造一些惊喜，但总能在截止日期前搞定一切。',
    traits: ['适应力极强', '社交达人', '永远在线'],
    strengths: ['到处都能跑', '生态浩如烟海', '入门极快'],
    contrastPoints: ['类型系统约等于没有', '回调地狱老朋友'],
    rivals: ['typescript', 'python'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    emoji: '🛡️',
    vector: { order: 0.8, control: 0.15, expression: 0.7, teamwork: 0.9, action: 0.8 },
    personalityLabel: '穿西装的 JavaScript',
    tagline: '给混乱世界加上类型护甲',
    memeHook: 'any 一时爽，重构火葬场',
    matchExplanation: '你相信规则能带来自由。在团队协作中，你是那个推动代码规范、写好接口定义的人，也享受 IDE 给你的丝滑体验。',
    traits: ['秩序维护者', '团队协作者', '规范先行'],
    strengths: ['类型安全', 'IDE 支持极佳', '渐进式采用'],
    contrastPoints: ['配置可能比代码多', '为了类型写类型'],
    rivals: ['javascript', 'python'],
  },
  {
    id: 'java',
    name: 'Java',
    emoji: '☕',
    vector: { order: 0.9, control: 0.3, expression: 0.3, teamwork: 0.95, action: 0.5 },
    personalityLabel: '企业级稳定怪',
    tagline: '二十年如一日的可靠',
    memeHook: '写了 100 行代码，其中 90 行是 boilerplate',
    matchExplanation: '你信奉稳定压倒一切。在长期项目中你是最可靠的人，虽然你的方案可能不是最酷的，但绝对是最不会出事的。',
    traits: ['稳重可靠', '流程规范', '长期主义'],
    strengths: ['跨平台运行', '企业级生态', '海量文档'],
    contrastPoints: ['代码冗长', '启动速度感人'],
    rivals: ['kotlin', 'go'],
  },
  {
    id: 'c',
    name: 'C',
    emoji: '⚙️',
    vector: { order: 0.5, control: 0.95, expression: 0.2, teamwork: 0.4, action: 0.3 },
    personalityLabel: '硬核极简主义者',
    tagline: '给你最大的自由，也给你最大的风险',
    memeHook: 'Segmentation fault (core dumped)',
    matchExplanation: '你渴望理解事物的本质，不愿被层层抽象遮住底层真相。你愿意承担风险来换取完全的掌控权。',
    traits: ['追求极致掌控', '极简主义', '硬核技术流'],
    strengths: ['执行效率极高', '直接操作硬件', '无多余抽象'],
    contrastPoints: ['内存管理全靠自己', '造轮子是日常'],
    rivals: ['rust', 'python'],
  },
  {
    id: 'cpp',
    name: 'C++',
    emoji: '🏗️',
    vector: { order: 0.6, control: 0.9, expression: 0.6, teamwork: 0.5, action: 0.25 },
    personalityLabel: '过度工程化大师',
    tagline: '能用模板解决的问题，就不该用别的',
    memeHook: '写出来的代码连编译器都需要想一想',
    matchExplanation: '你享受构建复杂系统的过程，追求极致性能但也欣赏抽象的美。你的方案可能别人看不懂，但你知道它是最优的。',
    traits: ['复杂系统构建者', '性能偏执狂', '抽象爱好者'],
    strengths: ['极致性能', '丰富的范式', '系统级能力'],
    contrastPoints: ['学习曲线陡峭', '编译时间感人'],
    rivals: ['rust', 'c'],
  },
  {
    id: 'csharp',
    name: 'C#',
    emoji: '🎵',
    vector: { order: 0.85, control: 0.3, expression: 0.55, teamwork: 0.9, action: 0.6 },
    personalityLabel: '微软全能选手',
    tagline: '优雅且全面，从桌面到游戏到云',
    memeHook: 'Unity 开发者的日常：C# 很好，直到你遇到 Unity 的 C#',
    matchExplanation: '你追求全面且优雅的解决方案，喜欢完善的工具链支持。你是那种在每个领域都能做到 80 分以上的全能型选手。',
    traits: ['全面发展', '精致主义', '平台整合者'],
    strengths: ['语法优雅', '工具链强大', '应用面广'],
    contrastPoints: ['生态偏微软系', '跨平台仍在追赶'],
    rivals: ['java', 'typescript'],
  },
  {
    id: 'go',
    name: 'Go',
    emoji: '🐹',
    vector: { order: 0.75, control: 0.5, expression: 0.15, teamwork: 0.85, action: 0.7 },
    personalityLabel: '极简实用主义工程师',
    tagline: '少即是多，能用就行',
    memeHook: 'if err != nil { return err } ×1000',
    matchExplanation: '你讨厌不必要的复杂性，相信简单的工具才是最好的工具。你宁可多写几行平铺直叙的代码，也不愿引入华丽但难懂的抽象。',
    traits: ['讨厌复杂', '效率至上', '团队优先'],
    strengths: ['编译极快', '并发原生支持', '部署简单'],
    contrastPoints: ['表达力受限', '泛型来得太晚'],
    rivals: ['rust', 'java'],
  },
  {
    id: 'rust',
    name: 'Rust',
    emoji: '🦀',
    vector: { order: 0.95, control: 0.9, expression: 0.5, teamwork: 0.6, action: 0.2 },
    personalityLabel: '安全偏执狂',
    tagline: '编译器是你最好的朋友（和最严厉的老师）',
    memeHook: '和借用检查器斗争的第 N 天',
    matchExplanation: '你对正确性有极高的追求，愿意在前期投入大量时间来换取后期的零隐患。你相信好的系统应该在编译时就消灭所有 bug。',
    traits: ['追求完美', '安全至上', '不妥协'],
    strengths: ['内存安全无 GC', '性能媲美 C', '错误处理优雅'],
    contrastPoints: ['学习曲线极陡', '编译时间长'],
    rivals: ['c', 'go'],
  },
  {
    id: 'swift',
    name: 'Swift',
    emoji: '🐦',
    vector: { order: 0.8, control: 0.4, expression: 0.65, teamwork: 0.7, action: 0.7 },
    personalityLabel: '苹果生态精英',
    tagline: '安全、快速、优雅，但只在苹果的花园里',
    memeHook: '写 Swift 很开心，直到 Xcode 崩溃',
    matchExplanation: '你重视用户体验和产品品质，喜欢在一个精心设计的生态中高效工作。你追求安全和表达力的平衡。',
    traits: ['品味至上', '追求体验', '规范但灵活'],
    strengths: ['类型安全', '语法现代', '与苹果生态深度整合'],
    contrastPoints: ['平台局限性', 'ABI 稳定性来得晚'],
    rivals: ['kotlin', 'typescript'],
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    emoji: '🏝️',
    vector: { order: 0.75, control: 0.3, expression: 0.7, teamwork: 0.8, action: 0.75 },
    personalityLabel: 'Java 的叛逆继承者',
    tagline: '所有 Java 想做但不敢做的，我都做了',
    memeHook: '一个 data class 顶 Java 五十行',
    matchExplanation: '你务实但拒绝墨守成规，善于在兼容旧体系的同时引入现代思路。你是团队里那个默默改善开发体验的人。',
    traits: ['务实创新者', '简洁爱好者', '兼容并包'],
    strengths: ['与 Java 完全兼容', '语法简洁现代', '空安全'],
    contrastPoints: ['编译速度偏慢', '社区相对小'],
    rivals: ['java', 'swift'],
  },
  {
    id: 'ruby',
    name: 'Ruby',
    emoji: '💎',
    vector: { order: 0.2, control: 0.2, expression: 0.9, teamwork: 0.6, action: 0.85 },
    personalityLabel: '快乐编程哲学家',
    tagline: '为了开发者的快乐而生',
    memeHook: '万物皆对象，快乐也是',
    matchExplanation: '你相信写代码应该是一种享受，每一行都应该读起来像诗。你追求表达力和优雅，效率是快乐的副产品。',
    traits: ['追求优雅', '开发者体验第一', '表达力极强'],
    strengths: ['语法如诗', 'Rails 生态', '元编程能力'],
    contrastPoints: ['性能平平', '市场份额缩小'],
    rivals: ['python', 'elixir'],
  },
  {
    id: 'php',
    name: 'PHP',
    emoji: '🐘',
    vector: { order: 0.2, control: 0.2, expression: 0.4, teamwork: 0.65, action: 0.85 },
    personalityLabel: '打不死的 Web 老兵',
    tagline: '被嘲笑了二十年，依然驱动半个互联网',
    memeHook: '世界上最好的语言（不接受反驳）',
    matchExplanation: '你是实用主义的典范——嘲笑归嘲笑，活干完了就行。你不追求完美架构，只关心东西能不能上线。',
    traits: ['务实到极点', '皮厚心大', '快速交付'],
    strengths: ['部署极简', 'WordPress 帝国', '学习曲线平缓'],
    contrastPoints: ['历史包袱重', '设计一致性差'],
    rivals: ['python', 'javascript'],
  },
  {
    id: 'r',
    name: 'R',
    emoji: '📊',
    vector: { order: 0.4, control: 0.15, expression: 0.6, teamwork: 0.5, action: 0.7 },
    personalityLabel: '数据可视化艺术家',
    tagline: '用统计学的眼睛看世界',
    memeHook: '向量化操作 yyds，for 循环是异端',
    matchExplanation: '你用数据说话，善于从数字中发现故事。你沉迷于让图表变得既准确又漂亮，统计显著性是你的口头禅。',
    traits: ['数据驱动', '学术气质', '可视化偏执'],
    strengths: ['统计分析天花板', 'ggplot 无敌', '学术社区强大'],
    contrastPoints: ['通用编程能力弱', '语法独特'],
    rivals: ['python', 'matlab'],
  },
  {
    id: 'scala',
    name: 'Scala',
    emoji: '🔮',
    vector: { order: 0.8, control: 0.35, expression: 0.9, teamwork: 0.5, action: 0.35 },
    personalityLabel: '学术派全栈巫师',
    tagline: '函数式与面向对象的终极融合',
    memeHook: '一行 Scala 等于十行 Java，但理解需要十倍时间',
    matchExplanation: '你在理论与实践之间游刃有余，追求类型系统的极致表达力。你的代码让同事又敬又畏。',
    traits: ['理论与实践融合', '类型系统爱好者', '抽象狂'],
    strengths: ['类型系统极强', 'JVM 生态', '并发模型先进'],
    contrastPoints: ['学习曲线陡峭', '编译慢'],
    rivals: ['kotlin', 'haskell'],
  },
  {
    id: 'haskell',
    name: 'Haskell',
    emoji: '🧠',
    vector: { order: 0.95, control: 0.3, expression: 0.95, teamwork: 0.25, action: 0.15 },
    personalityLabel: '纯函数式理想主义者',
    tagline: '如果代码能证明是对的，为什么要测试？',
    memeHook: '一个 monad 就是自函子范畴上的幺半群，有什么难理解的？',
    matchExplanation: '你追求数学般的优雅与纯粹，相信好的类型系统能消灭大部分 bug。你宁愿花更多时间思考，也不愿写出有副作用的代码。',
    traits: ['追求数学般优雅', '理想主义', '纯粹到极致'],
    strengths: ['类型系统天花板', '副作用可控', '并发安全'],
    contrastPoints: ['入门极难', '生态较小', '实用性争议大'],
    rivals: ['scala', 'rust'],
  },
  {
    id: 'lua',
    name: 'Lua',
    emoji: '🌙',
    vector: { order: 0.15, control: 0.5, expression: 0.5, teamwork: 0.3, action: 0.8 },
    personalityLabel: '轻量级嵌入式精灵',
    tagline: '小到可以装进任何地方',
    memeHook: '数组从 1 开始，战斗从这里结束',
    matchExplanation: '你喜欢轻量灵活的工具，不追求大一统的框架，更享受在有限空间里发挥创意。你是那种用最小工具解决问题的人。',
    traits: ['极简主义', '灵活嵌入', '轻快'],
    strengths: ['极小的运行时', '嵌入性极强', '游戏脚本首选'],
    contrastPoints: ['标准库极小', '独立使用受限'],
    rivals: ['python', 'javascript'],
  },
  {
    id: 'dart',
    name: 'Dart',
    emoji: '🎯',
    vector: { order: 0.7, control: 0.2, expression: 0.55, teamwork: 0.75, action: 0.8 },
    personalityLabel: 'Flutter 宇宙的中心',
    tagline: '为跨端而生的现代语言',
    memeHook: 'Hot reload 一时爽，一直 hot reload 一直爽',
    matchExplanation: '你追求一套代码打天下的效率，喜欢现代且友好的语法。你相信好的框架能让语言焕发出十倍的光彩。',
    traits: ['跨端追求者', '现代主义', '框架绑定型'],
    strengths: ['Flutter 生态', '热重载极快', '语法友好'],
    contrastPoints: ['离开 Flutter 存在感低', '社区偏小'],
    rivals: ['typescript', 'kotlin'],
  },
  {
    id: 'elixir',
    name: 'Elixir',
    emoji: '💧',
    vector: { order: 0.6, control: 0.25, expression: 0.85, teamwork: 0.55, action: 0.65 },
    personalityLabel: '并发世界的诗人',
    tagline: '在 Erlang 的肩膀上写诗',
    memeHook: '让一切崩溃吧——反正 supervisor 会重启',
    matchExplanation: '你相信容错是系统的最高美德，欣赏优雅的并发模型。你用哲学的态度对待故障：让它崩溃，然后优雅地恢复。',
    traits: ['并发思维', '容错哲学', '优雅务实'],
    strengths: ['天生高并发', '容错性极强', 'Phoenix 框架'],
    contrastPoints: ['生态较小', '入门有门槛'],
    rivals: ['go', 'ruby'],
  },
  {
    id: 'sql',
    name: 'SQL',
    emoji: '🗃️',
    vector: { order: 0.85, control: 0.1, expression: 0.3, teamwork: 0.7, action: 0.6 },
    personalityLabel: '数据世界的法官',
    tagline: '你负责存，我负责查',
    memeHook: 'SELECT * FROM life WHERE meaning IS NOT NULL — 0 rows returned',
    matchExplanation: '你是声明式思维的代表，关注"要什么"而不是"怎么做"。你相信结构化的数据是一切的基石。',
    traits: ['声明式思维', '数据导向', '逻辑严谨'],
    strengths: ['数据查询无可替代', '标准化程度高', '到处都需要'],
    contrastPoints: ['不是通用编程语言', '方言太多'],
    rivals: ['r', 'python'],
  },
  {
    id: 'bash',
    name: 'Bash',
    emoji: '🐚',
    vector: { order: 0.1, control: 0.6, expression: 0.3, teamwork: 0.35, action: 0.9 },
    personalityLabel: '系统管理员の浪漫',
    tagline: '管道符号是最强的武器',
    memeHook: 'chmod 777 解决一切权限问题（千万别这样做）',
    matchExplanation: '你是行动力的化身，遇到问题第一反应是打开终端。你相信管道和组合的力量，三行脚本就能自动化一切。',
    traits: ['系统掌控者', '自动化狂热', '速战速决'],
    strengths: ['系统管理无可替代', '自动化利器', '到处都有'],
    contrastPoints: ['语法反人类', '调试困难'],
    rivals: ['python', 'go'],
  },
  {
    id: 'assembly',
    name: 'Assembly',
    emoji: '🔩',
    vector: { order: 0.4, control: 1.0, expression: 0.05, teamwork: 0.1, action: 0.1 },
    personalityLabel: '底层世界的苦行僧',
    tagline: '没有抽象，只有真相',
    memeHook: '其他语言的「高性能」是我的日常',
    matchExplanation: '你追求对机器的完全理解和掌控，不惧写出上百行只为做一件小事的代码。你看到的世界比别人低几层，但也因此比别人更接近本质。',
    traits: ['极致掌控', '硬件亲密', '不畏复杂'],
    strengths: ['性能极限', '完全掌控硬件', '理解计算本质'],
    contrastPoints: ['开发效率极低', '可读性差', '不可移植'],
    rivals: ['c', 'rust'],
  },
  {
    id: 'cobol',
    name: 'COBOL',
    emoji: '📟',
    vector: { order: 0.9, control: 0.4, expression: 0.05, teamwork: 0.6, action: 0.15 },
    personalityLabel: '金融系统的不死传说',
    tagline: '世界运转靠的是你不知道的 COBOL',
    memeHook: '比你爷爷还老，但你的工资靠它发',
    matchExplanation: '你信奉稳定和规则到了极致。你不追求花哨或创新，只关心系统能不能在未来 50 年依然正确运行。',
    traits: ['稳定至上', '传统守护者', '闷声发大财'],
    strengths: ['金融系统基石', '极度稳定', '不会失业'],
    contrastPoints: ['语法古老', '新人稀缺', '设计理念过时'],
    rivals: ['java', 'sql'],
  },
  {
    id: 'lisp',
    name: 'Lisp',
    emoji: '🌀',
    vector: { order: 0.2, control: 0.4, expression: 1.0, teamwork: 0.15, action: 0.4 },
    personalityLabel: '括号宇宙的创世神',
    tagline: '代码即数据，数据即代码',
    memeHook: '据说打开 Lisp 源码文件，右括号能掉出屏幕',
    matchExplanation: '你是独立思考者，追求语言的终极灵活性。你相信好的抽象能改变一切，不介意为此走一条人迹罕至的路。',
    traits: ['元编程大师', '哲学极客', '独立思考者'],
    strengths: ['宏系统天花板', '极致灵活', '影响了无数语言'],
    contrastPoints: ['括号噩梦', '实用项目少', '孤独的战士'],
    rivals: ['haskell', 'python'],
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    emoji: '📐',
    vector: { order: 0.5, control: 0.2, expression: 0.4, teamwork: 0.45, action: 0.65 },
    personalityLabel: '工程计算的瑞士军刀',
    tagline: '矩阵运算，信手拈来',
    memeHook: '免费？不存在的。但老板付钱所以没关系',
    matchExplanation: '你是工程导向的实用派，追求计算的准确性和效率。你选工具不看时髦不时髦，只看好不好用。',
    traits: ['工程思维', '数值计算', '学术实用'],
    strengths: ['矩阵运算天花板', '工具箱丰富', '学术界标配'],
    contrastPoints: ['商业授权贵', '通用编程能力弱', '语法老旧'],
    rivals: ['python', 'r'],
  },
]
```

- [ ] **Step 2: Verify compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/languages.ts
git commit -m "feat: add 25 language profiles"
```

---

### Task 7: Question Data

**Files:**
- Create: `src/data/questions.ts`

Each option's `scores` maps a dimension ID to a positive integer. Primary dimension gets `3`, optional secondary gets `1`.

- [ ] **Step 1: Create the 15 quiz questions**

```ts
// src/data/questions.ts
import type { Question } from '../types'

export const questions: Question[] = [
  {
    id: 'q01',
    text: '你搬进新家，第一件事是什么？',
    options: [
      { emoji: '📋', title: '制定整理计划', description: '每件家具的位置都必须有讲究', scores: { order: 3, teamwork: 1 } },
      { emoji: '🔌', title: '先把网线接好', description: '其他的慢慢来，先保证在线', scores: { action: 3, control: 1 } },
      { emoji: '🎨', title: '按心情随意摆放', description: '感觉对了就行，不需要规划', scores: { expression: 3 } },
      { emoji: '📐', title: '研究最优利用方案', description: '每个房间的面积都不该浪费', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q02',
    text: '做菜的时候，你倾向于？',
    options: [
      { emoji: '📖', title: '严格按照菜谱来', description: '比例精确到克，火候精确到秒', scores: { order: 3 } },
      { emoji: '🍳', title: '菜谱只是参考', description: '随手发挥才有灵魂', scores: { expression: 3 } },
      { emoji: '⚡', title: '做最简单的', description: '能吃就行，速度第一', scores: { action: 3 } },
      { emoji: '🔬', title: '研究食材搭配原理', description: '先搞懂美拉德反应再下锅', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q03',
    text: '朋友约你一起做一个小项目，你的第一反应是？',
    options: [
      { emoji: '📝', title: '先定好规则和分工', description: '没有计划的项目注定翻车', scores: { teamwork: 3, order: 1 } },
      { emoji: '🚀', title: '先做个原型看看', description: '聊再多不如动手试试', scores: { action: 3 } },
      { emoji: '🔍', title: '我需要理解底层逻辑', description: '在动手之前，先搞清楚为什么要做', scores: { control: 3 } },
      { emoji: '✨', title: '我负责让它酷起来', description: '创意和体验是我最关心的', scores: { expression: 3 } },
    ],
  },
  {
    id: 'q04',
    text: '如果代码能闻到味道，你觉得好代码应该闻起来像？',
    options: [
      { emoji: '👔', title: '刚洗完的衣服', description: '干净、整洁、一丝不苟', scores: { order: 3 } },
      { emoji: '🔧', title: '机油味', description: '精密运转的机器', scores: { control: 3 } },
      { emoji: '🌸', title: '香水', description: '优雅且有个性', scores: { expression: 3 } },
      { emoji: '☕', title: '咖啡', description: '提神且实用', scores: { action: 3 } },
    ],
  },
  {
    id: 'q05',
    text: '你在图书馆看书，有人坐在旁边大声打电话，你会？',
    options: [
      { emoji: '🎧', title: '戴上耳机继续专注', description: '解决自己的问题比改变别人容易', scores: { control: 3, action: 1 } },
      { emoji: '🤝', title: '礼貌提醒对方', description: '公共场所有公共场所的规则', scores: { teamwork: 3 } },
      { emoji: '🚶', title: '换个位置', description: '动作比生气更有效', scores: { action: 3 } },
      { emoji: '📜', title: '内心起草行为规范', description: '这个图书馆需要一份更好的规则', scores: { order: 3 } },
    ],
  },
  {
    id: 'q06',
    text: '面对一个复杂任务，你更倾向于？',
    options: [
      { emoji: '🧩', title: '拆解成小步骤', description: '把大问题变成一堆小问题', scores: { order: 3, action: 1 } },
      { emoji: '🎯', title: '找到核心问题', description: '从根本入手，不做表面工夫', scores: { control: 3 } },
      { emoji: '💡', title: '找巧妙的方式', description: '一个好的抽象可以一步到位', scores: { expression: 3 } },
      { emoji: '👥', title: '找同伴一起讨论', description: '两个脑子比一个好', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q07',
    text: '你被分配了一个不太喜欢的任务，你会？',
    options: [
      { emoji: '✅', title: '照做并建议改进', description: '完成任务是第一位的，改进是附赠的', scores: { teamwork: 3, order: 1 } },
      { emoji: '🔄', title: '用自己的方式重新定义', description: '如果必须做，就做出我的风格', scores: { expression: 3 } },
      { emoji: '⏩', title: '快速完成然后闪人', description: '别浪费时间在不重要的事上', scores: { action: 3 } },
      { emoji: '🔎', title: '研究任务的设计逻辑', description: '搞清楚为什么是这样设计的', scores: { control: 3, order: 1 } },
    ],
  },
  {
    id: 'q08',
    text: '你最受不了的队友行为是？',
    options: [
      { emoji: '🚫', title: '不遵守约定', description: '说好的规则为什么你不遵守', scores: { order: 3 } },
      { emoji: '🤷', title: '不愿深入理解问题', description: '表面解决问题迟早会翻车', scores: { control: 3 } },
      { emoji: '😑', title: '做事没有创意', description: '千篇一律的方案让人窒息', scores: { expression: 3 } },
      { emoji: '🐢', title: '效率太低拖后腿', description: '进度是会传染的', scores: { action: 3, teamwork: 1 } },
    ],
  },
  {
    id: 'q09',
    text: '你获得了一台全新电脑，第一步做什么？',
    options: [
      { emoji: '⚙️', title: '配置开发环境', description: '编译器、终端、快捷键一步到位', scores: { control: 3, order: 1 } },
      { emoji: '📁', title: '定义文件夹结构', description: '命名规范和目录层级是一切的基础', scores: { order: 3 } },
      { emoji: '🎮', title: '装几个好玩的试试', description: '新电脑当然要先玩一下', scores: { action: 3, expression: 1 } },
      { emoji: '🔗', title: '同步到团队配置', description: '和大家保持一致最重要', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q10',
    text: '如果编程语言是宠物，你想养什么样的？',
    options: [
      { emoji: '🐕‍🦺', title: '训练有素的导盲犬', description: '可靠、守规矩、值得信赖', scores: { order: 3, teamwork: 1 } },
      { emoji: '🐱', title: '独立优雅的猫', description: '不黏人，但每个动作都有美感', scores: { expression: 3, control: 1 } },
      { emoji: '🐹', title: '小巧灵活的仓鼠', description: '体型小但跑得飞快', scores: { action: 3 } },
      { emoji: '🐍', title: '冷血但精准的蛇', description: '安静、高效、目标明确', scores: { control: 3 } },
    ],
  },
  {
    id: 'q11',
    text: '你写文章（或做 PPT）时的风格是？',
    options: [
      { emoji: '📑', title: '先列大纲再填内容', description: '结构清晰是好内容的基础', scores: { order: 3 } },
      { emoji: '🌊', title: '想到哪写到哪', description: '灵感不能被框架束缚', scores: { expression: 3, action: 1 } },
      { emoji: '✏️', title: '反复打磨每一句话', description: '好作品是改出来的', scores: { control: 3, expression: 1 } },
      { emoji: '📋', title: '参考模板快速完成', description: '没必要每次都从零开始', scores: { teamwork: 3, action: 1 } },
    ],
  },
  {
    id: 'q12',
    text: '旅行时你更喜欢？',
    options: [
      { emoji: '🗺️', title: '做详细行程规划', description: '每个时间段都安排好才安心', scores: { order: 3 } },
      { emoji: '🎒', title: '有个方向就出发', description: '最好的风景往往在计划之外', scores: { action: 3 } },
      { emoji: '🏝️', title: '选小众路线', description: '人少的地方才有独特体验', scores: { expression: 3 } },
      { emoji: '👫', title: '和朋友商量着来', description: '旅行的快乐在于分享', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q13',
    text: '如果你必须教一个完全的新手做某件事，你会？',
    options: [
      { emoji: '📃', title: '给一份完整步骤清单', description: '按步骤来就不会出错', scores: { order: 3, teamwork: 1 } },
      { emoji: '🤸', title: '让他先试，遇到问题再帮', description: '自己踩坑学得最快', scores: { action: 3, expression: 1 } },
      { emoji: '🧠', title: '从原理讲起', description: '理解了为什么，才算真的会了', scores: { control: 3 } },
      { emoji: '📚', title: '推荐标准教程', description: '好的教程比我讲得好', scores: { teamwork: 3 } },
    ],
  },
  {
    id: 'q14',
    text: '你在一个魔法世界，你的咒语风格是？',
    options: [
      { emoji: '📜', title: '长咒语，每个字严格', description: '一个音节都不能错', scores: { order: 3 } },
      { emoji: '🤫', title: '默念即可生效', description: '我要直接控制魔力', scores: { control: 3 } },
      { emoji: '🎶', title: '用自创的诗歌施法', description: '魔法应该是一种艺术', scores: { expression: 3 } },
      { emoji: '🤝', title: '和同伴组合大招', description: '合体技才是最强的', scores: { teamwork: 3, action: 1 } },
    ],
  },
  {
    id: 'q15',
    text: '你发现了一个有趣的新领域，你会？',
    options: [
      { emoji: '📖', title: '找权威入门书系统学习', description: '基础打好了再动手', scores: { order: 3, control: 1 } },
      { emoji: '🛠️', title: '马上做个小项目试试', description: '实践出真知', scores: { action: 3 } },
      { emoji: '💬', title: '找社区讨论交流', description: '和同好聊聊效率更高', scores: { teamwork: 3 } },
      { emoji: '🧭', title: '用自己的方式探索', description: '走自己的路才有惊喜', scores: { expression: 3, control: 1 } },
    ],
  },
]
```

- [ ] **Step 2: Verify compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/questions.ts
git commit -m "feat: add 15 quiz questions"
```

---

### Task 8: Content Validation Tests

**Files:**
- Create: `tests/data/completeness.test.ts`
- Create: `tests/data/coverage.test.ts`

- [ ] **Step 1: Write completeness tests**

```ts
// tests/data/completeness.test.ts
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
```

- [ ] **Step 2: Write coverage tests**

```ts
// tests/data/coverage.test.ts
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
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS (scoring, matching, completeness, coverage).

- [ ] **Step 4: Commit**

```bash
git add tests/data/completeness.test.ts tests/data/coverage.test.ts
git commit -m "test: add content completeness and coverage tests"
```

---

### Task 9: App Shell, Router, and Global Styles

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Create: `src/router/index.ts`
- Modify: `src/main.ts`
- Modify: `src/App.vue`
- Modify: `index.html`

- [ ] **Step 1: Create CSS variables**

```css
/* src/styles/variables.css */
:root {
  --color-bg: #FFFBF0;
  --color-accent: #FF4757;
  --color-accent-light: rgba(255, 71, 87, 0.08);
  --color-accent-border: rgba(255, 71, 87, 0.4);
  --color-card: #FFFFFF;
  --color-text: #2D3436;
  --color-text-secondary: #636E72;
  --color-text-muted: #B2BEC3;
  --color-border: #E8E8E8;
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.05);
  --shadow-card-hover: 0 6px 24px rgba(0, 0, 0, 0.1);
  --radius-sm: 14px;
  --radius-md: 18px;
  --radius-lg: 24px;
}
```

- [ ] **Step 2: Create global styles**

```css
/* src/styles/global.css */
@import './variables.css';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

button {
  cursor: pointer;
  font: inherit;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: Create router**

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
    { path: '/intro', name: 'intro', component: () => import('../views/QuizIntroView.vue') },
    { path: '/quiz', name: 'quiz', component: () => import('../views/QuizView.vue') },
    { path: '/result', name: 'result', component: () => import('../views/ResultView.vue') },
    { path: '/explore', name: 'explore', component: () => import('../views/ExploreView.vue') },
  ],
})

export default router
```

- [ ] **Step 4: Update main.ts**

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 5: Update App.vue**

```vue
<!-- src/App.vue -->
<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>
```

- [ ] **Step 6: Create placeholder views**

Create five files (`LandingView.vue`, `QuizIntroView.vue`, `QuizView.vue`, `ResultView.vue`, `ExploreView.vue`) in `src/views/`, each with a minimal placeholder:

```vue
<!-- src/views/LandingView.vue -->
<template>
  <div class="page">Landing</div>
</template>
```

```vue
<!-- src/views/QuizIntroView.vue -->
<template>
  <div class="page">Quiz Intro</div>
</template>
```

```vue
<!-- src/views/QuizView.vue -->
<template>
  <div class="page">Quiz</div>
</template>
```

```vue
<!-- src/views/ResultView.vue -->
<template>
  <div class="page">Result</div>
</template>
```

```vue
<!-- src/views/ExploreView.vue -->
<template>
  <div class="page">Explore</div>
</template>
```

- [ ] **Step 7: Update index.html meta tags**

Replace the `<head>` contents of `index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CLTI - 你是哪种编程语言？一个有趣的编程语言人格测试" />
    <title>CLTI - 编程语言人格测试</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 8: Verify dev server with routing**

```bash
npm run dev
```

Expected: Navigate to `/`, `/intro`, `/quiz`, `/result`, `/explore` — each shows its placeholder text.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add app shell, router, and global styles"
```

---

### Task 10: Landing View

**Files:**
- Create: `src/components/landing/ScatteredCards.vue`
- Create: `src/components/landing/HeroCard.vue`
- Modify: `src/views/LandingView.vue`

- [ ] **Step 1: Create ScatteredCards component**

```vue
<!-- src/components/landing/ScatteredCards.vue -->
<script setup lang="ts">
import { languages } from '../../data/languages'

const cards = languages.map((lang, i) => ({
  emoji: lang.emoji,
  name: lang.name,
  style: {
    left: `${(i * 17 + 7) % 90}%`,
    top: `${(i * 23 + 11) % 85}%`,
    transform: `rotate(${((i * 37) % 31) - 15}deg)`,
    opacity: 0.15 + (i % 5) * 0.08,
  },
}))
</script>

<template>
  <div class="scattered">
    <div
      v-for="card in cards"
      :key="card.name"
      class="scattered-card"
      :style="card.style"
    >
      <span class="scattered-emoji">{{ card.emoji }}</span>
      <span class="scattered-name">{{ card.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.scattered {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.scattered-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  font-size: 0.85rem;
  white-space: nowrap;
  user-select: none;
}

.scattered-emoji {
  font-size: 1.2rem;
}

.scattered-name {
  color: var(--color-text-secondary);
  font-weight: 500;
}
</style>
```

- [ ] **Step 2: Create HeroCard component**

```vue
<!-- src/components/landing/HeroCard.vue -->
<script setup lang="ts">
</script>

<template>
  <div class="hero-card">
    <h1 class="hero-title">CLTI</h1>
    <p class="hero-subtitle">编程语言人格测试</p>
    <p class="hero-desc">
      如果你是一门编程语言，你会是哪一种？<br />
      15 道趣味题，揭晓属于你的语言人格。
    </p>
    <router-link to="/intro" class="hero-btn">
      开始测试 →
    </router-link>
  </div>
</template>

<style scoped>
.hero-card {
  position: relative;
  z-index: 1;
  max-width: 460px;
  width: 90%;
  margin: 0 auto;
  padding: 48px 36px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.hero-subtitle {
  margin-top: 8px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text);
}

.hero-desc {
  margin-top: 20px;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.hero-btn {
  display: inline-block;
  margin-top: 32px;
  padding: 14px 40px;
  background: var(--color-accent);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}
</style>
```

- [ ] **Step 3: Update LandingView**

```vue
<!-- src/views/LandingView.vue -->
<script setup lang="ts">
import ScatteredCards from '../components/landing/ScatteredCards.vue'
import HeroCard from '../components/landing/HeroCard.vue'
</script>

<template>
  <div class="landing">
    <ScatteredCards />
    <div class="landing-center">
      <HeroCard />
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-center {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Landing page shows scattered language cards behind a centered frosted-glass hero card with title, description, and start button.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement landing view with hero and scattered cards"
```

---

### Task 11: Quiz Intro View

**Files:**
- Modify: `src/views/QuizIntroView.vue`

- [ ] **Step 1: Implement QuizIntroView**

```vue
<!-- src/views/QuizIntroView.vue -->
<script setup lang="ts">
</script>

<template>
  <div class="intro-page">
    <div class="intro-card">
      <h2 class="intro-title">准备好了吗？</h2>
      <p class="intro-desc">接下来你将回答 15 道趣味选择题，大约需要 3-5 分钟。</p>

      <ul class="intro-points">
        <li>
          <span class="intro-icon">🎯</span>
          <div>
            <strong>五维人格模型</strong>
            <p>测试基于秩序、掌控、表达、协作、行动五个维度</p>
          </div>
        </li>
        <li>
          <span class="intro-icon">🎲</span>
          <div>
            <strong>娱乐向测试</strong>
            <p>结果有趣但不严肃，适合分享和聊天</p>
          </div>
        </li>
        <li>
          <span class="intro-icon">🖼️</span>
          <div>
            <strong>生成专属卡片</strong>
            <p>你将获得一张可截图分享的语言人格海报</p>
          </div>
        </li>
      </ul>

      <router-link to="/quiz" class="intro-btn">
        开始答题 →
      </router-link>

      <router-link to="/" class="intro-back">
        ← 返回首页
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.intro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.intro-card {
  max-width: 500px;
  width: 100%;
  padding: 40px 32px;
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.intro-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.intro-desc {
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.intro-points {
  list-style: none;
  margin-top: 28px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.intro-points li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.intro-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.intro-points li strong {
  display: block;
  font-size: 0.95rem;
}

.intro-points li p {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.intro-btn {
  display: inline-block;
  margin-top: 32px;
  padding: 14px 40px;
  background: var(--color-accent);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 50px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.intro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}

.intro-back {
  display: block;
  margin-top: 16px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.intro-back:hover {
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to `/intro`. Expected: A centered card explaining the test format, with a "开始答题" button linking to `/quiz`.

- [ ] **Step 3: Commit**

```bash
git add src/views/QuizIntroView.vue
git commit -m "feat: implement quiz intro view"
```

---

### Task 12: Quiz State Composable

**Files:**
- Create: `src/composables/useQuiz.ts`

- [ ] **Step 1: Implement the composable**

```ts
// src/composables/useQuiz.ts
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
```

- [ ] **Step 2: Verify compile**

```bash
npx vue-tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useQuiz.ts
git commit -m "feat: implement quiz state composable with localStorage"
```

---

### Task 13: Quiz View with Question Flow

**Files:**
- Create: `src/components/quiz/ProgressBar.vue`
- Create: `src/components/quiz/OptionCard.vue`
- Modify: `src/views/QuizView.vue`

- [ ] **Step 1: Create ProgressBar component**

```vue
<!-- src/components/quiz/ProgressBar.vue -->
<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()
</script>

<template>
  <div class="progress-bar">
    <div
      v-for="i in total"
      :key="i"
      class="progress-segment"
      :class="{ filled: i <= current }"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  gap: 4px;
  width: 100%;
}

.progress-segment {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  transition: background 0.3s;
}

.progress-segment.filled {
  background: var(--color-accent);
}
</style>
```

- [ ] **Step 2: Create OptionCard component**

```vue
<!-- src/components/quiz/OptionCard.vue -->
<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  description: string
  selected: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    class="option-card"
    :class="{ selected }"
    @click="$emit('select')"
  >
    <div class="option-header">
      <span class="option-emoji">{{ emoji }}</span>
      <span class="option-title">{{ title }}</span>
    </div>
    <p class="option-desc">{{ description }}</p>
  </button>
</template>

<style scoped>
.option-card {
  width: 100%;
  padding: 18px 20px;
  text-align: left;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.option-card:hover {
  border-color: var(--color-accent-border);
  box-shadow: var(--shadow-card);
}

.option-card.selected {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  box-shadow: var(--shadow-card);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-emoji {
  font-size: 1.3rem;
}

.option-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.option-desc {
  margin-top: 8px;
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
```

- [ ] **Step 3: Implement QuizView**

```vue
<!-- src/views/QuizView.vue -->
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
  selectedOption,
  totalQuestions,
  restore,
  selectOption,
  nextQuestion,
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

      <button
        class="quiz-next"
        :disabled="selectedOption === undefined"
        @click="handleNext"
      >
        {{ isLastQuestion ? '查看结果 →' : '下一题 →' }}
      </button>
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

.quiz-next {
  display: block;
  width: 100%;
  margin-top: 28px;
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
</style>
```

- [ ] **Step 4: Verify quiz flow in browser**

```bash
npm run dev
```

Navigate `/` → `/intro` → `/quiz`. Expected: Progress bar, question text, 2×2 option grid, next button that activates after selection. Complete all 15 questions and land on `/result` (placeholder).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement quiz view with question flow"
```

---

### Task 14: Result View, Radar Chart, and Poster Card

**Files:**
- Create: `src/components/result/RadarChart.vue`
- Create: `src/components/result/LanguageMiniCard.vue`
- Create: `src/components/result/ResultPoster.vue`
- Modify: `src/views/ResultView.vue`

- [ ] **Step 1: Create RadarChart SVG component**

```vue
<!-- src/components/result/RadarChart.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { DIMENSIONS } from '../../data/dimensions'

const props = defineProps<{
  scores: Record<string, number>
}>()

const size = 240
const cx = size / 2
const cy = size / 2
const radius = 90
const labelRadius = radius + 24

const angles = DIMENSIONS.map((_, i) =>
  (Math.PI * 2 * i) / DIMENSIONS.length - Math.PI / 2
)

function toXY(angle: number, r: number): string {
  return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
}

const gridLevels = [0.25, 0.5, 0.75, 1.0]

const gridPolygons = computed(() =>
  gridLevels.map(level =>
    angles.map(a => toXY(a, radius * level)).join(' ')
  )
)

const axisLines = computed(() =>
  angles.map(a => ({ x2: cx + radius * Math.cos(a), y2: cy + radius * Math.sin(a) }))
)

const dataPolygon = computed(() =>
  DIMENSIONS.map((dim, i) => {
    const v = props.scores[dim.id] ?? 0
    return toXY(angles[i], radius * v)
  }).join(' ')
)

const labels = computed(() =>
  DIMENSIONS.map((dim, i) => ({
    x: cx + labelRadius * Math.cos(angles[i]),
    y: cy + labelRadius * Math.sin(angles[i]),
    text: dim.publicName,
    anchor: Math.abs(Math.cos(angles[i])) < 0.01 ? 'middle'
      : Math.cos(angles[i]) > 0 ? 'start' : 'end',
  }))
)
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="radar-chart">
    <!-- Grid -->
    <polygon
      v-for="(pts, i) in gridPolygons"
      :key="i"
      :points="pts"
      fill="none"
      stroke="#E8E8E8"
      stroke-width="1"
    />
    <!-- Axes -->
    <line
      v-for="(line, i) in axisLines"
      :key="'a' + i"
      :x1="cx" :y1="cy"
      :x2="line.x2" :y2="line.y2"
      stroke="#E8E8E8"
      stroke-width="1"
    />
    <!-- Data polygon -->
    <polygon
      :points="dataPolygon"
      fill="rgba(255, 71, 87, 0.15)"
      stroke="#FF4757"
      stroke-width="2.5"
    />
    <!-- Data dots -->
    <circle
      v-for="(dim, i) in DIMENSIONS"
      :key="'d' + i"
      :cx="cx + radius * (props.scores[dim.id] ?? 0) * Math.cos(angles[i])"
      :cy="cy + radius * (props.scores[dim.id] ?? 0) * Math.sin(angles[i])"
      r="4"
      fill="#FF4757"
    />
    <!-- Labels -->
    <text
      v-for="(label, i) in labels"
      :key="'l' + i"
      :x="label.x"
      :y="label.y"
      :text-anchor="label.anchor"
      dominant-baseline="central"
      font-size="12"
      fill="#636E72"
    >
      {{ label.text }}
    </text>
  </svg>
</template>

<style scoped>
.radar-chart {
  width: 100%;
  max-width: 260px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
```

- [ ] **Step 2: Create LanguageMiniCard component**

```vue
<!-- src/components/result/LanguageMiniCard.vue -->
<script setup lang="ts">
import type { LanguageProfile } from '../../types'

defineProps<{
  language: LanguageProfile
  label: string
}>()
</script>

<template>
  <div class="mini-card">
    <p class="mini-label">{{ label }}</p>
    <div class="mini-body">
      <span class="mini-emoji">{{ language.emoji }}</span>
      <div>
        <p class="mini-name">{{ language.name }}</p>
        <p class="mini-tag">{{ language.personalityLabel }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-card {
  flex: 1;
  padding: 16px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
}

.mini-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mini-body {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-emoji {
  font-size: 1.8rem;
}

.mini-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.mini-tag {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 3: Create ResultPoster component**

```vue
<!-- src/components/result/ResultPoster.vue -->
<script setup lang="ts">
import type { MatchResult } from '../../types'
import RadarChart from './RadarChart.vue'
import LanguageMiniCard from './LanguageMiniCard.vue'

defineProps<{
  result: MatchResult
}>()
</script>

<template>
  <div class="poster" id="clti-poster">
    <!-- Identity block -->
    <div class="poster-identity">
      <span class="poster-emoji">{{ result.language.emoji }}</span>
      <h1 class="poster-lang-name">{{ result.language.name }}</h1>
      <span class="poster-label-badge">{{ result.language.personalityLabel }}</span>
    </div>

    <!-- Meme hook -->
    <p class="poster-meme">「{{ result.language.memeHook }}」</p>

    <!-- Radar chart -->
    <div class="poster-section">
      <h3 class="poster-section-title">你的五维画像</h3>
      <div class="poster-chart-card">
        <RadarChart :scores="result.scores" />
      </div>
    </div>

    <!-- Match explanation -->
    <div class="poster-section">
      <h3 class="poster-section-title">为什么是你</h3>
      <div class="poster-text-card">
        <p>{{ result.language.matchExplanation }}</p>
      </div>
    </div>

    <!-- Traits + Strengths -->
    <div class="poster-section">
      <h3 class="poster-section-title">人格特征</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="t in result.language.traits" :key="t" class="poster-tag trait">{{ t }}</span>
        </div>
      </div>
    </div>

    <div class="poster-section">
      <h3 class="poster-section-title">核心优势</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="s in result.language.strengths" :key="s" class="poster-tag strength">{{ s }}</span>
        </div>
      </div>
    </div>

    <div class="poster-section">
      <h3 class="poster-section-title">反差面</h3>
      <div class="poster-text-card">
        <div class="poster-tags">
          <span v-for="c in result.language.contrastPoints" :key="c" class="poster-tag contrast">{{ c }}</span>
        </div>
      </div>
    </div>

    <!-- Secondary matches -->
    <div class="poster-section">
      <h3 class="poster-section-title">与你有关的语言</h3>
      <div class="poster-minis">
        <LanguageMiniCard :language="result.closestAlternative" label="最相似" />
        <LanguageMiniCard :language="result.mostDistant" label="最不像" />
      </div>
    </div>

    <!-- Branding -->
    <div class="poster-branding">
      <p>CLTI · 编程语言人格测试</p>
    </div>
  </div>
</template>

<style scoped>
.poster {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 28px 28px;
  background: linear-gradient(180deg, #FFF5F5 0%, #FFFBF0 50%, #F0F9FF 100%);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
}

.poster-identity {
  text-align: center;
}

.poster-emoji {
  font-size: 4rem;
  display: block;
}

.poster-lang-name {
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 800;
}

.poster-label-badge {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border: 1px solid var(--color-accent-border);
  border-radius: 50px;
}

.poster-meme {
  margin-top: 20px;
  text-align: center;
  font-style: italic;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.poster-section {
  margin-top: 24px;
}

.poster-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.poster-chart-card,
.poster-text-card {
  padding: 20px;
  background: var(--color-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
}

.poster-text-card p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.poster-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.poster-tag {
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.poster-tag.trait {
  background: #FFF0F0;
  color: #E74C3C;
}

.poster-tag.strength {
  background: #F0FFF4;
  color: #27AE60;
}

.poster-tag.contrast {
  background: #FFF8E1;
  color: #F39C12;
}

.poster-minis {
  display: flex;
  gap: 12px;
}

.poster-branding {
  margin-top: 28px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 4: Implement ResultView**

```vue
<!-- src/views/ResultView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuiz } from '../composables/useQuiz'
import ResultPoster from '../components/result/ResultPoster.vue'
import type { MatchResult } from '../types'

const router = useRouter()
const { getResult, reset, restore } = useQuiz()
const result = ref<MatchResult | null>(null)

onMounted(() => {
  restore()
  result.value = getResult()
  if (!result.value) {
    router.replace('/')
  }
})

async function savePoster() {
  const el = document.getElementById('clti-poster')
  if (!el) return
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(el, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  })
  const link = document.createElement('a')
  link.download = `clti-${result.value?.language.id ?? 'result'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function retake() {
  reset()
  router.push('/')
}
</script>

<template>
  <div class="result-page" v-if="result">
    <ResultPoster :result="result" />

    <div class="result-actions">
      <button class="action-btn primary" @click="savePoster">
        📸 保存海报
      </button>
      <button class="action-btn secondary" @click="retake">
        🔄 重新测试
      </button>
      <router-link to="/explore" class="action-btn secondary">
        🌐 查看全部语言
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-actions {
  margin-top: 24px;
  max-width: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  text-align: center;
  transition: transform 0.15s, box-shadow 0.15s;
}

.action-btn.primary {
  background: var(--color-accent);
  color: #fff;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.3);
}

.action-btn.secondary {
  background: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: var(--color-accent-border);
  box-shadow: var(--shadow-card);
}
</style>
```

- [ ] **Step 5: Verify full flow in browser**

```bash
npm run dev
```

Complete the quiz end-to-end: `/` → `/intro` → `/quiz` (answer all 15) → `/result`. Expected: Result poster shows language emoji, name, personality badge, meme hook, radar chart, match explanation, tags, secondary matches, branding, and action buttons.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement result view with poster card and radar chart"
```

---

### Task 15: Post-Result Exploration

**Files:**
- Modify: `src/views/ExploreView.vue`

- [ ] **Step 1: Implement ExploreView**

```vue
<!-- src/views/ExploreView.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import { languages } from '../data/languages'
import type { LanguageProfile, MatchResult } from '../types'

const { getResult, restore, reset } = useQuiz()
const result = ref<MatchResult | null>(null)

onMounted(() => {
  restore()
  result.value = getResult()
})

const selected = ref<LanguageProfile | null>(null)

function selectLang(lang: LanguageProfile) {
  selected.value = selected.value?.id === lang.id ? null : lang
}

function cardClass(lang: LanguageProfile) {
  if (!result.value) return ''
  if (lang.id === result.value.language.id) return 'highlight-match'
  if (lang.id === result.value.mostDistant.id) return 'highlight-distant'
  return ''
}
</script>

<template>
  <div class="explore-page">
    <div class="explore-header">
      <h1 class="explore-title">全部语言图鉴</h1>
      <p class="explore-desc" v-if="result">
        你的结果是 <strong>{{ result.language.emoji }} {{ result.language.name }}</strong>
      </p>
      <div class="explore-nav">
        <router-link to="/result" class="nav-link" v-if="result">← 返回结果</router-link>
        <router-link to="/" class="nav-link">🏠 首页</router-link>
      </div>
    </div>

    <div class="lang-grid">
      <button
        v-for="lang in languages"
        :key="lang.id"
        class="lang-card"
        :class="[cardClass(lang), { expanded: selected?.id === lang.id }]"
        @click="selectLang(lang)"
      >
        <div class="lang-card-header">
          <span class="lang-emoji">{{ lang.emoji }}</span>
          <div>
            <p class="lang-name">{{ lang.name }}</p>
            <p class="lang-label">{{ lang.personalityLabel }}</p>
          </div>
        </div>
        <div class="lang-detail" v-if="selected?.id === lang.id">
          <p class="lang-tagline">{{ lang.tagline }}</p>
          <p class="lang-meme">「{{ lang.memeHook }}」</p>
          <div class="lang-tags">
            <span v-for="t in lang.traits" :key="t" class="lang-tag">{{ t }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.explore-page {
  max-width: 740px;
  margin: 0 auto;
  padding: 32px 16px;
}

.explore-header {
  text-align: center;
  margin-bottom: 28px;
}

.explore-title {
  font-size: 1.6rem;
  font-weight: 800;
}

.explore-desc {
  margin-top: 8px;
  color: var(--color-text-secondary);
}

.explore-nav {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.nav-link {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.nav-link:hover {
  color: var(--color-accent);
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.lang-card {
  width: 100%;
  padding: 16px;
  text-align: left;
  background: var(--color-card);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.lang-card:hover {
  box-shadow: var(--shadow-card);
}

.lang-card.highlight-match {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.lang-card.highlight-distant {
  border-color: #B2BEC3;
  background: #F8F9FA;
}

.lang-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang-emoji {
  font-size: 1.6rem;
}

.lang-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.lang-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.lang-detail {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.lang-tagline {
  font-size: 0.85rem;
  color: var(--color-text);
  font-weight: 500;
}

.lang-meme {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.lang-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.lang-tag {
  padding: 3px 10px;
  font-size: 0.75rem;
  background: #F0F0F0;
  border-radius: 50px;
  color: var(--color-text-secondary);
}
</style>
```

- [ ] **Step 2: Verify in browser**

Navigate to `/explore` after completing a quiz. Expected: Grid of 25 language cards; user's match highlighted in red, most distant in grey. Click a card to expand its detail panel.

- [ ] **Step 3: Commit**

```bash
git add src/views/ExploreView.vue
git commit -m "feat: implement post-result exploration view"
```

---

### Task 16: Mobile Polish and Final Touch

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/result/ResultPoster.vue`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Add mobile responsive tweaks to global.css**

Append to `src/styles/global.css`:

```css
@media (max-width: 480px) {
  body {
    font-size: 15px;
  }
}

/* Smooth transitions between views */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
```

- [ ] **Step 2: Add router navigation guards**

Replace `src/router/index.ts` with:

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
    { path: '/intro', name: 'intro', component: () => import('../views/QuizIntroView.vue') },
    { path: '/quiz', name: 'quiz', component: () => import('../views/QuizView.vue') },
    { path: '/result', name: 'result', component: () => import('../views/ResultView.vue') },
    { path: '/explore', name: 'explore', component: () => import('../views/ExploreView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
```

- [ ] **Step 3: Ensure poster is screenshot-friendly**

In `src/components/result/ResultPoster.vue`, verify the `.poster` class already has sufficient padding and background. Append this rule to the `<style>` block:

```css
@media (max-width: 480px) {
  .poster {
    padding: 28px 20px 20px;
    border-radius: var(--radius-md);
  }

  .poster-emoji {
    font-size: 3rem;
  }

  .poster-lang-name {
    font-size: 1.6rem;
  }

  .poster-minis {
    flex-direction: column;
  }
}
```

- [ ] **Step 4: Run all tests one final time**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 5: Verify full flow end-to-end**

```bash
npm run dev
```

Walk through: `/` (landing → scattered cards, hero) → `/intro` (explanation) → `/quiz` (15 questions, progress bar, option selection) → `/result` (poster card, radar chart, actions) → `/explore` (language grid). Refresh during quiz, verify state restores.

- [ ] **Step 6: Verify production build**

```bash
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add mobile polish, router guards, and production build verification"
```

---

### Task 17: GitHub Pages Deployment

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/router/index.ts`
- Modify: `README.md`
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Update the Vite base path for production builds**

Replace `vite.config.ts` with:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? './' : '/',
  plugins: [vue()],
  test: {
    include: ['tests/**/*.test.ts'],
  },
}))
```

- [ ] **Step 2: Switch router history mode for GitHub Pages compatibility**

Replace `src/router/index.ts` with:

```ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
    { path: '/intro', name: 'intro', component: () => import('../views/QuizIntroView.vue') },
    { path: '/quiz', name: 'quiz', component: () => import('../views/QuizView.vue') },
    { path: '/result', name: 'result', component: () => import('../views/ResultView.vue') },
    { path: '/explore', name: 'explore', component: () => import('../views/ExploreView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
```

- [ ] **Step 3: Create the GitHub Pages workflow**

Create `.github/workflows/deploy-pages.yml` with:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Document the repository setting required by GitHub Pages**

Replace `README.md` with:

```md
# Coding Language Type Indicator

CLTI is a Vue 3 + TypeScript quiz app that matches users to a programming language persona and renders a shareable result poster.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Production builds use relative asset URLs, so the same artifact works on a GitHub Pages repository subpath and on a custom domain root.

## GitHub Pages Deployment

This repository includes a workflow at `.github/workflows/deploy-pages.yml` that deploys the Vite `dist/` output to GitHub Pages.

Required repository setting:

1. Open GitHub repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.

After that, every push to `master` will build and publish the site.
```

- [ ] **Step 5: Verify the production build uses the repository subpath**

Run: `npm run build`
Expected: Build succeeds and generated asset URLs in `dist/index.html` use relative `./assets/...` paths.

- [ ] **Step 6: Verify the test suite still passes**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts src/router/index.ts README.md .github/workflows/deploy-pages.yml
git commit -m "chore: add GitHub Pages deployment workflow"
```

---

## Self-Review Checklist

| Spec Section | Covered By |
|---|---|
| 5.1 Landing | Task 10 |
| 5.2 Quiz Intro | Task 11 |
| 5.3 Question Flow (one-at-a-time, 12-16 Qs) | Task 13 (15 questions) |
| 5.4 Result Reveal (single language, shareable poster) | Task 14 |
| 5.5 Post-Result Exploration | Task 15 |
| 6 Result Model (5-dim vector, 25 languages, tie-break) | Tasks 4, 5, 6 |
| 7 Dimension System (5 dims, gradient scoring) | Task 3 |
| 7.2 Language Profiles (all fields) | Task 6 |
| 8 Question Design (scenario + work-style + absurd) | Task 7 |
| 9 Result Page Structure (reveal → title → 梗句 → radar → explanation → traits → rivals → share) | Task 14 |
| 10.1 Color Palette | Task 9 (variables.css) |
| 10.2 Landing Layout (glass hero + scattered cards) | Task 10 |
| 10.3 Quiz Card Style (2×2 grid, accent selected, progress bar) | Task 13 |
| 10.4 Result Layout (gradient poster card, radar, minis, branding) | Task 14 |
| 11 Frontend Architecture (page/content/engine/presentation layers) | File Structure |
| 12 Data Flow (local, in-memory → engine → result) | Task 12 |
| 13 Error Handling (refresh restore, missing fields, mobile-first) | Tasks 12, 8, 16 |
| 14 Testing Strategy (scoring, coverage, completeness) | Tasks 4, 5, 8 |
| 15 Scope Boundaries | All tasks stay within v1 scope |
