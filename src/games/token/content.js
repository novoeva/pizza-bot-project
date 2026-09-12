// Self-contained content for the Token game.
// Two beats, both grounded in the term's definition ("a piece of a word, usually
// a few letters long"):
//   1. "What a token is", a token IS a piece of text. The player guesses how
//      many pieces a word is; "Pepperoni" splits into four. The definition
//      must never hint at the count (Nina 5.1), so no example word lives there.
//   2. "How it picks the next token", the model writes one token at a time,
//      each a prediction of what comes next. The player guesses the next token
//      and then sees the model's probability ranking.

// ---- Beat 1: tokenization ----
// The hook word: "Pepperoni" -> 4 tokens. GUESS_OPTIONS in index.jsx grows
// with this list, so a longer word still has its answer on the tiles.
export const hookWord = 'Pepperoni'
export const hookTokens = ['Pep', 'per', 'on', 'i']

// Supporting reveal: a whole short order, chunked, so the pattern is visible,
// common words stay whole, rare ones split, punctuation is its own token.
export const samplePhrase = {
  text: "I'd like a pepperoni pizza!",
  tokens: ['I', "'d", 'like', 'a', 'pep', 'per', 'on', 'i', 'pizza', '!'],
}

// ---- Beat 2: next-token prediction ----
// One clear "top pick" per round; the player guesses before seeing the ranking.
// Percentages in each round sum to 100.
// 5.2 (Nina): the model predicts a TOKEN, never a whole word. Every option
// here is a short, everyday word that is one token on its own (beat 1 already
// showed "pizza" as a single token), and the screen says so. No long or rare
// word that would split, like "salami" (sal + ami) or "penguin" (pen + guin).
export const predictionRounds = [
  {
    context: 'The Diavola is our spiciest',
    options: [
      { word: 'salad', pct: 17 },
      { word: 'pizza', pct: 72 },
      { word: 'soup', pct: 3 },
      { word: 'pasta', pct: 8 },
    ],
    why: '"pizza" fits both the sentence and the menu, so it\'s the model\'s runaway top pick.',
  },
  {
    context: 'Thanks so much for your',
    options: [
      { word: 'time', pct: 23 },
      { word: 'order', pct: 63 },
      { word: 'socks', pct: 4 },
      { word: 'pizza', pct: 10 },
    ],
    why: '"order" is the natural next word. The model has seen millions of sentences like this one.',
  },
]
