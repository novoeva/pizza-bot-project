import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { pages, rounds, answerFor, realTalk, MAX_PAGES } from './script.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import PartTile from '../../components/PartTile.jsx'
import SlotList from '../../components/SlotList.jsx'
import { useFirstTimeHint } from '../../lib/useFirstTimeHint.js'
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

  const hint = useFirstTimeHint(phase === 'pick')

  function toggle(id) {
    setPicked((cur) =>
      cur.includes(id)
        ? cur.filter((x) => x !== id)
        : cur.length < MAX_PAGES
          ? [...cur, id]
          : cur,
    )
  }
  function handOver(id) {
    setPicked((cur) => (cur.includes(id) || cur.length >= MAX_PAGES ? cur : [...cur, id]))
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

  // Progress: the customer (round), and while picking, the pages handed over.
  const progress =
    phase === 'pick'
      ? { part: round.n, parts: rounds.length, step: picked.length, steps: MAX_PAGES }
      : { part: round.n, parts: rounds.length }

  // Left column: constant orientation (what RAG is + Your role).
  const stage = (context, main) => <GameStage context={context} main={main} progress={progress} />

  // Per-phase instruction, at the top of the play column so it's always the
  // current step. Term name / role live on the left, so this stays slim.
  const instruction = (title, body, note) => (
    <PhaseCard title={title} meta={note}>
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
      <TermReveal
        term={term}
        onComplete={onComplete}
        aside={
          <Callout tone="info" title="Real talk">
            {realTalk}
          </Callout>
        }
      />
    )
  }

  // ---- Answer: the bot speaks, using only the pages it was handed ----
  if (phase === 'answer') {
    const handedTitles = picked.map((id) => pages.find((p) => p.id === id).title)
    const tone = outcome.tone === 'bad' ? 'problem' : outcome.tone === 'good' ? 'success' : 'info'

    return stage(
      <GameIntro term={term} />,
      <div className="flex flex-col gap-3">
        {instruction(
          'It answered',
          'The bot read only the pages you handed it, then answered the customer out loud. Here’s what came out.',
          undefined,
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

  // Left slot: the customer's question + the two handed-over slots, a SlotList
  // (the pages become a part of what the bot reads).
  const workbench = (
    <>
      {customerBubble}
      <SlotList
        title="Handed to the bot"
        icon="drafts"
        capacity={MAX_PAGES}
        items={picked.map((id) => {
          const p = pages.find((x) => x.id === id)
          return { id, icon: p.icon, label: p.title }
        })}
        accepts={pages.map((p) => p.id)}
        onDrop={handOver}
        onRemove={(i) => toggle(picked[i])}
        emptyLabel="drag a page here…"
        emptyTapLabel="tap a page to hand it over…"
        numbered={false}
        pulse={hint}
      />
    </>
  )

  // Right slot: this step's instruction + the binder. Each page is a PartTile
  // you drag (or tap) over to the bot. Two pages are deliberately titled the
  // same; the only tell is the small `foot` date.
  const firstFree = pages.findIndex((p) => !picked.includes(p.id))
  const binder = (
    <div className="flex flex-col gap-3">
      {instruction(round.instruction ? `Round ${round.n}` : 'Round', round.instruction)}
      <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">menu_book</span>
        The binder · the bot reads at most {MAX_PAGES} · drag or tap pages over
      </p>
      <div className="flex flex-col gap-2">
        {pages.map((page, i) => {
          const on = picked.includes(page.id)
          const locked = atCap && !on
          return (
            <PartTile
              key={page.id}
              id={page.id}
              icon={page.icon}
              label={page.title}
              detail={`${page.kind} · ${page.snippet}`}
              foot={page.foot}
              used={on || locked}
              usedLabel={on ? 'handed over' : 'bot is full'}
              onAdd={() => handOver(page.id)}
              wiggle={hint && i === firstFree}
            />
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {stage(
        <>
          <GameIntro term={term} />
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
