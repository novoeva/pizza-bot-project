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
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'
import Panel from '../../components/Panel.jsx'

/**
 * Temperature game, { termId, onComplete } interface.
 * Reuses the Token game's picture, the model choosing the next word from a
 * ranked list, and adds the one dial that reshapes that list.
 *   1. "Drag the dial", drag the temperature and watch the odds of the four
 *      candidate tokens go from "always the safe one" (low) to "any of them"
 *      (high). No rolling: the moving bars are the whole point (PIZZA-14/15).
 *   2. "Pick the setting", match a real bot job to the right temperature.
 */
export default function TemperatureGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('play') // 'play' | 'match' | 'reveal'

  // ---------- Beat 1: slide it ----------
  // Start low so the first picture is the favourite running away with it;
  // dragging up is the experiment. `moved` unlocks the next beat.
  const [temp, setTemp] = useState(0.4)
  const [moved, setMoved] = useState(false)

  // ---------- Beat 2: pick the setting ----------
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  useGameScroll(`${phase}:${roundIndex}`)

  // ---------- Beat 1: slide it ----------
  if (phase === 'play') {
    const ranked = reshape(candidates, temp)
    const zone = zoneFor(temp)

    function onDial(e) {
      setTemp(Number(e.target.value))
      setMoved(true)
    }

    const main = (
      <>
        {/* This beat's own instruction, at the top of the active column so it's
            always the current step (the constant orientation stays on the left). */}
        <PhaseCard title="Drag the dial">
          Drag the temperature from low to high and watch the odds of each next token change.
        </PhaseCard>

        {/* The sentence the bot is about to finish: the blank is one token. */}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{sliderContext} <span className="text-tertiary">___</span>"
          </p>
          <p className="mt-1 font-label text-[11px] text-text-muted">
            Four tokens can fill the blank. The dial only changes their odds.
          </p>
        </div>

        {/* The temperature dial, with an unmissable "drag me" until it has moved. */}
        <Panel
          title="Temperature"
          icon="thermostat"
          meta={
            <>
              <span className="rounded-full border-2 border-neutral bg-accent-soft px-2 py-0.5 font-label text-[11px] font-bold text-tertiary">
                {zone.label}
              </span>
              <span className="font-mono text-sm font-bold text-text">{temp.toFixed(1)}</span>
            </>
          }
        >
          <input
            type="range"
            min={TEMP_MIN}
            max={TEMP_MAX}
            step={0.1}
            value={temp}
            onChange={onDial}
            className={'range-chunky ' + (moved ? '' : 'range-nudge')}
            aria-label="Temperature"
          />
          <div className="mt-1 flex justify-between font-label text-[10px] text-text-muted">
            <span>Low · predictable</span>
            <span>High · wild</span>
          </div>
          {!moved && (
            <p className="mt-2 flex items-center justify-center gap-1 font-label text-[11px] font-bold text-tertiary">
              <span className="material-symbols-rounded text-[16px]">swipe</span>
              Drag the knob to the right
              <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
            </p>
          )}
        </Panel>

        {/* Live odds. Nothing is pinned as "the right one" (PIZZA-14): the
            favourite is only ever the tallest bar, and the bars animate so the
            lead visibly melts as the dial goes up. */}
        <Panel title="Chance of each next token" meta="each option = one token">
          <div className="flex flex-col gap-2">
            {ranked.map((o) => (
              <div key={o.word} className="flex items-center gap-2">
                <div className="w-16 shrink-0 rounded border-2 border-neutral bg-muted px-1.5 py-1 text-center font-mono text-xs text-text">
                  {o.word}
                </div>
                <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                  <div
                    className="h-full bg-cheese transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
                <div className="w-9 shrink-0 text-right text-xs text-text-muted">{Math.round(o.pct)}%</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] leading-snug text-text-muted">{zone.note}</p>
        </Panel>
      </>
    )

    // Left: read-once orientation (what temperature is + Your role). Right: the
    // dial and the odds. "Next" appears once the dial has been moved.
    return (
      <>
        <GameStage
          term={term}
          main={main}
          progress={{ part: 1, parts: 2 }}
        />
        {moved && (
          <GameActions>
            <GameActionButton
              variant="primary"
              icon="arrow_forward"
              onClick={() => setPhase('match')}
            >
              Next: pick the right setting
            </GameActionButton>
          </GameActions>
        )}
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
        <PhaseCard title="Pick the setting">
          Same bot, very different jobs. For each one, decide which way to turn the dial.
        </PhaseCard>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 shadow-pop">
          <p className="font-label text-[11px] text-text-muted">The job</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-text">{round.task}</p>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">{round.detail}</p>
        </div>

        {!answered ? (
          <ChoiceGroup mode="commit" columns={2} label="Which way do you turn the dial?">
            <SelectableCard
              mode="commit"
              variant="tile"
              icon="ac_unit"
              label="Turn it down"
              detail="Low · consistent"
              onSelect={() => choose('low')}
            />
            <SelectableCard
              mode="commit"
              variant="tile"
              icon="local_fire_department"
              iconClassName="text-tomato"
              label="Turn it up"
              detail="High · creative"
              onSelect={() => choose('high')}
            />
          </ChoiceGroup>
        ) : (
          <Callout
            tone={correct ? 'success' : 'problem'}
            icon={correct ? 'check_circle' : 'cancel'}
            title={
              correct
                ? `Right, turn it ${round.answer === 'low' ? 'down' : 'up'}`
                : `Better to turn it ${round.answer === 'low' ? 'down' : 'up'}`
            }
            compact
          >
            {round.why}
          </Callout>
        )}
      </>
    )

    return (
      <>
        <GameStage
          term={term}
          main={main}
          progress={{ part: 2, parts: 2, step: roundIndex + (answered ? 1 : 0), steps: taskRounds.length }}
        />
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
    <TermReveal term={term} score={`You matched the setting on ${score} of ${taskRounds.length}.`} onComplete={onComplete} />
  )
}

/**
 * Reshape the candidate distribution for a given dial position.
 * Standard temperature scaling: q_i is proportional to base_i^(1/T). Below 1.0
 * the dial IS the temperature. Above 1.0 the dial is stretched (2.0 on the dial
 * = T of 5) so the top of the dial is close to a coin flip between all four
 * tokens: with only four candidates a plain T of 2 would still leave the
 * favourite visibly ahead, and the point of "wild" is that the pick changes
 * from roll to roll. Returns each candidate with a `pct` (0-100).
 */
function reshape(list, temp) {
  const t = temp <= 1 ? temp : 1 + (temp - 1) * 4
  const exps = list.map((c) => Math.pow(c.base, 1 / t))
  const sum = exps.reduce((a, b) => a + b, 0)
  return list.map((c, i) => ({ ...c, pct: (exps[i] / sum) * 100 }))
}

/** The zone a dial position falls in. */
function zoneFor(temp) {
  return zones.find((z) => temp <= z.max)
}
