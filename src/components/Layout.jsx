import { useLayoutEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { GameActionsSlot } from './GameActions.jsx'
import { scrollToTop } from '../lib/useGameScroll.js'

/** Top bar. Shows a back arrow inside a game, the pizza mark elsewhere. */
function TopHeader({ inGame }) {
  return (
    <header className="shrink-0 border-b-[3px] border-neutral bg-bg">
      <div className="mx-auto flex max-w-game items-center justify-between px-3 py-2 lg:max-w-[72rem] lg:px-8 lg:py-3">
        <div className="w-10">
          {inGame ? (
            <Link to="/" aria-label="Back to workshop" className="press inline-flex rounded-md p-1">
              <span className="material-symbols-rounded text-primary">arrow_back</span>
            </Link>
          ) : (
            <span className="material-symbols-rounded fill p-1 text-primary" aria-hidden="true">
              local_pizza
            </span>
          )}
        </div>
        <Link to="/" className="font-display text-2xl font-extrabold text-primary">
          Pizza Bot
        </Link>
        <div className="flex w-10 justify-end">
          <Link
            to="/progress"
            aria-label="Progress"
            className="press rounded-md p-1 text-text-muted"
          >
            <span className="material-symbols-rounded">checklist</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={
        active
          ? 'flex flex-col items-center gap-0.5 rounded-md border-[3px] border-neutral bg-primary px-4 py-1 text-white shadow-pop'
          : 'press flex flex-col items-center gap-0.5 p-2 text-text-muted'
      }
    >
      <span className="material-symbols-rounded">{icon}</span>
      <span className="font-label text-[10px]">{label}</span>
    </Link>
  )
}

/** Bottom tab bar, Workshop / Progress. Lives in the fixed bottom stack. */
function BottomNav({ active }) {
  return (
    <nav className="mx-auto flex max-w-game items-center justify-around border-t-[3px] border-neutral bg-bg px-3 pt-2 pb-[calc(0.75rem+var(--space-safe-bottom))] lg:max-w-[72rem] lg:justify-center lg:gap-4 lg:px-8">
      <NavItem to="/" active={active === 'workshop'} icon="restaurant" label="Workshop" />
      <NavItem to="/progress" active={active === 'progress'} icon="smart_toy" label="Progress" />
    </nav>
  )
}

/** App frame: header + routed screen + bottom nav. */
export default function Layout() {
  const { pathname } = useLocation()
  const inGame = pathname.startsWith('/game/')
  const active = pathname.startsWith('/progress') ? 'progress' : 'workshop'

  // Every route change (open a game, switch games, back to the workshop) starts
  // at the top. In-game page turns aren't route changes and are handled by each
  // game's useGameScroll.
  useLayoutEffect(() => {
    scrollToTop()
  }, [pathname])

  // App shell: a fixed-height column where only the middle (#app-scroll)
  // scrolls. The header and the bottom stack are flex-none, so the routed
  // screen can never hide behind them and there's no fixed-position overlay to
  // reserve padding for. Scrolling an inner element (not the window) is what
  // makes the scroll reset reliable on iOS Safari.
  return (
    <div className="flex h-full flex-col">
      <TopHeader inGame={inGame} />
      <div id="app-scroll" className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <Outlet />
      </div>
      {/* Bottom stack: the game action bar (when a game fills it) sits directly
          above the nav. Inside a game we drop the Workshop/Progress nav — you
          don't switch tabs mid-game — and a safe-area spacer keeps the action
          bar off the home indicator. */}
      <div className="shrink-0">
        <GameActionsSlot />
        {inGame ? (
          <div className="bg-bg" style={{ height: 'var(--space-safe-bottom)' }} />
        ) : (
          <BottomNav active={active} />
        )}
      </div>
    </div>
  )
}
