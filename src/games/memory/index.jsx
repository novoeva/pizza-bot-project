import { useState } from 'react'
import { sessionOneLines, resetLines, facts, FACTS_TO_SAVE } from './content.js'
import terms from '../../content/terms.json'

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
    ? " Also — why did the pizza maker close shop? He couldn't make enough dough!"
    : ''
  const birthdayPart = saved.has('birthday') ? ' And happy early birthday, by the way!' : ''

  const botLine = `Hey Anna! ${orderPart}${allergyPart}${addressPart}${jokePart}${birthdayPart}`

  const practicalSaved = PRACTICAL_IDS.filter((id) => saved.has(id)).length
  const reaction =
    practicalSaved === PRACTICAL_IDS.length
      ? "You remembered everything! You're the best."
      : practicalSaved > 0
        ? "Oh — you remembered some of it, at least."
        : "...you don't remember me at all, do you?"

  return [
    { speaker: 'bot', text: botLine },
    { speaker: 'customer', text: reaction },
  ]
}

/**
 * Memory game — { termId, onComplete } interface.
 * "Welcome, stranger": working memory is perfect within one chat, then a
 * week later it's gone entirely. Installing persistent memory means picking
 * which facts survive the gap.
 */
export default function MemoryGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('session1') // session1 -> timejump -> reset -> install -> revisit -> reveal
  const [lineIndex, setLineIndex] = useState(0)
  const [selected, setSelected] = useState(new Set())

  const term = terms.find((t) => t.id === termId)

  function toggleFact(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < FACTS_TO_SAVE) {
        next.add(id)
      }
      return next
    })
  }

  function renderChatSequence(lines, onFinish, buttonLabel) {
    const isLast = lineIndex >= lines.length - 1
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {lines.slice(0, lineIndex + 1).map((line, i) => (
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
        <button
          type="button"
          onClick={() => {
            if (isLast) {
              setLineIndex(0)
              onFinish()
            } else {
              setLineIndex((i) => i + 1)
            }
          }}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          {isLast ? buttonLabel : 'Continue →'}
        </button>
      </div>
    )
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Working memory is perfect — until the chat ends. Anything worth keeping across visits has
          to be written somewhere persistent on purpose. This app remembers your finished games the
          exact same way, in your browser — that's why your bot is still half-built tomorrow.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Memory</h2>
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

  if (phase === 'revisit') {
    const lines = buildRevisitLines(selected)
    return renderChatSequence(lines, () => setPhase('reveal'), 'See what this means →')
  }

  if (phase === 'install') {
    const done = selected.size === FACTS_TO_SAVE
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">
          Install persistent memory — pick {FACTS_TO_SAVE} facts to save across visits.
        </p>
        <div className="flex flex-col gap-2">
          {facts.map((fact) => {
            const isSelected = selected.has(fact.id)
            return (
              <button
                key={fact.id}
                type="button"
                onClick={() => toggleFact(fact.id)}
                className={
                  'rounded-md border-2 px-4 py-3 text-left font-medium transition-all active:scale-[0.98] ' +
                  (isSelected
                    ? 'bg-cheese/20 border-cheese text-cheese'
                    : 'bg-surface border-border text-text-muted')
                }
              >
                {isSelected ? '✓ ' : ''}
                {fact.label}
              </button>
            )
          })}
        </div>
        <p className="text-text-dim text-xs text-center">{selected.size} / {FACTS_TO_SAVE} selected</p>
        <button
          type="button"
          disabled={!done}
          onClick={() => setPhase('revisit')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          Save to the hard drive →
        </button>
      </div>
    )
  }

  if (phase === 'reset') {
    return renderChatSequence(resetLines, () => setPhase('install'), 'Install a hard drive →')
  }

  if (phase === 'timejump') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="font-display text-xl text-text-muted">One week later.</p>
        <button
          type="button"
          onClick={() => setPhase('reset')}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 px-6 active:scale-[0.98] transition-transform"
        >
          Anna comes back →
        </button>
      </div>
    )
  }

  return renderChatSequence(sessionOneLines, () => setPhase('timejump'), 'End the chat →')
}
