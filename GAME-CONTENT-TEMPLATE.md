# Game content template

The standard structure every game follows, before and after the playable part.
This is the reference the content rollout is measured against. It governs copy
and layout only; each game's mechanic stays its own.

## Before the game — the intro card

Rendered by the shared `components/GameIntro.jsx`. Three parts, fixed order:

1. **Term name.**
2. **`about`** — one line that orients the player on what the term is about.
   - Written as a **declarative statement, never a question**.
   - Frames the idea to spark interest **without giving away the answer**. The
     full definition stays the payoff, shown after play.
   - Example (context window): "A bot can only keep so much of a conversation in
     mind at once."
3. **`howToPlay`** — a clearly labeled "How to play" block with the game
   instruction. One or two short sentences.

`about` and `howToPlay` live in `content/terms.json` next to `definition` and
`whyYouCare`, so intros are data-driven and copy edits never touch components.

Games with multiple beats may keep their own per-beat instruction lines mid-game.
Those are fine — they are game instructions, not the payoff definition. Only the
opening intro is standardized.

## After the game — the reveal

Three balanced boxes, each its own card:

1. **What it means** — the definition (`term.definition`). Shown **once**. No
   other block on the screen may restate it.
2. **Why you care** — `term.whyYouCare`, in its own box (not crammed under the
   definition).
3. **Real talk** — optional. Only when a game needs an honest caveat (e.g.
   context window: "we shrank the scale for the demo"). Most games have only the
   first two boxes.

## Cross-cutting rules

- **No double explaining.** Delete any recap block that restates the definition.
  If a game teaches a second idea live (e.g. token's next-token prediction), let
  the beat carry it; do not re-summarize it as prose in the reveal.
- **No em-dashes.** Anywhere — copy or code comments. Use commas, colons,
  parentheses, or separate sentences.
- **Respect term boundaries.** A game teaches its own term and does not drift
  into another's territory. Context window is one conversation; memory is across
  conversations; etc.
- **Bridges are explicit.** Where two terms naturally touch, make it a labeled
  handoff ("Where this hands off") that points at the other term on purpose,
  instead of quietly teaching the wrong one.

## Rollout status

- [x] token (reference implementation)
- [x] context-window (reference implementation, plus Real talk box and Memory bridge)
- [x] hallucination
- [x] prompt
- [x] agent
- [x] tool-use
- [x] skill
- [x] memory (plus Real talk box: the localStorage meta-example)
- [x] mcp
- [x] guardrails

All 10 games now use the shared `GameIntro` and the split-box reveal. Every
`about` line is a declarative statement. Em-dashes have been removed from all
source files (games, components, screens, content, CSS).
