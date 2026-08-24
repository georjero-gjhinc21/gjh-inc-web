# loop-budget.md

Token and run caps. A loop with no budget is a loop that discovers its cost in
an invoice.

| Loop | Cadence | Model | Cap per run | Cap per month |
|---|---|---|---|---|
| evidence-gate | every push | none | 0 | 0 |
| content-audit | daily | free-tier grader | ~40k in / 6k out | 1.5M tokens |
| insight-drafter | 3× week | Opus | ~120k in / 20k out | 1.7M tokens |
| example-builder | 2× month | Opus | ~200k in / 40k out | 0.5M tokens |
| weekly-review | weekly | Opus + free improver | ~150k in / 25k out | 0.7M tokens |

## Rules

- The deterministic gate runs before every model call, always. It is free and it
  removes the majority of what a model would otherwise be asked to catch. This
  is the single largest cost control in the system and it is not optional.
- The audit grader stays on a free or cheap model. It runs daily against a fixed
  rubric with schema validation and a retry — a task where a small model with a
  tight contract beats a large model with a loose one.
- Drafting and review use the strongest model available. Three good pieces a
  week costs less than five that need rewriting, and far less than one wrong
  claim published.
- A run exceeding 2× its cap aborts and opens an issue rather than continuing.
  Runaway loops are usually a stuck retry, and a stuck retry does not improve
  with more attempts.

## Review

Monthly. If actual spend is under half the cap, the cap is theatre — lower it so
that hitting it means something. If a loop is consistently at cap, the loop is
doing more than it was scoped for; find out what.
