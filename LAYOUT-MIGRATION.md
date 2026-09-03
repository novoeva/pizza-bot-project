# GameStage layout migration — tracker

Tracks which games have been moved to the finalized desktop layout pattern
(2-column `GameStage`: constant orientation left, game stacked right, per-phase
instruction at the top of the right column). Pattern reference: the completed
`temperature` game (`src/games/temperature/index.jsx`).

**Update this file whenever a game's status changes.**

## Clean games (apply the pattern now)

| Game | Layout status | Notes |
|------|---------------|-------|
| temperature | ✅ Done | Pilot / reference implementation. `showHowTo={false}`, per-phase instruction card, stacked right column, `.range-chunky` slider, cheese bars. |
| prompt | ✅ Done | Reference for BOTH the layout AND the visual-archetype system (message bubbles, colour-coded Instruction/Rule cards, numbered parts, concrete wrong-reply consequences). See the `pizza-bot-visual-archetypes` memory. |
| guardrails | ✅ Done | Layout + archetypes + framing fixes: you stay the OWNER (round 1 = "watch your no-guardrails bot get manipulated", customer labeled "Customer" not "you"), `about` explains guardrails, "NO GUARDRAILS" emphasis, "Part 1/2 of 2" badge, numbered "LIMIT 1 · …". |
| agent | ✅ Done | Multi-phase (chat → build → snag → run → reveal). `stage()` + slim per-phase instruction; customer order & chatbot reply as message bubbles, actions as cheese ChoiceCards ("Action you give your bot"), systems/fired feed as tinted result cards; concrete snag consequence. |
| tool-use | ✅ Done | Layout + archetypes: customer question bubble, bot reply bubble (guess=red, checked=green "backed by real data"), tools as blue choice cards ("Tool your bot can check"). Rounds 1→transition→2→reveal. |
| skill | ✅ Done | Layout + archetypes: complaint customer bubble, improvised replies as red bot bubbles, playbook steps as blue choice cards, round-2 consistent replies as green bot bubbles, "Part 1/2 of 2" badge. |
| memory | ⬜ To do | |

## Misfit games (separate track — game/role rework, not just layout)

| Game | Layout status | Notes |
|------|---------------|-------|
| hallucination | ✅ Layout done | GameStage applied during the layout pilot; role/content reworked separately. |
| token | ⏸ Deferred | Reworked separately (see role-model notes). Apply layout after rework. |
| context-window | ⏸ Deferred | Reworked separately. Apply layout after rework. |
| mcp | ⏸ Deferred | Full game rewrite in progress; apply layout after. |

Legend: ✅ done · 🔄 in progress · ⬜ to do · ⏸ deferred
