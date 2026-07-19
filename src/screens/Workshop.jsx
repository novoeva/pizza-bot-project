import { useMemo } from 'react'
import BotCanvas from '../components/BotCanvas.jsx'
import TermChecklist from '../components/TermChecklist.jsx'
import FailureLine from '../components/FailureLine.jsx'
import { useProgress } from '../lib/useProgress.js'
import { getFailureLine } from '../lib/failureLine.js'
import terms from '../content/terms.json'

export default function Workshop() {
  const completedTerms = useProgress()
  const total = terms.length

  // Recomputed each time the completed set changes, so a fresh line
  // appears whenever the player returns having finished another game.
  const failureLine = useMemo(() => getFailureLine(completedTerms), [completedTerms])

  return (
    <main className="mx-auto max-w-game px-4 pb-[calc(2rem+var(--space-safe-bottom))] pt-8">
      <header className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-cheese">Pizza Bot</h1>
        <p className="text-text-muted text-sm mt-1">Build the AI assistant, one term at a time.</p>
      </header>

      <BotCanvas completedTerms={completedTerms} />

      <p className="text-center text-text-muted text-sm mt-3 mb-5">
        {completedTerms.length} / {total} parts installed
      </p>

      {completedTerms.length === total ? (
        <p className="rounded-md bg-success-bg border border-success px-4 py-3 text-sm text-center text-success font-medium mb-6">
          It's alive. Your bot just made its first pizza.
        </p>
      ) : (
        <div className="mb-6">
          <FailureLine line={failureLine} />
        </div>
      )}

      <h2 className="font-display text-lg font-semibold mb-3">Learn the terms</h2>
      <TermChecklist completedTerms={completedTerms} />
    </main>
  )
}
