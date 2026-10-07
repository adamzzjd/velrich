#!/bin/bash
set -euo pipefail

cd /c/code

# Finish the interrupted rebase: accept the remote's README and stage everything else
git checkout --ours README.md || true
git checkout --theirs . || true
git checkout --theirs Documentation || true
git checkout --theirs public || true
git checkout --theirs scripts || true
git add -A
git rebase --continue

git push --force-with-lease origin main

echo "DONE"
