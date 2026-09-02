# Pizza Bot — Game Design Principles

> Durable design rules for every game in Pizza Bot. Derived from usability interview #1.
> For the full feedback list with per-item code anchors, see [`INTERVIEW-FEEDBACK.md`](./INTERVIEW-FEEDBACK.md).

## The framework: every game has three steps

Each game must follow the same teaching arc, in this order:

1. **Explain what we're teaching** — present the concept as a *definition* up front, clearly labeled, **before** the player starts playing.
   - Respect the existing intent: `term.about` (in `src/content/terms.json`) is deliberately a **teaser**, and the full `term.definition` is the **payoff shown after play**. So the intro should read as *"what you'll learn"*, not a full spoiler of the definition.
   - Owned by the shared intro panel (`src/components/GameIntro.jsx`).
2. **Simulation** — the actual hands-on exercise. Make interactive elements obviously interactive (see consistency rules below).
3. **Recap at the end** — restate the concrete definition and give a **memorable, visual checklist** of what matters (optionally a short "what not to do"), **not a wall of text**. The recap must look the same in every game.

## Consistency rules (fix systemically, not per game)

Interview #1's three strongest findings were each one of the three steps above failing **the same way across multiple games**. Solve them as shared components:

- **Selectable choices must look clickable** — hover + selected states, a radio/checkbox affordance, and "pick one" microcopy. Today this is duplicated three ways (`ChoiceCard`, `CategoryPicker`, inline `<button>`s). Extract one shared `SelectableCard`.
- **One shared recap screen** — a single `TermReveal` component (definition + checklist), used by all games, instead of a hand-rolled reveal block per game.
- **One shared "definition" intro panel** — consistent framing of step 1 across games.

## Visual language must be codified

Colors currently carry conflicting meanings — e.g. **green** is used for customer chat bubbles, for instruction/container boxes, *and* for result cards (even on wrong answers). Before/while building the shared components:

- Write down what each color / tint / shape means (message vs. choice vs. instruction vs. correct/incorrect result) and apply it consistently.
- Tokens live in `src/theme/tokens.css` and map to Tailwind classes in `tailwind.config.js`.
- Run a full component audit first (what each component is, where it's used, whether it makes sense, then unify).

## Copy rules

- Avoid unexplained jargon; make sure short button labels can't be misread (e.g. "Log it" was read as the nonsense word "logit").
- Write for a non-native English reader; keep it plain and reassuring.
