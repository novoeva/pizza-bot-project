# Copy edit report

**Date:** 26 July 2026
**Scope:** all player-facing text in `src/`. No logic, variable names, config, design docs or `pizza-bot-design-v0/` touched.

---

## 1. Summary

| Check | Result |
|---|---|
| Em-dashes and en-dashes found | 17 |
| Em-dashes and en-dashes remaining in `src/` | **0** |
| Banned corporate words (leverage, robust, seamless, unlock, empower, harness, delve, elevate, journey) | 0 remaining |
| AI tell patterns ("it's not just X it's Y", "think of it as", "here's the thing", "the key insight") | 0 remaining |
| JSON files parse | both OK |
| Syntax check on all 39 `src/` files | all parse cleanly (esbuild) |

A note on the build: `npm run build` cannot run in this environment because `node_modules` holds macOS binaries and the sandbox is Linux. Instead every `.js` and `.jsx` file in `src/` was parsed with esbuild, which catches any syntax break. Run `npm run build` locally to be fully sure.

A second note on `git diff`: 24 files show as changed, but only the 13 below were touched in this pass. The other 11 already had uncommitted changes before it started.

---

## 2. Files changed

| File | What changed |
|---|---|
| `src/content/terms.json` | 8 of 11 definitions rewritten for plain language, 1 dash removed |
| `src/games/agent/script.js` | 7 dashes, emoji removed, two failure lines rewritten |
| `src/games/agent/index.jsx` | 7 dashes, two UI lines rewritten |
| `src/games/temperature/index.jsx` | 1 dash, "candidates" replaced with plain words |
| `src/games/temperature/content.js` | all 6 explanation lines shortened |
| `src/games/token/index.jsx` | "LLM" now explained, prediction explainer rewritten |
| `src/games/context-window/messages.js` | "Real talk" section rewritten, "token" glossed, "codebase" removed |
| `src/games/prompt/rounds.js` | 3 idioms removed |
| `src/games/prompt/index.jsx` | 3 labels rewritten, "Deploy" removed |
| `src/games/memory/index.jsx` | "session" and "slate is blank" removed, working memory explained inline |
| `src/games/mcp/index.jsx` | proof text shortened, one button label rewritten |
| `src/games/mcp/systems.js` | 2 wrong-answer explanations shortened |
| `src/screens/ProgressScreen.jsx` | "unlock" removed, share line simplified |

Untouched because the copy was already clean: `failure-lines.json`, `hallucination/*`, `skill/*`, `guardrails/*`, `tool-use/*`, `Workshop.jsx`, `GameScreen.jsx`, all shared components.

---

## 3. Term definitions (`terms.json`)

This is the teaching payload, so it got the closest read. The biggest fixes:

### Agent
The old definition was a broken run-on sentence: two clauses were glued together with a comma so it read as if "keeps going until the job's done" and "charges the card" were the same list.

| | |
|---|---|
| **Before** | "A chatbot talks about doing something; an agent actually does it: it plans what needs to happen, acts, checks the result, and keeps going (or re-plans) until the job's done, charges the card, notifies the kitchen, no human in between." |
| **After** | "A chatbot talks about doing something. An agent actually does it. It works out what needs to happen, then does it: charges the card, tells the kitchen, sends out a driver. No human in between." |

### Token, "why you care"
The old line described temperature, not tokens, and did not match the learning goal in GAME-DESIGN.md ("can explain why long chats get slow and expensive").

| | |
|---|---|
| **Before** | "It's why the same question to Claude or ChatGPT can sound different each time, and why a 'more consistent' setting exists..." |
| **After** | "It's why long chats get slower and cost more. The AI has to look at every chunk, and a long conversation is a lot of chunks. It's also why AI is bad at counting the letters in a word: it never sees the letters, only the chunks." |

### Memory
"Working memory" and "persistent memory" were used as if the player already knew them.

| | |
|---|---|
| **Before** | "Working memory lasts one conversation; persistent memory carries facts, like your usual order, across visits." |
| **After** | "An AI has two kinds of memory. Working memory lasts one conversation and then it is gone. Persistent memory is written down and saved, so facts like your usual order are still there on your next visit." |

### MCP
Three letters with no expansion. Now the real name is visible.

| | |
|---|---|
| **Before** | "MCP is one shared plug that AI assistants and outside systems both agree to use..." |
| **After** | "MCP (short for Model Context Protocol) is one shared plug that AI assistants and outside systems both agree to use..." |

### Others
- **Prompt:** one 45-word sentence split into three short ones.
- **Hallucination:** "states something false" became "says something false". "Confidence isn't the same as correctness" became "Sounding sure is not the same as being right".
- **Skill:** "one recurring situation" became "one situation that keeps coming back".
- **Guardrails:** added "You decide them in advance", which is the actual learning goal and was missing. "A clever prompt" became "a clever customer", since the player has not met the word "prompt" yet in that game.
- **Tool use:** "calls a real system" became "looks something up in a real system". "Calls" is developer language.
- **Guardrails, how to play:** the old line only described round 1. Round 2 added.

---

## 4. Notable rewrites by game

### Token
Biggest jargon problem in the app: "LLM" appeared cold, mid-game, with no explanation.

| | |
|---|---|
| **Before** | "An LLM never writes a whole reply at once. It predicts just the next token, statistically, from everything it's seen so far. Then it does it again, and again." |
| **After** | "The model (an LLM, short for large language model) never writes a whole reply at once. It picks one token, then the next, then the next. Every pick is a guess at what fits best after everything it has seen so far." |

### Context window
The "Real talk" section had the game's longest sentences and two unglossed technical words.

| | |
|---|---|
| **Before** | "...Think of a coding assistant working through a large codebase: it reads dozens of files, runs tools, keeps the whole task history, and holds all of it at once..." |
| **After** | "It does fill up on bigger jobs. A coding assistant working through a big project reads dozens of files, uses tools, and keeps the whole task history in view at the same time..." |

Also added a gloss so this game stands alone if played first: "The biggest models today hold around 1 million tokens. **A token is a small chunk of text**, and 1 million of them is roughly a few full novels."

### Agent
| Before | After |
|---|---|
| "One large diavola to 12 Main St, please — paying by card." | "One large diavola to 12 Main St, please. Paying by card." |
| "Ooh, the diavola is our spiciest — you'll love it! 😋" | "Ooh, the diavola is our spiciest one. You'll love it!" |
| "You sent the driver before the kitchen even cooked — Luca's parked outside with an empty bag." | "You sent the driver before the kitchen even cooked. Luca is parked outside with an empty bag." |
| "It talked. Nothing actually happened — no pizza is coming." | "It talked. Nothing actually happened. No pizza is coming." |
| Asleep system label: "— asleep" | "asleep" |

### Prompt
Three idioms a non-native reader would trip on, plus one tech word.

| Before | After |
|---|---|
| "Your bot runs, but a few choices will bite you" | "Your bot runs, but a few of these choices will cause problems" |
| "has no spine, so it won't catch a bad order" | "agrees with anything, so it won't catch a bad order" |
| "interrogates the customer instead of chatting" | "fires questions at the customer instead of chatting" |
| "keeps it a friendly back-and-forth" | "keeps it a friendly conversation" |
| Button: "Deploy this bot" | "Switch this bot on" |
| "Your bot's instructions were too thin" | "Your bot's instructions were missing too much" |

### Memory
| Before | After |
|---|---|
| "Session 1, the bot is chatting with Anna." | "Visit 1: the bot is chatting with Anna." |
| "Same bot, new session, the slate is blank." | "Same bot, new chat, nothing saved." |
| "Check whatever the bot should remember, anything you skip is forgotten when the chat ends." | "Tick whatever the bot should remember. Anything you skip is gone the moment the chat ends." |
| "Its working memory is perfect inside a single chat, but nothing survives..." | "Inside one chat its memory is perfect. That is working memory. But nothing survives once the chat ends..." |

The last one matters: it names "working memory" at the exact moment the player feels it, instead of assuming they know it.

### Temperature
All six explanation lines were long and built from the same template. Each is now one or two short sentences.

| | |
|---|---|
| **Before** | "When the output must be identical and reliable, you turn the temperature down so the bot always reaches for the safest, most likely wording." |
| **After** | "When the wording has to be identical every time, you turn the temperature down. The bot then reaches for the safest, most likely word." |

Also: "Same candidates every time" became "Same words to choose from every time". "Candidates" is statistics language.

### MCP
| Before | After |
|---|---|
| "A stock tracking tool was built last month, by a company that has never heard of you. It does not know your bots exist. Your bots were built before it existed. Nobody has ever put these two things in the same room." (four sentences, rhythm-driven) | "A stock tracking tool was built last month by a company that has never heard of you. Your bots were built before that tool existed. Nobody has ever put these two things in the same room." |
| Button: "But here is the real payoff" | "Now the useful part" |

The two wrong-answer explanations were also cut down and their questions reordered so each asks one thing at a time.

### Progress screen
| Before | After |
|---|---|
| "Build all 11 parts to switch your bot on and **unlock** the diploma. No shortcuts, but no locks either." | "Build all 11 parts to switch your bot on and get the diploma. Nothing is locked." |
| "Let the world know your pizza agent is ready" | "Your pizza agent is ready. Tell people." |

---

## 5. Judgement calls

**Emoji kept.** Three sets survive because they are part of the visual style, not AI filler:
- `📍 🔥 📦` on the tool-use buttons, they act as icons for each tool
- `🍕🤖` in the LinkedIn share text, deliberate for a social post
- `✓` and `✕` as status and remove markers

Two were removed: `😋` in the chatbot's reply and `🔥` in "Order #A12 firing". Both sat inside sentences and read as chirpy filler rather than as part of the design.

**Files left alone.** `failure-lines.json` is the strongest copy in the app. Short, dry, no dashes, no AI tells. Same for the hallucination, skill, guardrails and tool-use content. Editing them would have flattened the voice for no gain.

**"Real talk" boxes kept.** They are honest, useful and part of the game's personality.

---

## 6. Suggested follow-ups

Not done, because they change design rather than copy:

1. **`failure-lines.json` is thin.** Two lines per term. The brief asks for 15 to 20 total, and the humour engine repeats fast when there are only two options per term.
2. **The Token game's "why you care" now mentions letter counting**, which no beat in the game demonstrates. It is true and useful, but a future beat could show it.
3. **Guardrails and Agent cross-reference each other** in GAME-DESIGN.md, but neither game says so on screen. One line on the agent end card would tie the two together.
