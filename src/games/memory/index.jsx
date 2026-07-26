import { useState } from 'react'
import { sessionOneLines, resetLines, facts } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

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
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · Welcome, stranger</p>
      <h1 className="text-2xl leading-tight">Memory</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">{sub}</p>
    </div>
  )

  function renderChatSequence(lines, onFinish, buttonLabel, header, intro = false) {
    const isLast = lineIndex >= lines.length - 1
    return (
      <div className="flex flex-col gap-3">
        {intro ? <GameIntro term={term} /> : instruction(header)}
        <div className="flex flex-col gap-2">
          {lines.slice(0, lineIndex + 1).map((line, i) => (
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

        <div className="rounded-lg border-[3px] border-tertiary bg-surface p-3 text-left shadow-pop">
          <p className="flex items-center gap-1 font-label text-[11px] font-bold text-tertiary">
            <span className="material-symbols-rounded text-[15px]">info</span>
            Real talk
          </p>
          <p className="mt-1 text-[13px] leading-snug text-text">
            This app remembers your finished games the exact same way, saved in your browser. That's
            why your bot is still half-built when you come back tomorrow.
          </p>
        </div>

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
    )
  }

  if (phase === 'install') {
    const done = selected.size > 0
    return (
      <div className="flex flex-col gap-3">
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
        {instruction('Why it forgot, and how to fix it.')}
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 shadow-pop">
          <p className="font-label text-[11px] text-primary">The problem</p>
          <p className="mt-1 text-[15px] leading-snug">
            Every visit, the bot starts from zero. Inside one chat its memory is perfect. That is
            working memory. But nothing survives once the chat ends, so it cannot recognise Anna at
            all.
          </p>
        </div>
        <div className="rounded-lg border-[3px] border-tertiary bg-surface p-4 shadow-pop">
          <p className="font-label text-[11px] text-tertiary">The fix</p>
          <p className="mt-1 text-[15px] leading-snug">
            Give it a hard drive: a place to write facts down and read them back at the start of
            every visit. That's persistent memory.
          </p>
        </div>
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
    )
  }

  if (phase === 'timejump') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('The chat is over.')}
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-[3px] border-neutral bg-muted py-16 shadow-card">
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
