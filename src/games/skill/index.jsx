import { useState } from 'react'
import { complaint, improvisedReplies, playbookSteps } from './content.js'
import terms from '../../content/terms.json'

// Fixed shuffle so the "build the playbook" step order isn't already the answer.
const shuffledSteps = [playbookSteps[2], playbookSteps[0], playbookSteps[3], playbookSteps[1]]

/**
 * Skill game — { termId, onComplete } interface.
 * "The complaint department": round 1 shows the same complaint getting three
 * wildly different improvised responses. Round 2, the player builds the
 * playbook step by step, then the same complaint gets identical, calm
 * handling every time.
 */
export default function SkillGame({ termId, onComplete }) {
  const [replyIndex, setReplyIndex] = useState(0)
  const [builtSteps, setBuiltSteps] = useState([])
  const [phase, setPhase] = useState('round1') // 'round1' | 'build' | 'round2' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const isLastReply = replyIndex === improvisedReplies.length - 1

  function tapStep(id) {
    const nextExpected = playbookSteps[builtSteps.length]?.id
    if (id !== nextExpected) return
    const next = [...builtSteps, id]
    setBuiltSteps(next)
    if (next.length === playbookSteps.length) {
      setPhase('round2')
    }
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Same complaint, same bot — the only thing that changed was whether it had a playbook to
          follow. Improvising means every answer depends on the model's mood that moment. A
          skill is what makes it handle the same situation the same, right way, every time.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Skill</h2>
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

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">
          Same complaint, three times — now handled by the playbook.
        </p>
        <div className="rounded-md bg-bg-raised border border-border px-4 py-3">
          <p className="text-text-dim text-xs mb-2">Your playbook:</p>
          <ol className="text-sm text-text-muted list-decimal list-inside flex flex-col gap-0.5">
            {playbookSteps.map((s) => (
              <li key={s.id}>{s.label}</li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md bg-success-bg border border-success px-4 py-3">
              <p className="text-success text-xs mb-1">😌 Customer {i + 1} — same complaint</p>
              <p className="text-text text-sm">
                {playbookSteps.map((s) => s.scripted).join(' ')}
              </p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          See what this means →
        </button>
      </div>
    )
  }

  if (phase === 'build') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">
          Build the playbook — tap the steps in the order they should happen.
        </p>
        <div className="rounded-md bg-bg-raised border border-border px-4 py-3 min-h-[4rem]">
          {builtSteps.length === 0 ? (
            <p className="text-text-dim text-sm text-center">Playbook is empty.</p>
          ) : (
            <ol className="text-sm text-text list-decimal list-inside flex flex-col gap-0.5">
              {builtSteps.map((id) => (
                <li key={id}>{playbookSteps.find((s) => s.id === id).label}</li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledSteps.map((step) => {
            const done = builtSteps.includes(step.id)
            return (
              <button
                key={step.id}
                type="button"
                disabled={done}
                onClick={() => tapStep(step.id)}
                className={
                  'rounded-md border-2 px-4 py-3 text-left font-medium transition-all ' +
                  (done
                    ? 'bg-success-bg border-success text-success opacity-50'
                    : 'bg-surface border-border text-text active:scale-[0.98]')
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
      <p className="text-xs text-text-muted text-center">Round 1 — no playbook, the bot improvises.</p>
      <div className="rounded-md bg-surface px-4 py-6 text-center">
        <p className="text-lg font-medium">Complaint: "{complaint}"</p>
      </div>
      <div className="flex flex-col gap-2">
        {improvisedReplies.slice(0, replyIndex + 1).map((reply, i) => (
          <div key={i} className="rounded-md bg-danger-bg border border-danger px-4 py-3">
            <p className="text-danger text-xs mb-1">Customer {i + 1} — same complaint</p>
            <p className="text-text text-sm">{reply}</p>
          </div>
        ))}
      </div>
      {!isLastReply ? (
        <button
          type="button"
          onClick={() => setReplyIndex((i) => i + 1)}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          Next customer →
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setPhase('build')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Build a playbook →
        </button>
      )}
    </div>
  )
}
