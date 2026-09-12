// Self-contained content for the Token game.
// Two beats, both grounded in the term's definition ("a token is a small
// chunk of text, 'Pepperoni' breaks into four of them"):
//   1. "Chop it up", a token IS a chunk of text. The player guesses how many
//      tokens a word is; "Pepperoni" splits into four.
//   2. "Guess what's next", the model writes one token at a time, each a
//      prediction of what comes next. The player guesses the next token and
//      then sees the model's probability ranking.

// ---- Beat 1: tokenization ----
// The hook word matches the definition exactly: "Pepperoni" -> 4 tokens.
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
// here is a short, common word that is one token on its own (beat 1 already
// showed "pizza" as a single token), and the screen says so. No word that
// would split, like "salami" (sal + ami).
export const predictionRounds = [
  {
    context: 'The Diavola is our spiciest',
    options: [
      { word: 'salad', pct: 17 },
      { word: 'pizza', pct: 72 },
      { word: 'penguin', pct: 3 },
      { word: 'pasta', pct: 8 },
    ],
    why: '"pizza" fits both the sentence and the menu, so it\'s the model\'s runaway top pick.',
  },
  {
    context: 'Thanks so much for your',
    options: [
      { word: 'patience', pct: 23 },
      { word: 'order', pct: 63 },
      { word: 'elephant', pct: 4 },
      { word: 'pizza', pct: 10 },
    ],
    why: '"order" is the natural next word. The model has seen millions of sentences like this one.',
  },
]
