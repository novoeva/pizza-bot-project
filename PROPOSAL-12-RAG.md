# Proposal: game 12, RAG

**Status:** Proposal, not approved. July 2026.
**Companion to:** `GAME-DESIGN.md` (this entry is written to slot in as section 12) and `PROJECT-PIZZA-BOT-BRIEF.md`.

Written to the same three-part contract as every other entry: definition, learning approach, game concept. Nothing gets built until this is approved or rejected.

---

## Why this game is allowed to exist

The obvious objection: tool use already covers "the bot checks a real source instead of guessing". If this game teaches that again, it is a duplicate and should be rejected.

It does not teach that. The two terms fail in different ways, and the difference is the whole reason to build it:

| | Tool use | RAG |
|---|---|---|
| What comes back | One exact answer from a live system ("23 minutes") | Whatever text happened to match, a few passages |
| Can it be wrong? | Only if the system is wrong | Yes, routinely: wrong page, old page, no page |
| What the bot does with it | Reports it | Reads it and writes an answer from it |
| Player's real-world move | Prefer answers backed by a live check | Ask *which document* the answer came from, and whether it is current |

Tool use teaches trust in checking. RAG teaches that checking a pile of documents is itself unreliable, and how. That is a separate, uncomfortable, useful lesson, and right now nothing in Pizza Bot teaches it.

**Term boundary, stated up front so the game can be reviewed against it:** this game never presses a tool button and never returns a structured value. It only ever hands paper to a bot.

---

## 12. RAG: *Recipe binder*

**Definition:** RAG is when an AI searches a specific set of documents before answering, grabs the few passages that look relevant, and writes its answer from those. It does not "know" your documents. It looks them up, one question at a time, and only sees what the search found.

**Learning goal:** After playing, the player knows that an AI answering "from our documents" is only as good as the pages it retrieved, and that the bot cannot tell a current page from an outdated one. The behavior we want on Monday: ask which document the answer came from.

**Academy sim:** none. Closest relative is the *Grounding Switch* (hallucination module), which already lives in the tool-use game. Nothing to reuse.

**Approach:** C (inoculation, the player IS the retrieval step) + D (consequence feedback). Deliberately not B (contrast), because tool use already owns the round-1-fails/round-2-works structure for external data, and a second game with that shape would read as the same lesson twice. Format: custom.

### Game: "You are the search"

The bot sits behind a counter with a fat, messy binder of pizzeria paperwork: menus, price lists, the allergen sheet, a supplier email, staff notes, an old flyer. The player's job is not to answer the customer. The player's job is to **decide which pages the bot gets to read.**

Hard rule shown from the first screen: **the bot can be handed at most two pages.** It never reads the whole binder. (This is the honest reason retrieval exists, and it is the labeled handoff to context window.)

The bot then answers using only what it was handed, out loud, confidently, in front of the customer.

**Round 1: the easy win.**
Customer: "Is the Quattro Formaggi vegetarian?"
The binder has a clearly labeled, current menu page with the answer on it. The player finds it, hands it over, the bot answers correctly. The player feels competent and learns the mechanic: search, grab, answer.

**Round 2: the trap (this is the game).**
Customer: "How much is a large Diavola?"
Now two pages match strongly. Both say "Price list". One is headed *spring 2024*, one is current, and the year is small, low on the page, easy to skip. Most players will grab the one with the better keyword match at the top.
The bot answers with total confidence: "That's 189 CZK." The consequence lands immediately: the customer arrives, the real price is 259, argument at the door, one star.
Reveal beat: **the bot never knew the page was old.** It cannot tell. It reads what it is handed and writes fluent text from it. The retrieval was wrong, so the answer was wrong, and nothing in the bot's tone changed.

**Round 3: nothing matches.**
Customer: "Do you cater weddings?"
Nothing in the binder covers weddings. There is a vaguely adjacent page (a note about large office orders). Two moves are available:
- Hand over the adjacent page: the bot improvises a wedding catering package from it, in detail, including a price. It does not exist. (Explicit bridge to hallucination: retrieval narrows where the invention comes from, it does not stop the invention.)
- Hand over nothing: the bot says it does not have that information, which is the correct outcome and is *allowed to feel unsatisfying*.

The game does not punish either choice with a fail screen. It shows what each one produces.

**Reveal (standard three boxes):** definition, why you care, plus a Real talk box.

*Real talk:* in a real system nobody picks the pages, a search does it, and it goes wrong in exactly the ways you just went wrong: strong keyword match beats correct page, and old documents look identical to new ones.

### Where this hands off

- **Tool use:** a tool returns one exact answer from a live system. Retrieval returns text that matched, which is a much weaker guarantee.
- **Context window:** the two-page limit is not an arbitrary game rule. The bot cannot read the whole binder at once, which is precisely why something has to choose the pages.
- **Hallucination:** round 3. Grounding the bot in documents narrows the gap-filling, it does not remove it.
- **Memory:** memory is what the bot remembers about *this customer* across visits. The binder is a fixed reference set that belongs to the pizzeria, not to anyone's history.

---

## Drop-in copy

### `src/content/terms.json`

```json
{
  "id": "rag",
  "order": 12,
  "name": "RAG",
  "botPart": "Recipe binder",
  "about": "Your bot can look things up in the pizzeria's paperwork, but it only ever reads the couple of pages it finds first.",
  "howToPlay": "You are the bot's search. Pick which pages it gets to read, then watch it answer using only those.",
  "definition": "RAG is when an AI searches a specific set of documents before answering, grabs the few passages that look relevant, and writes its answer from those. It doesn't know your documents. It looks them up, one question at a time, and only sees what the search found.",
  "whyYouCare": "It's what's behind every \"ask our company AI\" tool. The answer is only as good as the pages it happened to find, and the AI can't tell a current document from an outdated one. So ask it which document the answer came from."
}
```

### `src/content/failure-lines.json`

```json
"rag": [
  "Your bot quoted a price from the 2019 menu. Confidently. The customer has a screenshot.",
  "A customer asked about allergens. Your bot answered from the staff Christmas party memo."
]
```

### Bot part

A binder clipped to the bot's side, visibly stuffed with paper. Distinct from the chest hard drive (memory): the hard drive is what the bot remembers, the binder is what the bot can look up.

---

## Decisions still open

1. **Play order.** Pedagogically this belongs immediately after tool use, because the contrast between the two is the point. That means renumbering 7 through 11 in `terms.json` and anywhere order is read. Cheaper alternative: leave it at 12 and add one bridge line to the tool-use reveal pointing forward. Recommendation: leave it at 12 for now, revisit if play order stops being free.
2. **Name.** "RAG" as the display name assumes the player wants to recognize the acronym from meetings, which is the main argument for building this at all. The `about` line decodes it immediately. Alternative: "RAG (document search)".
3. **Round 2 difficulty.** The old-price page has to be findable but not obvious. If the date is too visible the trap never springs and the lesson dies. This needs one round of testing on a real person before the copy is frozen.
4. **Scope.** This is the 12th game in a project scoped at 10. Temperature was already added as 11. Worth deciding explicitly whether 12 is the new ceiling, or whether the term list is now open.
