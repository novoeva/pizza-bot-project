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
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term Context window</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            The bot never "forgot" on purpose — the window just filled up and the oldest chip fell
            out to make room. Re-pinning is the fix, and it's the same move that works on you: in a
            long chat with Claude or ChatGPT, if something matters, say it again near the end.
          </p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
          <p className="mt-3 text-[15px] leading-snug text-text-muted">
            <span className="font-semibold text-tertiary">Why you care: </span>
            {term.whyYouCare}
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="press mt-2 flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-5 py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Snap it onto your bot
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-center shadow-card">
          <p className="mb-2 font-label text-[11px] text-text-muted">
            The bot assembles the order from whatever's still in the window
          </p>
          <p className="text-lg font-extrabold leading-snug">
            {savedTheDetail
              ? 'A large, extra cheese, mushroom pizza. No olives.'
              : 'A large, extra cheese, mushroom pizza. Loaded with olives.'}
          </p>
        </div>

        <div
          className={
            'rounded-md border-[3px] px-4 py-3 shadow-pop ' +
            (savedTheDetail
              ? 'bg-success-bg border-success text-success'
              : 'bg-danger-bg border-danger text-danger')
          }
        >
          <p className="flex items-center gap-1.5 font-label text-sm font-bold">
            <span className="material-symbols-rounded text-[18px]">
              {savedTheDetail ? 'check_circle' : 'cancel'}
            </span>
            {savedTheDetail ? 'Correct pizza' : 'Wrong pizza'}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-text">
            {savedTheDetail
              ? 'You kept "no olives!!" in the window until the end.'
              : '"No olives!!" fell out of the window messages ago. The bot cheerfully explains it never saw that message.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          See what this means
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Instruction */}
      <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
        <p className="font-label text-[11px] text-primary">Game · The long order</p>
        <h1 className="text-2xl leading-tight">Context window</h1>
        <p className="mt-1 text-[13px] leading-snug text-text-muted">
          Tap a chip to re-pin it before the next message pushes one out — one re-pin per turn.
        </p>
      </div>

      <div className="flex items-center justify-between font-label text-[11px] text-text-muted">
        <span>
          Message {turnIndex + 1} / {messages.length}
        </span>
        <span>Window holds {WINDOW_SIZE}</span>
      </div>

      <div className="min-h-[8rem] rounded-md border-[3px] border-neutral bg-muted px-3 py-3 shadow-pop">
        {window_.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Window is empty — the order hasn't started.
          </p>
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
                    'rounded-md border-[3px] px-3 py-2 text-left text-sm transition-all duration-300 ' +
                    (m.critical
                      ? 'border-success bg-success-bg font-bold text-success '
                      : 'border-neutral bg-surface text-text-muted ') +
                    (atRisk ? 'animate-pulse ring-2 ring-danger ' : '') +
                    (pinnedThisTurn ? 'opacity-60' : 'press')
                  }
                >
                  {atRisk && (
                    <span className="mr-1 font-label text-[11px] font-bold text-danger">
                      ⚠ about to fall out —
                    </span>
                  )}
                  "{m.text}"
                </button>
              )
            })}
          </div>
        )}
      </div>

      {lastFallen && (
        <p className="text-center font-label text-[11px] text-danger">
          "{lastFallen.text}" slid out of the window.
        </p>
      )}

      {incoming && (
        <div className="rounded-md border-[3px] border-neutral bg-surface px-4 py-3 text-center shadow-pop">
          <p className="mb-1 font-label text-[11px] text-text-muted">Next message incoming</p>
          <p className="font-bold text-text">"{incoming.text}"</p>
        </div>
      )}

      <button
        type="button"
        onClick={letItArrive}
        className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
      >
        <span className="material-symbols-rounded">arrow_forward</span>
        Let it arrive
      </button>
    </div>
  )
}
