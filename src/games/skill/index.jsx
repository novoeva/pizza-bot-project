import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { complaint, improvisedReplies, playbookSteps } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

// Fixed shuffle so the buttons don't appear in a suggestive top-to-bottom order.
const shuffledSteps = [playbookSteps[2], playbookSteps[0], playbookSteps[3], playbookSteps[1]]

/**
 * Skill game, { termId, onComplete } interface.
 * "The complaint department": round 1 shows the same complaint getting three
 * wildly different improvised responses. Round 2, the player builds the
 * playbook step by step, then the same complaint gets identical, calm
 * handling every time.
 */
export default function SkillGame({ termId, onComplete }) {
  const [replyIndex, setReplyIndex] = useState(0)
  const [builtSteps, setBuiltSteps] = useState([])
  const [phase, setPhase] = useState('round1') // 'round1' | 'build' | 'round2' | 'reveal'

  useGameScroll(phase, replyIndex)

  const term = terms.find((t) => t.id === termId)
  const isLastReply = replyIndex === improvisedReplies.length - 1

  function tapStep(id) {
    if (builtSteps.includes(id)) return
    const next = [...builtSteps, id]
    setBuiltSteps(next)
    if (next.length === playbookSteps.length) {
      setPhase('round2')
    }
  }

  // Round 2 uses the player's own order: the point is consistency, not a "right" sequence.
  const builtPlaybook = builtSteps.map((id) => playbookSteps.find((s) => s.id === id))

  const instruction = (sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · The complaint department</p>
      <h1 className="text-2xl leading-tight">Skill</h1>
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
        <h2 className="text-2xl">You just learned the term Skill</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
        </div>

        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
            Snap it onto your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('Same complaint, three times, now handled by the playbook.')}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
          <p className="mb-2 font-label text-[11px] text-text-muted">Your playbook</p>
          <ol className="flex list-inside list-decimal flex-col gap-0.5 text-sm text-text-muted">
            {builtPlaybook.map((s) => (
              <li key={s.id}>{s.label}</li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md border-[3px] border-success bg-success-bg px-4 py-3 shadow-pop"
            >
              <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-success">
                <span className="material-symbols-rounded text-[15px]">sentiment_satisfied</span>
                Customer {i + 1}, same complaint
              </p>
              <p className="text-sm text-text">{builtPlaybook.map((s) => s.scripted).join(' ')}</p>
            </div>
          ))}
        </div>
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
            See what this means
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'build') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('Build the playbook, tap the steps in the order you would handle it.')}
        <div className="min-h-[4rem] rounded-md border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
          {builtSteps.length === 0 ? (
            <p className="text-center text-sm text-text-muted">Playbook is empty.</p>
          ) : (
            <ol className="flex list-inside list-decimal flex-col gap-0.5 text-sm text-text">
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
                  'rounded-md border-[3px] px-4 py-3 text-left font-bold shadow-pop transition-all ' +
                  (done
                    ? 'border-success bg-success-bg text-success opacity-50'
                    : 'press border-neutral bg-surface text-text')
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
      <GameIntro term={term} />
      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-5 text-center shadow-pop">
        <p className="text-lg font-extrabold leading-snug">Complaint: "{complaint}"</p>
      </div>
      <div className="flex flex-col gap-2">
        {improvisedReplies.slice(0, replyIndex + 1).map((reply, i) => (
          <div
            key={i}
            className="rounded-md border-[3px] border-danger bg-danger-bg px-4 py-3 shadow-pop"
          >
            <p className="mb-1 font-label text-[11px] font-bold text-danger">
              Customer {i + 1}, same complaint
            </p>
            <p className="text-sm text-text">{reply}</p>
          </div>
        ))}
      </div>
      {!isLastReply ? (
        <GameActions>
          <GameActionButton variant="accent" icon="arrow_forward" onClick={() => setReplyIndex((i) => i + 1)}>
            Next customer
          </GameActionButton>
        </GameActions>
      ) : (
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('build')}>
            Build a playbook
          </GameActionButton>
        </GameActions>
      )}
    </div>
  )
}
