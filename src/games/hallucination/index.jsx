import { useState } from 'react'
import { turns } from './turns.js'
import terms from '../../content/terms.json'

/**
 * Hallucination game — { termId, onComplete } interface.
 * "Never say I don't know": the player plays the bot itself. Confident,
 * invented answers are rewarded in the moment (satisfaction jumps, streak
 * builds) — the same pull a real model feels to fill a gap fluently
 * rather than admit it. The orders come back after.
 */
export default function HallucinationGame({ termId, onComplete }) {
  const [turnIndex, setTurnIndex] = useState(0)
  const [choice, setChoice] = useState(null) // null | 'confident' | 'honest'
  const [choices, setChoices] = useState([])
  const [satisfaction, setSatisfaction] = useState(50)
  const [streak, setStreak] = useState(0)
  const [phase, setPhase] = useState('playing') // 'playing' | 'consequences' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const current = turns[turnIndex]
  const isLastTurn = turnIndex === turns.length - 1

  function handleChoice(pick) {
    if (choice) return
    setChoice(pick)
    setChoices((c) => [...c, pick])

    if (pick === 'confident') {
      setSatisfaction((s) => Math.min(100, s + 25))
      setStreak((s) => s + 1)
    } else {
      setSatisfaction((s) => Math.max(0, s + 5))
      setStreak(0)
    }
  }

  function handleNext() {
    if (isLastTurn) {
      setPhase('consequences')
      return
    }
    setTurnIndex((i) => i + 1)
    setChoice(null)
  }

  const returnedOrders = choices.filter((c) => c === 'confident').length

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          You just did what every AI does. It's built to produce fluent, confident answers — so
          when it doesn't know, it fills the gap with something plausible. It doesn't feel the
          difference. Now you know why you can't either — not from tone. Confidence isn't
          evidence.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Hallucination</h2>
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
          {returnedOrders} of {turns.length} orders came back
        </p>

        <div className="flex flex-col gap-3">
          {turns.map((turn, i) =>
            choices[i] === 'confident' ? (
              <div key={i} className="rounded-md bg-danger-bg border border-danger px-4 py-3">
                <p className="text-danger font-semibold text-sm mb-1">Order returned</p>
                <p className="text-text-muted text-sm">{turn.consequence}</p>
              </div>
            ) : (
              <div key={i} className="rounded-md bg-success-bg border border-success px-4 py-3">
                <p className="text-success text-sm">No incident — you said you weren't sure.</p>
              </div>
            ),
          )}
        </div>

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
          Turn {turnIndex + 1} / {turns.length}
        </span>
        <span>🔥 Streak: {streak}</span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Customer satisfaction</span>
          <span>{satisfaction}%</span>
        </div>
        <div className="h-2 rounded-full bg-slot-empty overflow-hidden">
          <div
            className="h-full bg-cheese transition-all duration-300"
            style={{ width: `${satisfaction}%` }}
          />
        </div>
      </div>

      <div className="rounded-md bg-surface px-4 py-6 text-center">
        <p className="text-text-muted text-sm mb-2">You don't actually know this one.</p>
        <p className="text-lg font-medium">A customer asks: "{current.question}"</p>
      </div>

      {!choice ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleChoice('confident')}
            className="rounded-md bg-cheese/20 border-2 border-cheese text-cheese font-semibold py-4 px-3 text-left active:scale-[0.98] transition-transform"
          >
            "{current.confidentReply}"
          </button>
          <button
            type="button"
            onClick={() => handleChoice('honest')}
            className="rounded-md bg-surface border-2 border-border text-text-muted font-medium py-4 px-3 text-left active:scale-[0.98] transition-transform"
          >
            "{current.honestReply}"
          </button>
        </div>
      ) : (
        <button type="button" onClick={handleNext} className="flex flex-col gap-2 text-left">
          <div
            className={
              'rounded-md px-4 py-3 border ' +
              (choice === 'confident'
                ? 'bg-success-bg border-success text-success'
                : 'bg-bg-raised border-border text-text-muted')
            }
          >
            <p className="font-semibold">
              {choice === 'confident' ? '😍 Customer delighted!' : '😐 Oh... okay.'}
            </p>
          </div>
          <span className="text-center text-text-dim text-xs">Tap to continue →</span>
        </button>
      )}
    </div>
  )
}
