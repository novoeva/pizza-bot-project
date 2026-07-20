import { useState } from 'react'
import { messages, WINDOW_SIZE } from './messages.js'
import terms from '../../content/terms.json'

/**
 * Context window game — { termId, onComplete } interface.
 * "The long order": the window holds WINDOW_SIZE message chips; every new
 * message pushes the oldest one out. The player's one move per turn is to
 * re-pin a chip (send it to the fresh end) before the next message lands.
 */
export default function ContextWindowGame({ termId, onComplete }) {
  const [window_, setWindow] = useState([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [pinnedThisTurn, setPinnedThisTurn] = useState(false)
  const [lastFallen, setLastFallen] = useState(null)
  const [phase, setPhase] = useState('playing') // 'playing' | 'result' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const isDone = turnIndex >= messages.length
  const incoming = !isDone ? messages[turnIndex] : null
  const atRiskId = window_.length === WINDOW_SIZE ? window_[0].id : null

  function rePin(id) {
    if (pinnedThisTurn) return
    setWindow((prev) => {
      const idx = prev.findIndex((m) => m.id === id)
      if (idx === -1) return prev
      const item = prev[idx]
      return [...prev.slice(0, idx), ...prev.slice(idx + 1), item]
    })
    setPinnedThisTurn(true)
  }

  function letItArrive() {
    setWindow((prev) => {
      const next = [...prev, incoming]
      if (next.length > WINDOW_SIZE) {
        setLastFallen(next[0])
        return next.slice(1)
      }
      setLastFallen(null)
      return next
    })
    setPinnedThisTurn(false)
    const nextIndex = turnIndex + 1
    setTurnIndex(nextIndex)
    if (nextIndex >= messages.length) setPhase('result')
  }

  const savedTheDetail = window_.some((m) => m.critical)

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          The bot never "forgot" on purpose — the window just filled up and the oldest chip fell
          out to make room. Re-pinning is the fix, and it's the same move that works on you: in a
          long chat with Claude or ChatGPT, if something matters, say it again near the end.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Context window</h2>
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

  if (phase === 'result') {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-md bg-surface px-4 py-6 text-center">
          <p className="text-text-muted text-sm mb-2">The bot assembles the order from whatever's still in the window:</p>
          <p className="text-lg font-medium">
            {savedTheDetail ? 'A large, extra cheese, mushroom pizza. No olives.' : 'A large, extra cheese, mushroom pizza. Loaded with olives.'}
          </p>
        </div>

        <p
          className={
            'rounded-md border px-4 py-3 text-sm text-center font-medium ' +
            (savedTheDetail
              ? 'bg-success-bg border-success text-success'
              : 'bg-danger-bg border-danger text-danger')
          }
        >
          {savedTheDetail
            ? 'Correct pizza — you kept "no olives!!" in the window until the end.'
            : '"No olives!!" fell out of the window messages ago. The bot cheerfully explains it never saw that message.'}
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
          Message {turnIndex + 1} / {messages.length}
        </span>
        <span>Window holds {WINDOW_SIZE}</span>
      </div>

      <p className="text-xs text-text-muted text-center">
        Tap a chip to re-pin it before the next message pushes one out — one re-pin per turn.
      </p>

      <div className="rounded-md bg-bg-raised border border-border px-3 py-3 min-h-[8rem]">
        {window_.length === 0 ? (
          <p className="text-text-dim text-sm text-center py-6">Window is empty — the order hasn't started.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {window_.map((m) => {
              const atRisk = m.id === atRiskId
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => rePin(m.id)}
                  disabled={pinnedThisTurn}
                  className={
                    'text-left rounded-md px-3 py-2 text-sm border transition-all duration-300 ' +
                    (m.critical
                      ? 'bg-basil/20 border-basil text-basil font-semibold '
                      : 'bg-surface border-border text-text-muted ') +
                    (atRisk ? 'ring-2 ring-danger animate-pulse ' : '') +
                    (pinnedThisTurn ? 'opacity-60' : 'active:scale-[0.98]')
                  }
                >
                  {atRisk && <span className="text-danger text-xs font-semibold mr-1">⚠ about to fall out —</span>}
                  "{m.text}"
                </button>
              )
            })}
          </div>
        )}
      </div>

      {lastFallen && (
        <p className="text-danger text-xs text-center italic">"{lastFallen.text}" slid out of the window.</p>
      )}

      {incoming && (
        <div className="rounded-md bg-surface px-4 py-4 text-center">
          <p className="text-text-dim text-xs mb-1">Next message incoming:</p>
          <p className="text-text font-medium">"{incoming.text}"</p>
        </div>
      )}

      <button
        type="button"
        onClick={letItArrive}
        className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
      >
        Let it arrive →
      </button>
    </div>
  )
}
