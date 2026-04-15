# CLTI Design Spec

Date: 2026-04-15
Topic: Coding Language Type Indicator (CLTI)
Status: Approved for planning

## 1. Project Summary

CLTI is a pure frontend Vue project that turns programming languages into a playful personality test. The product should feel closer to a high-quality interactive meme experience than a serious psychological instrument. Users answer a short sequence of questions and receive a single programming language result with a strong, shareable personality card.

The project is intentionally entertainment-first. It should be fun in its writing, presentation, and interaction design. The product should not present itself as scientifically rigorous. Instead, it should clearly frame itself as a humorous, personality-driven coding language test.

## 2. Product Goals

The first release should balance four goals evenly:

1. The test should be fun to take.
2. The UI should feel polished and visually memorable.
3. The result should be easy to screenshot and share.
4. The language roster should feel broad enough to suggest a real universe rather than a tiny joke page.

Because all four goals are equally important, the design should avoid optimizing too hard for only one dimension. The result is a product that uses a strong quiz backbone, with selected worldbuilding and selected theatrical presentation layered on top.

## 3. Target Audience

The core audience is a mix of:

1. General internet users who enjoy interactive tests and personality content.
2. Social-sharing contexts where the result page needs to spread well in chats or on social platforms.

This means the writing must not depend on dense technical jargon. Developers should notice the jokes, but non-developers should still understand the personality framing and enjoy the experience.

## 4. Product Shape

The chosen direction is:

`A language personality test product as the main structure, with a small amount of archive-style worldbuilding and a small amount of ritual-like reveal energy mixed in.`

The product should therefore be built around a fast, clear test flow, while borrowing only the most useful parts of the other two concepts:

1. From the archive concept: lightweight post-result exploration.
2. From the ritual concept: stronger framing and reveal language.

The product should not become a content-heavy encyclopedia in v1, and it should not depend on expensive narrative animation to work.

## 5. Core User Flow

The application should be structured as a single experience with five distinct stages:

### 5.1 Landing

The landing view should immediately explain what the product is and why it is worth trying. The message should be short, bold, and playful. The page should establish that this is a coding language personality test, not a serious assessment tool.

### 5.2 Quiz Intro

The intro view should set expectations before the user starts:

1. The test takes about 3 to 5 minutes.
2. The result is based on five dimensions.
3. The output is playful and interpretive rather than scientific.

### 5.3 Question Flow

The question experience should use a one-question-at-a-time card flow. It should feel fast and decisive rather than like filling in a form. Total question count should target 12 to 16 questions, with an upper bound of 20.

### 5.4 Result Reveal

The result page is the main event. It should reveal one final programming language result, not a list of equal matches. The first screen of the result page must be visually strong enough to function as a shareable poster.

### 5.5 Post-Result Exploration

The product should include lightweight extension after the result, such as:

1. View a few other language profiles.
2. See what languages clash with the result.
3. Restart and take the test again.

This keeps replay value without turning the first version into a large content platform.

## 6. Result Model

The final result should be a single language identity, similar in clarity to MBTI-style output. The system should still use a richer internal scoring model behind the scenes.

The product should cover 25 programming languages in the initial design.

The recommended implementation model is not a rigid grid of 25 slots. Instead:

1. The user answers questions and builds a five-dimensional score vector.
2. Each language has its own predefined five-dimensional language vector.
3. The final result is the closest language match to the user vector.

This model is preferred because:

1. It supports exactly 25 languages without forcing fake combinations.
2. It can be extended later without redesigning the full system.
3. It produces more natural result writing because each language can have a bespoke profile.

The matching engine should include a stable tie-break rule so that the same answer set always yields the same result.

## 7. Dimension System

The dimension naming style should combine playful personification with explicit technical mapping. The public-facing name should be the personified label, followed by the technical label in parentheses.

Recommended dimensions:

1. `秩序欲（类型与规则严格性）`
2. `掌控欲（底层控制权 / 抽象层级）`
3. `表达欲（语法表现力 / 范式自由度）`
4. `团队脑（工程协作性 / 生态规范化）`
5. `行动派（反馈速度 / 原型推进效率）`

These dimensions should be treated as the stable internal backbone of the system.

### 7.1 Interpretation Rules

Each dimension should support a gradient rather than a pure binary. Questions should map to one or more dimensions with weighted scoring. The user should not see raw technical terms during the quiz. Those mappings belong in the scoring layer and in the result explanation.

### 7.2 Language Profiles

Every language in the initial 25-language roster should have:

1. A five-dimensional vector.
2. A short personality label.
3. A result tagline.
4. A meme-style hook sentence.
5. A short explanation of why the user matched it.

## 8. Question Design

The quiz should use multiple-choice questions only. Free-text input is out of scope for v1.

The recommended question mix is:

1. `Scenario questions`
   These frame technical preferences through social or situational choices.
2. `Work-style questions`
   These stay closer to coding habits without becoming too technical.
3. `Absurd joke questions`
   These appear in small numbers to increase memorability and keep the tone playful.

Questions should be understandable to non-developers, while still feeling meaningful to developers. This is a key writing constraint.

## 9. Result Page Structure

The result page should use a fixed content structure so it remains easy to author, easy to style, and easy to share.

Recommended order:

1. Main visual reveal with the language name.
2. A short personality title.
3. A `梗句` at the top of the hero area to increase humor and shareability.
4. A visual five-dimension summary.
5. A short explanation of why the match happened.
6. Behavioral traits, strengths, contrast points, and language rivalries.
7. Share and replay actions.

The first screen of the result page should be useful as a screenshot without requiring the user to scroll.

## 10. Visual Direction

The preferred visual tone is `high-quality internet meme product`, not dark hacker cliche and not sterile SaaS test UI.

Design principles:

1. Bright, bold, high-contrast visual language.
2. Strong headline treatment.
3. Fast-feeling card interactions.
4. Humor in system voice.
5. Result screen composed like a poster or character card.

The tone should feel playful and intentionally packaged, but never cheap or sloppy.

### 10.1 Color Palette

The visual style follows a bright cartoon direction with a warm, inviting palette:

1. Page background: `#FFFBF0` (warm cream).
2. Primary accent: `#FF4757` (coral red), used for selections, highlights, and CTAs.
3. Card surfaces: white with subtle shadows (`0 4px 16px rgba(0,0,0,0.05)`).
4. Text primary: `#2D3436`, text secondary: `#636E72`, text muted: `#B2BEC3`.
5. Border default: `#E8E8E8`, border radius on cards: `14px` to `24px`.
6. Overall feel: rounded corners everywhere, soft shadows, no harsh edges.

### 10.2 Landing Page Layout

The landing page uses a centered glass-morphism hero area combined with floating language cards scattered randomly across the entire background:

1. A centered hero card with frosted-glass effect contains the title, tagline, and start button.
2. Language emoji cards (e.g. 🐍 Python, 🦀 Rust) are scattered across the full page background at random positions, random rotations (-15° to +15°), and varying opacities (0.15 to 0.5).
3. The scattered cards should feel like a universe of languages floating behind the hero.
4. The layout must remain readable on mobile, with scattered cards acting as ambient decoration.

### 10.3 Quiz Card Style

The question flow uses a 2×2 grid of option cards with the following structure:

1. Each option card shows an emoji icon and title on the same line (left-aligned), with the description below.
2. Description text uses the same font size as the title (`1rem`), ensuring high readability.
3. The selected card gets a colored border (accent color) and tinted background, with a subtle shadow.
4. Unselected cards use the warm background (`#FFFBF0`) with a light border.
5. Progress is shown as a segmented bar at the top (one segment per question, filled segments in accent color).

### 10.4 Result Page Layout

The result page uses a single long poster card that doubles as the shareable screenshot:

1. The entire result is contained in one large card with a gradient background (`#FFF5F5` → `#FFFBF0` → `#F0F9FF`).
2. Card header: large language emoji, language name in bold, personality label in a colored pill badge.
3. Meme hook sentence in italic, centered below the identity block.
4. Five-dimension summary displayed as a pentagon radar chart inside a white sub-card.
5. Match explanation in a white sub-card below the radar chart.
6. Secondary matches (closest + most distant language) shown as two small side-by-side cards.
7. CLTI branding and URL at the bottom of the poster card.
8. Action buttons (save poster, retry, view full roster) sit outside the shareable area, below the poster card.

The first screen of the result page should be useful as a screenshot without requiring the user to scroll.

### 10.5 UX Tone

The quiz should feel like the user is being rapidly classified by a stylish system. Progress should feel alive. Transitions should be clean and decisive rather than slow and ornamental.

### 10.6 Writing Tone

The copy should be witty, slightly teasing, and readable by general users. It should not rely on insider-only jokes.

## 11. Frontend Architecture

This is a pure frontend Vue application. The architecture should stay simple but keep responsibilities clearly separated.

Recommended layers:

1. `Page / view layer`
   Handles landing, intro, quiz, result, and lightweight exploration views.
2. `Content data layer`
   Stores question definitions, options, language profiles, and result copy in structured data.
3. `Scoring and matching engine`
   A pure function layer that calculates dimension scores and selects the final language.
4. `Presentation and sharing layer`
   Handles result rendering, poster-like layout, replay actions, and share-oriented interactions.

The system should avoid coupling UI components directly to hardcoded question or language text.

## 12. Data Flow

The data flow should stay entirely local in v1:

1. User starts the test.
2. Each answer updates in-memory quiz state and dimension totals.
3. Completion triggers the local matching engine.
4. The engine returns the winning language and explanation inputs.
5. The result view renders from structured language profile data.

No backend is required for the first version. Persisting user accounts, analytics pipelines, or social graph features is out of scope.

## 13. Error Handling and Edge Cases

The first version should explicitly handle:

1. Page refresh or interruption during the quiz, with a decision on whether to restore local progress.
2. Missing content fields in a language profile, without crashing the result page.
3. Stable behavior when two language matches are extremely close.
4. Mobile-first readability for landing, quiz, and result screens.

The mobile requirement is especially important because result screenshots are a likely sharing path.

## 14. Testing Strategy

The project does not need enterprise-grade testing, but it does need focused verification in four places:

1. `Scoring logic tests`
   Verify score accumulation and deterministic matching.
2. `Language coverage tests`
   Verify all 25 languages are reachable and represented.
3. `Content completeness checks`
   Verify every language profile includes required fields.
4. `Manual experience review`
   Verify pacing, reveal impact, and mobile screenshot quality.

## 15. Scope Boundaries for v1

In scope:

1. A polished Vue frontend.
2. A five-dimension scoring model.
3. A 25-language result roster.
4. A playful question flow.
5. A highly shareable result page.
6. Lightweight post-result exploration.

Out of scope:

1. Backend services.
2. User accounts.
3. Persistent cloud storage.
4. Scientific personality claims.
5. A large encyclopedia-style knowledge base.
6. Heavy narrative branching.

## 16. Planning Implications

The implementation plan should be organized around a few separable workstreams:

1. App shell and page flow.
2. Content schema for questions and languages.
3. Scoring and matching engine.
4. Result page design and sharing experience.
5. Final polish and mobile adaptation.

This spec is narrow enough for a single implementation plan, while still leaving room for later expansion.

## 17. Deployment Constraints

The first release should be deployable as a static site on GitHub Pages under the repository subpath `CodingLanguageTypeIndicator`.

Deployment implications:

1. Production assets should be built with the repository subpath as the base path.
2. Client-side routing should avoid refresh-related 404 failures on GitHub Pages.
3. The repository should include a GitHub Actions workflow that builds the app and publishes the generated static files to GitHub Pages.
4. Local development should remain simple and should not require the repository subpath during normal `vite` development.