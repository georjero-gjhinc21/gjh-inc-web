---
description: Full repo sweep — consistency, correctness, privilege, harness integrity
allowed-tools: Read, Grep, Glob, Bash, Write
---

Run the **defect-sweeper** subagent over the whole repo.

Then verify these four known items specifically and report their current state
whether or not they have changed:

- **D1** canonical email divergence between repos
- **D4** the anti-inflation rule in `loop/improve.py` has no mechanical guard —
  it is a sentence in a prompt asking a model not to game a score it produces
- **D5** the grader runs through `opencode run --auto`, granting file-write
  permission to a text-classification task
- **D7** `/api/chat` has no rate limiting and no output validation on an
  unauthenticated, model-backed, spend-bearing route

Write `reports/YYYY-MM-DD-sweep.md`, open one issue per blocking finding, append
to `loop-run-log.md`. Fix only what the subagent's allowlist permits.
