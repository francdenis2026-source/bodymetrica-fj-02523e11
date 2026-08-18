---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
---

# tasteskill: Anti-Slop Frontend Skill

> Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI.
> Every rule below is **contextual**. None of it fires automatically. First read the brief, then pull only what fits.

---

## 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code or tweaking dials, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "serious B2B", "editorial", "agency-y", "glassy", "dark tech".
3. **Reference signals** - URLs they linked, screenshots they pasted, products they named, brands they're competing with.
4. **Audience** - B2B procurement panel vs. design-conscious consumer vs. recruiter scanning a portfolio. The audience picks the aesthetic, not your taste.
5. **Brand assets that already exist** - logo, color, type, photography. For redesigns, these are starting material, not optional input (see Section 11).
6. **Quiet constraints** - accessibility-first audiences, public-sector, regulated industries, trust-first commerce, kids' products. These constraints OVERRIDE aesthetic preference.

### 0.B Output a one-line "Design Read" before generating
Before any code, state in one line: **"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

### 0.C If the brief is ambiguous, ask one question, do not guess
Ask exactly **one** clarifying question - never a multi-question dump - and only when the design read genuinely diverges.

### 0.D Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. These are the LLM defaults. Reach past them deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)

* **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
* **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Use these unless the design read overrides them.

### 1.A Dial Inference (design read → dial values)
| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Dribbble / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / regulated / accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "redesign - preserve" | match existing | +1 | match existing |
| "redesign - overhaul" | +2 | +2 | match existing |

---

## 2. BRIEF → DESIGN SYSTEM MAP

Use official packages when a real design system fits the brief; otherwise use native CSS/Tailwind plus a maintained component library. One system per project.

Suggested foundations include Fluent UI, Material Web, Carbon, Polaris, Atlaskit, Primer, GOV.UK Frontend, USWDS, Bootstrap, Radix Themes, shadcn/ui, and Tailwind v4 depending on context.

---

## 3. DEFAULT ARCHITECTURE & CONVENTIONS

Unless the design read picks a real design system:

* **Framework:** React or Next.js.
* **Styling:** Tailwind v4 by default; v3 only when existing project requires it.
* **Animation:** Motion via `motion/react` for new code.
* **Fonts:** Next.js `next/font` or self-hosted `@font-face` with `font-display: swap`.
* Local state for isolated UI; global state only when needed.
* Do not use React state for continuous pointer/scroll physics; use motion values.
* Prefer one icon family: Phosphor, Hugeicons, Radix icons, or Tabler. Avoid hand-rolled SVG icons.
* Use stable mobile viewport units such as `min-h-[100dvh]` instead of `h-screen` for full-height heroes.
* Prefer CSS Grid over fragile percentage flex math.
* Verify every third-party dependency against `package.json` before importing it.

---

## 4. DESIGN ENGINEERING DIRECTIVES

### Typography
Use strong hierarchy, appropriate display sizing, restrained body width, brand-appropriate type, and avoid defaulting to Inter or random serif pairings. Do not mix unrelated type families simply for emphasis. Audit italic descenders so they do not clip.

### Color
Use a restrained palette, generally one accent color, and avoid automatic AI-purple/blue glow aesthetics unless the brief actually calls for them.

### Layout
Avoid template clichés. Build composition from the page purpose, audience, brand assets, and content hierarchy. Use asymmetry only when it strengthens the design read.

### Motion
Motion should communicate hierarchy, causality, or delight. Respect reduced-motion preferences. Avoid gratuitous looping animation and excessive scroll hijacking.

### Components
Do not ship default component-library styling unchanged. Adapt radius, spacing, typography, borders, shadows, and interaction states into one coherent system.

### Accessibility
Maintain contrast, focus visibility, keyboard operation, semantic HTML, target sizing, readable line length, and reduced-motion/transparency fallbacks where relevant.

---

## 5. REDESIGN WORKFLOW

For redesign work, audit first:
1. Identify existing brand assets and visual language.
2. Identify structural UX problems separately from aesthetic problems.
3. Preserve what already works.
4. Choose whether the redesign is evolutionary or a deliberate overhaul.
5. Apply a coherent design system rather than isolated cosmetic patches.
6. Validate responsiveness, accessibility, interaction states, and content hierarchy before shipping.

---

## 6. PRE-FLIGHT CHECK

Before considering frontend design work complete, verify:
- The result fits the actual audience and page type.
- It does not look like a generic AI template.
- Typography and spacing form a consistent hierarchy.
- Color use is intentional and contrast-safe.
- Mobile layout is stable.
- Interactive states are complete.
- Motion has purpose and respects accessibility preferences.
- Existing dependencies are verified before import.
- No unnecessary design-system mixing occurred.
- Brand assets and existing product constraints were respected.

---

Source: https://github.com/Leonxlnx/taste-skill
Installed for Body Metrica from the upstream `skills/taste-skill` skill definition.
