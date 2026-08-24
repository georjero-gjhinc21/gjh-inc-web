---
description: Turn the latest content-loop audit report into a PR of copy fixes
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

1. Read the newest file in `reports/*-audit.md`.
2. If the run has a fetch error rather than scores, fix the fetch first — a
   trend built on failed runs is worse than no trend. Check the response body
   before changing the user agent.
3. Take only findings scored below 3 that carry literal replacement text.
   Findings without replacement text are grader failures, not content failures:
   list them for the weekly review and skip them.
4. Apply each fix in a worktree: `git worktree add ../gjh-wt-$(date +%s)`.
5. Do not touch anything in the `gate.yaml` denylist. If a fix requires it, say
   so in the PR body and leave the fix out.
6. `npm run check:claims && npm run typecheck && npm run build`.
7. **evidence-checker** on the diff.
8. One PR labelled `content-loop`, listing each fix against the finding that
   prompted it, and the score the page was carrying.

Never apply a fix that raises a score by removing a true claim. That is the
score optimising against the site.
