// Content + data for the RAG game ("You are the search").
//
// The whole lesson in one line: a bot answering "from our documents" only ever
// reads the couple of pages that got handed to it, and it CANNOT tell a current
// page from an outdated one. The player feels it by BEING the retrieval step:
// the bot sits behind a counter with a fat, messy binder, and the player's job
// is not to answer the customer — it's to decide which pages the bot gets to
// read (at most two, ever). The bot then answers, out loud and confidently,
// using only what it was handed.
//
//   Round 1  easy win     — the answer is on one clearly-labelled page. Learn
//                           the mechanic: search, grab, answer.
//   Round 2  the trap     — two pages both say "Price list". One is current,
//                           one is two years old, and the date is small and low.
//                           Grab the old one and the bot quotes the old price
//                           with total confidence. It never knew.
//   Round 3  nothing fits — no page is about weddings. Hand the adjacent page
//                           and the bot invents a whole wedding package (bridge
//                           to hallucination). Hand nothing and it correctly
//                           says it doesn't know (and that's allowed to feel
//                           unsatisfying). Neither is a fail screen.
//
// The two-page cap is the honest reason retrieval exists, and the labelled
// hand-off to context window: the bot can't read the whole binder at once, so
// something has to choose the pages.

export const MAX_PAGES = 2

// The binder — the SAME fixed set of pages every round. The player searches
// this pile fresh each question, which is the whole point of "you are the
// search". Two pages are titled identically ("Price list") on purpose: the only
// thing telling them apart is the small `foot` date, easy to skip.
export const pages = [
  {
    id: 'menu-pizzas',
    title: 'Menu — Pizzas',
    kind: 'Menu page',
    icon: 'restaurant_menu',
    snippet: 'Margherita · Marinara · Quattro Formaggi (four cheeses, no meat) · Diavola (spicy salami)…',
  },
  {
    id: 'price-current',
    title: 'Price list',
    kind: 'Price list',
    icon: 'sell',
    snippet: 'Margherita 159 · Quattro Formaggi 229 · Diavola large 259 …',
    foot: 'valid from Jan 2026',
  },
  {
    id: 'price-old',
    title: 'Price list',
    kind: 'Price list',
    icon: 'sell',
    snippet: 'Margherita 129 · Quattro Formaggi 169 · Diavola large 189 …',
    foot: 'spring 2024',
  },
  {
    id: 'allergens',
    title: 'Allergen sheet',
    kind: 'Reference',
    icon: 'health_and_safety',
    snippet: 'Gluten, dairy and nut information, per pizza…',
  },
  {
    id: 'office-orders',
    title: 'Note: large office orders',
    kind: 'Staff note',
    icon: 'sticky_note_2',
    snippet: '10+ boxes to one office? Give 10% off and book it the day before.',
  },
  {
    id: 'supplier-email',
    title: 'Supplier email — flour',
    kind: 'Email',
    icon: 'mail',
    snippet: 'Tipo 00 flour delivery moved to Thursday. Invoice attached.',
  },
]

// One customer question per round, plus the current-step instruction shown at
// the top of the play column.
export const rounds = [
  {
    n: 1,
    customer: 'Nadia',
    question: '“Is the Quattro Formaggi vegetarian?”',
    instruction:
      'You’re the bot’s search. Find the page that answers this and hand it over — the bot reads at most two.',
  },
  {
    n: 2,
    customer: 'Petr',
    question: '“How much is a large Diavola?”',
    instruction: 'Same job: hand the bot the page that answers the price. Pick carefully.',
  },
  {
    n: 3,
    customer: 'Léa',
    question: '“Do you cater weddings?”',
    instruction:
      'Nothing in the binder is really about weddings. Hand it a page — or hand it nothing.',
  },
]

/**
 * Work out what the bot says given the round and the pages the player handed it.
 * The bot only ever "knows" what's on those pages, and it never doubts them.
 *
 * Returns { reply, tone, note, advance } where:
 *   reply   — the bot's spoken answer (a message bubble)
 *   tone    — 'good' | 'bad' | 'flat', tints the outcome card
 *   note    — { title, body } shown under the reply, the lesson made concrete
 *   advance — false only for the round-1 miss, so the player retries the mechanic
 */
export function answerFor(n, picked) {
  const has = (id) => picked.includes(id)

  if (n === 1) {
    if (has('menu-pizzas')) {
      return {
        reply: '“Yes — the Quattro Formaggi is four cheeses, no meat. It’s vegetarian.”',
        tone: 'good',
        note: {
          title: 'Nailed it',
          body: 'You handed it the right page, so it answered straight from it. That’s retrieval working — search, grab, answer.',
        },
        advance: true,
      }
    }
    return {
      reply: '“I can’t find anything about that in what you gave me.”',
      tone: 'flat',
      note: {
        title: 'It can only read what you hand it',
        body: 'The answer is on the menu page, and the bot never saw it. That’s the whole mechanic — you decide what it gets to read. Try again.',
      },
      advance: false,
    }
  }

  if (n === 2) {
    // The trap. Old page (alone or alongside the current one) → old price,
    // confidently. It reads the page it was handed and writes fluent text from
    // it; it does not reconcile two lists or weigh their dates.
    if (has('price-old')) {
      return {
        reply: '“A large Diavola is 189 CZK.”',
        tone: 'bad',
        note: {
          title: 'One star at the door',
          body: has('price-current')
            ? 'You handed it both price lists. It doesn’t reconcile them — it wrote from the old one and quoted 189. The real price is 259. The bot never noticed one page was two years old.'
            : 'The customer arrives expecting 189. The real price is 259. Argument at the door. The bot never knew the page was two years old — it read what you handed it and its tone never wavered.',
        },
        advance: true,
      }
    }
    if (has('price-current')) {
      return {
        reply: '“A large Diavola is 259 CZK.”',
        tone: 'good',
        note: {
          title: 'Right — but look closer',
          body: 'Both pages just said “Price list”. You happened to grab the current one. The bot couldn’t have told them apart — only the small date at the bottom does, and the bot doesn’t weigh dates.',
        },
        advance: true,
      }
    }
    return {
      reply: '“I don’t have a price for that in these pages.”',
      tone: 'flat',
      note: {
        title: 'Nothing to quote',
        body: 'No price page in what you handed it, so it had nothing to read a price from.',
      },
      advance: true,
    }
  }

  // Round 3 — nothing in the binder is about weddings.
  if (picked.length === 0) {
    return {
      reply: '“I’m sorry, I don’t have information on wedding catering.”',
      tone: 'flat',
      note: {
        title: 'Correct — and it’s allowed to feel flat',
        body: 'Handed nothing relevant, the honest answer is “I don’t know”. Unsatisfying, but true. This is the outcome you actually want.',
      },
      advance: true,
    }
  }
  return {
    reply:
      '“Absolutely! Our wedding package serves 40 guests with a spread of pizzas, a dessert platter and delivery — 6,900 CZK. Shall I book it?”',
    tone: 'bad',
    note: {
      title: 'None of this exists',
      body: 'There’s no wedding page in the binder. The closest was a note about office orders, so the bot built a whole wedding package out of it — price and all. Grounding it in documents narrowed where the invention came from. It didn’t stop the invention.',
    },
    advance: true,
  }
}

// The Real talk box on the reveal — the uncomfortable truth the game exists for.
export const realTalk =
  'In a real system nobody picks the pages — a search does, and it goes wrong in exactly the ways you just did: a strong keyword match beats the correct page, and an old document looks identical to a new one. So ask which document an answer came from, and whether it’s current.'
