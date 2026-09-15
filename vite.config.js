import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Worktrees share one node_modules (symlink), so the default cache dir
  // (node_modules/.vite) would be shared by every dev server running at once
  // and they'd overwrite each other's pre-bundled deps ("504 Outdated Optimize
  // Dep", blank page). Keep the cache next to each checkout instead.
  cacheDir: '.vite',
})
