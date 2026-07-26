import { Link, Outlet, useLocation } from 'react-router-dom'
import { GameActionsSlot } from './GameActions.jsx'

/** Sticky top bar. Shows a back arrow inside a game, the pizza mark elsewhere. */
function TopHeader({ inGame }) {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-neutral bg-bg">
      <div className="mx-auto flex max-w-game items-center justify-between px-3 py-2">
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
    <nav className="mx-auto flex max-w-game items-center justify-around border-t-[3px] border-neutral bg-bg px-3 pt-2 pb-[calc(0.75rem+var(--space-safe-bottom))]">
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

  return (
    <>
      <TopHeader inGame={inGame} />
      <Outlet />
      {/* One fixed bottom stack: the game action bar (when a game fills it)
          sits directly above the nav, so a game's forward action is always on
          screen. GameActions measures this stack and publishes its height as
          --bottom-stack-h, which game screens reserve as bottom padding. */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <GameActionsSlot />
        <BottomNav active={active} />
      </div>
    </>
  )
}
