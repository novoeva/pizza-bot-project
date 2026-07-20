// Deliberately simplified stand-in for a real BPE tokenizer — good enough to
// make the point ("often part of a word") without shipping a tokenizer model.
// Splits each word into alternating 3/2-char chunks, e.g. pepperoni -> pep·pe·ro·ni.
function chunkWord(word) {
  if (word.length <= 3) return [word]
  const chunks = []
  let i = 0
  let big = true
  while (i < word.length) {
    const size = big ? 3 : 2
    chunks.push(word.slice(i, i + size))
    i += size
    big = !big
  }
  return chunks
}

/** Tokenize a sentence into { word, chunks }[] plus a total chunk count (the "cost"). */
export function tokenize(text) {
  const words = text.split(' ').map((word) => ({ word, chunks: chunkWord(word) }))
  const cost = words.reduce((sum, w) => sum + w.chunks.length, 0)
  return { words, cost }
}
