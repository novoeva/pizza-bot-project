import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { BOT, NEEDED, EXTRA, STRANGER, WEEKS_PER_CONNECTOR } from './systems.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'

/**
 * MCP game, { termId, onComplete } interface.
 *
 * Rewritten for the owner role. You have ONE bot. It needs to reach the
 * systems your pizzeria runs on, and the old way each one is a custom
 * connector you build and maintain, weeks a piece, forever. You feel that
 * one system at a time, then a fourth tool you want piles on more of the same.
 * Then MCP gives your bot a single universal port: the same systems just click
 * in, and a brand-new tool a stranger built clicks in too, no bridge, no wait.
 *
 * No N x M matrix, no shape-matching, no second bot: the pain and the payoff
 * both belong to you, the owner, connecting your own bot.
 */

// The bot's card at the top of every build screen. Gains its universal port
// once MCP is installed.
function BotCard({ sub, port = false }) {
  return (
    <div
      className={
        'flex items-center gap-3 rounded-lg border-[3px] px-3 py-2.5 shadow-pop ' +
        (port ? 'border-primary bg-accent-soft' : 'border-neutral bg-surface')
      }
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-[3px] border-neutral bg-primary text-white">
        <span className="material-symbols-rounded text-[22px]">{BOT.icon}</span>
      </span>
      <div className="min-w-0">
        <p className="font-display text-lg font-extrabold leading-none">Your {BOT.name}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-text-muted">{sub}</p>
      </div>
      {port && (
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border-2 border-primary bg-surface px-2 py-0.5 font-label text-[10px] font-bold text-primary">
          <span className="material-symbols-rounded text-[14px]">usb</span>
          MCP port
        </span>
      )}
    </div>
  )
}

// One system the bot connects to. `right` is the action or status on the trailing edge.
function SystemRow({ sys, tone = 'todo', note, right }) {
  const border =
    tone === 'custom'
      ? 'border-cheese-dim bg-cheese-bg'
      : tone === 'mcp'
        ? 'border-success bg-success-bg'
        : 'border-neutral bg-surface'
  return (
    <div className={'flex items-center gap-3 rounded-md border-[3px] px-3 py-2 shadow-pop ' + border}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-neutral bg-surface text-text">
        <span className="material-symbols-rounded text-[20px]">{sys.icon}</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight">{sys.name}</p>
        <p className="text-[11px] leading-snug text-text-muted">{note ?? sys.desc}</p>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  )
}

function Counter({ n, label, tone = 'neutral' }) {
  return (
    <div
      className={
        'flex items-center justify-center gap-2 rounded-md border-[3px] px-3 py-1.5 shadow-pop ' +
        (tone === 'good'
          ? 'border-success bg-success-bg text-success'
          : tone === 'bad'
            ? 'border-danger bg-danger-bg text-danger'
            : 'border-neutral bg-surface text-text')
      }
    >
      <span className="font-display text-lg font-extrabold leading-none">{n}</span>
      <span className="font-label text-[10px] leading-tight">{label}</span>
    </div>
  )
}

export default function McpGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)

  const [phase, setPhase] = useState('old') // old | port | proof | reveal
  const [oldBuilt, setOldBuilt] = useState([]) // ids connected the custom way
  const [portOn, setPortOn] = useState(false) // universal port installed
  const [portClicked, setPortClicked] = useState([]) // ids clicked into the port
  const [strangerIn, setStrangerIn] = useState(false)

  const neededDone = NEEDED.every((s) => oldBuilt.includes(s.id))
  const extraShown = neededDone // the fourth tool piles on once the basics are wired
  const allOldDone = extraShown && oldBuilt.includes(EXTRA.id)
  const oldSystems = extraShown ? [...NEEDED, EXTRA] : NEEDED
  const mcpSystems = [...NEEDED, EXTRA]
  const allClicked = mcpSystems.every((s) => portClicked.includes(s.id))
  const weeks = oldBuilt.length * WEEKS_PER_CONNECTOR

  useGameScroll(phase, `${extraShown}:${allOldDone}:${portOn}:${allClicked}:${strangerIn}`)

  function build(id) {
    setOldBuilt((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }
  function clickIn(id) {
    setPortClicked((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  // --- reveal -------------------------------------------------------------
  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">Snapped onto your bot · {term.botPart}</p>
        <h2 className="text-2xl">You just learned the term MCP</h2>

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

  // --- proof: a tool nobody planned for, clicks straight in ----------------
  if (phase === 'proof') {
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={3} parts={3} />
        <PhaseCard title="One universal port" heading="A tool nobody planned for">
          A stock tracker was built last month by a company that has never heard of you or your
          bot. The old way, it would sit unusable until someone found time to build it a custom
          connector.
          <span className="mt-2 block font-bold text-text">But it speaks MCP. Plug it in.</span>
        </PhaseCard>

        <BotCard sub="one universal port, anything that speaks MCP fits" port />

        <SystemRow
          sys={STRANGER}
          tone={strangerIn ? 'mcp' : 'todo'}
          note={strangerIn ? 'connected · 0 weeks, nobody built a bridge' : STRANGER.desc}
          right={
            strangerIn ? (
              <span className="flex items-center gap-1 font-label text-[11px] font-bold text-success">
                <span className="material-symbols-rounded text-[16px]">check_circle</span>
                In
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setStrangerIn(true)}
                className="press rounded-md border-[3px] border-neutral bg-primary px-3 py-1.5 font-label text-[12px] font-bold text-white shadow-pop"
              >
                Plug it in
              </button>
            )
          }
        />

        {strangerIn && (
          <>
            <Callout tone="success" title="It just worked. You waited for no one.">
              The people who built the stock tracker and the people who built your bot never
              spoke. They both built to the same port, so the two sides fit before they ever met.
            </Callout>
            <GameActions>
              <GameActionButton
                variant="primary"
                icon="arrow_forward"
                onClick={() => setPhase('reveal')}
              >
                See what this means
              </GameActionButton>
            </GameActions>
          </>
        )}
      </div>
    )
  }

  // --- port: give the bot one universal port -------------------------------
  if (phase === 'port') {
    return (
      <div className="flex flex-col gap-3">
        <ProgressBar part={2} parts={3} step={portClicked.length} steps={mcpSystems.length} stepUnit="System" />
        <PhaseCard title="One universal port" heading="One universal port">
          Instead of a custom connector per system, give your bot a single port that any tool can
          plug into, as long as both sides speak the same standard. That standard is MCP.
        </PhaseCard>

        <BotCard
          sub={portOn ? 'universal port installed' : 'no universal port yet'}
          port={portOn}
        />

        {!portOn ? (
          <GameActions>
            <GameActionButton variant="primary" icon="usb" onClick={() => setPortOn(true)}>
              Give your bot a universal port (MCP)
            </GameActionButton>
          </GameActions>
        ) : (
          <>
            <p className="px-1 font-label text-[11px] text-text-muted">
              The same systems, now speaking MCP. No building, no shapes. Just click each one in.
            </p>
            <div className="flex flex-col gap-2">
              {mcpSystems.map((s) => {
                const inPort = portClicked.includes(s.id)
                return (
                  <SystemRow
                    key={s.id}
                    sys={s}
                    tone={inPort ? 'mcp' : 'todo'}
                    note={inPort ? 'speaks MCP · 0 weeks' : 'speaks MCP'}
                    right={
                      inPort ? (
                        <span className="flex items-center gap-1 font-label text-[11px] font-bold text-success">
                          <span className="material-symbols-rounded text-[16px]">check_circle</span>
                          In
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => clickIn(s.id)}
                          className="press rounded-md border-[3px] border-neutral bg-primary px-3 py-1.5 font-label text-[12px] font-bold text-white shadow-pop"
                        >
                          Click in
                        </button>
                      )
                    }
                  />
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Counter n="12 wks" label="the old, custom way" tone="bad" />
              <Counter n="0 wks" label="clicked into the port" tone="good" />
            </div>

            {allClicked && (
              <>
                <Callout tone="success" title="Same systems. Zero custom bridges." align="center">
                  No side has to know anything about the other any more. Each one only has to know
                  the port.
                </Callout>
                <GameActions>
                  <GameActionButton
                    variant="primary"
                    icon="arrow_forward"
                    onClick={() => setPhase('proof')}
                  >
                    Now the useful part
                  </GameActionButton>
                </GameActions>
              </>
            )}
          </>
        )}
      </div>
    )
  }

  // --- old: wire each system by hand ---------------------------------------
  return (
    <div className="flex flex-col gap-3">
      <ProgressBar part={1} parts={3} step={oldBuilt.length} steps={oldSystems.length} stepUnit="Connector" />
      <GameIntro term={term} />

      <BotCard sub="needs to reach the systems your pizzeria runs on" />

      <div className="flex flex-col gap-2">
        {oldSystems.map((s) => {
          const built = oldBuilt.includes(s.id)
          return (
            <SystemRow
              key={s.id}
              sys={s}
              tone={built ? 'custom' : 'todo'}
              note={built ? `custom connector · ${WEEKS_PER_CONNECTOR} wks · you maintain it` : s.desc}
              right={
                built ? (
                  <span className="flex items-center gap-1 font-label text-[11px] font-bold text-cheese-dim">
                    <span className="material-symbols-rounded text-[16px]">build</span>
                    Wired
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => build(s.id)}
                    className="press rounded-md border-[3px] border-neutral bg-surface px-3 py-1.5 font-label text-[12px] font-bold text-primary shadow-pop"
                  >
                    Build connector
                  </button>
                )
              }
            />
          )
        })}
      </div>

      {extraShown && !oldBuilt.includes(EXTRA.id) && (
        <Callout tone="problem" title="And you're not done" compact>
          You want the Loyalty app too. Same story, another custom build.
        </Callout>
      )}

      <div className="flex justify-center">
        <Counter
          n={`${weeks} wks`}
          label={oldBuilt.length === 1 ? '1 custom connector built' : `${oldBuilt.length} custom connectors built`}
          tone={oldBuilt.length ? 'bad' : 'neutral'}
        />
      </div>

      {allOldDone ? (
        <>
          <Callout tone="problem" title={`Four custom connectors. ${weeks} weeks of work.`} icon="schedule">
            And it never ends. Every new tool your bot needs is another custom bridge someone
            builds and keeps working.
          </Callout>
          <GameActions>
            <GameActionButton
              variant="primary"
              icon="arrow_forward"
              onClick={() => setPhase('port')}
            >
              There has to be a better way
            </GameActionButton>
          </GameActions>
        </>
      ) : (
        <p className="text-center font-label text-[11px] text-text-muted">
          Tap Build connector on each system your bot needs.
        </p>
      )}
    </div>
  )
}
