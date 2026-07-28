import { useLayoutEffect, useRef } from 'react'

/**
 * The app's scroll container (the middle of the Layout shell). Everything
 * scrolls inside this element, not the window — resetting an element's
 * scrollTop is reliable on iOS Safari, unlike scrolling the whole page. Falls
 * back to the document scroller if the shell isn't mounted yet.
 */
function getScroller() {
  return (
    document.getElementById('app-scroll') || document.scrollingElement || document.documentElement
  )
}

/** Set the scroller's position. `y` is a pixel offset, or 'bottom'. */
function scrollScrollerTo(y) {
  const el = getScroller()
  if (!el) return
  el.scrollTop = y === 'bottom' ? el.scrollHeight : y
}

/**
 * Re-apply `fn` now, next frame, and the frame after. iOS Safari can ignore a
 * scroll issued while the page height is still settling (and its scroll
 * anchoring can nudge it back), so one synchronous call isn't enough — the
 * follow-up frames land it once layout has settled.
 */
function applyAcrossFrames(fn) {
  fn()
  requestAnimationFrame(() => {
    fn()
    requestAnimationFrame(fn)
  })
  // Re-assert on the macrotask queue too: iOS Safari can restore or clamp the
  // scroll after the commit settles, which the animation-frame passes miss.
  setTimeout(fn, 0)
  setTimeout(fn, 200)
}

/** Jump to the very top. Exported for the route-change reset in Layout. */
export function scrollToTop() {
  applyAcrossFrames(() => scrollScrollerTo(0))
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
      apply = () => scrollScrollerTo(0)
    } else if (within !== prevWithin) {
      // Same page, new content appended below — reveal it.
      apply = () => scrollScrollerTo('bottom')
    } else {
      return undefined
    }

    applyAcrossFrames(apply)
    return undefined
  }, [page, within])
}
