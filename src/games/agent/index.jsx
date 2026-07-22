import { useState } from 'react'
import { round1Lines, actionSteps } from './script.js'
import terms from '../../content/terms.json'

function KitchenPanel({ lines }) {
  return (
    <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
      <p className="mb-2 flex items-center gap-1.5 font-label text-[11px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">skillet</span>
        Kitchen panel
      </p>
      {lines.length === 0 ? (
        <p className="text-sm italic text-text-muted">…nothing happening.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {lines.map((line, i) => (
            <li key={i} className="text-sm font-semibold text-success">
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

  const instruction = (sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · All talk</p>
      <h1 className="text-2xl leading-tight">Agent</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">{sub}</p>
    </div>
  )

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned Agent</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Same customer, same pizza — the difference was whether anything actually happened after
            the talking. A chatbot describes; an agent acts. And an agent that can act — check
            menus, charge cards, message the kitchen — is also one that needs guardrails around what
            it's allowed to do.
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

  if (phase === 'round2-done') {
    return (
      <div className="flex flex-col gap-3">
        <KitchenPanel lines={actionSteps.map((s) => s.kitchenText)} />
        <div className="rounded-lg border-[3px] border-neutral bg-success-bg p-4 text-center shadow-card">
          <p className="flex items-center justify-center gap-1.5 font-label font-bold text-success">
            <span className="material-symbols-rounded text-[18px]">local_pizza</span>
            The pizza arrives.
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

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('Round 2 — operate the agent. Tap the steps in order.')}
        <KitchenPanel lines={doneSteps.map((id) => actionSteps.find((s) => s.id === id).kitchenText)} />
        <div className="flex flex-col gap-2">
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
                  'rounded-md border-[3px] px-4 py-3 text-left font-bold shadow-pop transition-all ' +
                  (done
                    ? 'border-success bg-success-bg text-success'
                    : isNext
                      ? 'press border-cheese-dim bg-cheese-bg text-cheese-dim'
                      : 'border-neutral bg-surface text-text-muted opacity-50')
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
    <div className="flex flex-col gap-3">
      {instruction('Round 1 — just a conversation.')}
      <KitchenPanel lines={[]} />
      <div className="flex flex-col gap-2">
        {round1Lines.slice(0, lineIndex + 1).map((line, i) => (
          <div
            key={i}
            className={
              'max-w-[85%] rounded-md border-[3px] border-neutral px-4 py-3 text-sm shadow-pop ' +
              (line.speaker === 'bot'
                ? 'self-start bg-surface text-text'
                : 'ml-auto self-end bg-accent-soft text-text')
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
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-tertiary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Continue conversation
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Now actually get the pizza made
        </button>
      )}
    </div>
  )
}
