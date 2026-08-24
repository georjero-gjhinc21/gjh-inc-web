# CLAUDE.md — standing context for gjh-inc.com

Read this before touching anything. `AGENTS.md` is a copy of this file for
tools that look for that name; change one and run `npm run sync:agents`.

You are working inside the marketing site of an AI and data consultancy whose
entire commercial argument is that it ships verifiable systems. A false claim on
this site is not a copy defect. It is a product defect, because the product is
the claim.

---

## 1. What this repo is

Next.js 15 App Router, TypeScript strict, Tailwind with a closed token set,
markdown content, statically generated. No database on the request path.

| Path | What it is |
|---|---|
| `src/lib/site.ts` | Company facts, nav, JSON-LD. **Single source of truth.** |
| `src/lib/practices.ts` | Four practices + engagement traces |
| `src/lib/sectors.ts` | Industry pages. Each has an `evidence[]` array with a `status` |
| `src/lib/partners.ts` | Verified partnerships only |
| `src/lib/content.ts` | Markdown loader |
| `content/insights/*.md` | Articles |
| `content/examples/*.md` | Runnable artifacts with an article wrapped round them |
| `content/editorial/` | Voice guide, evidence ledger, calendar. **Read before drafting.** |
| `src/components/trace.tsx` | The signature element. See `docs/DESIGN.md` |
| `loop/` | The audit harness (fetch → grade → trend → propose) |
| `scripts/check-claims.mjs` | The deterministic evidence gate. Runs in CI |

## 2. The five rules that fail the build

These are enforced mechanically by `npm run check:claims` and by
`npm run build`. Do not argue with them in a PR description; fix the content.

1. **`consult@gjh-inc.com` is the only address.** Never `gjhconsulting.net`,
   never a second `gjh-inc.com` mailbox. Read it from `site.ts`; never hardcode.
2. **Every number needs an evidence anchor.** Any digit that functions as a
   claim — percentages, counts, durations, currency, "40 cases", "six weeks" —
   must either be generic illustration inside a clearly hypothetical example, or
   carry an `evidence:` key in front matter pointing at an id in
   `content/editorial/ledger.yaml`. No anchor, no merge.
3. **No client name without `status: published`** in the ledger. `needs-approval`
   means the sector, case study, or article does not render publicly.
4. **Banned vocabulary.** See `scripts/claims.config.json`. Currently:
   reimagine, unlock, revolutionize, cutting-edge, seamlessly, empower,
   game-changing, transformative, harness the power. Add, never remove without
   a human commit.
5. **First Load JS under 120 kB.** It is ~106 kB. Check the build output before
   adding a dependency. Most of the budget is spent on fonts, deliberately.

## 3. Facts you may state, and their sources

| Fact | Source | Safe to publish |
|---|---|---|
| Founded 2009 | live gjh-inc.com | yes |
| Anthropic, Google, AWS, Databricks, Snowflake partnerships | `partners.ts` | yes, named, no logos |
| Four practices: advisory, building, data foundations, staying-with-it | `practices.ts` | yes |
| Working style: paid short assessment of one workflow first; senior people do the work; client owns everything built | `practices.ts` | yes |
| Engagements delivered, median time-to-first-system | `site.ts` shows `TBD` | **no — placeholders** |
| Any certification: 8(a), HUBZone, SDVOSB, WOSB | undocumented | **no. Compliance exposure** |
| UEI, CAGE, NAICS, contract vehicles | undocumented | **no** |
| Any named client | ledger, mostly `needs-approval` | **only if `published`** |

Two claims are known to be inconsistent and must never be written together:
"20+ years" and "founded 2009". If you find a "20+ years" string anywhere,
that is a defect — open it, do not silently pick one.

The federal practice lives on gjhconsulting.net and is cross-linked, not
duplicated here. Do not write federal set-aside content into this repo.

## 4. Voice

Full guide: `content/editorial/VOICE.md`. The short version:

- Sentence case. Active voice. Short sentences.
- Open with the reader's problem, never with GJH's capability.
- A paragraph a competitor could paste onto their own site unchanged has failed.
- State claims someone could disagree with. Hedged prose reads as having nothing
  to say.
- Show the machinery. A code block, a trace, a schema, or a number beats an
  adjective every time.
- No superlatives, no exclamation marks, no "in today's rapidly evolving".
- Never write in the second person about the reader's feelings.

## 5. How work gets done here — the loop, not the prompt

Every recurring job in this repo is a loop with four parts. If you are asked to
do something recurring and you cannot name all four, you are being asked to do
it manually and should say so.

| Part | Where it lives |
|---|---|
| Trigger | `.github/workflows/*.yml` schedule, or a slash command in `.claude/commands/` |
| Maker | a subagent in `.claude/agents/` that produces a candidate |
| Checker | `scripts/check-claims.mjs` first (free, deterministic), then a checker subagent. Fail closed |
| Gate | a PR a human merges. Nothing customer-facing auto-publishes |

Autonomy is staged. `LOOP.md` records which loop is at which level.

- **L1** — the loop proposes; a human does everything else. All new loops start here.
- **L2** — the loop opens a PR with a passing checker; a human merges.
- **L3** — the loop commits directly. Only ever for `reports/`, `history/`, and
  `docs/` — never `content/`, never `src/`.

## 6. Working conventions

- Run `npm run typecheck && npm run check:claims && npm run build` before
  claiming anything is done. All three, every time.
- Unattended code changes run in an isolated git worktree, one per attempt.
  Discard on checker reject rather than patching a rejected attempt.
- Never edit `loop/rubric.md` directly. Rubric changes go through
  `loop/improve.py`, which writes a proposal a human merges. A rubric that the
  thing being graded can edit is not a rubric.
- Never edit files matched by `gate.yaml` `denylist`.
- Append one line to `loop-run-log.md` per unattended run. If the run produced
  nothing, log that it produced nothing.
- When you learn something durable about this repo, write it into this file or a
  skill, not into a commit message. Commit messages are not read again.

## 7. What to do when you are unsure

Say so in the PR body under a heading `Uncertain`, list what you could not
verify, and leave the claim out of the copy. A missing sentence costs nothing.
A wrong one costs the argument the whole site is built on.
