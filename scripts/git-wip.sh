#!/usr/bin/env bash
#
# "Am I in sync with what's deployed?" — the 2-second check.
# Wired up as `git wip`. Shows current branch, how it compares to the deployed
# branch (origin/master), and whether the tree is clean.
#
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

git fetch -q origin master 2>/dev/null || true

branch="$(git rev-parse --abbrev-ref HEAD)"
ahead="$(git rev-list --count origin/master..HEAD 2>/dev/null || echo '?')"
behind="$(git rev-list --count HEAD..origin/master 2>/dev/null || echo '?')"

echo "branch:            $branch"
echo "vs origin/master:  $ahead ahead, $behind behind"

if git diff --quiet && git diff --cached --quiet; then
  echo "working tree:      clean"
else
  echo "working tree:      DIRTY — uncommitted changes"
fi

if [ "$ahead" != "0" ] && [ "$ahead" != "?" ]; then
  echo "→ $ahead commit(s) not on the deployed branch. Ship with: npm run ship"
fi
