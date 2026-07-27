import { useLayoutEffect, useRef } from 'react'

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
 * The page scrolls the window (no inner scroll container), so scrollTo is the
 * right target. useLayoutEffect fires before paint, avoiding a flash at the old
 * scroll position.
 */
export function useGameScroll(page, within) {
  const prev = useRef({ page: undefined, within: undefined })
  useLayoutEffect(() => {
    const { page: prevPage, within: prevWithin } = prev.current
    if (page !== prevPage) {
      window.scrollTo(0, 0)
    } else if (within !== prevWithin) {
      // Same page, new content appended below — reveal it.
      window.scrollTo(0, document.documentElement.scrollHeight)
    }
    prev.current = { page, within }
  }, [page, within])
}
