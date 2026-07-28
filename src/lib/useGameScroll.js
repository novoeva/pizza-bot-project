import { useLayoutEffect, useRef } from 'react'

/**
 * Move the window to `y`, hitting every element iOS Safari might treat as the
 * scroller. `window.scrollTo` alone is unreliable there during a React commit
 * (see useGameScroll), so we also set scrollTop directly, which always applies
 * instantly regardless of CSS scroll-behavior.
 */
function scrollWindowTo(y) {
  window.scrollTo(0, y)
  const el = document.scrollingElement || document.documentElement
  if (el) el.scrollTop = y
  if (document.body) document.body.scrollTop = y
}

/** Jump to the very top. Exported for GameScreen's on-entry baseline. */
export function scrollToTop() {
  scrollWindowTo(0)
  // iOS Safari can ignore a scroll issued mid-commit when the page height is
  // changing in the same frame; re-apply once layout has settled.
  requestAnimationFrame(() => scrollWindowTo(0))
}

/**
 * Scroll management for a game's flow, in one place so every game behaves the
 * same way.
 *
 * - When `page` changes — a real page turn (new phase, question, attack, or
 *   round) — scroll to the top so the new page starts at the top.
 * - When only `within` changes — content appended inside the same page (a chat
 *   bubble, another improvised reply) — scroll to the bottom so the newly
 *   revealed item is in view instead of stranded below the fold.
 *
 * Games with no in-page appends omit `within`; then only page turns move the
 * scroll. Runs on mount too, so opening a game always starts at the top.
 *
 * We compare against the previous page/within (not just "page changed vs not")
 * so a spurious re-run with unchanged values is a no-op — this is what keeps
 * StrictMode's double-invoked mount effect from mistaking itself for an append
 * and scrolling to the bottom.
 *
 * The scroll is applied twice: synchronously (before paint, so no flash on
 * browsers that honor it) and again on the next frame. iOS Safari otherwise
 * ignores a scroll issued while the page height is changing and just clamps the
 * old position to the new (often shorter) page — leaving you partway down a
 * "new" page instead of at the top.
 */
export function useGameScroll(page, within) {
  const prev = useRef({ page: undefined, within: undefined })
  useLayoutEffect(() => {
    const { page: prevPage, within: prevWithin } = prev.current
    prev.current = { page, within }

    let apply
    if (page !== prevPage) {
      apply = () => scrollWindowTo(0)
    } else if (within !== prevWithin) {
      // Same page, new content appended below — reveal it.
      apply = () => scrollWindowTo(document.documentElement.scrollHeight)
    } else {
      return undefined
    }

    apply()
    const raf = requestAnimationFrame(apply)
    return () => cancelAnimationFrame(raf)
  }, [page, within])
}
