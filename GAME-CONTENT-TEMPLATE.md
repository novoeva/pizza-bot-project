# Game content template

The standard structure every game follows, before and after the playable part.
This is the reference the content rollout is measured against. It governs copy
and layout only; each game's mechanic stays its own.

## Before the game — the intro card

Rendered by the shared `components/GameIntro.jsx`. Four blocks, fixed order:

0. **Term N of M.** The same count the landing page promises; read from the
   term list, never typed.
1. **Term name.**
2. **`definition`**, labelled "What it is". Said up front (Phase 4: spoil it),
   applied during the game, repeated at the end. It must not hint at any
   answer the game asks for (Token: no example word, no count).
3. **`whyYouCare`**, labelled "Why you care". One sentence, the reason to
   learn the term, the same sentence as on the Workshop card. On screen before
   the game starts (interview #3, Nina).
4. **`role`**, labelled "Your role". Two short sentences: "You're the owner.
   This game shows you ..." in everyday words, no jargon.

All four live in `content/terms.json`, so intros are data-driven and copy
edits never touch components.

Games with multiple beats may keep their own per-beat instruction lines mid-game.
Those are fine — they are game instructions, not the payoff definition. Only the
opening intro is standardized.

## After the game — the reveal

Three balanced boxes, each its own card:

1. **What it means** — the definition (`term.definition`). Shown **once**. No
   other block on the screen may restate it.
2. **Why you care** — retired as a reveal box. `term.whyYouCare` holds the
   one-sentence reason to play and is shown twice before play: on the term's
   card in the workshop and in the intro card. Do not render it in the reveal.
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
