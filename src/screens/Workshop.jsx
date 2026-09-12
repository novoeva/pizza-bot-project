import { useMemo } from 'react'
import BotCanvas from '../components/BotCanvas.jsx'
import TermChecklist from '../components/TermChecklist.jsx'
import StatusReadout from '../components/StatusReadout.jsx'
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
    <main className="mx-auto max-w-game px-4 pb-6 pt-4 lg:max-w-desktop lg:px-8 lg:pt-8">
      <p className="text-center font-label text-xs text-text-muted">What is this app?</p>
      <h1 className="mt-1 text-center text-xl leading-tight lg:text-3xl">
        Learn AI terms and build a pizza bot
      </h1>
      <p className="mx-auto mt-2 max-w-prose text-center text-sm leading-snug text-text-muted lg:text-base">
        You own a pizzeria, and you&rsquo;re building an AI bot to take orders. To build it, you&rsquo;ll
        learn one AI term at a time &mdash; and each term you learn is another part of your bot.
      </p>

      {/* Below `lg` this is a single stacked column (board → status → checklist),
          identical to mobile. At `lg`+ it becomes the split screen: the board +
          status sit in a sticky left column while the components list scrolls in
          the right column. */}
      <div className="lg:mt-6 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-x-10">
        {/* Left: the build board + status readout. Sticky so it stays in view
            while the (taller) checklist scrolls past it on desktop. */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div
            className="relative mt-3 rounded-lg border-[3px] border-neutral bg-muted p-4 pb-6 shadow-card lg:mt-0"
            style={PEGBOARD}
          >
            <BotCanvas
              completedTerms={completedTerms}
              // On desktop the board scales down with the viewport so the status
              // readout below it stays on screen. lg:min-h-0 drops the mobile
              // 200px floor so on very short screens (or when a long failure line
              // makes the status taller) the board keeps shrinking cleanly rather
              // than overflowing and pushing the status below the fold.
              className="lg:max-h-[calc(100dvh-30rem)] lg:min-h-0"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-[3px] border-neutral bg-surface px-4 py-1.5 font-label text-xs">
              {done} / {total} parts built
            </div>
          </div>

          <div className="mt-5">
            <StatusReadout line={line} powered={powered} firstMissingId={firstMissing?.id} />
          </div>
        </div>

        {/* Right: the list of terms, which doubles as the game menu.
            2.1 / 2.5 (Nina): "System components" read as chapters of a bot,
            not as the things you learn. Say plainly what the list is and what
            to do with it. */}
        <div>
          <h2 className="mt-7 text-lg leading-tight lg:mt-0 lg:text-xl">
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
