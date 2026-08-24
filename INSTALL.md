# Install — one sitting, then it runs

Drop these files into the root of `gjh-inc-web`. Nothing here overwrites
existing source; the only edits to files you already have are three lines in
`package.json` and one guard in `loop/audit.py`.

```
CLAUDE.md                 AGENTS.md is a copy — see step 2
LOOP.md
STATE.md
gate.yaml
loop-budget.md
.claude/settings.json
.claude/agents/*.md       5 subagents
.claude/commands/*.md     5 slash commands
content/editorial/*       voice guide, ledger, calendar
scripts/check-claims.mjs  the gate
scripts/claims.config.json
.github/workflows/*.yml   3 workflows
docs/CONTENT-ENGINE.md
docs/DEFECTS.md
```

---

## Step 1 — wire the gate into npm

Add to `package.json`:

```json
{
  "scripts": {
    "check:claims": "node scripts/check-claims.mjs",
    "check:claims:json": "node scripts/check-claims.mjs --json",
    "sync:agents": "cp CLAUDE.md AGENTS.md",
    "preflight": "npm run check:claims && npm run typecheck && npm run build"
  }
}
```

Then:

```bash
npm run sync:agents
npm run check:claims
```

**It will fail on the first run.** That is the point — it is reporting the state
of the repo, not the state of the gate. Read the findings before changing
anything; each carries its fix.

## Step 2 — set the required status check

Settings → Branches → `main` → require `evidence gate / gate` to pass.

Without this the gate is advice.

## Step 3 — secrets

`ANTHROPIC_API_KEY` in repository secrets. The evidence gate and the audit's
free-model route need nothing.

## Step 4 — the bootstrap run

Open Claude Code in the repo and paste the prompt in the next section. It is a
single session, roughly an hour of agent time, and it is the only large piece of
manual work in this whole design.

---

# The bootstrap prompt

Paste this verbatim.

> You are working in the gjh-inc.com repository. Read `CLAUDE.md`, `LOOP.md`,
> `STATE.md`, `gate.yaml`, `docs/DEFECTS.md`, and `docs/CONTENT-ENGINE.md`
> before doing anything. Do not skim them; the rules in them are the task.
>
> This is a one-time bootstrap. Work through the phases in order. Open a
> separate PR per phase so each can be reviewed on its own. Stop and report if
> any phase cannot be completed honestly.
>
> **Phase 1 — make the gate pass truthfully.**
> Run `npm run check:claims`. For each finding, fix the *content*, not the rule.
> If you believe a rule is wrong, leave the finding, and list it at the end with
> your reasoning — rule changes are a separate human decision. Do not add
> waivers to make the run green.
>
> **Phase 2 — enforce the staged ship rule.**
> `src/lib/sectors.ts` exports `publishedSectors()` and twelve of thirteen
> sectors are `needs-approval`, but `src/app/sectors/page.tsx`, `src/app/page.tsx`
> and `src/app/sitemap.ts` render all of them. Change those three to use
> `publishedSectors()`. Keep `sectorKeywords` feeding JSON-LD `knowsAbout`.
> Handle the empty state honestly — the industries page should say what it is
> waiting on, not pretend to be full. Expect the page to be nearly empty; that
> is the accurate state of the evidence.
>
> **Phase 3 — fix the audit fetch (D-new in DEFECTS.md).**
> The last audit recorded a 403 against `https://gjh-inc.com/` and every score
> is `None`. Diagnose before changing anything: log the response status, body,
> and headers. Do not spoof a browser user agent to get past bot protection —
> that removes the signal that the protection exists. Then add a guard to
> `loop/audit.py`: if every target errored, write no history entry and exit
> non-zero. A failed run must not look like a quiet one.
>
> **Phase 4 — D5, drop the grader's privileges.**
> `loop/audit.py` calls the grader with `opencode run --auto`, granting
> filesystem write access to a task that reads text and returns JSON. Route
> grading through the plain completion path in `loop/llm.py`, or disable tool
> use entirely rather than auto-approving it. Keep `parse_grade()`; it is a good
> check and should not be the only one.
>
> **Phase 5 — D4, put a mechanism behind the anti-inflation rule.**
> Create `loop/frozen/` with ten fixtures carrying human-assigned scores, and a
> script that re-grades them after any rubric change. If the mean frozen score
> rises while those fixtures are unchanged, the rubric got easier — the script
> exits non-zero. Add the rubric hash to every entry written to
> `history/scores.jsonl`. Do not show `loop/frozen/` to `improve.py`.
>
> **Phase 6 — D7, harden `/api/chat`.**
> Per-IP rate limit in middleware, server-side max input length that rejects
> rather than truncates, a low output cap, and output validation against the
> forbidden-claims list. If a response mentions a certification, contract
> vehicle, price, timeline, or named client, drop it and return the fallback.
> Log every conversation with a request id.
>
> **Phase 7 — first example, end to end.**
> Run `/case-study this-site-runs-a-loop` using the case-study-writer subagent
> in Mode B. This publishes the content-audit harness as a runnable example.
> It needs no client approval, and it is the cheapest proof the firm's
> positioning is real. Take it all the way to a PR that passes the gate.
>
> **Phase 8 — report.**
> Write `reports/bootstrap.md`: what you changed, what you could not change and
> why, every rule you think is wrong, and the three things you would do next in
> priority order. Then update the `<!-- LOOP-STATE -->` block in `STATE.md`.
>
> Throughout: never modify a path in the `gate.yaml` denylist. Never invent a
> number, a client, or a credential. Where you are unsure, leave the claim out
> and say so.

---

## Step 5 — first week, by hand

Before enabling the schedules, run the loops manually so you see what they
produce while it is cheap to change them:

```
/insight golden-set-anatomy
/insight retrieval-mode-registry
/case-study this-site-runs-a-loop
/defect-sweep
/weekly-review
```

Rewrite the drafts heavily. That rewriting is not wasted work — the diff between
draft and merge is what you feed back into `content/editorial/VOICE.md`. After
two weeks the drafts will need editing rather than rewriting.

## Step 6 — turn on the schedules

Uncomment nothing; the workflows are already scheduled. Set
`paused: false` in `STATE.md` (it already is) and let the Monday run happen.

To stop everything: set `paused: true`, or add the `loop-pause-all` label to any
open issue. Both are checked before a token is spent.

---

## What you should expect

**Week 1.** The gate fails a lot. Several existing pages will have unanchored
numbers and at least one banned word. The sectors page empties out. This looks
like a regression and is a correction.

**Week 2–4.** Three drafts a week, each needing real editing. The calendar
drains at about four entries a week including the ones you reject.

**Week 6.** The queue needs refilling — that is a human hour, not an agent task.
Median edit size should be visibly smaller. Consider promoting the drafting loop
to L2.

**The thing that will not fix itself.** Nothing in here produces a case study
with a named client. That is one conversation and one signature, and it is worth
more than every article the engine will write. It is the first line of
`STATE.md` for that reason.
