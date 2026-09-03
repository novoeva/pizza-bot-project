import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { sessionOneLines, resetLines, facts } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import PartTile from '../../components/PartTile.jsx'
import SlotList from '../../components/SlotList.jsx'
import { useFirstTimeHint } from '../../lib/useFirstTimeHint.js'
import GameStage from '../../components/GameStage.jsx'

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

  const hint = useFirstTimeHint(phase === 'install')

  function saveFact(id) {
    setSelected((prev) => (prev.has(id) ? prev : new Set([...prev, id])))
  }
  function forgetFact(index) {
    setSelected((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return new Set(next)
    })
  }

  const instruction = (sub) => <PhaseCard title="Welcome, stranger">{sub}</PhaseCard>
  const stage = (main, progress) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} progress={progress} />
  )

  // Progress: 1 visit one · 2 a week later · 3 install memory · 4 Anna is back.
  function renderChatSequence(lines, onFinish, buttonLabel, header, part = 1) {
    const isLast = lineIndex >= lines.length - 1
    return stage(
      <>
        {instruction(header)}
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
      </>,
      { part, parts: 4, step: lineIndex + 1, steps: lines.length },
    )
  }

  if (phase === 'reveal') {
    return (
      <TermReveal
        term={term}
        onComplete={onComplete}
        aside={
          <Callout tone="info" title="Real talk" compact>
            This app remembers your finished games the exact same way, saved in your browser. That's
            why your bot is still half-built when you come back tomorrow.
          </Callout>
        }
      />
    )
  }

  if (phase === 'revisit') {
    const lines = buildRevisitLines(selected)
    return renderChatSequence(
      lines,
      () => setPhase('reveal'),
      'See what this means',
      'A week later, Anna is back.',
      4,
    )
  }

  if (phase === 'install') {
    const done = selected.size > 0
    return stage(
      <>
        {instruction(
          'The hard drive is empty. Drag in whatever the bot should remember. Anything you leave out is gone the moment the chat ends.',
        )}
        <SlotList
          title="The hard drive"
          icon="database"
          capacity={facts.length}
          items={[...selected].map((id) => ({ id, label: facts.find((f) => f.id === id).label }))}
          accepts={facts.map((f) => f.id)}
          onDrop={saveFact}
          onRemove={forgetFact}
          emptyLabel="drag a fact here…"
          numbered={false}
          pulse={hint}
        />
        <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
          <span className="material-symbols-rounded text-[15px]">handyman</span>
          What the bot heard today · drag what it should keep
        </p>
        <div className="flex flex-col gap-2">
          {facts.map((fact, i) => (
            <PartTile
              key={fact.id}
              id={fact.id}
              label={fact.label}
              used={selected.has(fact.id)}
              usedLabel="saved"
              onAdd={() => saveFact(fact.id)}
              wiggle={hint && i === facts.findIndex((f) => !selected.has(f.id))}
            />
          ))}
        </div>
        <GameActions>
          <GameActionButton variant="primary" icon="save" disabled={!done} onClick={() => setPhase('revisit')}>
            Save to the hard drive
          </GameActionButton>
        </GameActions>
      </>,
      { part: 3, parts: 4, step: selected.size, steps: facts.length },
    )
  }

  if (phase === 'diagnose') {
    return stage(
      <>
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
      </>,
      { part: 3, parts: 4, step: 0, steps: facts.length },
    )
  }

  if (phase === 'reset') {
    return renderChatSequence(
      resetLines,
      () => setPhase('diagnose'),
      'Why did it forget?',
      'Same bot, new chat, nothing saved.',
      2,
    )
  }

  if (phase === 'timejump') {
    return stage(
      <>
        {instruction('The chat is over.')}
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-[3px] border-neutral bg-muted py-16 shadow-pop">
          <p className="font-display text-xl text-text-muted">One week later.</p>
          <GameActions>
            <GameActionButton variant="accent" icon="arrow_forward" onClick={() => setPhase('reset')}>
              Anna comes back
            </GameActionButton>
          </GameActions>
        </div>
      </>,
      { part: 2, parts: 4 },
    )
  }

  return renderChatSequence(
    sessionOneLines,
    () => setPhase('timejump'),
    'End the chat',
    'Visit 1: the bot is chatting with Anna.',
    1,
  )
}
