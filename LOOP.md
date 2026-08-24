# LOOP.md — the loops that maintain gjh-inc.com

Five loops. Each has a trigger, a maker, a checker, and a gate. Nothing that
reaches a reader ships without a human merge.

Priority when two loops collide: **evidence gate → content audit → insight
drafter → example builder → weekly review.** A loop yields to anything above it.

---

## 1. Evidence gate (L3 — blocking, deterministic, no model)

| | |
|---|---|
| Trigger | every push and PR (`.github/workflows/evidence-gate.yml`) |
| Maker | none — this loop only rejects |
| Checker | `scripts/check-claims.mjs` |
| Gate | required status check on `main` |

Catches: banned vocabulary, unanchored numbers, unapproved client names, email
divergence, front-matter schema breaks, `needs-approval` sectors rendering
publicly, and "20+ years" against a 2009 founding date.

Runs in about two seconds and costs nothing. It is the reason the model loops
below can be cheap: they never have to be trusted with the rules a regex can
enforce.

## 2. Content audit (L2 — existing harness)

| | |
|---|---|
| Trigger | daily, `.github/workflows/content-loop.yml` |
| Maker | `loop/audit.py` — fetch, deterministic pre-grade, model grade |
| Checker | `parse_grade()` schema validation with retry; `fail_below` / `regression_delta` thresholds |
| Gate | clean run auto-ships `reports/` + `history/` to main; a regression opens a P1 issue |

Already built. Two changes it needs, tracked in `docs/DEFECTS.md`:

- the grader runs through `opencode run --auto`, which grants a coding agent
  write permission for a task that is pure text classification (**D5**)
- the anti-inflation rule in `IMPROVER_SYSTEM` is a sentence in a prompt with no
  mechanical check behind it (**D4**)

## 3. Insight drafter (L1 → L2 — the publishing engine)

| | |
|---|---|
| Trigger | weekday 06:00 UTC, `.github/workflows/insight-loop.yml`; or `/insight` locally |
| Maker | `.claude/agents/insight-writer.md` |
| Checker | `check:claims`, then `.claude/agents/evidence-checker.md`, then `.claude/agents/machine-legibility.md` |
| Gate | draft PR labelled `insight`, human merges |

Reads the next `ready` item from `content/editorial/calendar.yaml`, writes it
against its ledger anchors, opens a PR. **It cannot invent a topic.** An empty
calendar produces an issue asking for input, not a filler post.

Start at L1 for two weeks: the loop drafts, you rewrite heavily, and the diff
between draft and merge is the training signal for the voice guide. Promote to
L2 when your median edit stops touching the argument and starts touching only
the sentences.

## 4. Example builder (L1 — the thing that actually converts)

| | |
|---|---|
| Trigger | weekly Monday, or `/case-study` / `/example` |
| Maker | `.claude/agents/case-study-writer.md` |
| Checker | `check:claims` + the artifact must actually run |
| Gate | PR, human merges |

Produces `content/examples/*.md`: a runnable artifact (an eval harness, a
retrieval regression gate, a trace schema, a cost model) with the reasoning
written round it. A technical buyer who clones a repo has already started the
engagement in their head. This loop is worth more than the article loop and
should be resourced accordingly.

## 5. Weekly review (L1 — the self-improvement loop)

| | |
|---|---|
| Trigger | Friday, `.github/workflows/weekly-review.yml`; or `/weekly-review` |
| Maker | `loop/improve.py` + `.claude/agents/defect-sweeper.md` |
| Checker | human |
| Gate | one PR with a proposal, one issue with the defect list |

Reads `history/scores.jsonl`, `history/publishing.jsonl`, and `loop-run-log.md`.
Proposes rubric amendments, calendar re-prioritisation, and defect triage.
Never applies anything.

---

## Worktrees

Any unattended change to `src/` runs in an isolated worktree, one per attempt:

```bash
git worktree add ../gjh-wt-$RUN_ID -b loop/$RUN_ID
```

Discard on checker reject. Do not patch a rejected attempt in place — the
second attempt inherits the first one's wrong assumption.

## Budget and observability

- Token caps: `loop-budget.md`
- Run history: `loop-run-log.md`, one line per unattended run
- Score history: `history/scores.jsonl`
- Publishing history: `history/publishing.jsonl`
- Kill switch: set `paused: true` in `STATE.md`, or add the `loop-pause-all`
  label to any open issue. Every workflow checks both in its first step.

## Safety

- No auto-merge on `main` for anything under `content/` or `src/`.
- Denylist and auto-merge allowlist: `gate.yaml`.
- The site assistant (`/api/chat`) is not a loop. It is a single grounded
  completion and must stay one — see `docs/ARCHITECTURE.md`.
