#!/usr/bin/env node
// Print how GPT-4o's tokenizer splits any text, so game copy that claims
// "this is N tokens" can be checked instead of guessed.
//   node scripts/tokens.mjs "I'd like a pepperoni, thanks!" " pizza" pepperoni
import { encode, decode } from 'gpt-tokenizer/encoding/o200k_base'
for (const text of process.argv.slice(2)) {
  const ids = encode(text)
  console.log(`${JSON.stringify(text)} → ${ids.length}: ${ids.map((i) => JSON.stringify(decode([i]))).join(' ')}`)
}
