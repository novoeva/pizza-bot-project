import { useState } from 'react'
import { round1Lines, actionSteps } from './script.js'
import terms from '../../content/terms.json'

function KitchenPanel({ lines }) {
  return (
    <div className="rounded-md bg-bg-raised border border-border px-4 py-3">
      <p className="text-xs text-text-dim mb-2">🍳 Kitchen panel</p>
      {lines.length === 0 ? (
        <p className="text-text-dim text-sm italic">…nothing happening.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {lines.map((line, i) => (
            <li key={i} className="text-success text-sm">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * Agent game — { termId, onComplete } interface.
 * "All talk": round 1 is a lovely chatbot conversation with a kitchen panel
 * that never lights up. Round 2, the player operates the agent's action
 * steps in order and watches the same panel come alive.
 */
export default function AgentGame({ termId, onComplete }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [phase, setPhase] = useState('round1') // 'round1' | 'round2' | 'round2-done' | 'reveal'
  const [doneSteps, setDoneSteps] = useState([])

  const term = terms.find((t) => t.id === termId)
  const round1Complete = lineIndex >= round1Lines.length - 1

  function nextLine() {
    if (lineIndex < round1Lines.length - 1) {
      setLineIndex((i) => i + 1)
    }
  }

  function tapStep(id) {
    const nextExpected = actionSteps[doneSteps.length]?.id
    if (id !== nextExpected) return
    const next = [...doneSteps, id]
    setDoneSteps(next)
    if (next.length === actionSteps.length) {
      setPhase('round2-done')
    }
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Same customer, same pizza — the difference was whether anything actually happened after
          the talking. A chatbot describes; an agent acts. And an agent that can act — check
          menus, charge cards, message the kitchen — is also one that needs guardrails around what
          it's allowed to do.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Agent</h2>
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

  if (phase === 'round2-done') {
    return (
      <div className="flex flex-col gap-4">
        <KitchenPanel lines={actionSteps.map((s) => s.kitchenText)} />
        <div className="rounded-md bg-success-bg border border-success px-4 py-6 text-center">
          <p className="text-success font-semibold">🍕 The pizza arrives.</p>
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

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">Round 2 — operate the agent. Tap the steps in order.</p>
        <KitchenPanel lines={doneSteps.map((id) => actionSteps.find((s) => s.id === id).kitchenText)} />
        <div className="flex flex-col gap-3">
          {actionSteps.map((step, i) => {
            const done = doneSteps.includes(step.id)
            const isNext = i === doneSteps.length
            return (
              <button
                key={step.id}
                type="button"
                disabled={!isNext && !done}
                onClick={() => tapStep(step.id)}
                className={
                  'rounded-md border-2 px-4 py-3 text-left font-medium transition-all ' +
                  (done
                    ? 'bg-success-bg border-success text-success'
                    : isNext
                      ? 'bg-cheese/20 border-cheese text-cheese active:scale-[0.98]'
                      : 'bg-surface border-border text-text-dim opacity-50')
                }
              >
                {done ? '✓ ' : ''}
                {step.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-text-muted text-center">Round 1 — just a conversation.</p>
      <KitchenPanel lines={[]} />
      <div className="flex flex-col gap-2">
        {round1Lines.slice(0, lineIndex + 1).map((line, i) => (
          <div
            key={i}
            className={
              'rounded-md px-4 py-3 text-sm max-w-[85%] ' +
              (line.speaker === 'bot'
                ? 'bg-surface text-text self-start'
                : 'bg-cheese/20 text-text self-end ml-auto')
            }
          >
            {line.text}
          </div>
        ))}
      </div>
      {!round1Complete ? (
        <button
          type="button"
          onClick={nextLine}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          Continue conversation →
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Now actually get the pizza made →
        </button>
      )}
    </div>
  )
}
