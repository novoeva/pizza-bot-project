# Pizza Bot — Component Audit (FR-18)

> Read-only audit of every recurring UI element across the 12 games, plus a proposal for a shared component set and a codified color language. Serves [`GAME-DESIGN-PRINCIPLES.md`](./GAME-DESIGN-PRINCIPLES.md) and closes FR-18 in [`INTERVIEW-FEEDBACK.md`](./INTERVIEW-FEEDBACK.md). No code was changed.
>
> Visual companion: [`design-system/gallery.html`](./design-system/gallery.html) renders everything in this audit with the real tokens, side by side with the proposed fixes. Keep it updated (rule in `GAME-DESIGN-PRINCIPLES.md`).
>
> Scope: `src/games/*/index.jsx` (12 games), `src/components/*`, `src/screens/*`, `src/theme/tokens.css`, `tailwind.config.js`, `src/index.css`.

## TL;DR

1. **The "green" problem is a token, not a component.** `--color-muted` (`#dce5d9`) is a pale sage green, yet it is used as the app's *neutral secondary surface* in 26 places: customer bubbles, "Your playbook", "How to play", the fill-in sentence box, done checklist rows, and the wrong-answer rows on the Prompt results screen. Next to it sits `success-bg` (`#e7f4f1`, mint). A first-time reader cannot tell "neutral box" from "you got it right". Fixing the token value (or moving all neutral surfaces to white) removes most of FR-17 and FR-11 without touching game logic.
2. **Two more token collisions:** `primary` and `danger` are the *same hex* (`#b7102a`), so every "Game · …" eyebrow, every primary button and the bot avatar share the error color. And `tertiary`/`accent-soft` (blue) carries five meanings (your role, your messages, instruction type, selected state, info aside).
3. **Shared layer is thin.** Only `GameStage`, `GameActions`, `GameIntro` are shared. Everything else is copy-pasted: the chat bubble pair exists 6×, the phase instruction card 12×, the reveal screen 12×, the icon-panel choice card 5×, the tinted result callout ~20× with 4 different shapes.
4. **Selectable choices have 3 different "selected" colors** (blue in Prompt/Guardrails, cheese in RAG/Memory/Agent, green in Skill) and 4 interaction models. One `SelectableCard` + `ChoiceGroup` covers all of them.
5. **Recommended order:** fix tokens → extract the 4 pure-visual primitives (Callout, ChatMessage, PhaseCard, Panel) → SelectableCard (FR-10/16) → TermReveal (FR-13) → definition panel (FR-9) and bring the 4 non-GameStage games onto the stage.

---

## 1. Inventory

Legend for **Consistent?**: ✅ same everywhere · ⚠️ same idea, drifting details · ❌ conflicting meaning or shape.

Files are `src/games/<id>/index.jsx` unless noted. "stage games" = the 8 games that use `GameStage` (prompt, guardrails, hallucination, temperature, skill, tool-use, agent, rag). "misfits" = token, context-window, memory, mcp (single column, no `GameStage`).

### 1a. Shared today

| # | Component | Semantic role | Where used | Consistent? | Proposal |
|---|---|---|---|---|---|
| S1 | `GameStage` | layout: orientation left / play right; `progress` strip above both (R6) | 8 stage games | ✅ | Keep. Adopt in the 4 misfits (see Phase 4). |
| S2 | `GameActions` + `GameActionButton` (variants primary / accent / neutral / soft) | action: pinned forward control | all 12 | ⚠️ variant meaning is not written down: `accent` (blue) = "continue within a phase", `primary` (red) = "commit / advance phase", `soft` (cheese) = "do the uncomfortable thing" (Guess anyway, See how your bot answers), `neutral` = secondary. Skill and Memory use `accent` for the same "next customer" beat that Guardrails renders as `primary`. | Keep. Document variant meanings in the dictionary (§2). |
| S3 | `GameIntro` | definition/orientation: term, **Definition** (Phase 4), Your role (blue box) | all 12 games, on the left of every screen (Phase 4) | ✅ | Done: FR-9 definition panel. |
| S4 | `TermChecklist`, `StatusReadout`, `BotCanvas`, `Layout` | workshop chrome | screens only | ✅ | Out of scope; note `StatusReadout` uses green for "System online", which is a legitimate "good state". |

### 1b. Recurring, unshared (games)

| # | Component | Semantic role | Where used (per-game variations) | Consistent? | Proposal |
|---|---|---|---|---|---|
| G1 | **Phase instruction card** — white, `border-[3px]`, `rounded-lg`, `p-3`, `shadow-pop`; eyebrow `Game · <title>` in `text-primary`; progress note right; body `text-[13px] text-text-muted` | instruction (current step) | 8 stage games via a local `instruction()` helper; temperature inlines it twice (`temperature:58`, `:215`). Misfits add an `<h1>` with the term name (`token:160`, `context-window:49`, `memory:70`, `mcp:150/217`) because they lost `GameIntro`. Memory's body is `font-label` (`memory:71`); MCP's body is `text-text`, not muted. Progress is a free-text string: `Round 1 / 3`, `Part 1 of 2`, `Q1/3`, `1 / 3`, `3/4`, `round 2/3`; Guardrails appends `· 1 / 4` inside the subtitle string (`guardrails:182,255`). | ⚠️ | `PhaseCard` — `title`, `progress={{ current, total, unit }}`, `children`. One progress format. |
| G2 | **Customer bubble** (received message): person avatar `h-9 w-9 rounded-full bg-surface`, label `Customer`, bubble `rounded-2xl rounded-tl-sm border-neutral bg-muted shadow-pop`, bold text | message · received | 6 identical copies: prompt:105, guardrails:81, skill:57, tool-use:78, agent:84, rag:87. Label varies (`Customer`, `Customer · Marco`, `Same customer, same trick`, `Customer · Anna · asking your bot`). | ✅ shape · ❌ color (see D2 in §2: `bg-muted` reads green) | `ChatMessage from="customer"`. |
| G3 | **Bot bubble** (sent message): robot avatar `bg-primary smart_toy`, label, bubble `rounded-2xl rounded-tr-sm`, right-aligned | message · sent | 6 copies. **Neutral** (white) in prompt:121, agent:100, rag:105. **Tinted as a result** (`border-success bg-success-bg` / `border-danger bg-danger-bg` + icon + note line) in guardrails:97, skill:72, tool-use:93. Text weight differs (bold in prompt/agent/rag, regular in guardrails/tool-use, `text-sm` in skill). Label differs (`Your bot`, `Pizza bot`, `Your chatbot`, `Your bot · out loud`). | ⚠️ | `ChatMessage from="bot" tone="neutral|good|bad" note="…"`. The tinted bot bubble is a legitimate pattern (the *reply itself* is the result) — keep it as a `tone`, but make the note line + icon the only place the verdict lives. Standardize the label to `Your bot`. |
| G4 | **Chat rows without avatars** (`rounded-md` boxes, `max-w-[85%]`) | message | memory:81 (bot = left/white, **customer = right/blue**), context-window:120,190,221 (you = right/blue, bot = left/tinted) | ❌ two games flip the sides: everywhere else the customer is left and the bot is right; Memory puts the customer (Anna) on the right. Context-window puts *you* on the right, which is fine only because the player is the one chatting. Neither uses the bubble shape or avatars. | Replace with `ChatMessage`. Decide one rule: **received = left, sent by "your side" (bot or you) = right** (Memory must flip). |
| G5 | **Icon-panel choice card** — `w-11` colored left panel with icon, `border-r-[3px]`, type tag (`font-label 10px`), bold label | choice | prompt `ChoiceCard`:29 (panel = blue for *Instruction*, cheese for *Rule*), skill `stepCard`:103 (blue → green when added), tool-use `toolCard`:125 (blue), agent `actionPalette`:324 (cheese, `w-10`, trailing `+ add / added`), rag binder:292 (blue → cheese when handed, trailing `+ hand over / handed ✓`) | ❌ the panel color means **type** in Prompt, **state** in Skill/RAG, and **nothing** in Tool-use/Agent | `SelectableCard` with `icon`, `tag`, `mode`, `selected`. Panel color = one meaning (§2, D5). |
| G6 | **Pill / plain option buttons** — no icon panel | choice | prompt `CategoryPicker`:51 (inline pills, selected = blue), guardrails:224 (full-width rows, selected = blue), memory:176 (full-width, selected = cheese + `✓ ` text prefix), token:52 (grid-4 numbers), token:180 (mono word rows), temperature:235 (2 icon cards "Turn it down / up"), hallucination:161 (2 solid buttons Trust / Made up) | ❌ selected color is blue in 2 games, cheese in 1; 4 games have no selected state at all because the tap commits immediately; none has a radio/checkbox affordance or "pick one" microcopy (FR-10/16) | `SelectableCard` (same component, no icon panel) inside `ChoiceGroup`. |
| G7 | **Result callout** — tinted card with eyebrow + icon + body | correct-result / wrong-result | ~20 instances. Danger: prompt:340 "The problem", agent:156,186, tool-use:177, rag:190 (`rounded-lg p-4 shadow-card border-danger`); context-window:123,193 (bubble-shaped `rounded-md shadow-pop`). Success: prompt:189,269 (`border-neutral`!, centered), hallucination `Feedback`:198 (`border-neutral rounded-md`), temperature:255 & token:192 (`border-success rounded-md`), mcp:187,277 (`rounded-lg p-3`, headline is 15px bold, no eyebrow), context-window:224 (bubble). Neutral/info: rag tone `neutral` (`bg-muted`), **memory:211 "The problem" is white with a red eyebrow, not a danger tint**. | ❌ 4 shapes, 2 radii, 2 shadows, border either semantic or neutral, heading either eyebrow or headline, alignment either | `Callout tone="problem|success|info|cost" title icon`. One shape. |
| G8 | **Info aside** ("Real talk", "The fix", "Where this hands off", "You're the owner…") | container · aside | memory:135,219 & context-window:130,205,368 → `border-tertiary bg-surface`; guardrails:156 "In the real world" → `bg-muted` + info icon; rag:141 "Real talk" → `border-cheese-dim bg-cheese-bg` + bolt icon | ❌ the same "Real talk" label is styled 3 ways | `Callout tone="info"`. One style for asides. |
| G9 | **Prompt wrong-answer row** (`bg-muted` row inside a white card, "You picked …" then "Better: …" in `text-success`) | wrong-result | prompt:202 only | ❌ FR-11: the row is green-ish (`bg-muted`) and the recommendation is green text, so a wrong pick looks approved; the container has `border-neutral` | `Callout tone="problem"` per wrong row, recommended option shown with a check icon in neutral text, not `text-success`. |
| G10 | **Reveal screen** — success circle (`h-20 w-20 bg-success` check) → eyebrow `Snapped onto your bot · botPart` → `<h2>You just learned the term X</h2>` → optional score line → "What it means" card → "Why you care" card → optional extra card → pinned CTA | recap | 12 hand-rolled copies (prompt:152, guardrails:135, hallucination:48, temperature:296, skill:159, tool-use:144, agent:115, rag:120, memory:114, token:261, context-window:55, mcp:116). Term name in the `<h2>` is a **hard-coded string** per game, not `term.name`. Score line in 3 games. Extra card in 4 games, styled 3 ways (see G8). No checklist anywhere. | ⚠️ structure · ❌ extras | `TermReveal` (FR-13). |
| G11 | **Sentence-with-blank / stimulus box** — `bg-muted`, centered, `text-lg font-extrabold`, blank in `text-primary` | container · the thing the bot is completing | token:168, temperature:66; temperature:227 "The job" (left-aligned); token:42 "How many tokens" (white, `shadow-card`) | ⚠️ | `Panel variant="stimulus"`. Color follows D2. |
| G12 | **Reference / tool panel with header** | container · reference material | hallucination:96 menu (`bg-muted` header), hallucination:143 claim (`bg-text` dark header + fake confidence bar, fixed `h-[150px]`, `shadow-card`), context-window `ContextPanel`:264 (dark header + blue goldfish strip), temperature dial:84 & distribution:114, token ranking:212, mcp `BotCard`:24 | ⚠️ two header styles (dark vs muted) with no rule | `Panel header="dark|label|none" title icon meta`. Dark header = "inside the bot's head" (claim, context window); label header = reference you consult (menu). Flag for review. |
| G13 | **Slot list** (assembly) — dashed `border-slot-empty` empty rows + filled `cheese` rows with `✕` | container · what you have assembled | agent `toDoList`:263, rag "Handed to the bot":228 (near-identical), skill `playbookPanel`:139 (`bg-muted` ordered list, no slots, no remove) | ⚠️ | `SlotList capacity items onRemove emptyLabel`. Skill adopts it (gains remove + slots). |
| G14 | **Probability bars** — word chip + rounded track + %; one row highlighted | container · distribution | temperature:120 (top word = cheese bar + cheese chip), token:218 (bot's best = green bar; your pick = blue chip) | ❌ highlight means "favorite" in one game and "correct answer" in the other; FR-14/15 want the *sampled* word highlighted | `DistributionBars rows highlight={{ id, tone }} marker={{ id, label }}`. |
| G15 | **Status strip / counter** — one-line tinted pill | status | guardrails:258 damage (danger) & :185 `Damage: $0` (success), mcp `Counter`:71 (success / cheese / neutral), agent:235 "Firing: …" (cheese, `animate-pulse`), mcp:341 "And you're not done" (cheese) | ⚠️ | `StatusStrip tone`. Cheese here = cost/in-progress (see D5). |
| G16 | **Systems grid** — 3 dark cards that light up green | result · external effect | agent `SystemsPanel`:397 only | ✅ | Keep local. Uses `bg-text` (navy) for "asleep": OK as a one-off, but note it is a third use of the dark surface. |
| G17 | **Chip / tag** — small `rounded` or `rounded-full` bordered label | tag | token chips:67 (blue mono) & :95 (white mono), count pills token:89 & temperature:91 (blue), mcp "MCP port":40 (primary outline), hallucination progress dots:120, trailing hints `+ add / added / handed ✓` (`text-primary`) | ⚠️ | `Tag tone` + `Dots` for progress. |
| G18 | **Avatar** | identity | person (6× identical), bot round `bg-primary smart_toy` (6×), hallucination `BotAvatar`:224 (square SVG robot, same art as `StatusReadout`), mcp `BotCard` (square icon) | ⚠️ 3 bot renderings | `Avatar who="customer|bot" size`. Pick one bot face (recommend the SVG robot, it is the mascot on the workshop screen). |
| G19 | **Hint text** — `font-label text-[11px] text-text-muted`, sometimes centered / italic | instruction · micro | tool-use:230,235, mcp:237,378, memory:193, skill:143, temperature:76 | ⚠️ | `Hint` (tiny; mostly a Tailwind preset). |
| G20 | **Inline secondary button** — white, tertiary text, `shadow-pop` | action · secondary, not pinned | temperature "Roll again":153, mcp row buttons:174,256,326 (solid primary *and* white variants for the same "connect" verb), agent "↻ clear the list":305 (unstyled text) | ❌ mcp uses solid red for "Click in" but white for "Build connector" | `GameActionButton` gains `inline` (non-full-width) and `size="sm"`; row actions use it. |
| G21 | **Empty slot / dropped item** — dashed or struck-through `border-slot-empty` | placeholder | agent:276, rag:245, context-window:299 | ✅ | Part of `SlotList`; context-window keeps its own. |

### 1c. Box-style traits (the "recurring inline styles" from the brief)

| Trait | Count (games+components+screens) | Where it is *supposed* to mean something | Verdict |
|---|---|---|---|
| `border-[3px] border-neutral` | everywhere | the chunky container outline | ✅ house style, keep |
| `shadow-pop` (4px) | 132 | default card / control shadow | ✅ default |
| `shadow-card` (6px) | 14 | "bigger thing" — used on some result callouts (prompt, agent, tool-use, rag), the token chop card, the hallucination claim, the context panel, the workshop board | ❌ no rule; other result callouts use `pop` | Rule: `card` only on the workshop board + hero panels (`Panel header="dark"`); every `Callout` uses `pop` |
| `rounded-lg` vs `rounded-md` | mixed | `lg` = text cards (intro, instruction, reveal, some callouts); `md` = controls, panels, other callouts | ⚠️ | Rule: `lg` = reading cards (PhaseCard, Callout, TermReveal cards); `md` = interactive/panel |
| `bg-muted` | 26 | neutral secondary surface | ❌ reads green (D2) |
| `bg-accent-soft` | 20 | blue tint | ❌ 5 meanings (D4) |
| `bg-cheese-bg` | 15 | amber tint | ❌ 5 meanings (D5) |
| `bg-success-bg` / `border-success` | 19 / 15 | correct | ⚠️ also used for "added" state in Skill and "connected" in MCP |
| `bg-danger-bg` / `border-danger` | 15 / 13 | wrong / problem | ✅ meaning is consistent; shape is not (G7) |
| `bg-raised`, `basil`, `tomato`, `glow`, `crust`, `metal*` | 0 in games | unused or BotCanvas-only | Prune or mark as canvas-only in `tokens.css` |

---

## 2. Color & visual-language dictionary

> **Status (2026-09-02):** the role map below was reviewed visually in `design-system/gallery.html` (section R1) and **approved** by Eva, with the note that individual roles may still be revised. R2 was revised after the Phase 0 review: **two reds**, marinara (`primary`, brand + labels + buttons) and a muted brick red (`danger`, "wrong"). The build mechanic is **decided: part tiles with real drag-and-drop** (R3), with the condition that it must be obviously draggable.

Shape carries the **role**; colour carries the **verdict or ownership**. Eight roles, each with its own shape and its own colour. Green belongs to exactly one role; grey belongs to exactly one role.

| # | Role | Shape | Colour | Tokens | Where it applies |
|---|---|---|---|---|---|
| 1 | **Message received** (someone said this) | speech bubble, tail top-left, person avatar | grey | `bg-muted` (**recoloured to a true neutral**, see D2), `border-neutral` | customer bubbles in every game. The only grey-tinted element on a game screen. |
| 2 | **Message from your bot** | speech bubble, tail top-right, marinara robot avatar | white, **never tinted** | `bg-surface`; avatar `bg-primary` | bot replies. Whether the reply was good or bad is said by a Callout under it (R5). |
| 3 | **Teaching & instructions** (the game tells you something) | reading card (`rounded-lg`) with a marinara eyebrow; "Your role" is a blue inset, "How to play" a plain white inset (R5) | white, blue only for "Your role" | eyebrow `text-primary`; role box `bg-accent-soft` | `PhaseCard`, `GameIntro`. Never a bubble. |
| 4 | **A question to answer** (pick one / pick any) | card with a radio circle or checkbox square on the left, lifts on hover | white → blue when picked | `bg-surface` → `bg-accent-soft`, control `bg-tertiary` | Guardrails limits, Prompt rounds 1–3, Temperature up/down, Token guesses, Hallucination trust/made-up. `SelectableCard` + `ChoiceGroup`. |
| 5 | **A part of your bot** (build mechanic) | part tile with a grab handle; slot list with dashed empty slots | amber, on the shelf **and** in the bot | `bg-cheese-bg`, `border-cheese-dim`, handle/label `text-cheese-dim`; empty slot `border-slot-empty` dashed | Skill steps → playbook, Agent actions → to-do list, RAG pages → handed, Memory facts → hard drive, MCP systems → port, "Firing…". `PartTile` + `SlotList` (R3, decided). A part never changes colour; it changes **place**. |
| 6 | **It went right** | tinted callout (`rounded-lg`), border matches tint, eyebrow + icon | green | `bg-success-bg`, `border-success`, `text-success` | correct pick, held guardrail, system fired, pinned line kept. **Nothing else is ever green** (Skill's "added" step and Prompt's "Better:" text lose their green). |
| 7 | **It went wrong / it hurts** | same callout shape | **muted brick red** (`#9c4444` on `#f2e2e0`), visibly duller than the brand red | `bg-danger-bg`, `border-danger`, `text-danger` | wrong pick, caved bot, dropped allergy, "The problem", damage counters, MCP's weeks counter and "And you're not done". |
| 8 | **The action that moves you on** | solid full-width button, pinned bar | **marinara red** (`primary`, R2 revised) | `bg-primary`; `accent` blue, `soft` amber, `neutral` white | `GameActionButton`. Also the signature colour of the chrome: logo, active tab, "Term ·"/"Game ·" labels, bot avatar, reference headers. |

### Token-level consequences

- **D2 — `muted`:** keep the name, change the value to a true light neutral (a cool grey close to `bg`, e.g. `#e6e7ee`; exact value tuned in Phase 0). Every `bg-muted` use stops reading as green in one line.
- **D4 — `tertiary` / `accent-soft`:** blue = *the owner's side*: the game talking to you (role 3) and your answer (role 4). Info asides ("Real talk", "The fix", "In the real world") leave blue and become `Callout tone="info"`: white, `border-neutral`, info icon, muted eyebrow. Token chips become neutral.
- **D5 — `cheese`:** amber = *a part of your bot* (role 5). It is no longer "cost/caution": painful counters move to red (role 7). Prompt's *Rule* card stops using the amber panel; Rule vs Instruction is carried by icon (`gavel` / `description`) and tag text only, both in role 4 blue.
- **D7 — `primary` = `danger`:** split into two reds. `primary` stays the bright marinara `#b7102a` (the signature: logo, tabs, labels, buttons, avatars, reference headers); `danger` becomes a muted brick `#9c4444` with tint `#f2e2e0`, so "wrong" never looks like the brand. (First attempt, navy buttons + one red, was reviewed and rejected as overcorrection.)
- **D8 — `text` as a surface:** retired after the Phase 1 review (the navy-headed context window looked like a different design). `Panel` headers are the grey label strip or the marinara strip ("Today's real menu"). The context window's rows are small `ChatMessage` bubbles.
- Shadows: `shadow-pop` everywhere; `shadow-card` only on the workshop board, `Panel header="dark"`, and the tile being dragged. Radii: `rounded-lg` = reading cards and callouts; `rounded-md` = controls, tiles, panels.

---

## 3. Recommended shared-component set

Core five first (they close the three FRs), then supporting primitives. All in `src/components/`. Names are proposals.

### Core

**1a. `SelectableCard` + `ChoiceGroup`** (FR-10 / FR-16) — role 4, *answer a question*
- `SelectableCard`: `mode="commit" | "radio" | "checkbox"`, `selected`, `disabled`, `icon`, `tag`, `label`, `detail`, `trailing`. Renders the affordance itself: a leading radio circle / checkbox square (or the icon panel when `icon` is given), hover lift (`press`), selected = blue fill + solid blue control + check, disabled = `opacity-40`. `commit` mode shows a trailing chevron ("tapping this moves you on").
- `ChoiceGroup`: `label` ("Limit 1 · Max discount…"), `hint` ("Pick one" / "Pick any"), `columns`, children. Owns the "pick one" microcopy so games cannot forget it. `role="radiogroup"` / `aria-checked`.
- Replaces: Prompt rounds 1–3 (ChoiceCard + CategoryPicker), Guardrails limits, Tool-use tool cards, Token guesses/words, Temperature up/down; Hallucination optional.

**1b. `PartTile` + `SlotList`** (R3, decided: drag-and-drop) — role 5, *build the bot*
- `PartTile`: amber tile with a `drag_indicator` handle, optional icon, label, trailing hint ("drag ↑" / "in playbook"); `used` fades it to `opacity-40`. Draggable (HTML drag-and-drop or a small library), with **tap as the touch fallback** that slides the tile into the next empty slot.
- `SlotList`: `capacity`, `items`, `onDrop`, `onRemove`, `emptyLabel`, `ordered`. Dashed empty slots; the target slot lights up amber with "Drop here" during a drag; landed tiles are numbered and get a ✕ that returns them to the shelf.
- Replaces: Skill steps/playbook, Agent action palette/to-do list, RAG binder/handed pages, Memory facts/hard drive (gains a slot list), MCP system rows (gain the handle; already turn amber).
- **Acceptance rule ("obviously drag-and-drop"), all five required:** (1) grab handle on every tile, grab cursor on hover; (2) the tile's hint text says the verb: "drag ↑" (touch: "tap to add"); (3) the empty slot says the verb: "drag a step here…"; (4) on the first build screen of a session the top tile wiggles once and the first slot pulses amber once, skipped under `prefers-reduced-motion`; (5) tap fallback animates the tile sliding into the slot. Budget: ≈ +1 day in Phase 2.

**2. `TermReveal`** (FR-13)
- Props: `term`, `score={{ got, of, unit }}` (optional), `aside={{ title, body }}` (optional, rendered as `Callout tone="info"`), `onComplete`.
- Renders: success mark → `Snapped onto your bot · {term.botPart}` → `You just learned the term {term.name}` (from data, not a string) → **definition card** → **checklist card** (`term.keyPoints[]`, check icons, one line each, max 4) → optional **"Don't" card** (`term.dont[]`, cross icons) → optional score → aside → pinned CTA.
- Needs content: add `keyPoints` (3–4 lines) and optional `dont` (1–2 lines) per term in `src/content/terms.json`. `whyYouCare` can become the first key point or stay as its own line; flag for copy review.
- Replaces: G10 (all 12).

**3. `GameIntro` v2 — the definition panel** (FR-9)
- Keep the data-driven structure; add a clearly labeled first block **"What you'll learn"** (new `term.learn` one-liner, per FR-2) above the teaser, with an icon, so the panel reads as a definition card at a glance without spoiling `term.definition`.
- Blocks in order: eyebrow `Term` → name → **What you'll learn** (labeled, blue = yours) → teaser → Your role → How to play (only when `showHowTo`).
- Stays on the left for **every** phase in all 12 games (Phase 4 brings the misfits onto `GameStage`), so the definition is always on screen.

**4. `Callout`**
- `tone="problem" | "success" | "info" | "cost"`, `title`, `icon` (default per tone), `align`, children. One shape: `rounded-lg`, `border-[3px]` in the tone color, tint background, `shadow-pop`, eyebrow 11px bold in the tone color, body 15px.
- Replaces: G7, G8, G9 (and fixes FR-11 as a side effect: wrong rows become `problem`).

**5. `ChatMessage` + `Avatar`**
- `ChatMessage`: `from="customer" | "bot" | "you"`, `label`, `tone="neutral" | "good" | "bad"`, `note`, children. Received (customer) = left; sent (bot, you) = right. Bubble shape fixed; tinted only when `tone` is set; note line with icon is the verdict.
- `Avatar`: `who="customer" | "bot"`, `size`. One bot face.
- Replaces: G2, G3, G4, G18.

### Supporting

**6. `PhaseCard`** — `title`, `meta`, `heading`, children. Replaces G1. No progress in it (R6): progress is the `ProgressBar` strip at the top of the screen, passed to `GameStage` as `progress={{ part, parts, step, steps }}` (single-column games render `<ProgressBar>` first). `meta` is a small text for counts that are not progress.

**7. `Panel`** — `header="none" | "label" | "dark"`, `title`, `icon`, `meta`, children. Replaces G11, G12 wrappers (menu, claim, context window, dial, ranking, bot card). Games keep their inner content.

**8. `SlotList`** — `capacity`, `items`, `renderItem`, `onRemove`, `emptyLabel`, `onClear`. Replaces G13 for agent, rag; skill adopts it.

**9. `DistributionBars`** — `rows=[{ id, label, pct }]`, `highlight={{ id, tone }}`, `marker={{ id, label }}`. Replaces G14; gives FR-14/15 the "highlight the rolled word" hook for free.

**10. `Tag`, `StatusStrip`, `Hint`, `GameActionButton inline/size`** — small presets replacing G15, G17, G19, G20.

Keep local (one-off, fine as is): agent `SystemsPanel`, context-window `ContextPanel` internals, temperature slider (`range-chunky`), hallucination confidence bar, mcp `SystemRow` (or fold into `Panel` later).

---

## 4. Phased refactor plan

No behavior or game-logic changes in any phase; every phase is "same screens, fewer copies". Estimates assume one person, familiar with the repo.

**Phase 0 — Tokens & dictionary. ✅ Done and approved 2026-09-02 (review round 2: 4/4)** (`muted` → `#e6e7ee`; `primary` stays marinara `#b7102a`; `danger` → muted brick `#9c4444` / `#f2e2e0`; "How to play" box blue; "Today's real menu" header marinara; unused tokens pruned). Decide D2, D5, D7. Apply the `muted` value change and prune unused tokens in `tokens.css`. Write the dictionary (§2) into `GAME-DESIGN-PRINCIPLES.md` or a `VISUAL-LANGUAGE.md`. Blocks everything else: extracted components must be born with the right meanings.

**Phase 1 — Pure visual primitives. ✅ Done and approved 2026-09-02 after 5 review rounds (R4–R6): `ProgressBar` on top of the PhaseCard, bubbles never tinted and hold only the reply, verdict in a `Callout` below, context window rows are small bubbles, dark panel header retired, result screens show the tapped option with red/green pills.** Built `Callout` (problem / success / info), `ChatMessage` + `Avatar`, `PhaseCard`, `Panel` (inline / label / brand / dark headers) in `src/components/` and swapped them into all 12 games. Side effects delivered: FR-11 (Prompt wrong rows are muted-red callouts with the better option as plain advice), Memory chat sides fixed, MCP cost counters red, the three "Real talk" stylings unified. Build `Callout`, `ChatMessage` + `Avatar`, `PhaseCard`, `Panel`. Swap them in game by game, stage games first (they are already structured for it), then misfits. Closes FR-11 (Prompt wrong rows → `Callout problem`) and fixes Memory's flipped chat sides. No prop-driven behavior, so risk is visual only; verify by screenshots per game.

**Phase 2 — `SelectableCard` + `ChoiceGroup`, then `PartTile` + `SlotList`. ✅ Done and approved 2026-09-02 (review 5/5).** Answers: Prompt (rounds 1–3), Guardrails, Tool use, Token, Temperature use `SelectableCard` inside a `ChoiceGroup` ("Pick one" / "Tap one" microcopy, radio circles, chevrons on commit cards). Building: Skill, Agent, RAG, Memory use `PartTile` (amber, grab handle, "drag ↑" / "tap to add") and `SlotList` (dashed slots, "Drop here" while dragging, ✕ to take back), HTML drag-and-drop with tap as the touch fallback, plus the once-per-session wiggle + slot pulse (`useFirstTimeHint`). Hallucination keeps its two judgment buttons; MCP keeps its row buttons. Depends on Phase 0 (selected color) and `Tag`. Answers first: Prompt (the FR-10 anchor) → Guardrails (FR-16) → Tool-use, Token, Temperature. Then the build mechanic with drag-and-drop: Skill → Agent → RAG → Memory → MCP. Hallucination last or skipped.

**Phase 3 — `TermReveal`. ✅ Built 2026-09-02; structure agreed (three sections), the 12 recaps are frozen as written until Eva reviews the copy in her own time (review kit round 3 in `design-system/reviews/phase-3.html`). Do not change the text before that review.** One end screen for all 12 games: success mark → "Snapped onto your bot" → "You just learned the term {name}" (from data) → optional score → definition → "What you learned in the game" (3 full sentences from `term.inGame` tying the definition to what the player just did) → "Do and don't" (2 do sentences from `term.do` with checks, 1 don't from `term.dont` with a cross; review rounds 1–2 asked for both the in-game recap and the general checklist, all as sentences a person would say) → optional aside (the four "Real talk" / "In the real world" callouts) → pinned action. `whyYouCare` is no longer shown: its content was folded into the key points (decision Q7). Depends on `Callout`. Needs `keyPoints` / `dont` written for 12 terms in `terms.json` (copy task, can run in parallel with Phases 1–2). Swap all 12 reveal blocks.

**Phase 4 — `GameIntro` v2 + misfits onto `GameStage`. ✅ Built 2026-09-02, awaiting review.** Decision (Eva): the intro shows the **full definition up front**, labelled "Definition" (define first, apply during the game, repeat at the end); the `term.about` teaser is no longer shown and FR-2's separate "what you'll learn" line is not needed. Token, Context window, Memory and MCP now run on `GameStage` on every screen (left: intro with definition + role; right: PhaseCard + play; progress strip above), which also closes FR-20. Hallucination gets a PhaseCard like the others. `showHowTo` is off everywhere; each screen's instruction lives in its PhaseCard. Depends on Phase 1 (`PhaseCard` replaces the misfits' `<h1>` instruction cards). Adds `term.learn` copy (FR-2). Token, Context window, Memory, MCP get the left orientation column for every phase; their `<h1>` cards go away.

**Phase 5 — Nice-to-have primitives (½–1 day).** `SlotList`, `DistributionBars` (unblocks FR-14/15), `StatusStrip`, inline `GameActionButton`.

Dependencies in one line: **0 → 1 → {2, 3, 4} → 5**, with the `terms.json` copy for 3 and 4 written any time after 0.

---

## 5. Decisions log

Reviewed visually in `design-system/gallery.html` on 2026-09-02.

| # | Decision | Status |
|---|---|---|
| R1 | 8-role colour map (§2) | **Approved.** Roles may be revised individually; the gallery is the source of truth. |
| R2 | Reds | **Decided (revised after Phase 0 review):** two reds. Marinara `#b7102a` = brand, labels, buttons, avatars, reference headers. Muted brick `#9c4444` / `#f2e2e0` = wrong / it hurts. Navy-button attempt rejected as overcorrection. |
| R3 | Amber = a part of your bot; build mechanic | **Decided.** Amber = part. Checkbox mechanic **rejected**. Part tiles with **real drag-and-drop**, must be obviously draggable (five signals, §3 1b); tap stays as the fallback. |
| — | Chat sides | Proposed rule: received = left, your side (bot or you) = right; Memory flips. Not yet reviewed. |
| — | Bot face | Proposed: navy round `smart_toy` avatar in bubbles (matches R2 navy); the SVG robot stays the workshop mascot. Not yet reviewed. |
| R4 | After Phase 1 review | **Applied:** bubble = only the reply, verdict in a Callout under it; context-window rows are small chat bubbles; dark panel header retired; result screens show the tapped option. (Pizza-slice progress tried, replaced in R5.) |
| R6 | After Phase 1 review, rounds 3–4 | **Applied:** progress is a strip at the very top of every game screen (`ProgressBar` via `GameStage progress`, or rendered first by the single-column games): **one line labelled "Progress", one segment per part of the game**; finished parts solid, the current part fills up with its steps, no numbers. `PhaseCard` no longer carries progress (only an optional `meta` text). |
| R5 | After Phase 1 review, round 2 | **Applied:** bubbles are **never tinted** (verdict lives only in the Callout); progress is a labelled segmented **"Progress" bar** at the top of the PhaseCard (`ProgressBar`); on result screens the **pills carry the verdict** (your pick red, better green) inside a neutral card; the picked card is shown back unchanged; "How to play" is a plain white inset, only "Your role" is blue; verdict copy names who it worked for ("It worked for the customer. You lost $50."). Non-design findings logged as FR-19/20/21. |
| Q7 | `TermReveal` content | **Applied (Phase 3):** three sections: `definition`, `inGame[]` (3 sentences about what happened in that game), `do[]` + `dont[]` (2 + 1 takeaway sentences). `whyYouCare` no longer shown. Rule from the review: recap lines must read as sentences a person would say, grounded in the game, never lecture notes. |

Out of scope, noted only: the untracked `Update landing page/` folder at the repo root is a separate Lovable/TanStack project (FR-1), not part of this app.
