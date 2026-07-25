import { lazy } from 'react'

/**
 * Game registry, the only place that knows every game exists.
 * Adding game #11 = one folder + one line here. Games never import
 * each other or the workshop; they only implement { termId, onComplete }.
 */
export const gameRegistry = {
  token: lazy(() => import('./token/index.jsx')),
  'context-window': lazy(() => import('./context-window/index.jsx')),
  hallucination: lazy(() => import('./hallucination/index.jsx')),
  prompt: lazy(() => import('./prompt/index.jsx')),
  agent: lazy(() => import('./agent/index.jsx')),
  'tool-use': lazy(() => import('./tool-use/index.jsx')),
  skill: lazy(() => import('./skill/index.jsx')),
  memory: lazy(() => import('./memory/index.jsx')),
  mcp: lazy(() => import('./mcp/index.jsx')),
  guardrails: lazy(() => import('./guardrails/index.jsx')),
}
