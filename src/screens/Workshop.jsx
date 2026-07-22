import { useMemo } from 'react'
import BotCanvas from '../components/BotCanvas.jsx'
import TermChecklist from '../components/TermChecklist.jsx'
import StatusReadout from '../components/StatusReadout.jsx'
import { useProgress } from '../lib/useProgress.js'
import { getFailureLine } from '../lib/failureLine.js'
import terms from '../content/terms.json'

const PEGBOARD = {
  backgroundImage: 'radial-gradient(var(--color-pegboard-dot) 1.3px, transparent 1.3px)',
  backgroundSize: '20px 20px',
}

export default function Workshop() {
  const completedTerms = useProgress()
  const total = terms.length
  const done = completedTerms.length
  const powered = done === total

  const failureLine = useMemo(() => getFailureLine(completedTerms), [completedTerms])
  const firstMissing = useMemo(() => {
    const set = new Set(completedTerms)
    return [...terms].sort((a, b) => a.order - b.order).find((t) => !set.has(t.id))
  }, [completedTerms])

  const line = powered ? "Your bot's online. It makes pizza now — and only pizza. Exactly as planned." : failureLine

  return (
    <main className="mx-auto max-w-game px-4 pb-[calc(6rem+var(--space-safe-bottom))] pt-5">
      <p className="text-center font-label text-xs text-text-muted">What is this app?</p>
      <h1 className="mt-1 text-center text-2xl leading-tight">Learn AI terms and build a pizza bot</h1>

      <div className="relative mt-4 rounded-lg border-[3px] border-neutral bg-muted p-4 pb-6 shadow-card" style={PEGBOARD}>
        <BotCanvas completedTerms={completedTerms} />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-[3px] border-neutral bg-surface px-4 py-1.5 font-label text-xs">
          {done} / {total} parts built
        </div>
      </div>

      <div className="mt-5">
        <StatusReadout line={line} powered={powered} firstMissingId={firstMissing?.id} />
      </div>

      <h2 className="mb-3 mt-7 font-label text-sm text-text-muted">
        {powered ? 'Replay any game' : 'System components'}
      </h2>
      <TermChecklist completedTerms={completedTerms} />
    </main>
  )
}
