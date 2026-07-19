import terms from '../content/terms.json'
import failureLines from '../content/failure-lines.json'

const ALL_TERM_IDS = terms.map((term) => term.id)

/**
 * Pure selection of the workshop's current failure-mode line.
 * @param {string[]} completedTerms - term ids the player has finished
 * @param {() => number} rng - injectable randomness source, defaults to Math.random (for tests)
 * @returns {string|null} the line to show, or null once every term is complete
 */
export function getFailureLine(completedTerms, rng = Math.random) {
  const completed = new Set(completedTerms)
  const missing = ALL_TERM_IDS.filter((id) => !completed.has(id))

  if (missing.length === 0) return null

  if (missing.length === 1) {
    return pickRandom(failureLines.almostDone, rng)
  }

  const pool = missing.flatMap((id) => failureLines.perTerm[id] ?? [])

  if (completed.size >= 1 && completed.size <= 3) {
    pool.push(...failureLines.combo)
  }

  return pickRandom(pool, rng)
}

function pickRandom(list, rng) {
  return list[Math.floor(rng() * list.length)]
}
