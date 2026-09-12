import terms from '../content/terms.json'

/**
 * The one place that knows how the term list is ordered and counted. Every
 * screen that says "N terms", numbers the terms, or looks for the next one
 * reads it from here, so terms.json stays the single source of truth.
 */

/** Every term in teaching order (terms.json `order`). Computed once. */
export const sortedTerms = [...terms].sort((a, b) => a.order - b.order)

/** How many terms the app teaches. */
export const termCount = terms.length

/** 1-based position of a term in the teaching order (0 if the id is unknown). */
export function termPosition(id) {
  return sortedTerms.findIndex((t) => t.id === id) + 1
}

/** The first term in teaching order that is not completed yet, or undefined. */
export function firstIncomplete(completedTerms) {
  const done = new Set(completedTerms)
  return sortedTerms.find((t) => !done.has(t.id))
}
