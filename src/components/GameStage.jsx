/**
 * Desktop game layout.
 *
 * The app is mobile-first: every game is a single tall column. On desktop that
 * column left the whole width unused and, because it overflowed vertically, the
 * content had to scroll — which made panels jump between turns.
 *
 * GameStage fixes that WITHOUT touching the mobile experience:
 *   - below `lg` the two slots simply stack, `context` then `main`, in the exact
 *     order (and with the same gaps) the game used before. Pixel-identical.
 *   - at `lg`+ they split into two top-aligned columns, so a game fits on one
 *     screen with no vertical scroll (and therefore no scroll-jumping).
 *
 * `context` = the parts that don't change turn to turn (intro, a reference
 * panel, the round tracker). `main` = the live interaction (the prompt, the
 * choices, the feedback). Feedback then appears in place in the right column
 * instead of pushing the page down.
 */
import ProgressBar from './ProgressBar.jsx'

/**
 * `progress` ({ part, parts, step, steps, … }, see ProgressBar) is drawn as a
 * strip above both columns, first thing on the screen, so the player always
 * sees where they are before reading anything else.
 */
export default function GameStage({ context, main, wide = false, progress }) {
  // `wide`: a phase whose `main` itself holds two side-by-side panels needs more
  // room, so it opts into a wider stage and gives the right column the larger
  // share. The default keeps the standard balanced two-column reading width.
  const width = wide
    ? 'lg:w-[min(66rem,calc(100vw-3rem))]'
    : 'lg:w-[min(58rem,calc(100vw-3rem))]'
  const cols = wide ? 'lg:grid-cols-[1fr_1.55fr]' : 'lg:grid-cols-[1fr_1.05fr]'
  return (
    // Below `lg`: a plain stacked column, exactly the old mobile layout.
    // At `lg`+: break out of the game screen's narrow reading column and center
    // a wider two-column stage in the viewport (left/translate is the standard
    // full-bleed-from-a-centered-parent trick), so both columns get real width.
    <div
      className={
        'flex flex-col gap-3 ' +
        'lg:relative lg:left-1/2 lg:-translate-x-1/2 ' +
        width +
        ' lg:grid ' +
        cols +
        ' lg:items-start lg:gap-8'
      }
    >
      {progress && (
        <div className="lg:col-span-2">
          <ProgressBar {...progress} />
        </div>
      )}
      <div className="flex flex-col gap-3">{context}</div>
      <div className="flex flex-col gap-3">{main}</div>
    </div>
  )
}
