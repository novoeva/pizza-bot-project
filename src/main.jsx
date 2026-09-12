import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedProgress } from './lib/progress.js'
import terms from './content/terms.json'

// DEV ONLY: `?seed=N` presets progress to the first N terms (in `order`), so
// the Workshop board can be screenshotted in any state. Never runs in a build.
if (import.meta.env.DEV) {
  const raw = new URLSearchParams(window.location.search).get('seed')
  const n = raw === null ? NaN : Number.parseInt(raw, 10)
  if (Number.isInteger(n)) {
    const ids = [...terms].sort((a, b) => a.order - b.order).map((t) => t.id)
    seedProgress(ids.slice(0, Math.min(Math.max(n, 0), ids.length)))
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
