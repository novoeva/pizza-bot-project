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
 * One token as a chip, the same look beat 1 uses for the chopped word, so a
 * piece reads as a piece on every screen of the game.
 *   tone  'written' (default) already on screen
 *         'picked'  the token the bot just chose (green = it went right)
 *         'later'   a piece the bot still has to pick, faded
 *         'slot'    the empty next-token slot, dashed
 */
const CHIP_TONES = {
  written: 'border-neutral bg-accent-soft text-tertiary',
  picked: 'border-success bg-success-bg text-success',
  later: 'border-dashed border-slot-empty bg-surface text-text-muted opacity-70',
  slot: 'border-dashed border-tertiary bg-surface text-tertiary',
}

function TokenChip({ tone = 'written', className = '', children }) {
  return (
    <span
      className={
        'inline-block rounded border-2 px-2 py-1 font-mono text-sm font-bold leading-none ' +
        CHIP_TONES[tone] +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </span>
  )
}

/**
 * Token game, { termId, onComplete } interface.
 * Two beats that build the concept in order:
 *   1. Chop it up, a token is a chunk of text. Guess how many tokens
 *      "Pepperoni" is (four), then see the chunks and a whole order tokenized.
 *   2. Read your bot's mind, your bot writes one token at a time, predicting
 *      the next from a ranked list. It writes "pepperoni" with the very pieces
 *      beat 1 chopped it into; you call each next piece before it does, then
 *      see the ranking and the pieces snap together (PIZZA-31: a token, never
 *      a whole word). You stay the owner watching your bot, never the model.
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
                Why &ldquo;pep&rdquo; and not &ldquo;pe&rdquo;? The pieces are whatever showed up
                most often in the text the model learned from. Nobody designed them, and you
                can&rsquo;t work them out by hand.
              </p>
            </>
          )}
        </div>

        {answered && (
          <>
            <div className="rounded-md border-[3px] border-neutral bg-muted p-3 shadow-pop">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-label text-[11px] text-text-muted">A whole order, chunked</p>
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
                Short, common words are usually one token. Long or unusual ones get split. Even
                punctuation counts.
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
  // PIZZA-31: the bot writes "pepperoni" piece by piece, with the same pieces
  // beat 1 chopped it into. Each round shows the pieces already written and
  // stops mid-word, so what the player calls is visibly the next PIECE, never
  // the whole word. After the pick the pieces snap together on screen.
  if (phase === 'predict') {
    const round = predictionRounds[roundIndex]
    const best = bestOf(round.options)
    const answered = pick !== null
    const correct = pick === best.token
    const isLast = roundIndex === predictionRounds.length - 1
    const sorted = [...round.options].sort((a, b) => b.pct - a.pct)
    const wordSoFar = round.written.join('')

    function choose(token) {
      if (pick) return
      setPick(token)
      setResults((r) => [...r, token === best.token])
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
          Your bot never writes a whole word at once. It writes one token, then the next, then
          the next. Below it is in the middle of a word: the pieces it has already written are on
          screen. Call the next piece before it does.
        </PhaseCard>

        {/* The sentence so far. Plain text for the finished words, then the
            pieces of the word in progress as chips with no gap between them,
            then the empty slot, so the stop lands visibly mid-word. */}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Your bot is writing</p>
          <p className="mt-2 flex flex-wrap items-center justify-center text-lg font-extrabold leading-snug">
            <span className="mr-2">&ldquo;{round.before}</span>
            <span className="inline-flex items-center gap-0.5">
              {round.written.map((t, i) => (
                <TokenChip key={i}>{t}</TokenChip>
              ))}
              {answered ? (
                <TokenChip tone="picked" className={'part-land' + (best.space ? ' ml-1.5' : '')}>
                  {best.token}
                </TokenChip>
              ) : (
                <TokenChip tone="slot">?</TokenChip>
              )}
            </span>
            <span className="ml-0.5">&rdquo;</span>
          </p>
          {round.note && (
            <p className="mt-2 text-[12px] leading-snug text-text-muted">{round.note}</p>
          )}
        </div>

        {!answered ? (
          <ChoiceGroup mode="commit" label="Which token does your bot pick next?">
            {round.options.map((o) => (
              <SelectableCard
                key={o.token}
                mode="commit"
                label={o.token}
                labelClassName="font-mono text-sm"
                onSelect={() => choose(o.token)}
              />
            ))}
          </ChoiceGroup>
        ) : (
          <>
            <Callout
              tone={correct ? 'success' : 'problem'}
              icon={correct ? 'check_circle' : 'cancel'}
              title={correct ? 'You called it' : `Your bot picked "${best.token}"`}
              compact
            >
              {round.why}
            </Callout>

            {/* The pieces snap together: what was written + the bot's pick,
                then the pieces still to come, faded. This is where the point
                lands: the bot built the word, it never guessed it. */}
            <Panel title="Snapped together" compact>
              <div className="flex flex-wrap items-center gap-1">
                {round.written.map((t, i) => (
                  <TokenChip key={i}>{t}</TokenChip>
                ))}
                <span className="font-label text-sm text-text-muted">+</span>
                <TokenChip tone="picked" className={best.space ? 'ml-1' : ''}>
                  {best.token}
                </TokenChip>
                {round.after.map((t, i) => (
                  <TokenChip key={'after' + i} tone="later">
                    {t}
                  </TokenChip>
                ))}
              </div>
              <p className="mt-2 text-[13px] leading-snug text-text">
                {round.after.length > 0 ? (
                  <>
                    <span className="font-mono font-bold">{wordSoFar}</span> +{' '}
                    <span className="font-mono font-bold text-success">{best.token}</span> ={' '}
                    <span className="font-mono font-bold">{wordSoFar + best.token}&hellip;</span>{' '}
                    {round.after.length === 1
                      ? `One more pick (${round.after[0]}) and the word is done.`
                      : `${round.after.length} more picks (${round.after.join(', ')}) and the word is done.`}
                  </>
                ) : (
                  <>
                    <span className="font-mono font-bold">{wordSoFar}</span> is complete. Next token:{' '}
                    <span className="font-mono font-bold text-success">{best.token}</span>, a whole
                    short word this time. Common words like this are one token on their own.
                  </>
                )}
              </p>
            </Panel>

            <Panel title="Your bot's ranking" meta="% = probability">
              <div className="flex flex-col gap-2">
                {sorted.map((o) => {
                  const isBest = o.token === best.token
                  const isPick = o.token === pick
                  return (
                    <div key={o.token} className="flex items-center gap-2">
                      <div
                        className={
                          'w-24 shrink-0 rounded border-2 px-1.5 py-1 text-center ' +
                          (isPick
                            ? 'border-neutral bg-accent-soft text-tertiary'
                            : 'border-neutral bg-muted text-text-muted')
                        }
                      >
                        <span className={'block font-mono text-xs ' + (isPick ? 'font-bold' : '')}>{o.token}</span>
                        <span className="block font-label text-[9px] leading-tight">{o.makes}</span>
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
                {isLast ? 'See what this means' : 'Next piece'}
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
