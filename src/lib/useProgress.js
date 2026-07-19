import { useEffect, useState } from 'react'
import { getCompletedTerms, subscribe } from './progress.js'

/** Reactive read of completed term ids; re-renders when progress changes anywhere in the app. */
export function useProgress() {
  const [completed, setCompleted] = useState(getCompletedTerms)

  useEffect(() => {
    return subscribe((state) => setCompleted(state.completed))
  }, [])

  return completed
}
