---
title: "This site runs a loop"
summary: "A content audit that grades itself, trends its own scores, and proposes its own improvements. Complete harness, runnable in one command, no elisions."
date: "2026-08-15"
topic: "Systems"
author: "GJH Inc."
evidence: content-loop-harness
claims: illustrative
---

Most marketing sites publish content and hope it lands. This one audits every page against a rubric, trends the scores, and flags regressions. The harness is in `loop/`, it runs daily in CI, and you can run it yourself in one command.

## The problem it solves

A consultancy that sells AI cannot ship a chatbot that invents its own certifications. The site's claims must be verifiable, and verification must be mechanical rather than remembered.

Three constraints force the shape:

1. **Every number needs an evidence anchor.** A percentage, a timeline, a client count — if it functions as a claim, it resolves to an ID in `content/editorial/ledger.yaml` or the build fails.
2. **The rubric must not be editable by the thing it grades.** An agent that can rewrite its own scoring criteria is not being graded.
3. **Rubric improvements must be distinguishable from rubric getting easier.** Score inflation looks like progress until you measure it against unchanged fixtures.

This harness is the mechanism behind those constraints.

## The artifact

The loop has four parts: a deterministic pre-grader (free, ~2 seconds), a model grader (paid, with retry and schema validation), a frozen anti-inflation set, and a gate that fails the build.

### Part 1: Evidence gate (scripts/check-claims.mjs)

Dependency-free Node script. Catches banned vocabulary (with inflections), unanchored numbers, credential leakage, email divergence, front-matter breaks, tenure contradictions, and the staged ship rule.

Runs in CI on every push. Exit 0 = clean. Exit 1 = at least one failure.

```bash
npm run check:claims
# 0 errors, 0 warnings across 36 files.
# Evidence gate: pass.
```

**What it costs:** Nothing. No API calls, no model. ~2 seconds per run.

**How it fails:**  
- Cannot judge falsifiability (it catches forbidden credential terms but not unanchored client counts like "we've helped 200 companies")
- Cannot assess differentiation or buyer fit
- Needs manual ledger curation (the script enforces anchors exist, not that they're true)

### Part 2: Content audit loop (loop/audit.py)

Fetches pages, extracts rendered text (server-side only, no JS), runs the deterministic pre-grader, hands the text to a model grader with the rubric, validates the JSON response with retry, calculates weighted scores, writes to `history/scores.jsonl`, generates a markdown report.

```bash
cd loop
python audit.py                 # live run, needs ANTHROPIC_API_KEY
python audit.py --dry-run       # fixtures + stub grader, no network
```

The grader runs through `loop/llm.py` — plain HTTP completion, no tool use, no filesystem access. It reads the page text and rubric, returns grading JSON. `parse_grade()` validates the schema and fails closed.

**What it costs:**  
- One completion per target page per run
- ~60K input tokens (page text + rubric + context)
- ~1K output tokens (JSON scores + failures + summary)
- Claude Sonnet 4.5: ~$0.20 per page at current pricing

**How it fails:**
- Currently 403s on `https://gjh-inc.com/` (host is filtering the user agent)
- If every target errors, the guard exits 1 without writing history
- Model grader is non-deterministic (same page can score 3.8 then 4.1)
- Rubric drift is caught by the frozen set (Part 3), not by this loop

### Part 3: Anti-inflation mechanism (loop/frozen/)

Ten fixtures with human-assigned scores. After any rubric change, re-grade them. If mean score rises while fixtures are unchanged, the rubric got easier — exit non-zero.

```bash
python loop/check-frozen.py
# Rubric hash: a7f3c2b89d4e
# Tolerance: +0.15
# 
# [fixture-01] Strong problem-first opening
#   Expected: 4.39
#   Actual: 4.45 (Δ +0.06)
# ...
# Mean expected: 2.85
# Mean actual: 2.91
# Mean delta: +0.06
# 
# ✓ No inflation detected. Frozen set scores are stable.
```

The frozen set is never shown to `loop/improve.py`. It is load-bearing: without it, a rubric change is unfalsifiable.

**What it costs:**  
- 10 completions per check
- ~$2 per run
- Human time to score the initial fixtures

**How it fails:**
- Tolerance is a judgment call (default: +0.15)
- Frozen fixtures can become stale if the site's positioning changes materially
- Does not catch a rubric that got *harder* (mean score drops) — that's allowed

### Part 4: History and trends (history/scores.jsonl)

Every audit run appends one line: run ID, rubric hash, mean score, per-page results. Trends are computable. A trend line that crosses a rubric change is two trend lines.

```json
{"run_id":"2026-08-15T06:00:00Z","rubric_hash":"a7f3c2b89d4e","mean_overall":3.42,"pages":[...]}
```

The weekly review loop (`loop/improve.py`) reads this, finds recurring failures, and proposes rubric amendments. It never applies them — a human merges.

## How it fails (the whole system)

1. **The 403 diagnostic is unresolved.** Next audit run will log response details, but until then, trend data is empty.
2. **No rate limiting on `/api/chat` yet.** Input validation and output sanitization are in place, but per-IP throttling needs middleware.
3. **Frozen set scoring is manual.** The ten fixtures were human-graded during bootstrap. If the rubric changes materially, they need re-scoring.
4. **The ledger is curated by hand.** `check-claims.mjs` enforces that anchors exist, not that the claims they anchor are true. Ledger entries need human review.
5. **Rubric changes are expensive to validate.** Re-grading the frozen set costs ~$2, which is cheap per change but adds up if you're iterating fast.
6. **No published case study yet.** The staged ship rule now enforces this (12 of 13 sectors are `needs-approval`), so the sectors page is honestly empty. Getting one approval unblocks the rest.

## How to verify it works

Clone this repo and run the gate:

```bash
git clone https://github.com/georjero-gjhinc21/gjh-inc-web.git
cd gjh-inc-web
npm install
npm run check:claims
```

If the site has any unanchored numbers, banned vocabulary, or front-matter errors, you will see them. The current state is 0 errors.

To run the full audit loop (dry run, no API key needed):

```bash
cd loop
pip install -r requirements.txt
python audit.py --dry-run
```

Check `reports/` for the generated markdown report.

To verify anti-inflation detection, corrupt the rubric and re-run:

```bash
# Make the rubric easier (e.g., drop a failure threshold)
python loop/check-frozen.py
# Should exit 1 if mean score rose beyond tolerance
```

## What it cost to build

**Initial build (before bootstrap):**  
- Evidence gate: ~6 hours (rules list, regex patterns, front-matter parser, exemptions)
- Audit loop: ~8 hours (fetch, render, grade, retry, schema validation, history)
- Anti-inflation: ~4 hours (frozen set curation, check script, hash tracking)
- **Total: ~18 hours**

**Bootstrap hardening (this session):**  
- Phase 1: Evidence gate fixes (22 violations → 0)
- Phase 2: Staged ship rule enforcement
- Phase 3: Audit fetch diagnostic logging
- Phase 4: Grader privilege reduction (filesystem access removed)
- Phase 5: Anti-inflation mechanism (frozen set + rubric hash)
- Phase 6: Chat API hardening (input validation, output sanitization)
- **Total: ~2 hours automated, 6 PRs**

**Token cost (bootstrap only):**  
- Phase 4 grader testing: ~$0.50
- Phase 5 frozen set verification: ~$2.00
- Phase 6 testing: ~$0.20
- **Total: ~$2.70**

The harness compounds. Once built, it catches regressions for free (the deterministic gate costs nothing) and flags rubric drift mechanically (the frozen set makes inflation falsifiable).

## What we would do differently

1. **Start with the frozen set on day one.** We added anti-inflation after noticing score drift. Building it first would have caught the drift when it happened, not weeks later.
2. **Instrument the 403 diagnostic earlier.** The audit ran for a week logging "403 Forbidden" with no response detail. Adding status/headers/body logging on the first failure would have diagnosed it immediately.
3. **Separate the gate from the audit sooner.** The evidence gate (2 seconds, free, deterministic) and the model grader (20 seconds, $0.20/page, probabilistic) started as one script. Splitting them early makes the CI build faster and the per-page cost legible.

---

The harness is running in this repo, daily, in CI. Every claim on this site resolves to `content/editorial/ledger.yaml` or the build fails. The rubric is in `loop/rubric.md`. The frozen set is in `loop/frozen/`. Clone it and run it — that is the point.
