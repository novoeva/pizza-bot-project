import { useMemo } from 'react'
import FlowCanvas from '../components/FlowCanvas.jsx'
import TermChecklist from '../components/TermChecklist.jsx'
import StatusReadout from '../components/StatusReadout.jsx'
import TermTracker from '../components/TermTracker.jsx'
import TermRecap from '../components/TermRecap.jsx'
import { useProgress } from '../lib/useProgress.js'
import { getFailureLine } from '../lib/failureLine.js'
import { termCount, firstIncomplete } from '../lib/terms.js'

const PEGBOARD = {
  backgroundImage: 'radial-gradient(var(--color-pegboard-dot) 1.3px, transparent 1.3px)',
  backgroundSize: '20px 20px',
}

export default function Workshop() {
  const completedTerms = useProgress()
  const total = termCount
  const done = completedTerms.length
  const powered = done === total

  const failureLine = useMemo(() => getFailureLine(completedTerms), [completedTerms])
  const firstMissing = useMemo(() => firstIncomplete(completedTerms), [completedTerms])

  const line = powered
    ? "Your bot's online. It makes pizza now, and only pizza. Exactly as planned."
    : failureLine

  return (
    <main className="mx-auto max-w-game px-4 pb-6 pt-4 lg:flex lg:h-full lg:max-w-desktop lg:flex-col lg:px-8 lg:pb-4 lg:pt-6">
      <p className="text-center font-label text-xs text-text-muted">What is this app?</p>
      <h1 className="mt-1 text-center text-xl leading-tight lg:text-3xl">
        Learn AI terms and build a pizza bot
      </h1>
      <p className="mx-auto mt-2 max-w-prose text-center text-sm leading-snug text-text-muted lg:text-base">
        You own a pizzeria, and you&rsquo;re building an AI bot to take orders. To build it, you&rsquo;ll
        learn one AI term at a time &mdash; and each term you learn is another box wired into your bot.
      </p>
      {/* PIZZA-40: the promised count, all of it visible at once, and which
          term is next. Same row on the Progress screen. */}
      <TermTracker completedTerms={completedTerms} className="mt-4 lg:mt-3" />

      {/* Below `lg` this is a single stacked column (board → status → checklist),
          identical to mobile. At `lg`+ it is a bento split that fills the app
          shell's height: the board takes two thirds and sizes itself to the
          room left under the intro (no viewport arithmetic), the right third
          holds the status readout and the checklist, which scrolls on its own. */}
      <div className="lg:mt-5 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:gap-x-8">
        {/* Left two thirds: the build board, a flex column so the canvas can
            take the remaining height. */}
        <div className="lg:col-span-2 lg:flex lg:min-h-0 lg:flex-col">
          <div
            className="relative mt-3 rounded-lg border-[3px] border-neutral bg-muted p-4 pb-6 shadow-card lg:mt-0 lg:flex lg:min-h-[18rem] lg:flex-1 lg:flex-col"
            style={PEGBOARD}
          >
            <FlowCanvas completedTerms={completedTerms} className="pb-4" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-[3px] border-neutral bg-surface px-4 py-1.5 font-label text-xs">
              {done} / {total} wired in
            </div>
          </div>

          <div className="mt-5 lg:hidden">
            <StatusReadout line={line} powered={powered} firstMissingId={firstMissing?.id} />
          </div>
        </div>

        {/* Right third: status readout on top, then the checklist (scrolls inside
            the column at lg+ so the board never has to). */}
        <div className="lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <div className="hidden lg:block">
            <StatusReadout line={line} powered={powered} firstMissingId={firstMissing?.id} />
          </div>
          {/* PIZZA-40: the finish of the promise. Once every term is done,
              "these are the N you learned today" sits above the (now all
              ticked) list, under the green "System online" readout. */}
          {powered && <TermRecap className="mt-5" />}
          {/* 2.1 / 2.5 (Nina): "System components" read as chapters of a bot,
              not as the things you learn. Say plainly what the list is and what
              to do with it. */}
          <h2 className="mt-7 text-lg leading-tight lg:mt-5">
            {powered ? 'Replay any game' : `The ${total} AI terms you'll learn`}
          </h2>
          <p className="mb-3 mt-1 text-sm text-text-muted">
            {powered ? 'Every term is done. Tap one to play it again.' : 'One game each. Tap a term to play.'}
          </p>
          <TermChecklist completedTerms={completedTerms} />
        </div>
      </div>
    </main>
  )
}
