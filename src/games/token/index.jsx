import { useMemo, useState } from 'react'
import { turns } from './turns.js'
import { tokenize } from './tokenize.js'
import terms from '../../content/terms.json'

/**
 * Token game — { termId, onComplete } interface.
 * "The token budget": every reply the player picks visibly chops into token
 * chunks and a shared budget ticks down per chunk. Concise replies fit;
 * one flowery reply alone can eat more than half the budget.
 */
export default function TokenGame({ termId, onComplete }) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [pick, setPick] = useState(null) // null | 'concise' | 'flowery'
  const [picks, setPicks] = useState([])
  const [phase, setPhase] = useState('playing') // 'playing' | 'consequences' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const current = turns[turnIndex]
  const isLastTurn = turnIndex === turns.length - 1

  // Budget: comfortably covers the concise path, but not much more —
  // one flowery pick is designed to blow it.
  const budget = useMemo(() => {
    const conciseTotal = turns.reduce((sum, t) => sum + tokenize(t.concise).cost, 0)
    return conciseTotal + 15
  }, [])

  const tokenized = pick ? tokenize(current[pick]) : null
  const spentSoFar = picks.reduce((sum, p) => sum + p.cost, 0)
  const runningTotal = spentSoFar + (tokenized ? tokenized.cost : 0)
  const overBudget = runningTotal > budget

  function handlePick(kind) {
    if (pick) return
    setPick(kind)
    setPicks((p) => [...p, { kind, cost: tokenize(current[kind]).cost }])
  }

  function handleNext() {
    if (isLastTurn) {
      setPhase('consequences')
      return
    }
    setTurnIndex((i) => i + 1)
    setPick(null)
  }

  const totalSpent = picks.reduce((sum, p) => sum + p.cost, 0)
  const budgetHeld = totalSpent <= budget
  // First turn where cumulative spend blew the budget, if any.
  let overflowIndex = -1
  let running = 0
  for (let i = 0; i < picks.length; i++) {
    running += picks[i].cost
    if (running > budget && overflowIndex === -1) overflowIndex = i
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Every reply you get from an AI is paid for in chunks like these — not words, not
          characters, but tokens. A flowery reply doesn't just read longer, it costs more, every
          single time. That's why long chats get slower and pricier, and why concise beats
          verbose when you're the one paying for it.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Token</h2>
          <p className="text-text">{term.definition}</p>
        </div>

        <div className="rounded-md bg-bg-raised border border-border px-4 py-4">
          <p className="text-text-muted text-sm">
            <span className="font-semibold text-info">Why you care: </span>
            {term.whyYouCare}
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="mt-2 rounded-md bg-tomato text-text font-semibold py-3 shadow-pop active:scale-[0.98] transition-transform"
        >
          Snap it onto your bot →
        </button>
      </div>
    )
  }

  if (phase === 'consequences') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-text-muted text-sm">
          {totalSpent} / {budget} tokens spent
        </p>

        <div className="flex flex-col gap-3">
          {turns.map((turn, i) => (
            <div
              key={i}
              className={
                'rounded-md border px-4 py-3 ' +
                (i === overflowIndex
                  ? 'bg-danger-bg border-danger'
                  : 'bg-surface border-border')
              }
            >
              <p className="text-text-muted text-xs mb-1">"{turn.question}"</p>
              <p className={'text-sm font-semibold ' + (i === overflowIndex ? 'text-danger' : 'text-text')}>
                {picks[i].kind === 'flowery' ? 'Flowery reply' : 'Concise reply'} — {picks[i].cost} tokens
              </p>
              {i === overflowIndex && (
                <p className="text-danger text-sm mt-1">
                  Budget ran out here. The rest of this reply gets cut off mid-sent—
                </p>
              )}
            </div>
          ))}
        </div>

        <p
          className={
            'rounded-md border px-4 py-3 text-sm text-center font-medium ' +
            (budgetHeld
              ? 'bg-success-bg border-success text-success'
              : 'bg-danger-bg border-danger text-danger')
          }
        >
          {budgetHeld
            ? 'Budget covered — every customer got a full answer, with room to spare.'
            : "Budget blown — one flowery reply ate more than half of it."}
        </p>

        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          See what this means →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-text-dim">
        <span>
          Customer {turnIndex + 1} / {turns.length}
        </span>
        <span>{spentSoFar} tokens spent so far</span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Token budget</span>
          <span>
            {Math.min(runningTotal, budget)} / {budget}
            {overBudget ? ' (over!)' : ''}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slot-empty overflow-hidden">
          <div
            className={
              'h-full transition-all duration-500 ' + (overBudget ? 'bg-danger' : 'bg-cheese')
            }
            style={{ width: `${Math.min(100, (runningTotal / budget) * 100)}%` }}
          />
        </div>
      </div>

      <div className="rounded-md bg-surface px-4 py-6 text-center">
        <p className="text-lg font-medium">A customer asks: "{current.question}"</p>
      </div>

      {!pick ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handlePick('concise')}
            className="rounded-md bg-surface border-2 border-border text-text font-medium py-4 px-3 text-left active:scale-[0.98] transition-transform"
          >
            "{current.concise}"
          </button>
          <button
            type="button"
            onClick={() => handlePick('flowery')}
            className="rounded-md bg-cheese/20 border-2 border-cheese text-cheese font-semibold py-4 px-3 text-left active:scale-[0.98] transition-transform"
          >
            "{current.flowery}"
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-md bg-bg-raised border border-border px-4 py-3">
            <p className="text-xs text-text-dim mb-2">Reply chunked into tokens:</p>
            <p className="text-sm leading-relaxed font-mono text-text-muted break-words">
              {tokenized.words.map((w, wi) => (
                <span key={wi} className="mr-2 inline-block">
                  {w.chunks.map((chunk, ci) => (
                    <span
                      key={ci}
                      className={
                        'inline-block px-0.5 rounded ' +
                        (ci % 2 === 0 ? 'bg-cheese/25 text-cheese' : 'bg-tomato/25 text-tomato')
                      }
                    >
                      {chunk}
                      {ci < w.chunks.length - 1 ? '·' : ''}
                    </span>
                  ))}
                </span>
              ))}
            </p>
            <p className="text-right text-sm font-semibold mt-2 text-cheese">
              +{tokenized.cost} tokens
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
          >
            {isLastTurn ? 'See the bill →' : 'Next customer →'}
          </button>
        </div>
      )}
    </div>
  )
}
