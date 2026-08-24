# Open defects

Ranked by consequence. Each carries the specific fix, not a direction.

---

## D1 — canonical email divergence between repos (blocking)

`consult@gjh-inc.com` is canonical and sourced from `src/lib/site.ts` in this
repo. The federal presence on gjhconsulting.net uses a different address. A
buyer who finds both reads it as two companies, or one careless one.

**Fix.** Decide which address is canonical for which property, in writing, in
`STATE.md`. Then `scripts/check-claims.mjs` enforces it here permanently — rule
`email-divergence`, already implemented. Add the same script to the other repo.

---

## D4 — the anti-inflation guard is a sentence, not a mechanism (blocking)

`IMPROVER_SYSTEM` in `loop/improve.py` says: *never propose a change that would
make the grader more lenient in order to raise scores.* That is a request, made
to a model, about a metric it produces. There is no mechanism behind it.

**Fix — three parts, all structural.**

1. `loop/rubric.md` and `loop/config.yaml` are in the `gate.yaml` denylist and
   the `.claude/settings.json` deny list. Already done in this kit. Verify it
   holds after every settings change.
2. Freeze a held-out set: ten pages or fixtures with human-assigned scores,
   stored in `loop/frozen/` and **never** shown to the improver. After any
   rubric change, re-grade the frozen set. If mean frozen score rises while
   nothing about those pages changed, the rubric got easier — revert.
3. Record the rubric hash in every entry of `history/scores.jsonl`. A trend line
   that crosses a rubric change is two trend lines, and must be rendered as two.

Without (2), a rubric change is unfalsifiable. That is the whole defect.

---

## D5 — excessive privilege for a text-grading task (blocking)

`loop/audit.py` calls the grader through `opencode run … --auto`. `--auto`
suppresses permission prompts, so a coding agent with filesystem access runs
unattended to perform what is pure text classification: read a page, return
JSON. The task needs no tools at all.

**Fix.** Route grading through the plain HTTP completion path in `loop/llm.py`
rather than a coding-agent CLI. If the free-model routing via `opencode` is worth
keeping for cost reasons, then at minimum:

- run it in a container with the repo mounted read-only
- pass `--pure` (already present) **and** disable tool use entirely rather than
  auto-approving it
- assert on the output shape before it touches disk, which `parse_grade()`
  already does — that check is good and should not be the only one

The principle is the finding: an agent should not hold write permission for a
task whose output is a JSON object.

---

## D7 — `/api/chat` has no rate limit and no output validation (blocking)

An unauthenticated, publicly reachable, model-backed route. Today that is a
spend surface and a reputational one: the assistant speaks as GJH.

**Fix.**

- Per-IP token bucket, e.g. 10 requests per minute, 60 per hour, in edge
  middleware so the limit applies before the model is reached.
- Max input length, enforced server-side. Reject rather than truncate.
- Max output tokens, capped low. The assistant answers questions about the site;
  it has no reason to produce long output.
- Output validation against the same forbidden-claims list the site uses. If a
  response mentions a certification, a contract vehicle, a price, a timeline, or
  a named client, drop it and return the fallback. The system prompt already
  forbids these; a prompt is a request and this is the check behind it.
- Log every conversation with a request id. An assistant whose answers cannot be
  reviewed cannot be improved or defended.

---

## D-new — the staged ship rule is documented but not enforced (blocking)

`src/lib/sectors.ts` exports `publishedSectors()`, and twelve of thirteen
sectors carry `status: needs-approval`. But `src/app/sectors/page.tsx` maps over
`sectors`, and the homepage does the same. So the site currently renders thirteen
industry pages asserting delivery experience it has not cleared to claim.

This matters more than it looks. The rule exists precisely to stop the site
making claims ahead of its evidence, and the rule is currently decorative.

**Fix.** Map over `publishedSectors()` in `sectors/page.tsx`, `page.tsx`, and
`sitemap.ts`. Keep `sectorKeywords` feeding JSON-LD `knowsAbout` — naming a
domain you work in is not the same as claiming an engagement in it. Rule
`staged-ship-rule` in `check-claims.mjs` fails the build on regression.

Expect the sectors page to be nearly empty afterwards. That is the accurate
state of the evidence, and it is the argument for getting one case study
approved rather than for turning the rule off.

---

## D-new — the audit has been fetching nothing (blocking the whole harness)

`reports/2026-08-11-audit.md` records `403 Client Error: Forbidden` for
`https://gjh-inc.com/`. Every score is `None`. Trend analysis over a history of
failed fetches produces confident output about nothing.

**Fix.** Diagnose before changing anything: log the response body and headers.
If it is bot protection on the host, allowlist the loop's user agent there
rather than spoofing a browser — spoofing removes the signal that your own bot
rules exist. Then add a hard rule to `audit.py`: a run where every target
errored writes no history entry and exits non-zero. A failed run must not look
like a quiet one.

---

## Watch list

- `site.ts` proof numbers still `TBD`. They must not be filled by inference.
- Partner list needs annual confirmation; logo use needs written permission per
  partner before any logo appears.
- `/work` renders an empty state. This is honest and should stay honest until a
  case study is approved.
