import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { sessionOneLines, resetLines, facts } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'

const PRACTICAL_IDS = ['order', 'allergy', 'address']

function buildRevisitLines(saved) {
  const orderPart = saved.has('order')
    ? 'One large pepperoni, extra cheese, coming right up!'
    : 'What would you like today?'
  const allergyPart = saved.has('allergy') ? ' No anchovies, I remember.' : ''
  const addressPart = saved.has('address')
    ? ' Delivering to 12 Oak Street as usual.'
    : ' Mind confirming your delivery address?'
  const jokePart = saved.has('joke')
    ? " Also, why did the pizza maker close shop? He couldn't make enough dough!"
    : ''
  const birthdayPart = saved.has('birthday') ? ' And happy early birthday, by the way!' : ''

  const botLine = `Hey Anna! ${orderPart}${allergyPart}${addressPart}${jokePart}${birthdayPart}`

  const practicalSaved = PRACTICAL_IDS.filter((id) => saved.has(id)).length
  const reaction =
    practicalSaved === PRACTICAL_IDS.length
      ? "You remembered everything! You're the best."
      : practicalSaved > 0
        ? 'Oh, you remembered some of it, at least.'
        : "...you don't remember me at all, do you?"

  return [
    { speaker: 'bot', text: botLine },
    { speaker: 'customer', text: reaction },
  ]
}

/**
 * Memory game, { termId, onComplete } interface.
 * "Welcome, stranger": working memory is perfect within one chat, then a
 * week later it's gone entirely. Installing persistent memory means picking
 * which facts survive the gap.
 */
export default function MemoryGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('session1') // session1 -> timejump -> reset -> diagnose -> install -> revisit -> reveal
  const [lineIndex, setLineIndex] = useState(0)
  const [selected, setSelected] = useState(new Set())

  useGameScroll(phase, lineIndex)

  const term = terms.find((t) => t.id === termId)

  function toggleFact(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const instruction = (sub) => (
    <PhaseCard title="Welcome, stranger" heading="Memory">
      {sub}
    </PhaseCard>
  )

  // Progress: 1 visit one · 2 a week later · 3 install memory · 4 Anna is back.
  function renderChatSequence(lines, onFinish, buttonLabel, header, intro = false, part = 1) {
    const isLast = lineIndex >= lines.length - 1
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={part} parts={4} step={lineIndex + 1} steps={lines.length} />
        {intro ? <GameIntro term={term} /> : instruction(header)}
        {/* Standard sides: the customer (Anna) is received, on the left; your
            bot is on the right, like every other game. */}
        <div className="flex flex-col gap-2">
          {lines.slice(0, lineIndex + 1).map((line, i) =>
            line.speaker === 'bot' ? (
              <ChatMessage key={i} from="bot">
                {line.text}
              </ChatMessage>
            ) : (
              <ChatMessage key={i} from="customer" label="Customer · Anna">
                {line.text}
              </ChatMessage>
            ),
          )}
        </div>
        <GameActions>
          <GameActionButton
            variant={isLast ? 'primary' : 'accent'}
            icon="arrow_forward"
            onClick={() => {
              if (isLast) {
                setLineIndex(0)
                onFinish()
              } else {
                setLineIndex((i) => i + 1)
              }
            }}
          >
            {isLast ? buttonLabel : 'Continue'}
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term Memory</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
        </div>

        <Callout tone="info" title="Real talk" compact>
          This app remembers your finished games the exact same way, saved in your browser. That's
          why your bot is still half-built when you come back tomorrow.
        </Callout>

        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
            Snap it onto your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'revisit') {
    const lines = buildRevisitLines(selected)
    return renderChatSequence(
      lines,
      () => setPhase('reveal'),
      'See what this means',
      'A week later, Anna is back.',
      false,
      4,
    )
  }

  if (phase === 'install') {
    const done = selected.size > 0
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={3} parts={4} step={selected.size} steps={facts.length} />
        {instruction(
          'The hard drive is empty. Tick whatever the bot should remember. Anything you skip is gone the moment the chat ends.',
        )}
        <div className="flex flex-col gap-2">
          {facts.map((fact) => {
            const isSelected = selected.has(fact.id)
            return (
              <button
                key={fact.id}
                type="button"
                onClick={() => toggleFact(fact.id)}
                className={
                  'press rounded-md border-[3px] px-4 py-3 text-left font-bold shadow-pop transition-all ' +
                  (isSelected
                    ? 'border-cheese-dim bg-cheese-bg text-cheese-dim'
                    : 'border-neutral bg-surface text-text-muted')
                }
              >
                {isSelected ? '✓ ' : ''}
                {fact.label}
              </button>
            )
          })}
        </div>
        <p className="text-center font-label text-[11px] text-text-muted">
          {selected.size === 0
            ? 'Nothing saved yet'
            : `${selected.size} fact${selected.size === 1 ? '' : 's'} saved to memory`}
        </p>
        <GameActions>
          <GameActionButton variant="primary" icon="save" disabled={!done} onClick={() => setPhase('revisit')}>
            Save to the hard drive
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'diagnose') {
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={3} parts={4} />
        {instruction('Why it forgot, and how to fix it.')}
        <Callout tone="problem" title="The problem">
          Every visit, the bot starts from zero. Inside one chat its memory is perfect. That is
          working memory. But nothing survives once the chat ends, so it cannot recognise Anna at
          all.
        </Callout>
        <Callout tone="info" title="The fix" icon="build">
          Give it a hard drive: a place to write facts down and read them back at the start of
          every visit. That's persistent memory.
        </Callout>
        <GameActions>
          <GameActionButton variant="primary" icon="database" onClick={() => setPhase('install')}>
            Install persistent memory
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'reset') {
    return renderChatSequence(
      resetLines,
      () => setPhase('diagnose'),
      'Why did it forget?',
      'Same bot, new chat, nothing saved.',
      false,
      2,
    )
  }

  if (phase === 'timejump') {
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={2} parts={4} />
        {instruction('The chat is over.')}
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-[3px] border-neutral bg-muted py-16 shadow-pop">
          <p className="font-display text-xl text-text-muted">One week later.</p>
          <GameActions>
            <GameActionButton variant="accent" icon="arrow_forward" onClick={() => setPhase('reset')}>
              Anna comes back
            </GameActionButton>
          </GameActions>
        </div>
      </div>
    )
  }

  return renderChatSequence(
    sessionOneLines,
    () => setPhase('timejump'),
    'End the chat',
    'Visit 1: the bot is chatting with Anna.',
    true,
  )
}
