import { useEffect, useState } from 'react'
import { order, chatbotReply, actions, systems, fired, validateSequence } from './script.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'

/**
 * Agent game — { termId, onComplete } interface.
 *
 * "From chat to agent." One idea: a chatbot only talks, an agent acts.
 *   1. Chat — the plain chatbot answers Marco with nice words; the real systems
 *      (Payment / Kitchen / Delivery) stay asleep. Nothing happened.
 *   2. Build — the player turns it into an agent by handing it real actions in a
 *      sensible order (check stock → charge → kitchen → driver).
 *   3. Run — each action fires and lights up its external system. Order matters:
 *      a bad sequence (driver before the kitchen cooked) fails and sends the
 *      player back to fix it. That dependency is why an agent has to act, not
 *      just talk.
 */
export default function AgentGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('chat') // 'chat' | 'build' | 'snag' | 'run' | 'reveal'
  const [seq, setSeq] = useState([]) // ordered action ids
  const [snag, setSnag] = useState(null) // { msg, lit }
  const [runIdx, setRunIdx] = useState(0) // how many actions have fired

  const full = seq.length === actions.length

  // During the run the agent fires one action at a time, ~750ms apart.
  useEffect(() => {
    if (phase !== 'run' || runIdx >= seq.length) return
    const t = setTimeout(() => setRunIdx((i) => i + 1), runIdx === 0 ? 650 : 750)
    return () => clearTimeout(t)
  }, [phase, runIdx, seq.length])

  function add(id) {
    if (seq.length < actions.length && !seq.includes(id)) setSeq([...seq, id])
  }
  function removeAt(i) {
    setSeq(seq.filter((_, idx) => idx !== i))
  }
  function runAgent() {
    const bad = validateSequence(seq)
    if (bad) {
      setSnag(bad)
      setPhase('snag')
      return
    }
    setRunIdx(0)
    setPhase('run')
  }

  // ---- Reveal (standard payoff card) ----
  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term Agent</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
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

  // ---- Step 1: the plain chatbot (all talk, nothing fires) ----
  if (phase === 'chat') {
    return (
      <div className="flex flex-col gap-3">
        <GameIntro term={term} />
        <OrderCard />
        <div className="flex items-start gap-2">
          <BotAvatar />
          <div className="rounded-lg border-[3px] border-neutral bg-surface px-3 py-2 text-[13px] font-semibold leading-snug shadow-pop">
            {chatbotReply}
          </div>
        </div>
        <SystemsPanel lit={new Set()} />
        <div className="flex items-center gap-2 rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2.5 text-[13px] font-bold leading-snug text-danger shadow-pop">
          <span className="material-symbols-rounded text-[20px]">sentiment_neutral</span>
          It talked. Nothing actually happened — no pizza is coming.
        </div>
        <button
          type="button"
          onClick={() => setPhase('build')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">build</span>
          Turn it into an agent
        </button>
      </div>
    )
  }

  // ---- Snag: bad order, funny real-world failure ----
  if (phase === 'snag') {
    const litSet = new Set(snag.lit ? [snag.lit] : [])
    return (
      <div className="flex flex-col gap-2.5">
        <Header title="Ran it · uh oh" note="bad order" />
        <OrderCard />
        <div className="flex items-center gap-2 rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2.5 text-[13px] font-bold leading-snug text-danger shadow-pop">
          <span className="material-symbols-rounded text-[20px]">warning</span>
          {snag.msg}
        </div>
        <SystemsPanel lit={litSet} />
        <p className="px-1 text-center text-[13px] leading-snug text-text">
          An agent acts in the <span className="font-bold text-primary">real world</span>, so the
          order matters. Fix the sequence and run it again.
        </p>
        <button
          type="button"
          onClick={() => setPhase('build')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_back</span>
          Fix the order
        </button>
      </div>
    )
  }

  // ---- Run: fire each action, light up each system ----
  if (phase === 'run') {
    const done = runIdx >= seq.length
    const litSet = new Set(seq.slice(0, runIdx))
    return (
      <div className="flex flex-col gap-2.5">
        <Header title="Running the agent" note={`${Math.min(runIdx, seq.length)}/${seq.length}`} />
        <OrderCard />
        <SystemsPanel lit={litSet} />
        <div className="rounded-md border-[3px] border-neutral bg-surface px-3 py-2.5 shadow-pop">
          <p className="mb-2 flex items-center gap-1 font-label text-[10px] text-text-muted">
            <span className="material-symbols-rounded text-[15px]">wifi_tethering</span>
            Real actions fired
          </p>
          <div className="flex flex-col gap-1.5">
            {seq.slice(0, runIdx).map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 rounded-md border-2 border-success bg-success-bg px-2.5 py-1.5 text-[13px] font-bold text-success"
              >
                <span className="material-symbols-rounded text-[16px]">{fired[id].icon}</span>
                {fired[id].name}: {fired[id].result}
              </div>
            ))}
            {!runIdx && <p className="text-[13px] italic text-text-muted">…starting…</p>}
          </div>
        </div>
        {!done && (
          <div className="flex animate-pulse items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-3 py-2.5 text-[13px] font-bold text-cheese-dim shadow-pop">
            <span className="material-symbols-rounded text-[20px]">
              {actions.find((a) => a.id === seq[runIdx]).icon}
            </span>
            Firing: {actions.find((a) => a.id === seq[runIdx]).label}…
          </div>
        )}
        {done && (
          <button
            type="button"
            onClick={() => setPhase('reveal')}
            className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
          >
            <span className="material-symbols-rounded">arrow_forward</span>
            See what it just did
          </button>
        )}
      </div>
    )
  }

  // ---- Step 2: build the agent (pick real actions, in order) ----
  return (
    <div className="flex flex-col gap-2.5">
      <Header title="Build the agent" note={`${seq.length}/${actions.length}`} />
      <OrderCard />
      <p className="px-1 text-center text-[13px] leading-snug text-text">
        A chatbot only talks. An{' '}
        <span className="font-bold text-primary">agent takes real actions</span> — in the order that
        makes sense. Tap the actions to build its to-do list.
      </p>

      {/* The to-do list the player is assembling */}
      <div className="rounded-md border-[3px] border-neutral bg-surface px-3 py-2.5 shadow-pop">
        <p className="mb-2 flex items-center gap-1 font-label text-[10px] text-text-muted">
          <span className="material-symbols-rounded text-[15px]">checklist</span>
          The agent’s to-do list
        </p>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: actions.length }).map((_, i) => {
            const id = seq[i]
            if (!id) {
              return (
                <div
                  key={i}
                  className="flex min-h-[42px] items-center gap-2 rounded-md border-2 border-dashed border-slot-empty px-2.5 py-2 text-[13px] text-text-muted"
                >
                  <span className="w-4 text-center font-label text-[11px] font-bold">{i + 1}</span>
                  tap an action to add it here…
                </div>
              )
            }
            const action = actions.find((a) => a.id === id)
            return (
              <div
                key={i}
                className="flex min-h-[42px] items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-2.5 py-2 text-[13px] font-bold text-cheese-dim"
              >
                <span className="w-4 text-center font-label text-[11px] font-bold">{i + 1}</span>
                <span className="material-symbols-rounded text-[17px]">{action.icon}</span>
                {action.label}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="ml-auto font-label text-[13px] font-bold text-cheese-dim"
                  aria-label={`Remove ${action.label}`}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Available actions */}
      <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">handyman</span>
        Actions it can take
      </p>
      <div className="flex flex-col gap-2">
        {actions.map((action) => {
          const used = seq.includes(action.id)
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => add(action.id)}
              disabled={used}
              className={
                'press flex items-center gap-2.5 rounded-md border-[3px] border-neutral px-3 py-3 text-left text-[13px] font-bold shadow-pop ' +
                (used ? 'bg-surface opacity-40' : 'bg-surface text-text')
              }
            >
              <span className="material-symbols-rounded text-[18px]">{action.icon}</span>
              {action.label}
              <span className="ml-auto font-label text-[11px] font-bold text-primary">
                {used ? 'added' : '+ add'}
              </span>
            </button>
          )
        })}
      </div>

      {seq.length > 0 && (
        <button
          type="button"
          onClick={() => setSeq([])}
          className="self-center font-label text-[11px] font-bold text-text-muted"
        >
          ↻ clear the list
        </button>
      )}

      <button
        type="button"
        onClick={runAgent}
        disabled={!full}
        className={
          'press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral py-3 font-label font-bold text-white shadow-pop ' +
          (full ? 'bg-primary' : 'bg-primary opacity-40')
        }
      >
        <span className="material-symbols-rounded fill">play_arrow</span>
        Run the agent
      </button>
    </div>
  )
}

// ---- The incoming customer order (the job the agent must fulfill) ----
function OrderCard() {
  return (
    <div className="rounded-md border-[3px] border-neutral bg-muted px-3 py-2 shadow-pop">
      <p className="flex items-center gap-1 font-label text-[10px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">receipt_long</span>
        Customer · {order.customer}
      </p>
      <p className="mt-0.5 text-[13px] font-bold leading-snug text-text">{order.text}</p>
    </div>
  )
}

// ---- The three external systems, asleep until their action fires ----
function SystemsPanel({ lit }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {systems.map((sys) => {
        const on = lit.has(sys.id)
        return (
          <div
            key={sys.id}
            className={
              'flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-md border-[3px] px-1.5 py-2 text-center shadow-pop ' +
              (on ? 'border-success bg-success-bg' : 'border-neutral bg-text')
            }
          >
            <span
              className={
                'material-symbols-rounded text-[20px] ' + (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {sys.icon}
            </span>
            <span
              className={
                'font-label text-[8.5px] uppercase leading-none ' +
                (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {sys.name}
            </span>
            <span
              className={
                'text-[10px] font-bold leading-tight ' + (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {on ? fired[sys.id].result : '— asleep'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ---- Light header used on the play screens ----
function Header({ title, note }) {
  return (
    <div className="flex items-center justify-between rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Agent · {title}</p>
      <span className="font-label text-[11px] text-text-muted">{note}</span>
    </div>
  )
}

// ---- Little bot avatar for the chatbot bubble ----
function BotAvatar() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[3px] border-neutral bg-primary">
      <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
        <rect x="5" y="7" width="22" height="18" rx="6" fill="#fff" />
        <circle cx="12.5" cy="16" r="2.6" fill="var(--color-primary)" />
        <circle cx="19.5" cy="16" r="2.6" fill="var(--color-primary)" />
        <line x1="16" y1="7" x2="16" y2="3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="2.5" r="2" fill="#fff" />
      </svg>
    </span>
  )
}
