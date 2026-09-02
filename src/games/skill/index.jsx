import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { complaint, improvisedReplies, playbookSteps } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'

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

  // Left column: constant orientation (what a skill is + Your role).
  const stage = (main) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} />
  )

  const instruction = (part, sub) => (
    <PhaseCard title="The complaint department" progress={`Part ${part} of 2`}>
      {sub}
    </PhaseCard>
  )

  // The complaint as a received MESSAGE; the bot's reply as a sent one whose
  // tint is the verdict: 'good' (on-script) / 'bad' (improvised).
  const customerBubble = (text) => <ChatMessage from="customer">{text}</ChatMessage>
  const botBubble = (key, text, tone, note) => (
    <ChatMessage key={key} from="bot" tone={tone} note={note}>
      {text}
    </ChatMessage>
  )

  // Choice archetype — a step you add to the playbook (turns green once added).
  const stepCard = (step) => {
    const done = builtSteps.includes(step.id)
    return (
      <button
        key={step.id}
        type="button"
        disabled={done}
        onClick={() => tapStep(step.id)}
        className={
          'flex items-stretch overflow-hidden rounded-md border-[3px] border-neutral text-left shadow-pop ' +
          (done ? 'bg-success-bg' : 'press bg-surface')
        }
      >
        <span
          className={
            'flex w-11 shrink-0 items-center justify-center border-r-[3px] border-neutral ' +
            (done ? 'bg-success text-white' : 'bg-accent-soft text-tertiary')
          }
          aria-hidden="true"
        >
          <span className="material-symbols-rounded text-[20px]">
            {done ? 'check' : 'playlist_add'}
          </span>
        </span>
        <span className="flex-1 px-3 py-3">
          <span
            className={'block font-label text-[10px] ' + (done ? 'text-success' : 'text-tertiary')}
          >
            {done ? 'Added to playbook' : 'Playbook step'}
          </span>
          <span className="mt-0.5 block font-bold leading-snug text-text">{step.label}</span>
        </span>
      </button>
    )
  }

  const playbookPanel = (steps, muted) => (
    <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
      <p className="mb-1 font-label text-[10px] text-text-muted">Your playbook</p>
      {steps.length === 0 ? (
        <p className="text-sm text-text-muted">Empty — tap a step below to add it.</p>
      ) : (
        <ol
          className={
            'flex list-inside list-decimal flex-col gap-0.5 text-sm ' +
            (muted ? 'text-text-muted' : 'text-text')
          }
        >
          {steps.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ol>
      )}
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
    const script = builtPlaybook.map((s) => s.scripted).join(' ')
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(2, 'Same complaint, three times — now handled by your playbook, identically.')}
        {playbookPanel(builtPlaybook, true)}
        {customerBubble(complaint)}
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) =>
            botBubble(i, script, 'good', `Customer ${i + 1} · same script every time`),
          )}
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
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(2, 'Build the playbook — tap the steps in the order you would handle it.')}
        {playbookPanel(
          builtSteps.map((id) => playbookSteps.find((s) => s.id === id)),
          false,
        )}
        <div className="flex flex-col gap-2">{shuffledSteps.map((step) => stepCard(step))}</div>
      </div>
    )
  }

  return stage(
    <div className="flex flex-col gap-3">
      {instruction(
        1,
        'No set process yet. Same complaint, but your bot improvises a different answer every time.',
      )}
      {customerBubble(complaint)}
      <div className="flex flex-col gap-2">
        {improvisedReplies
          .slice(0, replyIndex + 1)
          .map((reply, i) => botBubble(i, reply, 'bad', `Customer ${i + 1} · improvised, no process`))}
      </div>
      {!isLastReply ? (
        <GameActions>
          <GameActionButton
            variant="accent"
            icon="arrow_forward"
            onClick={() => setReplyIndex((i) => i + 1)}
          >
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
