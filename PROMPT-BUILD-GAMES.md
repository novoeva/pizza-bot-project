# Prompt — re-skin the remaining Pizza Bot games

Paste the block below into a fresh chat (it's self-contained for a cold start in this repo).

---

You're working in the Pizza Bot repo — a Vite + React + Tailwind web app that
teaches 10 AI terms through tiny 2-minute games; finishing a game snaps a part
onto a robot. The app was just re-skinned from a dark theme to a light, bold
"chunky" design (3px borders + hard offset shadows, navy text on off-white, red
primary with blue accents). Your job: RE-SKIN THE REMAINING GAMES to match the
new design — WITHOUT changing their gameplay, mechanics, or copy. Restyle only.

WHERE THINGS ARE
- Run it: `node_modules/.bin/vite --port 5180` (or `npm run dev`) →
  http://localhost:5180. Games are at /game/<termId>.
- Design tokens (single source of truth for colors/fonts/shadows):
  src/theme/tokens.css, mapped to Tailwind in tailwind.config.js.
- Games: src/games/<termId>/index.jsx — each is a default-export React
  component with props { termId, onComplete }. Registry: src/games/registry.js.
  GameScreen (src/screens/GameScreen.jsx) wraps each in
  <main className="mx-auto max-w-game px-4 pt-5 pb-[calc(6rem+var(--space-safe-bottom))]">.
- Term content (definitions, botPart, whyYouCare): src/content/terms.json.

STUDY THESE FIRST — they're the design already applied, your gold standard:
- src/games/hallucination/index.jsx  (a FULL game in the new design — copy its patterns)
- src/screens/Workshop.jsx, src/components/StatusReadout.jsx,
  src/components/TermChecklist.jsx, src/screens/ProgressScreen.jsx
- design-mix/index.html is the original visual prototype for reference.

THE "CHUNKY" DESIGN RULES
- Cards: `rounded-lg border-[3px] border-neutral bg-surface shadow-card`
  (large) or `shadow-pop` (small). Sage panels: `bg-muted`.
- Buttons: `border-[3px] border-neutral shadow-pop press`. Primary action
  `bg-primary text-white`; secondary `bg-tertiary text-white`.
- Type: h1–h3 use the display font automatically. Eyebrows/labels/tags/buttons
  use `font-label` (mono, uppercase). Body text `text-text`, muted `text-text-muted`.
- Icons: Material Symbols — `<span className="material-symbols-rounded">name</span>`
  (add the `fill` class for filled).
- Feedback: success `bg-success-bg text-success`, danger `bg-danger-bg text-danger`.

CRITICAL GOTCHAS (learned the hard way)
- NEVER use Tailwind `/opacity` on the CSS-variable colors (e.g. `bg-cheese/20`,
  `fill-muted/50`) — it renders BLACK/broken because the tokens are `var()`
  colors. Use a solid token (e.g. `bg-accent-soft`) or add a new solid token in
  tokens.css + tailwind.config.js. Plain `bg-white/25` is fine (white isn't a var).
- NO raw hex/rgb in components — only tokens (Tailwind classes or
  `var(--color-…)`). Need a decorative color? Add it as a token in tokens.css.
- The token game (src/games/token/) still has `bg-cheese/10`, `bg-success/20`,
  etc. — FIX those when you re-skin it (they currently don't render).

LAYOUT / FIT
- Keep each game compact enough to avoid forced scrolling on a phone (chrome is
  ~137px: 57 header + 80 nav). Prefer fixed-size elements that don't resize
  between states (see how hallucination pins its claim card to a fixed height).

GAMES TO RE-SKIN (keep each one's existing mechanic + content — restyle only):
token (also fix its /opacity classes), context-window, prompt, agent, tool-use,
skill, memory, mcp, guardrails.
Do NOT touch hallucination — it's done; use it as the reference.

WORKFLOW: re-skin one game → run it in the browser → verify it works and fits →
next. Commit in batches; end commit messages with:
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
