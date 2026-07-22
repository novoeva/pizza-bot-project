# Pizza Bot — Design Brief for V0

**Purpose:** exploration pass. This is one of two parallel briefs (the other is for Google Stitch) — the goal is to see design directions from both tools, then pick one before any real design work starts. Nothing here is final.

**How to use this:** V0 works best when you're explicit about component type, visual details, interaction behavior, and the data each component displays — it generates real React + Tailwind (+ shadcn/ui) code, not just a mood. Prompt it component-by-component using the sections below rather than pasting the whole thing at once; you'll get more usable output. Since the real app is hand-built React + Vite + Tailwind with values coming from a CSS-variable theme file (not shadcn defaults), treat V0's code as a strong visual/structural reference to translate into that token system — not a direct copy-paste into the repo.

---

## Product context (read first, don't literally prompt this part)

Pizza Bot teaches busy, non-technical professionals 10 AI terms through 2-minute browser games — no login, no course structure. The hook: every finished game snaps a part onto a robot the player is building (the "pizza bot," an AI assistant for a pizzeria). At 10/10 the bot powers on and the player gets a shareable "You just built an AI agent" diploma. Audience is managers/marketers/founders, not developers — the tone should be approachable, not technical.

## Design personality

**Neat and minimalistic, but fun and memorable.** Clean layout, generous whitespace, restrained color use — the personality lives in one likeable robot character and in short, funny copy, not in visual clutter. Avoid generic AI-product gradients/glassmorphism and avoid anything that reads as a SaaS dashboard or a kids' app. Closer to Duolingo or a Wordle result card than either extreme.

## Components to generate

Prompt these one at a time.

### 1. BotCanvas
- **Type:** the central hero component of the home screen — a visual of a robot assembled from up to 10 parts.
- **Visual:** simple, friendly robot illustration/silhouette. Completed parts (memory, tools, guardrails, MCP port, voice box, etc.) render fully; incomplete parts render as visibly empty outlined slots on the body — the incompleteness must be obvious at a glance, since this is the app's only progress indicator.
- **Data it displays:** a list of which of the 10 terms are complete (e.g. `completed: string[]` out of 10 known term IDs). Each term maps to a specific body part/position.
- **Interaction:** static display, no interaction required — tapping could optionally jump to that term's game.
- **State to show two versions of:** partially built (e.g. 4/10) and fully powered-on (10/10, eyes lit, holding a pizza) for the completion screen.

### 2. TermChecklist
- **Type:** a simple list/menu component, doubles as the game picker.
- **Visual:** 10 rows, each with the term name, a checkmark or empty state, minimal icon or none. Compact, scannable, not decorative.
- **Data:** term name, completion boolean, per term.
- **Interaction:** tapping a row navigates to that term's game screen (any term, any order — no locking).

### 3. FailureLine
- **Type:** a callout/banner component — this is the comedy engine of the app, give it real visual presence, not a small caption.
- **Visual:** short, punchy status line in a distinct card/banner, e.g. "Your bot can order pizza. It can also probably take down the internet." Should feel like a speech bubble or status readout from the bot itself.
- **Data:** a single string, changes based on which terms are missing.
- **Interaction:** optionally tappable to jump straight to the game that fixes the issue it's describing.

### 4. GameScreen shell (use the context-window game as the worked example)
- **Type:** a single full-screen game view, mobile-first, portrait.
- **Visual:** minimal chrome — mostly the game itself. For the context-window example: a chat-style conversation with the bot that visibly loses/pushes out older messages as new ones come in (the falling-away *is* the mechanic — don't describe it as a static explanation).
- **Interaction:** one clear action per screen, instant feedback (correct/incorrect + a one-line "why") shown immediately after the player acts. A plain-language definition of the term appears only after play, as the payoff.
- **Data:** term ID, current conversation state, pass/fail result.

### 5. ShareCard / diploma
- **Type:** a result card generated at completion, shaped for screenshotting and sharing on LinkedIn/Slack.
- **Visual:** "You just built an AI agent" headline, space for the finished bot image and the player's name, clean card format (roughly social-share aspect ratio).
- **Data:** player name (optional), bot image/state.
- **Interaction:** download/copy/share button.

## Constraints to state in every prompt

- **Mobile-first, portrait.** Design at phone width; most traffic is a link opened on a phone.
- **Touch-first**, no hover-dependent or drag-only interactions.
- **Tailwind utility classes only**, values should be easy to swap to CSS custom properties later (avoid hardcoding one-off hex colors inline — ask V0 to keep the palette limited and named/consistent so it can be re-mapped to a token file).
- **Light, fast, no heavy animation libraries** — simple CSS transitions are enough (a snap-in animation for bot parts, a light power-on flourish at 10/10).

## What to ask V0 for at the end of each prompt

- 2–3 visual variations within the "minimal but fun" brief, so there's something to compare against the Stitch output.
- Keep components self-contained — this matters structurally, since the real app treats every game as an independently swappable plugin with no shared code beyond a theme file and a couple of generic UI pieces.

---

*Once you have output from both this brief and the Stitch brief, compare and pick the direction — that decision drives the actual theme-token file described in the technical brief (`PROJECT-PIZZA-BOT-BRIEF.md`, section 10).*
