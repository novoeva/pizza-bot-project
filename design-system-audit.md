# Prompt — Design-system audit (run in a separate, context-free chat)

> Paste the block below into a fresh chat (Claude Code in this repo works best).
> It is intentionally self-contained so the audit isn't biased by other context.
> Return the resulting `COMPONENT-AUDIT.md` here when done.

---

```
You are auditing the design system / UI components of "Pizza Bot", a React +
Vite + Tailwind learning app that teaches AI concepts through 12 mini-games.
This is an AUDIT + PROPOSAL task — do NOT implement changes yet. Read-only
exploration, then a written deliverable.

## Goal
Inventory every recurring UI component across all games, judge whether its
usage is consistent and sensible, and propose a unified shared-component set +
a codified visual language.

## Context files (read these first)
- INTERVIEW-FEEDBACK.md (repo root) — usability findings; see FR-9, FR-10/16,
  FR-13, FR-17, FR-18 especially.
- GAME-DESIGN-PRINCIPLES.md (repo root) — the design rules the audit should
  serve (games follow definition → simulation → recap; fix things systemically).

## Where things live
- Games: src/games/<term>/index.jsx (12 of them)
- Shared today (thin): src/components/GameStage.jsx, GameActions.jsx, GameIntro.jsx
- Per-game local helpers (not shared): e.g. ChoiceCard + CategoryPicker in
  src/games/prompt/index.jsx (lines ~29 and ~51), Feedback in
  src/games/hallucination/index.jsx, various *Panel components.
- Color tokens: src/theme/tokens.css (CSS vars) → mapped to bg-*/text-* in
  tailwind.config.js
- Recurring inline box styles to trace: shadow-pop, border-[3px], bg-danger-bg,
  bg-success-bg, bg-muted, bg-accent-soft, bg-cheese, bg-surface

## Known problems to verify and factor in
1. Color language is overloaded — e.g. GREEN is used for customer chat bubbles,
   for instruction/container boxes (Skill part 2 "YOUR PLAYBOOK"), AND for
   result cards on the Prompt results screen (even on wrong answers). Codify what
   each color/tint/shape means and flag every conflict.
2. Selectable choices don't look clickable, and are implemented 3 different ways
   (ChoiceCard, CategoryPicker, guardrails inline <button> ~ src/games/guardrails/
   index.jsx:224). Candidate for a single shared SelectableCard.
3. The end-of-game "You just learned the term…" recap is hand-rolled per game
   (e.g. src/games/temperature/index.jsx ~line 294). Candidate for a shared
   TermReveal.

## Method
Go through ALL 12 games. For each distinct recurring visual element capture:
- Name / what it is
- Semantic role (message · choice · instruction · correct-result · wrong-result ·
  container · action · etc.)
- Where it's used (files, and note per-game variations)
- Is it consistent? Does the styling match its meaning? List inconsistencies.
- Proposed unified component (or "keep as is")

Component families already spotted (confirm and complete the list): fill-in/prompt
box, customer chat bubble, instruction card, problem/error callout, action card,
success callout, choice cards, the "YOUR ROLE" orientation box, probability/
distribution bars.

## Deliverable (write to COMPONENT-AUDIT.md at repo root)
1. Inventory table: component → semantic role → where used → consistent? →
   proposed unified component.
2. A color/visual-language dictionary: each token/tint/shape and the single
   meaning it should carry, with current conflicts called out.
3. A recommended shared-component set (names + responsibilities), explicitly
   covering SelectableCard (FR-10/16), TermReveal (FR-13), and a shared
   definition/intro panel (FR-9).
4. A phased refactor plan (what to build first, dependencies), no code yet.

Do not change component behavior or game logic. Keep the existing light/chunky
visual style. Flag anything ambiguous for review rather than guessing.
```
