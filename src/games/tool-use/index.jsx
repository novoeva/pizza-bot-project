import { useState } from 'react'
import { questions, tools } from './questions.js'
import terms from '../../content/terms.json'

/**
 * Tool use game — { termId, onComplete } interface.
 * "Don't guess, check": round 1 answers the same questions blind, with no
 * way to know — deliberately uncomfortable, and the game says so. Round 2
 * gives the player real tools to check instead of guessing.
 */
export default function ToolUseGame({ termId, onComplete }) {
  const [round, setRound] = useState(1)
  const [qIndex, setQIndex] = useState(0)
  const [guessed, setGuessed] = useState(false)
  const [wrongToolTap, setWrongToolTap] = useState(false)
  const [checked, setChecked] = useState(false)
  const [phase, setPhase] = useState('playing') // 'playing' | 'transition' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const current = questions[qIndex]
  const isLastQuestion = qIndex === questions.length - 1

  function nextQuestion() {
    if (isLastQuestion) {
      if (round === 1) {
        setPhase('transition')
      } else {
        setPhase('reveal')
      }
      return
    }
    setQIndex((i) => i + 1)
    setGuessed(false)
    setChecked(false)
    setWrongToolTap(false)
  }

  function startRound2() {
    setRound(2)
    setQIndex(0)
    setGuessed(false)
    setChecked(false)
    setWrongToolTap(false)
    setPhase('playing')
  }

  function tapTool(toolId) {
    if (checked) return
    if (toolId === current.correctTool) {
      setChecked(true)
      setWrongToolTap(false)
    } else {
      setWrongToolTap(true)
    }
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
        <h2 className="text-2xl">You just learned Tool use</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Same questions, wildly different confidence — because round 2 wasn't guessing, it was
            checking. That's the fix on the bot's side for the exact gap that causes hallucinations:
            give it a real system to look at instead of asking it to remember.
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

  if (phase === 'transition') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-danger bg-danger-bg p-4 text-center shadow-card">
          <p className="text-sm font-semibold text-danger">
            Annoying, right? The bot feels this on every question it can't actually check.
          </p>
        </div>
        <button
          type="button"
          onClick={startRound2}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Give the bot some tools
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Instruction */}
      <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
        <div className="flex items-center justify-between">
          <p className="font-label text-[11px] text-primary">Game · Don't guess, check</p>
          <span className="font-label text-[11px] text-text-muted">
            Round {round} / 2 · Q{qIndex + 1}/{questions.length}
          </span>
        </div>
        <h1 className="text-2xl leading-tight">Tool use</h1>
      </div>

      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-5 text-center shadow-pop">
        <p className="text-lg font-extrabold leading-snug">
          A customer asks: "{current.question}"
        </p>
      </div>

      {round === 1 ? (
        !guessed ? (
          <div className="rounded-md border-[3px] border-neutral bg-surface px-4 py-4 text-center shadow-pop">
            <p className="mb-3 font-label text-[11px] text-text-muted">
              There's no way to check. What do you say?
            </p>
            <button
              type="button"
              onClick={() => setGuessed(true)}
              className="press rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-4 py-3 font-label font-bold text-cheese-dim shadow-pop"
            >
              Guess anyway
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md border-[3px] border-danger bg-danger-bg px-4 py-3 shadow-pop">
              <p className="text-text">{current.guessAnswer}</p>
              <p className="mt-1 flex items-center gap-1 font-label text-[11px] font-bold text-danger">
                <span className="material-symbols-rounded text-[15px]">error</span>
                that's just a guess
              </p>
            </div>
            <button
              type="button"
              onClick={nextQuestion}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-tertiary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              Next question
            </button>
          </div>
        )
      ) : !checked ? (
        <div className="flex flex-col gap-2">
          <p className="text-center font-label text-[11px] text-text-muted">
            Tap the right tool to check.
          </p>
          <div className="flex flex-col gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => tapTool(tool.id)}
                className="press rounded-md border-[3px] border-neutral bg-surface px-4 py-3 text-left font-bold text-text shadow-pop"
              >
                {tool.label}
              </button>
            ))}
          </div>
          {wrongToolTap && (
            <p className="text-center font-label text-[11px] italic text-text-muted">
              That tool doesn't have this answer — try another.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-md border-[3px] border-success bg-success-bg px-4 py-3 shadow-pop">
            <p className="text-text">{current.realAnswer}</p>
            <p className="mt-1 flex items-center gap-1 font-label text-[11px] font-bold text-success">
              <span className="material-symbols-rounded text-[15px]">check_circle</span>
              Correct answer, backed by real data.
            </p>
          </div>
          <button
            type="button"
            onClick={nextQuestion}
            className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
          >
            <span className="material-symbols-rounded">arrow_forward</span>
            Next question
          </button>
        </div>
      )}
    </div>
  )
}
