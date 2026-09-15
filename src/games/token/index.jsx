import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { hookWord, hookTokens, samplePhrase, predictionRounds } from './content.js'
import terms from '../../content/terms.json'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'
import GameStage from '../../components/GameStage.jsx'
import Panel from '../../components/Panel.jsx'

// Always offers at least 1..4 and always includes the real count, so a new
// hook word in content.js can never leave the right answer off the tiles.
const GUESS_OPTIONS = Array.from({ length: Math.max(4, hookTokens.length) }, (_, i) => i + 1)

function bestOf(options) {
  return options.reduce((a, b) => (b.pct > a.pct ? b : a))
}

/**
 * Token game, { termId, onComplete } interface.
 * Two beats that build the concept in order:
 *   1. Chop it up, a token is a piece of text. Guess how many tokens
 *      "pepperoni" is (two), then see the pieces and a whole order tokenized.
 *   2. Read your bot's mind, your bot writes one token at a time, predicting
 *      the next from a ranked list. Call the next token before it does, then
 *      see the ranking. You stay the owner watching your bot, never the model.
 */
export default function TokenGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('chop') // 'chop' | 'predict' | 'reveal'
  const [chopGuess, setChopGuess] = useState(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  useGameScroll(`${phase}:${roundIndex}`)

  // ---------- Beat 1: chop it up ----------
  if (phase === 'chop') {
    const answered = chopGuess !== null
    const correct = chopGuess === hookTokens.length
    const wordCount = samplePhrase.text.trim().split(/\s+/).length
    return (
      <GameStage
        term={term}
        progress={{ part: 1, parts: 2 }}
        main={
          <>
        <PhaseCard title="What a token is">
          Guess how many pieces your bot sees in one word. There is no rule you could work out,
          so just take a guess. Then watch a whole order get chopped.
        </PhaseCard>

        <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-pop">
          <p className="text-center font-label text-[11px] text-text-muted">
            {answered ? 'It splits into' : 'How many tokens is this word?'}
          </p>

          {!answered ? (
            <>
              <p className="mt-2 text-center text-3xl font-extrabold tracking-tight">{hookWord}</p>
              <div className="mt-3 text-left">
                <ChoiceGroup mode="commit" columns={4}>
                  {GUESS_OPTIONS.map((n) => (
                    <SelectableCard
                      key={n}
                      mode="commit"
                      variant="tile"
                      label={String(n)}
                      labelClassName="text-lg"
                      onSelect={() => setChopGuess(n)}
                    />
                  ))}
                </ChoiceGroup>
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {hookTokens.map((t, i) => (
                  <span
                    key={i}
                    className="rounded border-2 border-neutral bg-accent-soft px-2.5 py-1.5 font-mono text-sm font-bold text-tertiary"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-center text-[13px] leading-snug text-text">
                <span className="font-bold">{hookTokens.length} tokens.</span>{' '}
                {correct ? 'Nailed it.' : 'Surprising, right?'} One word to you, {hookTokens.length} pieces to
                the model.
              </p>
              <p className="mt-2 text-center text-[12px] leading-snug text-text-muted">
                Why &ldquo;pepper&rdquo; + &ldquo;oni&rdquo; and not syllables? The pieces are
                whatever showed up most often in the text the model learned from: &ldquo;pepper&rdquo;
                is a common word, &ldquo;oni&rdquo; a common ending. Nobody designed them, and you
                can&rsquo;t work them out by hand.
              </p>
            </>
          )}
        </div>

        {answered && (
          <>
            <div className="rounded-md border-[3px] border-neutral bg-muted p-3 shadow-pop">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-label text-[11px] text-text-muted">A whole order, split into tokens</p>
                <span className="shrink-0 rounded-full border-2 border-neutral bg-accent-soft px-2 py-0.5 font-label text-[11px] font-bold text-tertiary">
                  {samplePhrase.tokens.length} tokens
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {samplePhrase.tokens.map((t, i) => (
                  <span
                    key={i}
                    className="rounded border-2 border-neutral bg-surface px-2 py-1 font-mono text-xs text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-snug text-text-muted">
                <span className="font-bold text-text">
                  {wordCount} words, {samplePhrase.tokens.length} tokens.
                </span>{' '}
                Short, common words are usually one token. Longer or rarer ones get split, and not
                by syllable: a token is a chunk the model has seen a lot, so &ldquo;pepper&rdquo; +
                &ldquo;oni&rdquo;. Even punctuation counts.
              </p>
            </div>

            <GameActions>
              <GameActionButton
                variant="primary"
                icon="arrow_forward"
                onClick={() => setPhase('predict')}
              >
                Next: how it picks the next token
              </GameActionButton>
            </GameActions>
          </>
        )}
          </>
        }
      />
    )
  }

  // ---------- Beat 2: guess what's next ----------
  if (phase === 'predict') {
    const round = predictionRounds[roundIndex]
    const best = bestOf(round.options)
    const answered = pick !== null
    const correct = pick === best.word
    const isLast = roundIndex === predictionRounds.length - 1
    const sorted = [...round.options].sort((a, b) => b.pct - a.pct)

    function choose(word) {
      if (pick) return
      setPick(word)
      setResults((r) => [...r, word === best.word])
    }

    function next() {
      if (isLast) {
        setPhase('reveal')
        return
      }
      setRoundIndex((i) => i + 1)
      setPick(null)
    }

    return (
      <GameStage
        term={term}
        progress={{ part: 2, parts: 2, step: roundIndex + (answered ? 1 : 0), steps: predictionRounds.length }}
        main={
          <>
        <PhaseCard title="How it picks the next token">
          Your bot never writes a whole reply at once. It picks one token, then the next, then
          the next. Each option below is one token: a short, everyday word is a single token,
          while a long word like &ldquo;pepperoni&rdquo; would take four picks.
        </PhaseCard>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{round.context} <span className="text-tertiary">___</span>"
          </p>
        </div>

        {!answered ? (
          <ChoiceGroup mode="commit" label="Which token comes next? Each option is one token.">
            {round.options.map((o) => (
              <SelectableCard
                key={o.word}
                mode="commit"
                label={o.word}
                labelClassName="font-mono text-sm"
                onSelect={() => choose(o.word)}
              />
            ))}
          </ChoiceGroup>
        ) : (
          <>
            <Callout
              tone={correct ? 'success' : 'problem'}
              icon={correct ? 'check_circle' : 'cancel'}
              title={correct ? 'You called it' : `Your bot picked "${best.word}"`}
              compact
            >
              {round.why}
            </Callout>

            <Panel title="Your bot's ranking" meta="% = probability">
              <div className="flex flex-col gap-2">
                {sorted.map((o) => {
                  const isBest = o.word === best.word
                  const isPick = o.word === pick
                  return (
                    <div key={o.word} className="flex items-center gap-2">
                      <div
                        className={
                          'w-24 shrink-0 rounded border-2 px-1.5 py-1 text-center font-mono text-xs ' +
                          (isPick
                            ? 'border-neutral bg-accent-soft font-bold text-tertiary'
                            : 'border-neutral bg-muted text-text-muted')
                        }
                      >
                        {o.word}
                      </div>
                      <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                        <div
                          className={'h-full ' + (isBest ? 'bg-success' : 'bg-tertiary')}
                          style={{ width: `${o.pct}%` }}
                        />
                      </div>
                      <div className="w-9 shrink-0 text-right text-xs text-text-muted">
                        {o.pct}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={next}>
                {isLast ? 'See what this means' : 'Next sentence'}
              </GameActionButton>
            </GameActions>
          </>
        )}
          </>
        }
      />
    )
  }

  // ---------- Reveal ----------
  const score = results.filter(Boolean).length
  return (
    <TermReveal term={term} score={`You called your bot's next token on ${score} of ${predictionRounds.length}.`} onComplete={onComplete} />
  )
}
