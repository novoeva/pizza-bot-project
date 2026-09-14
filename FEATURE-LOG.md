# Feature log — per-game tracker

The living to-do list for every game: features to build, fixes, content and
copy work, and open ideas. One section per game.

**This is the general tracker.** For the history of the one-time GameStage
layout migration specifically, see [`LAYOUT-MIGRATION.md`](LAYOUT-MIGRATION.md)
— that file stays scoped to that migration and is not updated here.

**Update this file whenever a game's open items change.** Check items off in
place; don't delete them (a struck-through done item is a useful record). Add
new games as a new section and a new row.

Status legend: ✅ done · 🔄 in progress · ⬜ to do · ⏸ deferred

## At a glance

| # | Game | Overall | Open items |
|---|------|---------|-----------|
| 1 | [token](#1-token) | ⏸ deferred | Role rework, then layout |
| 2 | [context-window](#2-context-window) | ⏸ deferred | Role rework, then layout |
| 3 | [hallucination](#3-hallucination) | 🔄 in progress | Role/content rework |
| 4 | [prompt](#4-prompt) | ✅ done | — |
| 5 | [agent](#5-agent) | ✅ done | — |
| 6 | [tool-use](#6-tool-use) | ✅ done | — |
| 7 | [skill](#7-skill) | ✅ done | — |
| 8 | [memory](#8-memory) | ⬜ to do | Layout migration |
| 9 | [mcp](#9-mcp) | 🔄 in progress | Full game rewrite, then layout |
| 10 | [guardrails](#10-guardrails) | ✅ done | — |
| 11 | [temperature](#11-temperature) | ✅ done | — (pilot/reference) |
| 12 | [rag](#12-rag) | 🔄 in progress | Wire into BotCanvas |

---

## 1. token
`src/games/token/`

- ⏸ Deferred: role/game rework (one of the 4 "misfit" games that don't yet fit
  the constant owner-sets-up-the-bot role).
- ⬜ Apply the GameStage layout pattern **after** the rework.
- ✅ PIZZA-31: the prediction beat predicts a token, not a word. The bot writes
  "pepperoni" with the pieces beat 1 chopped it into (pep | per | on | i); each
  round stops mid-word, and the pieces snap together after the pick.

## 2. context-window
`src/games/context-window/`

- ⏸ Deferred: role/game rework (misfit game).
- ⬜ Apply the GameStage layout pattern **after** the rework.

## 3. hallucination
`src/games/hallucination/`

- ✅ GameStage layout applied during the layout pilot.
- 🔄 Role/content rework tracked separately (misfit game — kept from the
  prototype but role needs to match the owner-sets-up-the-bot frame).

## 4. prompt
`src/games/prompt/`

- ✅ Layout + visual-archetype reference implementation. No open items.

## 5. agent
`src/games/agent/`

- ✅ Multi-phase flow, layout + archetypes done. No open items.

## 6. tool-use
`src/games/tool-use/`

- ✅ Layout + archetypes done. No open items.

## 7. skill
`src/games/skill/`

- ✅ Layout + archetypes done. No open items.

## 8. memory
`src/games/memory/`

- ⬜ Apply the GameStage layout pattern (2-col, per-phase instruction). Only
  clean game not yet migrated.

## 9. mcp
`src/games/mcp/`

- 🔄 Full game rewrite in progress (misfit game).
- ⬜ Apply the GameStage layout pattern **after** the rewrite.

## 10. guardrails
`src/games/guardrails/`

- ✅ Layout + archetypes + owner-framing fixes done. No open items.

## 11. temperature
`src/games/temperature/`

- ✅ Pilot / reference implementation for the layout and archetype system.
  No open items.

## 12. rag
`src/games/rag/`

- 🔄 New game #12 ("you are the search / recipe binder"), built to the
  clean-game pattern.
- ⬜ Wire into `BotCanvas` — it currently hardcodes 11 games and has no `rag`
  part.
