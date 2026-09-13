# Pizza Bot — Game Design Principles

> Durable design rules for every game in Pizza Bot. Derived from usability interviews #1 and #2.
> The full feedback list with per-item code anchors lives in [Linear, team Pizza Bot](https://linear.app/genaiacademy/team/PIZZA/all) (issues FR-1 to FR-49 and BUG tickets). Undecided product questions: [`OPEN-PRODUCT-QUESTIONS.md`](./OPEN-PRODUCT-QUESTIONS.md).

## The framework: define → practice → define again

Every game follows the same teaching arc, in this order:

**0. Make them want it** — before the game even opens, the term's card in the Workshop carries **one sentence saying why this term is worth knowing**. Not a category label, not the robot part: a reason to care.
   - From usability interview #2: *„Mě to vlastně jako nezajímá ta definice, co to je, když nechápu, jakej to má dopad na ten výsledek."* Someone landing on the Workshop has to be **convinced** the term matters before they will spend two minutes on it.
   - Owned by the term card (`src/components/TermChecklist.jsx`) + a field in `src/content/terms.json`.

**1. Define it** — present the concept as a plain-language **definition up front**, clearly labeled, **before** the player starts playing.
   - Owned by the shared intro panel (`src/components/GameIntro.jsx`).

**2. Practice it** — the hands-on exercise. Make interactive elements obviously interactive (see consistency rules below).

**3. Define it again** — restate the same definition at the end, now anchored to what just happened in the game, plus a **memorable, visual checklist** of what matters (and a short "what not to do"), **not a wall of text**. The recap looks the same in every game.
   - Owned by the shared `TermReveal` component.

> **Retired rule (2026-09-03):** the definition used to be withheld as a *payoff after play*, with `term.about` acting as a teaser. That's gone — `about` was removed from `terms.json`, and the definition is now stated up front, practiced, then restated. Repetition is the mechanism; surprise is not.

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

## Component gallery rule

The living component gallery is [`design-system/gallery.html`](./design-system/gallery.html) (open it in a browser; no build step). It renders every shared component and every recurring per-game element with the app's real tokens, plus the "Today / Proposed" pairs for open colour decisions.

- **Every new or changed shared component must be added to the gallery in the same PR.** Show each variant and state (selected, disabled, each tone) with a one-line caption saying where it is used.
- **Before adding a new visual element to a game, check the gallery first.** If a matching component exists, use it. If it almost matches, extend the component (add a prop or tone), do not fork a local copy.
- **New colours or tokens go into the gallery's token row** with the one meaning they carry (see the dictionary in [`COMPONENT-AUDIT.md`](./COMPONENT-AUDIT.md), section 2).
- A component that is not in the gallery is not finished.

## Copy rules

- Avoid unexplained jargon; make sure short button labels can't be misread (e.g. "Log it" was read as the nonsense word "logit").
- Write for a non-native English reader; keep it plain and reassuring.
