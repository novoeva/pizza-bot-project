// Self-contained content for the Token game.
// Two beats, both grounded in the term's definition ("a piece of a word, usually
// a few letters long"):
//   1. "What a token is", a token IS a piece of text. The player guesses how
//      many pieces a word is; "Pepperoni" splits into four. The definition
//      must never hint at the count (Nina 5.1), so no example word lives there.
//   2. "How it picks the next token", the model writes one token at a time,
//      each a prediction of what comes next. The bot writes "pepperoni" piece
//      by piece (the same pieces as beat 1); the player calls each next piece
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
// PIZZA-31 (Nina, interview #3): a model never predicts a whole word, it
// predicts the next TOKEN. So here the bot writes "pepperoni" one piece at a
// time, using exactly the pieces beat 1 showed (pep | per | on | i). Every
// round stops mid-word: the pieces already written are on screen and the
// player calls the next one. Options are the pieces themselves, plus (in the
// last round) the odd whole short word or punctuation mark, because those are
// single tokens too (beat 1 showed "pizza" and "!" as one token each).
//
//   before   plain text already written, before the word in progress
//   written  pieces of the current word already on screen (from hookTokens)
//   options  candidate next tokens; `makes` = the word that piece would start
//            or finish, shown in the ranking after the pick; `space` marks a
//            token that starts a new word (drawn with a gap, not glued on)
//   after    pieces the bot still has to pick once the top option lands
//   note     optional line under the sentence (how the bot got here)
//   why      the verdict copy after the pick
// One clear top pick per round; percentages in each round sum to 100.
export const predictionRounds = [
  {
    before: 'Great choice! One',
    written: ['pep'],
    options: [
      { token: 'per', pct: 71, makes: 'pepper\u2026' },
      { token: 'si', pct: 19, makes: 'Pepsi' },
      { token: 'tide', pct: 6, makes: 'peptide' },
      { token: 'py', pct: 4, makes: 'peppy' },
    ],
    after: ['on', 'i'],
    why: '"pep" and "per" together start "pepperoni", which is on your menu, so "per" is the runaway pick. Your bot did not guess the whole word. It guessed one piece, and it still has two more to pick.',
  },
  {
    before: 'Great choice! One',
    written: ['pep', 'per'],
    options: [
      { token: 'on', pct: 64, makes: 'pepperon\u2026' },
      { token: 'mint', pct: 17, makes: 'peppermint' },
      { token: 's', pct: 12, makes: 'peppers' },
      { token: 'ed', pct: 7, makes: 'peppered' },
    ],
    after: ['i'],
    why: '"pepper" could still turn into peppermint or peppers, but after "One pepper" on a pizza menu, "on" wins by a mile. One piece to go.',
  },
  {
    before: 'Great choice! One',
    written: ['pep', 'per', 'on', 'i'],
    note: 'Your bot took "i" on its own: after "pepperon", nothing else fits.',
    options: [
      { token: 'pizza', pct: 74, makes: 'a whole word', space: true },
      { token: 'and', pct: 11, makes: 'a whole word', space: true },
      { token: ',', pct: 9, makes: 'punctuation' },
      { token: 's', pct: 6, makes: 'pepperonis' },
    ],
    after: [],
    why: 'The word is finished, so this time the next token is a whole short word. "pizza" is common enough to be one token on its own, and it is what "pepperoni" is usually followed by on your menu.',
  },
]
