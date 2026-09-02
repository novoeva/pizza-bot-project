import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import {
  order,
  WINDOW_SIZE,
  recallQuestion,
  recallInWindow,
  recallDropped,
  pinHint,
  goldfishNote,
  newChatQuestion,
  newChatReply,
  bridgeToMemory,
  honestyTitle,
  honestyIntro,
  honestyExample,
  honestyClose,
} from './messages.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

/**
 * Context window game, { termId, onComplete } interface.
 * A live "Context window" panel shows exactly what the bot can see right now.
 * Beat 1: send messages until the window overflows; the earliest line ("no
 * olives!!") scrolls out of view and the bot can't recall it. Beat 1b: as the
 * owner you can't enlarge the window, but you decide what goes in it, so you
 * pin the allergy and it stops dropping. Beat 2: a brand new order starts with
 * an empty window, so nothing carries over on its own.
 */
export default function ContextWindowGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('fill') // 'fill' | 'newchat' | 'reveal'
  const [sentCount, setSentCount] = useState(0)
  const [recalled, setRecalled] = useState(false)
  const [pinned, setPinned] = useState(false) // owner pinned the allergy back in
  const [newChatAsked, setNewChatAsked] = useState(false)

  useGameScroll(phase, `${recalled}:${pinned}`)

  const sent = order.slice(0, sentCount)
  const allSent = sentCount === order.length
  const nextMessage = order[sentCount]

  const instruction = (sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · What the bot can see</p>
      <h1 className="text-2xl leading-tight">Context window</h1>
      <p className="mt-1 text-[13px] leading-snug text-text-muted">{sub}</p>
    </div>
  )

  // ---------- Reveal ----------
  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term Context window</h2>

        {/* What it means: the definition (the payoff) */}
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        {/* Why you care */}
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
        </div>

        {/* Real talk: the honest note that owns the goldfish simplification */}
        <div className="rounded-lg border-[3px] border-tertiary bg-surface p-3 text-left shadow-pop">
          <p className="flex items-center gap-1 font-label text-[11px] font-bold text-tertiary">
            <span className="material-symbols-rounded text-[15px]">info</span>
            Real talk
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-text">{honestyTitle}</p>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">{honestyIntro}</p>
          <p className="mt-2 text-[13px] leading-snug text-text-muted">{honestyExample}</p>
          <p className="mt-2 text-[13px] leading-snug text-text">{honestyClose}</p>
        </div>

        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
            Snap it onto your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  // ---------- Beat 2: new order, empty window ----------
  if (phase === 'newchat') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('Same bot, brand new order. Watch the window.')}
        <ContextPanel sent={[]} />

        {!newChatAsked ? (
          <div className="rounded-md border-[3px] border-neutral bg-surface p-3 shadow-pop">
            <p className="mb-2 font-label text-[11px] text-text-muted">You, in the new chat</p>
            <div className="rounded-md border-[3px] border-neutral bg-accent-soft px-3 py-2 text-sm text-text">
              "{newChatQuestion}"
            </div>
            <GameActions>
              <GameActionButton variant="accent" icon="send" onClick={() => setNewChatAsked(true)}>
                Send in the new chat
              </GameActionButton>
            </GameActions>
          </div>
        ) : (
          <>
            <div className="ml-auto max-w-[85%] self-end rounded-md border-[3px] border-neutral bg-accent-soft px-4 py-2 text-sm text-text shadow-pop">
              "{newChatQuestion}"
            </div>
            <div className="max-w-[85%] self-start rounded-md border-[3px] border-danger bg-danger-bg px-4 py-3 shadow-pop">
              <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-danger">
                <span className="material-symbols-rounded text-[15px]">visibility_off</span>
                Empty window
              </p>
              <p className="text-[13px] leading-snug text-text">{newChatReply}</p>
            </div>
            <div className="rounded-md border-[3px] border-tertiary bg-surface px-3 py-2 shadow-pop">
              <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-tertiary">
                <span className="material-symbols-rounded text-[15px]">arrow_forward</span>
                Where this hands off
              </p>
              <p className="text-[13px] leading-snug text-text">{bridgeToMemory}</p>
            </div>
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
                See what this means
              </GameActionButton>
            </GameActions>
          </>
        )}
      </div>
    )
  }

  // ---------- Beat 1: fill the window ----------
  return (
    <div className="flex flex-col gap-3">
      <GameIntro term={term} />

      <ContextPanel sent={sent} pinned={pinned} />

      {!allSent && (
        <div className="rounded-md border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="mb-2 flex items-center justify-between font-label text-[11px] text-text-muted">
            <span>Next message from the customer</span>
            <span>
              {sentCount + 1} / {order.length}
            </span>
          </p>
          <div className="rounded-md border-[3px] border-neutral bg-accent-soft px-3 py-2 text-sm text-text">
            "{nextMessage.text}"
          </div>
          <GameActions>
            <GameActionButton variant="accent" icon="send" onClick={() => setSentCount((c) => c + 1)}>
              Send to the bot
            </GameActionButton>
          </GameActions>
        </div>
      )}

      {allSent && !recalled && (
        <div className="rounded-md border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="mb-2 font-label text-[11px] text-text-muted">
            The whole order is in. Now check what the bot still sees.
          </p>
          <GameActions>
            <GameActionButton variant="primary" icon="quiz" onClick={() => setRecalled(true)}>
              Ask: "{recallQuestion}"
            </GameActionButton>
          </GameActions>
        </div>
      )}

      {allSent && recalled && (
        <>
          {/* Ask #1 — the allergy has already scrolled out, so the bot can't answer. */}
          <div className="ml-auto max-w-[85%] self-end rounded-md border-[3px] border-neutral bg-accent-soft px-4 py-2 text-sm text-text shadow-pop">
            "{recallQuestion}"
          </div>
          <div className="max-w-[85%] self-start rounded-md border-[3px] border-danger bg-danger-bg px-4 py-3 shadow-pop">
            <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-danger">
              <span className="material-symbols-rounded text-[15px]">visibility_off</span>
              Out of the context window
            </p>
            <p className="text-[13px] leading-snug text-text">{recallDropped}</p>
          </div>

          {!pinned ? (
            <>
              {/* Beat 1b: the owner's move — you can't grow the window, but you
                  decide what stays in it. */}
              <div className="rounded-md border-[3px] border-tertiary bg-surface px-3 py-2 shadow-pop">
                <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-tertiary">
                  <span className="material-symbols-rounded text-[15px]">push_pin</span>
                  You're the owner. You can fix this.
                </p>
                <p className="text-[13px] leading-snug text-text">{pinHint}</p>
              </div>
              <GameActions>
                <GameActionButton variant="primary" icon="push_pin" onClick={() => setPinned(true)}>
                  Pin the allergy to the top
                </GameActionButton>
              </GameActions>
            </>
          ) : (
            <>
              {/* Ask #2 — same question, but the pinned line is still in view. */}
              <div className="ml-auto max-w-[85%] self-end rounded-md border-[3px] border-neutral bg-accent-soft px-4 py-2 text-sm text-text shadow-pop">
                "{recallQuestion}"
              </div>
              <div className="max-w-[85%] self-start rounded-md border-[3px] border-success bg-success-bg px-4 py-3 shadow-pop">
                <p className="mb-1 flex items-center gap-1 font-label text-[11px] font-bold text-success">
                  <span className="material-symbols-rounded text-[15px]">push_pin</span>
                  Pinned, so it stays in the window
                </p>
                <p className="text-[13px] leading-snug text-text">{recallInWindow}</p>
              </div>
              <GameActions>
                <GameActionButton
                  variant="primary"
                  icon="arrow_forward"
                  onClick={() => setPhase('newchat')}
                >
                  Start a new order
                </GameActionButton>
              </GameActions>
            </>
          )}
        </>
      )}
    </div>
  )
}

/**
 * The context window as a sliding frame over the conversation: messages that
 * scrolled out sit faded and struck through above a boundary line; what the
 * bot can actually see sits below it.
 */
function ContextPanel({ sent, pinned = false }) {
  const critical = sent.find((m) => m.critical)
  const showPinned = pinned && Boolean(critical)
  // A pinned line is reserved its own slot: it never counts toward the sliding
  // window and never scrolls out. The rest of the messages share what's left.
  const rest = showPinned ? sent.filter((m) => !m.critical) : sent
  const cap = showPinned ? WINDOW_SIZE - 1 : WINDOW_SIZE
  const dropped = rest.slice(0, Math.max(0, rest.length - cap))
  const inWindow = rest.slice(-cap)
  const seen = inWindow.length + (showPinned ? 1 : 0)
  return (
    <div className="overflow-hidden rounded-md border-[3px] border-neutral bg-surface shadow-card">
      <div className="flex items-center justify-between bg-text px-3 py-1.5 font-label text-[10px] text-white">
        <span className="flex items-center gap-1">
          <span className="material-symbols-rounded text-[14px]">visibility</span>
          Context window · what the bot sees
        </span>
        <span>
          {seen} / {WINDOW_SIZE}
        </span>
      </div>

      <div className="flex items-center gap-1 border-b-2 border-slot-empty bg-accent-soft px-3 py-1 font-label text-[10px] text-text">
        <span className="material-symbols-rounded text-[13px]">psychology</span>
        {goldfishNote}
      </div>

      <div className="flex min-h-[7rem] flex-col gap-1.5 p-3">
        {sent.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Empty. The bot can't see anything yet.
          </p>
        ) : (
          <>
            {showPinned && (
              <div className="flex items-center gap-2 rounded-md border-2 border-success bg-success-bg px-3 py-1.5 text-[13px] text-text">
                <span className="material-symbols-rounded text-[14px] text-success">push_pin</span>
                <span className="font-bold">{critical.text}</span>
                <span className="ml-auto shrink-0 font-label text-[10px] font-bold text-success">
                  pinned
                </span>
              </div>
            )}
            {dropped.map((m) => (
              <div
                key={m.id}
                className="rounded-md border-2 border-slot-empty bg-surface px-3 py-1.5 text-[13px] text-text-muted line-through opacity-60"
              >
                {m.text}
              </div>
            ))}
            {dropped.length > 0 && (
              <div className="my-0.5 flex items-center gap-2">
                <span className="h-0 flex-1 border-t-2 border-dashed border-slot-empty" />
                <span className="font-label text-[10px] text-text-muted">
                  out of the context window
                </span>
                <span className="h-0 flex-1 border-t-2 border-dashed border-slot-empty" />
              </div>
            )}
            {inWindow.map((m) => (
              <div
                key={m.id}
                className="rounded-md border-2 border-neutral bg-muted px-3 py-1.5 text-[13px] text-text-muted"
              >
                {m.text}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
