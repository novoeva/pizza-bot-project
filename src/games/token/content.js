// Self-contained content for the Token game.
// Two beats, both grounded in the term's definition ("a piece of a word, usually
// a few letters long"):
//   1. "What a token is", a token IS a piece of text. The player guesses how
//      many pieces a word is; "pepperoni" splits into two (pepper + oni). The definition
//      must never hint at the count (Nina 5.1), so no example word lives there.
//   2. "How it picks the next token", the model writes one token at a time,
//      each a prediction of what comes next. The player guesses the next token
//      and then sees the model's probability ranking.

// ---- Beat 1: tokenization ----
// The hook word and its REAL split (GPT-4o tokenizer, checked with
// `node scripts/tokens.mjs " pepperoni"`): " pepper" + "oni" = 2 tokens.
// Tokens aren't syllables: a token is a chunk the model has seen a lot, and
// "pepper" is a common word while "oni" is a common ending. GUESS_OPTIONS in
// index.jsx always offers at least 1–4.
export const hookWord = 'pepperoni'
export const hookTokens = ['pepper', 'oni']

// Supporting reveal: a whole short order, chunked the way GPT-4o really does
// it (`node scripts/tokens.mjs "I'd like a pepperoni, thanks!"`): common words
// stay whole, "pepperoni" splits, punctuation is its own token.
export const samplePhrase = {
  text: "I'd like a pepperoni, thanks!",
  tokens: ["I'd", 'like', 'a', 'pepper', 'oni', ',', 'thanks', '!'],
}

// ---- Beat 2: next-token prediction ----
// One clear "top pick" per round; the player guesses before seeing the ranking.
// Percentages in each round sum to 100.
// PIZZA-31 (Nina, Eva): the model predicts a TOKEN, never a whole word. So
// every option here is a short, everyday word that is one token on its own
// (verified with gpt-tokenizer, GPT-4o and GPT-4), the screen says so, and the
// same rule holds in the Temperature game.
export const predictionRounds = [
  {
    context: 'The Diavola is our spiciest',
    options: [
      { word: 'dish', pct: 68 },
      { word: 'one', pct: 19 },
      { word: 'soup', pct: 9 },
      { word: 'hat', pct: 4 },
    ],
    why: '"dish" fits the sentence and the menu, so it\'s the model\'s runaway top pick.',
  },
  {
    context: 'Thanks so much for your',
    options: [
      { word: 'time', pct: 23 },
      { word: 'order', pct: 63 },
      { word: 'socks', pct: 4 },
      { word: 'help', pct: 10 },
    ],
    why: '"order" is the natural next word. The model has seen millions of sentences like this one.',
  },
]
