# Project Pizza Bot — Brief

**Status:** Draft v1 · July 2026
**Owner:** Evi
**Relation to GenAI Academy:** Same umbrella (teaching agentic AI), separate product. Pizza Bot reuses definitions and ideas from the Academy lessons but ships as its own standalone, publicly shareable app.

---

## 1. Problem

People use Claude or ChatGPT every day but don't know the vocabulary behind it. When they hear "context window", "MCP", or "agent", they nod and secretly google it later. Existing learning content (courses, docs, our own Academy) demands time and commitment they don't have.

## 2. Target persona

**"The busy AI user."** A professional (manager, marketer, founder, PM) who:

- uses AI tools daily but never learned the underlying concepts
- is overwhelmed by AI news and jargon
- won't start a course, but will play a 2-minute game on their phone
- learns best through doing, not reading

Not for: developers, ML engineers, people who want depth. That's what GenAI Academy is for.

## 3. What Pizza Bot is

A collection of tiny games, each teaching **one AI term**. Brutally simple: you play, you get it, you leave. Every game ends with a plain-language definition of the term — that's the whole lesson.

One session = 2–5 minutes. No login, no progress tracking pressure, no course structure. Open link, play, done.

## 4. What Pizza Bot is not (non-goals)

- Not a course. No modules, no curriculum, no completion percentage.
- Not comprehensive. 10 terms in v1, not 100.
- Not the Academy. No lessons, no long reading, no quizzes with 10 questions.
- No accounts, no backend, no data collection in v1.

## 5. Design principles (from educational game research)

1. **The mechanic IS the lesson.** The game should make you *experience* the concept, not read about it. E.g. for context window: things literally fall out of your window as it fills up.
2. **One concept per game.** No bundling. Cognitive load stays near zero.
3. **Instant feedback.** Every action gets an immediate response — right/wrong/why. Feedback is the #1 driver of learning in games.
4. **Fail cheap, retry instantly.** Losing takes 10 seconds and restart is one tap. Failure is information, not punishment.
5. **Definition as the payoff.** The plain-language definition appears *after* play, when curiosity is highest — not before.
6. **Shareable by design.** Wordle's lesson: a result you can paste into LinkedIn/Slack without spoiling the game is the viral engine. Every game ends with a share-friendly result card.
7. **Phone-first.** Most plays will come from a LinkedIn link opened on a phone. Touch-first, fast load, no landscape requirement.

## 6. Unique angle: one running scenario, not a metaphor

Every game uses the same realistic scenario: **the player is building an AI assistant for a product**, and each term appears as a real decision in that build. No metaphors — tokens are actual tokens (how the bot's text gets chopped up, what each reply costs), context window is what the bot actually remembers in a conversation, guardrails are what the bot must refuse.

This means players don't just learn definitions — they learn *why the term matters when you build or buy AI at work*, which is exactly the persona's real situation.

**Scenario (decided): the pizza ordering bot.** The player is building "the AI assistant for a pizzeria". Universal (everyone has ordered pizza), naturally funny failure states, and great design potential (pizza visuals, cute bot mascot).

## 7. Meta-game: build your bot

Games are playable one by one, in any order, standalone. On top sits the meta-game: **the player is assembling the pizza bot itself.** Each term is a real capability, so each completed game installs a visible part.

**The workshop (home screen):**

- A half-built robot in the middle. Each completed game snaps a part onto it: memory = hard drive in the chest, tools = arms, context window = a comically small short-term chip, guardrails = safety casing, MCP = the port that plugs into the pizzeria's systems, tokens = its voice box, etc. Empty part slots stay visible (near-miss pull).
- **Term checklist:** all 10 terms listed with checkmarks — one glance shows what's learned and what's missing. The checklist doubles as the game menu.
- **Endowed progress:** the bot's frame/chassis exists from the first visit — never 0%.

**Failure mode diagnostics (the humor engine):**

The workshop always shows the bot's **current failure mode** — a funny status line derived from which terms are NOT yet learned. Examples (starter set, ~2 per term; final copy needs 15–20 lines):

- *Guardrails missing:* "Your bot can order pizza. It can also probably take down the internet. Maybe learn about guardrails."
- *Guardrails missing:* "A customer just negotiated a free pizza for life. Your bot said yes. Guardrails would help."
- *Hallucination missing:* "Your bot is confidently describing the 'Hawaiian Deluxe with truffle'. It does not exist. Nothing on that menu exists."
- *Context window missing:* "The customer said 'no olives' 12 messages ago. Your bot just added extra olives."
- *Memory missing:* "Your best customer ordered for the 50th time. Your bot greeted them with 'Welcome, stranger!'"
- *Tools missing:* "Your bot is guessing the delivery time. Out loud. To customers."
- *Agent missing:* "Your bot had a lovely 20-minute chat about pizza. Nobody ordered anything."
- *Token missing:* "Your bot's replies cost more than the pizza. Learn about tokens."
- *Prompt missing:* "You told the bot to 'be helpful'. It is now recommending the competitor's pizzeria."
- *Skill missing:* "A customer complained. Your bot improvised. There is now a lawsuit."
- *MCP missing:* "Your bot takes perfect orders. The kitchen never hears about them."
- *Combo (only 1–3 learned):* "Technically it's a robot. Practically it's a very expensive fridge magnet."

Mechanics: each term has 1–2 dedicated failure lines; the workshop rotates through lines for currently-missing terms (one shown at a time). A few special lines for combos/milestones (almost done: "One part missing. So close. Your bot can taste the pizza. Which it also shouldn't be able to do."). Each line ends with a nudge toward the game that fixes it — the failure line IS the call to action, and it teaches what the term protects against before the game is even played.

**Completion — "the special thing":**

Finishing all 10 → **the bot powers on.** Eyes light up, it takes its first real order, and successfully makes a pizza — which it hands to the player, its builder. Then the shareable diploma: **"You just built an AI agent."** (Player name + their bot + the pizza.) Designed for posting on LinkedIn — the reward doubles as the viral loop.

**Later (not v1):** powering on unlocks a bonus "dinner rush" boss level combining all 10 concepts.

**Gamification principles applied:** visible progress (the bot itself is the progress bar), set-completion drive, meaningful individual items AND meaningful completed set (every visible part = a concept the player can now explain), celebration proportional to achievement (small snap-in per game, big power-on at 10/10), collection layer separate from game logic. Full principles and research: see `GAMIFICATION-PRINCIPLES.md`.

**Progress persistence:** `localStorage` — the browser remembers completed games and bot state across visits. No accounts, no backend, works on static hosting (Vercel). Limitation (accepted for v1): progress is per-device/per-browser. Meta-note: this persistent memory is itself a live example of the "memory" term — the memory game can point at it.

## 8. Format: hybrid

- **Default mechanic (quick play):** one fast, repeatable game covering most terms — e.g. "match the term" / rapid guess format. Learn the interface once, play all terms.
- **Custom mini-games (3–4 in v1):** for concepts that deserve simulation. Candidates: context window, memory, agent-with-tools.
- **Academy sims are inspiration, not source material.** The existing `.sim.html` prototypes in the Academy lessons show which mechanics work — steal the mechanics, but every game is built fresh: content rewritten for the pizza bot scenario, structure rebuilt to follow the gamification principles (`GAMIFICATION-PRINCIPLES.md`). No copy-pasting Academy content.

## 9. Scope v1 — the 10 terms

1. Token
2. Context window
3. Hallucination
4. Prompt
5. Agent (vs. chatbot)
6. Tool / tool use
7. Skill
8. Memory (working vs. persistent)
9. MCP
10. Guardrails / staying in scope

Each term ships with: a game (default or custom), a one-sentence plain-language definition, and one "why you care" line tied to everyday Claude/ChatGPT use.

**Per-term game design:** the agreed definition, learning approach, and game concept for every term live in **`GAME-DESIGN.md`** — the alignment document games are reviewed against. No game gets built before its entry there is approved.

**How each term appears in the pizza bot scenario:**

| Term | In the pizza bot world |
|---|---|
| Token | The bot reads and writes in chunks — "pep-pe-ro-ni" is 4 tokens, and every token costs money |
| Context window | How much of the conversation the bot still remembers — long order, and "no olives!" from message 2 falls out |
| Hallucination | The bot confidently offers the "Hawaiian Deluxe with truffle" — which isn't on the menu |
| Prompt | The instructions you give the bot: vague prompt = weird pizzas |
| Agent (vs. chatbot) | Chatbot talks about pizza; agent actually places the order, charges the card, notifies the kitchen |
| Tool / tool use | Bot checks the real menu, the oven queue, delivery tracking — instead of guessing |
| Skill | The "how to handle a complaint" playbook you hand the bot so it does it right every time |
| Memory | Remembering "Evi = margherita, extra basil, no. 14 Main St" next week vs. within one chat |
| MCP | The standard plug that connects the bot to the ordering system, POS, and delivery service |
| Guardrails | Bot must not: give unlimited discounts, promise 5-minute delivery, discuss anything but pizza |

## 10. Design: functional now, swappable later

V1 ships with a clean but un-fine-tuned look. The hard requirement is architecture, not aesthetics:

- **All visual styling lives in one theming layer** (design tokens: colors, fonts, spacing, radii as CSS variables) — never hardcoded inside game logic. Swapping the entire look must mean editing one file.
- **Game logic and presentation stay separate**, so a later redesign (e.g. generated via Google Stitch or a designer) can be dropped in without touching how games work.
- **Follow-up deliverable:** a separate **design brief** (personality, mood, character design for the recurring world, color direction) before any real design pass. Not part of v1 build.

## 11. Technical specification

**Stack & hosting (decided):**

- **React + Vite**, JavaScript (same stack as `genai-academy/` — familiar, no learning tax). Tailwind for utility styling, but all theme values come from design tokens (see below).
- **New separate repo:** `pizza-bot/` — independent from the Academy. Pushed to **GitHub**, auto-deployed to **Vercel** on every push to `main` (zero-config for Vite). Preview deployments per branch for free.
- **No backend, no database, no accounts.** Fully static SPA. State lives in `localStorage`.

**Responsive requirements:**

- **Mobile-first** (~90% of LinkedIn-link traffic), but fully usable on desktop: game area capped at a max width, centered, so desktop isn't a stretched phone screen.
- Touch-first interactions that also work with mouse/keyboard. No hover-only UI, no drag mechanics without a tap alternative.
- Portrait only; no landscape requirement.
- Performance budget: initial load under ~1s on 4G. No heavy game engine — plain React + CSS animations (framer-motion allowed if needed). Games lazy-loaded per route so the workshop opens instantly.

**Architecture (the rules Claude Code must follow):**

- **Games are plugins — and independently editable.** Each game is a self-contained component implementing one standard interface — roughly `{ termId, onComplete() }`. The workshop knows nothing about game internals; games know nothing about the meta-game. Hard requirement driven by the review workflow: Evi reviews games one by one and may reject/rework a single game — so changing or fully rewriting one game must never require touching any other game or the workshop. Adding game #11 = one folder + one registry entry. Nothing shared between games except the standard interface, the theme tokens, and (optionally) small generic UI components.
- **Every game has a direct URL** (e.g. `/game/hallucination`) so a single game can be opened, reviewed, and tested in isolation — on a phone too, via the Vercel preview link.
- **One name everywhere:** term ID = game folder name = URL slug (`hallucination` → `src/games/hallucination/` → `/game/hallucination`). Feedback like "change the hallucination game" maps to exactly one folder — no ambiguity for humans or for Claude Code.
- **Content is data, not code.** Terms, definitions, "why you care" lines, and all failure-mode lines live in JSON/JS data files (`content/terms.json`, `content/failure-lines.json`). Copy edits never require touching components.
- **Theming is one file.** All colors, fonts, spacing, radii as CSS variables consumed by Tailwind config. Full redesign (Stitch or designer) = replacing the token file + swapping SVG assets. No hex codes inside components.
- **Bot state is one module.** A single `progress` module owns localStorage reads/writes (`completed: ["token", "memory", ...]`, versioned schema so later releases don't wipe progress). Everything else asks it.
- **Failure-line selection is pure logic:** a function `(completedTerms) => line` — dedicated lines per missing term, special combo/milestone lines, rotation between visits. Unit-testable.
- **Share cards:** result cards and the diploma generated client-side (canvas or SVG→PNG) with Web Share API on mobile, download/copy fallback on desktop.

**Repo layout** (this `pizza-bot/` folder IS the repo root — this brief and `GAMIFICATION-PRINCIPLES.md` live in it):

```
pizza-bot/
├── PROJECT-PIZZA-BOT-BRIEF.md    # this file
├── GAMIFICATION-PRINCIPLES.md
├── src/
│   ├── screens/        # Workshop (home), GameScreen, PowerOnFinale
│   ├── games/          # one folder per game, standard interface
│   ├── components/     # BotCanvas, TermChecklist, FailureLine, ShareCard
│   ├── content/        # terms, definitions, failure lines (data only)
│   ├── theme/          # design tokens — the one swappable file
│   └── lib/            # progress (localStorage), failure-line logic
└── public/             # bot part SVGs, favicon, og-image
```

- **Content reuse:** definitions distilled from `../lessons/`, sim prototypes adapted from existing `.sim.html` files in the Academy (one level up, in the Agentic AI folder).
- **Nice-to-have (cheap, worth it):** OG meta tags so the link unfurls nicely on LinkedIn; Vercel Analytics (one line, no cookies) to see if anyone actually plays.

## 12. Success criteria

- A stranger with zero AI knowledge can open the link on their phone and finish one game in under 2 minutes without instructions.
- After playing, they can explain the term to a colleague in one sentence.
- Evi is proud enough to post the link on LinkedIn.

## 13. Open questions

- Daily-game angle: Wordle-style "one term per day" could drive return visits — v1 or later?
- Language: English only, or Czech version too?
- Order: fixed sequence (easy → hard) or free pick from a grid?
