import { lazy } from 'react'

/**
 * Game registry — the only place that knows every game exists.
 * Adding game #11 = one folder + one line here. Games never import
 * each other or the workshop; they only implement { termId, onComplete }.
 */
export const gameRegistry = {
  hallucination: lazy(() => import('./hallucination/index.jsx')),
}
