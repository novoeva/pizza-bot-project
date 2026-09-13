const STORAGE_KEY = 'pizza-bot:progress'
const SCHEMA_VERSION = 1

const listeners = new Set()

function defaultState() {
  return { version: SCHEMA_VERSION, completed: [] }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()

    const parsed = JSON.parse(raw)
    if (parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.completed)) {
      return defaultState()
    }
    return parsed
  } catch {
    return defaultState()
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode, quota), progress just won't persist
  }
  listeners.forEach((listener) => listener(state))
}

export function getCompletedTerms() {
  return load().completed
}

export function isTermCompleted(termId) {
  return load().completed.includes(termId)
}

export function markTermCompleted(termId) {
  const state = load()
  if (state.completed.includes(termId)) return state

  const next = { ...state, completed: [...state.completed, termId] }
  save(next)
  return next
}

/**
 * Dev-only helper: overwrite progress with exactly these term ids (used by the
 * `?seed=N` URL hook in main.jsx to screenshot the Workshop in any state).
 */
export function seedProgress(termIds) {
  const next = { ...defaultState(), completed: [...termIds] }
  save(next)
  return next
}

export function resetProgress() {
  const next = defaultState()
  save(next)
  return next
}

/** Subscribe to progress changes; returns an unsubscribe function. */
export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
