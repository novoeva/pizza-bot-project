# Pizza Bot — Design Brief for Google Stitch

**Purpose:** exploration pass. This is one of two parallel briefs (the other is for V0) — the goal is to see design directions from both tools, then pick one before any real design work starts. Nothing here is final.

**How to use this:** paste the sections below into Stitch's canvas as your prompt. Stitch works best from natural-language description of feel and flow rather than exact specs — it'll generate multiple directions and up to 5 connected screens at once, so lean into describing the mood and the journey, not pixel measurements.

---

## What Pizza Bot is

A tiny web game that teaches busy, non-technical professionals 10 AI terms (like "context window", "agent", "hallucination") through play. No course, no login. You open a link on your phone, play a 2-minute game, get a plain-language definition, done.

**The hook:** every game you finish snaps a part onto a robot you're building — the "pizza bot", an AI assistant for a pizzeria. Finish all 10 and the bot powers on, takes its first order, and makes a pizza. You get a shareable "You just built an AI agent" diploma to post on LinkedIn.

**Audience:** managers, marketers, founders — people who use ChatGPT/Claude daily but never learned the vocabulary. Not developers. They're overwhelmed by AI jargon and will play a fun 2-minute game, but won't start a course.

## Design personality (the important part)

**Neat and minimalistic, but fun and memorable.** Not corporate-clean-to-the-point-of-boring, and not cluttered-cute-to-the-point-of-noisy. Think: a small, likeable robot character in a clean, generous, uncluttered layout — the personality comes from the character and copy, not from visual density.

Reference feel: closer to Duolingo's owl or a Wordle result grid than to a SaaS dashboard or a kids' app. Playful but composed. One good joke per screen, not five.

**Explicitly avoid:** gradients-and-glassmorphism tech-startup look, generic "AI product" purple/blue gradient clichés, busy dashboards, anything that looks like a course platform.

## The world

Everything happens inside one running scenario: **building an AI assistant for a pizzeria.** No abstract metaphors — a "context window" is literally what the bot remembers mid-order, "tokens" are literally chopped-up pizza-order text. The visual world should lean into pizza/pizzeria imagery and a small robot mascot, kept simple enough to stay clean.

## Screens to generate

Describe these as one flow so Stitch links them:

1. **Workshop (home screen).** A half-built robot sits center stage — this is the *only* progress bar in the product, so it needs to read instantly. Some parts are snapped on (memory = a hard drive in the chest, tools = arms, guardrails = a safety casing, MCP = a port, tokens = a voice box, etc.), others are visibly empty outlined slots — missing parts should look obviously incomplete, not just absent. Below or beside the bot: a checklist of the 10 terms with checkmarks, doubling as the game menu. Somewhere prominent: one funny "failure mode" status line describing what the bot currently does wrong (e.g. "Your bot can order pizza. It can also probably take down the internet.") — this line is the personality of the whole app, give it real visual weight, not a small caption.

2. **One example game screen.** Pick the context-window game as the representative: the player is mid-conversation with the bot, and as the chat fills up, older lines visibly fall away / get pushed out of view — that falling-away *is* the mechanic, not an explanation of it. Keep the game screen itself extremely simple — one screen, one action, instant feedback (right/wrong + why) after the player acts. A definition line appears after play, not before.

3. **Completion / power-on screen.** The bot's eyes light up, it hands the player a finished pizza. Below that: a shareable "diploma" card — "You just built an AI agent" — with a place for the player's name and their bot's picture, designed to look good as a screenshot posted on LinkedIn or Slack.

## Constraints to state explicitly in your prompt

- **Mobile-first, portrait only.** Most traffic is someone opening a link on their phone from LinkedIn. Design at phone width first; no landscape or hover-dependent interactions.
- **Touch-first.** Big tap targets, no drag-only mechanics.
- **Fast, light, minimal.** No heavy illustration-per-screen — this needs to feel instant to load and play, not like a premium mobile game.
- **One consistent character.** The robot mascot should look the same (just more/less complete) across every screen — Stitch should treat it as a persistent character, not redraw it per screen.

## What to ask Stitch for at the end of your prompt

- Multiple direction options for the overall mood/color palette (2–3), all within the "minimal but fun" brief above.
- The 3 screens above, stitched together as a flow if possible.
- Export in a form you can hand to a developer — Stitch can export production code, but treat that as a visual reference only for now, not final code (the actual build uses hand-written React + Tailwind + CSS-variable design tokens, so any exported code will get re-implemented, not pasted in).

---

*Once you have output from both this brief and the V0 brief, compare and pick the direction — that decision drives the actual theme-token file described in the technical brief (`PROJECT-PIZZA-BOT-BRIEF.md`, section 10).*
