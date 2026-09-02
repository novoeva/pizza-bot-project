import { Link } from 'react-router-dom'

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

/**
 * The app's bottom tab bar: Home (landing) / Workshop / Progress. Shared by the
 * Layout shell (in-app screens) and the Landing page so the menu is identical
 * everywhere. It renders only the bar itself — callers position it (Layout puts
 * it in the fixed bottom stack; Landing pins it with a fixed wrapper).
 */
export default function BottomNav({ active }) {
  return (
    <nav className="mx-auto flex max-w-game items-center justify-around border-t-[3px] border-neutral bg-bg px-3 pt-2 pb-[calc(0.75rem+var(--space-safe-bottom))] lg:max-w-desktop lg:justify-center lg:gap-4 lg:px-8">
      <NavItem to="/" active={active === 'home'} icon="home" label="Home" />
      <NavItem to="/workshop" active={active === 'workshop'} icon="restaurant" label="Workshop" />
      <NavItem to="/progress" active={active === 'progress'} icon="smart_toy" label="Progress" />
    </nav>
  )
}
