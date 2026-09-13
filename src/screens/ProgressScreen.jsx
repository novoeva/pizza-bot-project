import { useState } from 'react'
import BotCanvas from '../components/BotCanvas.jsx'
import { useProgress } from '../lib/useProgress.js'
import { sortedTerms, termCount } from '../lib/terms.js'

export default function ProgressScreen() {
  const completedTerms = useProgress()
  const total = termCount
  const done = completedTerms.length
  const powered = done === total
  const [name, setName] = useState('')

  const dateLabel = new Date()
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    .toUpperCase()

  const share = () => {
    const text = 'I just built my own AI agent with Pizza Bot! 🍕🤖'
    const url = window.location.origin
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
      '_blank',
      'noopener',
    )
  }

  return (
    <main className="mx-auto max-w-game px-4 pb-6 pt-6 lg:max-w-desktop lg:px-8 lg:pt-10">
      <p className="text-center font-label text-xs text-text-muted">Your progress</p>
      <p className="mt-1 text-center text-3xl font-extrabold lg:text-4xl">
        {done} out of {total} completed
      </p>
      <div className="mx-auto mt-3 h-4 rounded-full border-[3px] border-neutral bg-muted p-0.5 lg:max-w-xl">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>

      {/* Below `lg`: mascot then status/certificate, stacked (mobile). At `lg`+:
          mascot sits in a sticky left column, the status card / certificate in
          the right column. */}
      <div className="lg:mt-8 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-x-12">
        {/* Mascot */}
        <div className="relative mx-auto mt-6 w-56 max-w-[70%] lg:mt-0 lg:w-full lg:max-w-xs lg:self-start lg:justify-self-center lg:sticky lg:top-10">
          <span
            className={
              'absolute -right-2 -top-2 z-10 rotate-12 rounded-md border-[3px] border-neutral px-3 py-1 font-label text-sm shadow-pop ' +
              (powered ? 'bg-success text-white' : 'bg-muted text-text-muted')
            }
          >
            {powered ? 'COMPLETE!' : `${done}/${total}`}
          </span>
          <div className={powered ? '' : 'opacity-60 grayscale'}>
            <BotCanvas completedTerms={completedTerms} />
          </div>
        </div>

        {/* Right column: status card while unfinished, certificate + share once done. */}
        <div>
      {!powered ? (
        <div className="mt-6 rounded-lg border-[3px] border-neutral bg-muted p-6 text-center shadow-pop lg:mt-0">
          <span className="material-symbols-rounded fill text-3xl text-text-muted">
            hourglass_top
          </span>
          <h3 className="mt-2 text-xl">Not finished yet</h3>
          <p className="mt-1 text-sm text-text-muted">
            Build all {total} parts to switch your bot on and get the diploma. Nothing is locked.
            Play them in any order.
          </p>
        </div>
      ) : (
        <>
          <section
            className="relative mt-6 overflow-hidden rounded-sm border-[6px] border-neutral bg-surface text-center"
            style={{
              backgroundImage: 'radial-gradient(var(--color-tomato) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div className="flex items-center justify-between border-b-[3px] border-neutral bg-muted px-4 py-3">
              <span className="material-symbols-rounded fill text-text-muted">
                workspace_premium
              </span>
              <span className="font-label text-xs text-text-muted">Official Certification</span>
              <span className="material-symbols-rounded fill text-text-muted">verified_user</span>
            </div>
            <div className="relative z-10 px-5 py-6">
              <h2 className="text-3xl leading-none">
                YOU JUST BUILT AN
                <br />
                AI AGENT
              </h2>
              <div className="mx-auto my-4 h-1 w-16 bg-tomato" />
              <p className="font-label text-xs tracking-[0.2em] text-text-muted">Awarded to</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="THE PLAYER'S NAME"
                spellCheck={false}
                className="mt-1 w-full border-b-[3px] border-dotted border-neutral bg-transparent pb-1 text-center font-display text-2xl font-extrabold uppercase tracking-tight text-text placeholder:text-slot-empty focus:outline-none"
              />
              <div className="mt-6 flex items-end justify-between">
                <div className="text-left">
                  <p className="font-label text-[10px] text-text-muted">Date issued</p>
                  <p className="font-label text-sm text-text">{dateLabel}</p>
                </div>
                <div className="flex h-[88px] w-[88px] -rotate-12 flex-col items-center justify-center rounded-full border-4 border-double border-tomato text-tomato">
                  <span className="text-center font-label text-[10px] leading-tight">
                    PIZZA BOT
                    <br />
                    CERTIFIED
                  </span>
                  <span className="material-symbols-rounded fill mt-1 text-xl">restaurant</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2.4 (Nina): close the loop on the number promised at the start.
              "These are the N you learned today", every one ticked. */}
          <section className="mt-5 rounded-lg border-[3px] border-neutral bg-surface p-4 shadow-pop">
            <h3 className="text-lg leading-tight">The {total} AI terms you learned today</h3>
            <ol className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {sortedTerms.map((t, i) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white"
                      aria-hidden="true"
                    >
                      <span className="material-symbols-rounded fill text-base">check</span>
                    </span>
                    <span className="font-label text-text-muted">{i + 1}.</span>
                    <span className="font-semibold">{t.name}</span>
                  </li>
                ))}
            </ol>
          </section>

          <button
            type="button"
            onClick={share}
            className="press mt-5 flex w-full items-center justify-center gap-3 rounded-md border-[3px] border-neutral bg-primary px-6 py-4 font-label font-bold text-white shadow-pop"
          >
            <span className="material-symbols-rounded">share</span>
            Share to LinkedIn
          </button>
          <p className="mt-3 text-center font-label text-xs text-text-muted">
            Your pizza agent is ready. Tell people.
          </p>
        </>
      )}
        </div>
      </div>
    </main>
  )
}
