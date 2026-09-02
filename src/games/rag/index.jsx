import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { pages, rounds, answerFor, realTalk, MAX_PAGES } from './script.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import Panel from '../../components/Panel.jsx'

/**
 * RAG game, { termId, onComplete } interface.
 *
 * "You are the search." The bot has a fat binder of pizzeria paperwork but can
 * only read two pages at a time, so the player IS the retrieval step: pick which
 * pages the bot gets, then watch it answer using only those.
 *   1. Round 1 (easy win): the answer is on one page — hand it over, bot's right.
 *   2. Round 2 (the trap): two identical "Price list" pages, one two years old.
 *      Grab the old one and the bot quotes the old price, confidently, and never
 *      knows the difference.
 *   3. Round 3 (nothing fits): hand the adjacent page and the bot invents a
 *      wedding package; hand nothing and it honestly says it doesn't know.
 *
 * Layout + visual archetypes (see the pizza-bot-gamestage-layout and
 * pizza-bot-visual-archetypes memories): constant orientation lives LEFT via
 * GameStage; the current step's instruction sits at the top of the play column;
 * the customer's question reads as a chat MESSAGE (bubble + avatar), the binder
 * pages you hand the bot as colour-coded CHOICE cards, the bot's answer as a bot
 * MESSAGE, and the consequence as a tinted RESULT card.
 */
export default function RagGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [roundIdx, setRoundIdx] = useState(0)
  const [phase, setPhase] = useState('pick') // 'pick' | 'answer' | 'reveal'
  const [picked, setPicked] = useState([]) // page ids handed to the bot
  const [outcome, setOutcome] = useState(null) // result of answerFor()

  const round = rounds[roundIdx]
  useGameScroll(phase === 'reveal' ? 'reveal' : `${round.n}-${phase}`)

  function toggle(id) {
    setPicked((cur) =>
      cur.includes(id)
        ? cur.filter((x) => x !== id)
        : cur.length < MAX_PAGES
          ? [...cur, id]
          : cur,
    )
  }
  function answer(ids) {
    setOutcome(answerFor(round.n, ids))
    setPhase('answer')
  }
  function next() {
    // Round-1 miss: retry the same round so the mechanic lands before moving on.
    if (!outcome.advance) {
      setOutcome(null)
      setPhase('pick')
      return
    }
    if (roundIdx < rounds.length - 1) {
      setRoundIdx(roundIdx + 1)
      setPicked([])
      setOutcome(null)
      setPhase('pick')
    } else {
      setPhase('reveal')
    }
  }

  // Left column: constant orientation (what RAG is + Your role).
  const stage = (context, main) => <GameStage context={context} main={main} />

  // Per-phase instruction, at the top of the play column so it's always the
  // current step. Term name / role live on the left, so this stays slim.
  const instruction = (title, body, note) => (
    <PhaseCard title={title} progress={note}>
      {body}
    </PhaseCard>
  )

  // The customer's question as a received MESSAGE, the bot's answer as a sent
  // one. A different visual family from the page cards, so "the job" never
  // reads as "a thing you give the bot".
  const customerBubble = (
    <ChatMessage from="customer" label={`Customer · ${round.customer} · asking your bot`}>
      {round.question}
    </ChatMessage>
  )
  const botReply = (text) => (
    <ChatMessage from="bot" label="Your bot · out loud">
      {text}
    </ChatMessage>
  )

  // ---- Reveal (standard payoff card + a Real talk box) ----
  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term RAG</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
        </div>

        <Callout tone="info" title="Real talk">{realTalk}</Callout>

        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
            Snap it onto your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  // ---- Answer: the bot speaks, using only the pages it was handed ----
  if (phase === 'answer') {
    const handedTitles = picked.map((id) => pages.find((p) => p.id === id).title)
    const tone = outcome.tone === 'bad' ? 'problem' : outcome.tone === 'good' ? 'success' : 'info'

    return stage(
      <GameIntro term={term} showHowTo={false} />,
      <div className="flex flex-col gap-3">
        {instruction(
          'It answered',
          'The bot read only the pages you handed it, then answered the customer out loud. Here’s what came out.',
          { unit: 'Customer', current: round.n, total: rounds.length },
        )}
        {customerBubble}
        <Panel
          compact
          icon="drafts"
          title={
            handedTitles.length
              ? `You handed it: ${handedTitles.join(' + ')}`
              : 'You handed it nothing'
          }
        />
        {botReply(outcome.reply)}
        <Callout tone={tone} title={outcome.note.title}>
          {outcome.note.body}
        </Callout>
        <GameActions>
          <GameActionButton
            variant="primary"
            icon={outcome.advance ? 'arrow_forward' : 'refresh'}
            onClick={next}
          >
            {!outcome.advance
              ? 'Try again'
              : roundIdx < rounds.length - 1
                ? 'Next customer'
                : 'See what you learned'}
          </GameActionButton>
        </GameActions>
      </div>,
    )
  }

  // ---- Pick: choose which pages the bot gets to read ----
  //
  // Like the agent's build step, this phase has more to show than one column can
  // hold on desktop, so it uses GameStage's two slots as a WORKBENCH: the LEFT
  // column holds the job (the question) + the pages you've handed over (the
  // growing state), the RIGHT column holds the instruction + the binder you pick
  // from. Below `lg` the two slots simply stack, so the phone keeps one column.

  const atCap = picked.length >= MAX_PAGES

  // Left slot: the customer's question + the two handed-over slots.
  const workbench = (
    <>
      {customerBubble}
      <Panel
        compact
        icon="drafts"
        title="Handed to the bot"
        meta={<span className="font-bold">{picked.length}/{MAX_PAGES}</span>}
      >
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: MAX_PAGES }).map((_, i) => {
            const id = picked[i]
            if (!id) {
              return (
                <div
                  key={i}
                  className="flex min-h-[42px] items-center gap-2 rounded-md border-2 border-dashed border-slot-empty px-2.5 py-2 text-[13px] text-text-muted"
                >
                  <span className="material-symbols-rounded text-[17px]">add</span>
                  tap a page to hand it over…
                </div>
              )
            }
            const page = pages.find((p) => p.id === id)
            return (
              <div
                key={i}
                className="flex min-h-[42px] items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-2.5 py-2 text-[13px] font-bold text-cheese-dim"
              >
                <span className="material-symbols-rounded text-[17px]">{page.icon}</span>
                {page.title}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="ml-auto font-label text-[13px] font-bold text-cheese-dim"
                  aria-label={`Take back ${page.title}`}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </Panel>
    </>
  )

  // Right slot: this step's instruction + the binder. Each page is a CHOICE you
  // hand the bot — a colour-coded icon panel + a "Page from the binder" tag — so
  // it reads as its own thing, never as a message. Two pages are deliberately
  // titled the same; the only tell is the small `foot` date.
  const binder = (
    <div className="flex flex-col gap-3">
      {instruction(round.instruction ? `Round ${round.n}` : 'Round', round.instruction, `${picked.length}/${MAX_PAGES} handed`)}
      <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">menu_book</span>
        The binder · the bot reads at most {MAX_PAGES}
      </p>
      <div className="flex flex-col gap-2">
        {pages.map((page) => {
          const on = picked.includes(page.id)
          const locked = atCap && !on
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => toggle(page.id)}
              disabled={locked}
              className={
                'press flex items-stretch overflow-hidden rounded-md border-[3px] text-left shadow-pop ' +
                (on ? 'border-cheese-dim bg-cheese-bg ' : 'border-neutral bg-surface ') +
                (locked ? 'opacity-40' : '')
              }
            >
              <span
                className={
                  'flex w-11 shrink-0 items-center justify-center border-r-[3px] ' +
                  (on
                    ? 'border-cheese-dim bg-cheese-bg text-cheese-dim'
                    : 'border-neutral bg-accent-soft text-tertiary')
                }
                aria-hidden="true"
              >
                <span className="material-symbols-rounded text-[20px]">{page.icon}</span>
              </span>
              <span className="flex flex-1 flex-col px-3 py-2.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-label text-[10px] text-tertiary">
                    Page from the binder · {page.kind}
                  </span>
                  <span className="shrink-0 font-label text-[11px] font-bold text-primary">
                    {on ? 'handed ✓' : '+ hand over'}
                  </span>
                </span>
                <span className="mt-0.5 font-bold leading-snug text-text">{page.title}</span>
                <span className="mt-0.5 text-[12px] leading-snug text-text-muted">
                  {page.snippet}
                </span>
                {page.foot && (
                  <span className="mt-1 font-label text-[9px] text-text-muted">{page.foot}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {stage(
        <>
          <GameIntro term={term} showHowTo={false} />
          {workbench}
        </>,
        binder,
      )}
      <GameActions>
        {round.n === 3 && (
          <GameActionButton variant="neutral" icon="block" onClick={() => answer([])}>
            Hand it nothing
          </GameActionButton>
        )}
        <GameActionButton
          variant="primary"
          icon="visibility"
          disabled={picked.length === 0}
          onClick={() => answer(picked)}
        >
          Let the bot read these
        </GameActionButton>
      </GameActions>
    </>
  )
}
