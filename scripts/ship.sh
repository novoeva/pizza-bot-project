#!/usr/bin/env bash
#
# Ship the current work to production.
#
# Vercel deploys origin/master, so "done" means the commit is on origin/master,
# not just committed locally. This script closes both gaps that stranded the
# Temperature game: (1) committed-but-not-pushed, and (2) work sitting on a
# feature branch that Vercel never deploys. Run it from anywhere in the repo.
#
#   npm run ship
#
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

branch="$(git rev-parse --abbrev-ref HEAD)"

# 1. Refuse to ship with uncommitted (tracked) changes — they wouldn't deploy.
if ! git diff-index --quiet HEAD --; then
  echo "✗ You have uncommitted changes. Commit or stash them first:"
  git status --short
  exit 1
fi

# 2. Build first, so a broken build fails here instead of on Vercel.
echo "▸ Building (catching errors before Vercel does)…"
npm run build

# 3. Put the commit on master (the deployed branch).
if [ "$branch" != "master" ]; then
  echo "▸ Fast-forwarding master → $branch…"
  git fetch -q origin master || true
  git checkout master
  if ! git merge --ff-only "$branch"; then
    echo "✗ master can't fast-forward to $branch — they've diverged."
    echo "  Reconcile them (merge or rebase), then re-run: npm run ship"
    git checkout "$branch"
    exit 1
  fi
fi

# 4. Push. This is what actually triggers the Vercel production deploy.
echo "▸ Pushing origin master…"
git push origin master

# Return to where you were working.
[ "$branch" != "master" ] && git checkout -q "$branch"

echo "✓ Shipped $(git rev-parse --short origin/master) to origin/master."
echo "  Vercel will build this commit — watch the Deployments tab, then hard-refresh."
