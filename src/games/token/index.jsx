import { useState } from 'react'
import { customerMessage, tempSteps, scenarios } from './content.js'
import terms from '../../content/terms.json'

const TIER_CLASSES = {
  cold: { bar: 'bg-success', box: 'bg-success-bg border-success text-success', pill: 'bg-success-bg text-success' },
  warm: { bar: 'bg-cheese', box: 'bg-cheese-bg border-cheese-dim text-cheese-dim', pill: 'bg-cheese-bg text-cheese-dim' },
  hot: { bar: 'bg-danger', box: 'bg-danger-bg border-danger text-danger', pill: 'bg-danger-bg text-danger' },
}

const VERDICT_CLASSES = {
  good: 'bg-success-bg border-success text-success',
  warn: 'bg-cheese-bg border-cheese-dim text-cheese-dim',
  bad: 'bg-danger-bg border-danger text-danger',
}

const VERDICT_LABEL = {
  good: 'Right call',
  warn: 'Close, but not quite',
  bad: 'Wrong call',
}

const VERDICT_ICON = {
  good: 'check_circle',
  warn: 'error',
  bad: 'cancel',
}

const BUCKETS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

/**
 * Token game — { termId, onComplete } interface.
 * "Dial it in": the bot always picks its next token from a ranked list of
 * probabilities — temperature controls how bold that pick is. Round 1 lets
 * the player feel the mechanism (drag the dial, watch the probabilities and
 * the reply shift). Round 2 turns it into a decision: pick the right
 * temperature for two real bot messages and see the consequence.
 */
export default function TokenGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('explore') // 'explore' | 'apply' | 'summary' | 'reveal'
  const [stepIndex, setStepIndex] = useState(2)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [scenarioPick, setScenarioPick] = useState(null)
  const [results, setResults] = useState([])

  const term = terms.find((t) => t.id === termId)
  const step = tempSteps[stepIndex]
  const tierClasses = TIER_CLASSES[step.tier]

  function handleScenarioPick(bucketId) {
    if (scenarioPick) return
    setScenarioPick(bucketId)
  }

  function handleScenarioNext() {
    const scenario = scenarios[scenarioIndex]
    const nextResults = [
      ...results,
      { id: scenario.id, pick: scenarioPick, correct: scenarioPick === scenario.correct },
    ]
    setResults(nextResults)

    if (scenarioIndex === scenarios.length - 1) {
      setPhase('summary')
      return
    }
    setScenarioIndex((i) => i + 1)
    setScenarioPick(null)
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
        <h2 className="text-2xl">You just learned Token</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Every token the bot writes — yours too, every time you chat with Claude or ChatGPT — gets
            picked the same way: rank the possible next tokens, then choose one. Temperature is the
            knob for how bold that choice gets. Low is a promise to say the same right thing every
            time. High trades that promise for personality.
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

  if (phase === 'summary') {
    const correctCount = results.filter((r) => r.correct).length
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 text-center shadow-pop">
          <p className="font-label text-[11px] text-primary">Round 2 · Result</p>
          <p className="mt-1 text-lg font-extrabold">
            {correctCount} / {scenarios.length} dialed in correctly
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {scenarios.map((scenario, i) => {
            const result = results[i]
            const outcome = scenario.outcomes[result.pick]
            return (
              <div
                key={scenario.id}
                className={
                  'rounded-md border-[3px] px-4 py-3 shadow-pop ' + VERDICT_CLASSES[outcome.verdict]
                }
              >
                <p className="font-label text-[11px] opacity-80">{scenario.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-label text-sm font-bold">
                  <span className="material-symbols-rounded text-[18px]">
                    {VERDICT_ICON[outcome.verdict]}
                  </span>
                  {VERDICT_LABEL[outcome.verdict]}
                </p>
              </div>
            )
          })}
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

  if (phase === 'apply') {
    const scenario = scenarios[scenarioIndex]
    const outcome = scenarioPick ? scenario.outcomes[scenarioPick] : null

    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <div className="flex items-center justify-between">
            <p className="font-label text-[11px] text-primary">Round 2 · Pick the dial</p>
            <span className="font-label text-[11px] text-text-muted">
              Message {scenarioIndex + 1} / {scenarios.length}
            </span>
          </div>
          <p className="mt-1 font-label text-[11px] text-text-muted">{scenario.title}</p>
          <p className="mt-0.5 text-[14px] leading-snug text-text">{scenario.prompt}</p>
        </div>

        {!scenarioPick ? (
          <div className="flex flex-col gap-2">
            <p className="text-center font-label text-[11px] text-text-muted">
              Set the temperature for this one
            </p>
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleScenarioPick(b.id)}
                className="press rounded-md border-[3px] border-neutral bg-surface py-4 px-3 font-label font-bold text-text shadow-pop"
              >
                {b.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className={
                'rounded-md border-[3px] px-4 py-3 shadow-pop ' + VERDICT_CLASSES[outcome.verdict]
              }
            >
              <p className="flex items-center gap-1.5 font-label text-sm font-bold">
                <span className="material-symbols-rounded text-[18px]">
                  {VERDICT_ICON[outcome.verdict]}
                </span>
                {VERDICT_LABEL[outcome.verdict]}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-text">{outcome.text}</p>
            </div>
            <button
              type="button"
              onClick={handleScenarioNext}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              {scenarioIndex === scenarios.length - 1 ? 'See how you did' : 'Next message'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Instruction */}
      <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
        <p className="font-label text-[11px] text-primary">Game · Dial it in</p>
        <h1 className="text-2xl leading-tight">Token</h1>
        <p className="mt-1 text-[13px] leading-snug text-text-muted">
          Try all five settings — watch how sure the bot is about its next word, and how much the
          reply changes.
        </p>
      </div>

      {/* Customer message */}
      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 text-sm shadow-pop">
        <span className="font-label text-[11px] text-text-muted">Customer asks </span>
        <span className="font-bold text-text">"{customerMessage}"</span>
      </div>

      {/* Temperature dial */}
      <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-label text-[11px] text-text-muted">Temperature</span>
          <span className="text-lg font-extrabold text-primary">{step.value}</span>
        </div>

        <div className="mb-3 grid grid-cols-5 gap-1.5">
          {tempSteps.map((s, i) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStepIndex(i)}
              className={
                'press rounded-md border-[3px] border-neutral py-2 font-label text-[11px] font-bold shadow-pop ' +
                (i === stepIndex
                  ? TIER_CLASSES[s.tier].pill
                  : 'bg-surface text-text-muted')
              }
            >
              {s.value}
            </button>
          ))}
        </div>

        <p className={'rounded-md border-[3px] px-3 py-2 text-xs leading-snug ' + tierClasses.box}>
          {step.desc}
        </p>
      </div>

      {/* Token probabilities */}
      <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-pop">
        <p className="mb-3 font-label text-[11px] text-text-muted">{step.subtitle}</p>
        <div className="flex flex-col gap-2">
          {step.tokens.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-24 shrink-0 rounded border-2 border-neutral bg-muted px-1.5 py-1 text-center font-mono text-xs text-text-muted">
                {t.word}
              </div>
              <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                <div
                  className={'h-full transition-all duration-300 ' + tierClasses.bar}
                  style={{ width: `${t.pct}%` }}
                />
              </div>
              <div className="w-9 shrink-0 text-right text-xs text-text-muted">{t.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bot reply */}
      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
        <p className="mb-1 font-label text-[11px] text-text-muted">Bot's reply</p>
        <p className="text-sm leading-snug text-text">{step.reply}</p>
        <p
          className={
            'mt-2 inline-block rounded-full px-2.5 py-0.5 font-label text-[11px] font-bold ' +
            tierClasses.pill
          }
        >
          {step.tag}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPhase('apply')}
        className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
      >
        <span className="material-symbols-rounded">arrow_forward</span>
        Try it on a real message
      </button>
    </div>
  )
}
