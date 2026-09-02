import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import {
  sliderContext,
  candidates,
  TEMP_MIN,
  TEMP_MAX,
  zones,
  taskRounds,
} from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

/**
 * Temperature game, { termId, onComplete } interface.
 * Reuses the Token game's picture, the model choosing the next word from a
 * ranked list, and adds the one dial that reshapes that list.
 *   1. "Slide it", drag the temperature and watch the candidate words go from
 *      "always the safe one" (low) to "anything can win" (high). Rolling the
 *      dice samples one word so the randomness is concrete, and doubles as the
 *      obvious call-to-action that unlocks the next beat.
 *   2. "Pick the setting", match a real bot job to the right temperature.
 */
export default function TemperatureGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('play') // 'play' | 'match' | 'reveal'

  // ---------- Beat 1: slide it ----------
  const [temp, setTemp] = useState(1.0)
  const [sampled, setSampled] = useState(null)
  const [rolls, setRolls] = useState(0)

  // ---------- Beat 2: pick the setting ----------
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  useGameScroll(`${phase}:${roundIndex}`)

  // ---------- Beat 1: slide it ----------
  if (phase === 'play') {
    const ranked = reshape(candidates, temp)
    const top = ranked.reduce((a, b) => (b.pct > a.pct ? b : a))
    const zone = zones.find((z) => temp <= z.max)
    const interacted = rolls > 0

    function roll() {
      setSampled(sampleWord(ranked))
      setRolls((r) => r + 1)
    }

    const main = (
      <>
        {/* This beat's own instruction, at the top of the active column so it's
            always the current step (the constant orientation stays on the left). */}
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · Feel the dial</p>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">
            Drag the temperature from low to high and watch the odds shift, then roll to see which word your bot picks.
          </p>
        </div>

        {/* The sentence the bot is about to finish */}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{sliderContext}{' '}
            {sampled ? (
              <span className="text-primary">{sampled}</span>
            ) : (
              <span className="text-primary">___</span>
            )}
            {sampled ? '.' : ''}"
          </p>
          <p className="mt-1 font-label text-[11px] text-text-muted">
            {sampled
              ? 'One roll at this setting'
              : 'Same words to choose from every time. Only the odds change.'}
          </p>
        </div>

        {/* The temperature dial */}
        <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-pop">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1 font-label text-[11px] text-text-muted">
              <span className="material-symbols-rounded text-[15px]">thermostat</span>
              Temperature
            </p>
            <span className="flex items-center gap-2">
              <span className="rounded-full border-2 border-neutral bg-accent-soft px-2 py-0.5 font-label text-[11px] font-bold text-tertiary">
                {zone.label}
              </span>
              <span className="font-mono text-sm font-bold text-text">{temp.toFixed(1)}</span>
            </span>
          </div>
          <input
            type="range"
            min={TEMP_MIN}
            max={TEMP_MAX}
            step={0.1}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="range-chunky"
            aria-label="Temperature"
          />
          <div className="mt-1 flex justify-between font-label text-[10px] text-text-muted">
            <span>Low · predictable</span>
            <span>High · wild</span>
          </div>
        </div>

        {/* Live distribution */}
        <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-pop">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <p className="font-label text-[11px] text-text-muted">Chance of each next word</p>
            <p className="font-label text-[11px] text-text-muted">% = probability</p>
          </div>
          <div className="flex flex-col gap-2">
            {ranked.map((o) => {
              const isTop = o.word === top.word
              return (
                <div key={o.word} className="flex items-center gap-2">
                  <div
                    className={
                      'w-24 shrink-0 rounded border-2 px-1.5 py-1 text-center font-mono text-xs ' +
                      (isTop
                        ? 'border-neutral bg-cheese-bg font-bold text-cheese-dim'
                        : 'border-neutral bg-muted text-text-muted')
                    }
                  >
                    {o.word}
                  </div>
                  <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                    <div
                      className={'h-full transition-[width] duration-150 ' + (isTop ? 'bg-cheese' : 'bg-tertiary')}
                      style={{ width: `${o.pct}%` }}
                    />
                  </div>
                  <div className="w-9 shrink-0 text-right text-xs text-text-muted">
                    {Math.round(o.pct)}%
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-[13px] leading-snug text-text-muted">{zone.note}</p>
        </div>

        {/* Re-roll stays inline as a secondary; the pinned bar carries the
            forward action so it's always on screen. */}
        {interacted && (
          <button
            type="button"
            onClick={roll}
            className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-surface py-2.5 font-label text-sm font-bold text-tertiary shadow-pop"
          >
            <span className="material-symbols-rounded text-[18px]">casino</span>
            Roll again
          </button>
        )}
      </>
    )

    // Left: read-once orientation (what temperature is + Your role). Right: the
    // live dial, the distribution and the roll — the part you actually touch.
    return (
      <>
        <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} />
        <GameActions>
          {!interacted ? (
            <GameActionButton variant="accent" icon="casino" onClick={roll}>
              Roll the dice, let the bot pick
            </GameActionButton>
          ) : (
            <GameActionButton
              variant="primary"
              icon="arrow_forward"
              onClick={() => setPhase('match')}
            >
              Next: pick the right setting
            </GameActionButton>
          )}
        </GameActions>
      </>
    )
  }

  // ---------- Beat 2: pick the setting ----------
  if (phase === 'match') {
    const round = taskRounds[roundIndex]
    const answered = pick !== null
    const correct = pick === round.answer
    const isLast = roundIndex === taskRounds.length - 1

    function choose(choice) {
      if (pick) return
      setPick(choice)
      setResults((r) => [...r, choice === round.answer])
    }

    function next() {
      if (isLast) {
        setPhase('reveal')
        return
      }
      setRoundIndex((i) => i + 1)
      setPick(null)
    }

    // Left column keeps the same orientation as beat 1 (the term + Your role),
    // so it stays put while the right column switches from the dial to the jobs.
    const main = (
      <>
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <div className="flex items-center justify-between">
            <p className="font-label text-[11px] text-primary">Game · Pick the setting</p>
            <span className="font-label text-[11px] text-text-muted">
              {roundIndex + 1} / {taskRounds.length}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">
            Same bot, very different jobs. For each one, decide which way to turn the dial.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 shadow-pop">
          <p className="font-label text-[11px] text-text-muted">The job</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-text">{round.task}</p>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">{round.detail}</p>
        </div>

        {!answered ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => choose('low')}
              className="press flex flex-col items-center gap-1 rounded-md border-[3px] border-neutral bg-surface py-4 shadow-pop"
            >
              <span className="material-symbols-rounded text-2xl text-tertiary">ac_unit</span>
              <span className="font-label text-sm font-bold text-text">Turn it down</span>
              <span className="font-label text-[10px] text-text-muted">Low · consistent</span>
            </button>
            <button
              type="button"
              onClick={() => choose('high')}
              className="press flex flex-col items-center gap-1 rounded-md border-[3px] border-neutral bg-surface py-4 shadow-pop"
            >
              <span className="material-symbols-rounded text-2xl text-primary">local_fire_department</span>
              <span className="font-label text-sm font-bold text-text">Turn it up</span>
              <span className="font-label text-[10px] text-text-muted">High · creative</span>
            </button>
          </div>
        ) : (
          <div
            className={
              'rounded-md border-[3px] px-4 py-3 shadow-pop ' +
              (correct ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg')
            }
          >
            <p
              className={
                'flex items-center gap-1.5 font-label text-sm font-bold ' +
                (correct ? 'text-success' : 'text-danger')
              }
            >
              <span className="material-symbols-rounded text-[18px]">
                {correct ? 'check_circle' : 'cancel'}
              </span>
              {correct
                ? `Right, turn it ${round.answer === 'low' ? 'down' : 'up'}`
                : `Better to turn it ${round.answer === 'low' ? 'down' : 'up'}`}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-text">{round.why}</p>
          </div>
        )}
      </>
    )

    return (
      <>
        <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} />
        {answered && (
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={next}>
              {isLast ? 'See what this means' : 'Next job'}
            </GameActionButton>
          </GameActions>
        )}
      </>
    )
  }

  // ---------- Reveal ----------
  const score = results.filter(Boolean).length
  return (
    <div className="flex flex-col gap-3 text-center">
      <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
        <span className="material-symbols-rounded fill text-5xl text-white">check</span>
      </div>
      <p className="font-label text-[11px] text-primary">Snapped onto your bot · {term.botPart}</p>
      <h2 className="text-2xl">You just learned the term Temperature</h2>
      <p className="font-label text-xs text-text-muted">
        You matched the setting on {score} of {taskRounds.length}.
      </p>

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

/**
 * Reshape the candidate distribution for a given temperature.
 * Standard temperature scaling: q_i is proportional to base_i^(1/T). At low T
 * the top word runs away with it; at high T the distribution flattens and the
 * long shots become viable. Returns each candidate with a `pct` (0-100).
 */
function reshape(list, temp) {
  const exps = list.map((c) => Math.pow(c.base, 1 / temp))
  const sum = exps.reduce((a, b) => a + b, 0)
  return list.map((c, i) => ({ ...c, pct: (exps[i] / sum) * 100 }))
}

/** Draw one word from a reshaped distribution (percentages sum to 100). */
function sampleWord(ranked, rng = Math.random) {
  const r = rng() * 100
  let acc = 0
  for (const c of ranked) {
    acc += c.pct
    if (r <= acc) return c.word
  }
  return ranked[ranked.length - 1].word
}
