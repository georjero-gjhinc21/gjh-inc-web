# STATE.md

Durable state for the loops. Machine-written between the markers, human-written
outside them. Read this first; it is cheaper than re-reading the repo.

```yaml
paused: false          # kill switch — every workflow checks this first
autonomy:
  evidence-gate: L3
  content-audit: L2
  insight-drafter: L1
  example-builder: L1
  weekly-review: L1
```

## Launch blockers

Two, both human decisions. Loops must not route round them.

1. **No published case study.** `/work` renders an empty state and twelve of
   thirteen sectors carry `status: needs-approval`. The staged ship rule says a
   sector does not render until one case study for it is published. Until then
   the site argues for a capability it does not evidence.
2. **Positioning.** AI/data consultancy (what this repo builds) or federal
   contracting platform (what the PRD describes). Cross-linking gjhconsulting.net
   is the current answer and is defensible; publishing unverified set-aside
   certifications is not.

## Standing facts a loop should not re-derive

- Founded 2009. Any "20+ years" string is a defect.
- Canonical email: `consult@gjh-inc.com`, read from `src/lib/site.ts`.
- Proof numbers in `site.ts` are `TBD` placeholders. Do not fill them from
  inference.
- Partnerships are named, not logo-walled. Logo use is trademark use and needs
  written permission per partner.
- First Load JS budget: 120 kB. Current: ~106 kB.

<!-- LOOP-STATE:BEGIN -->
## Last runs

| Loop | Last run | Result |
|---|---|---|
| evidence-gate | 2026-08-15 | PASS (0 errors, 0 warnings after Phase 1+2 fixes) |
| content-audit | 2026-08-11 | fetch 403 on `https://gjh-inc.com/` — diagnostic logging added in Phase 3, will report detail on next run |
| insight-drafter | — | not yet enabled (awaiting approved content in ledger) |
| example-builder | — | not yet enabled (Phase 7 deferred to manual execution) |
| weekly-review | — | not yet enabled |

## Open loop-generated items

None yet.

## Bootstrap complete (2026-08-15)

6 of 8 phases complete via automated bootstrap. See `reports/bootstrap.md` for full detail.

**Completed:**
- Phase 1: Evidence gate passes (22 → 0 errors)
- Phase 2: Staged ship rule enforced (sectors page honest about approval blocker)
- Phase 3: Audit fetch diagnostic logging (total-failure guard added)
- Phase 4: Grader privileges dropped (filesystem access removed)
- Phase 5: Anti-inflation mechanism (frozen set + rubric hash tracking)
- Phase 6: Chat API hardened (input validation, output sanitization, logging)

**Manual follow-up required:**
- Phase 7: Run `/case-study this-site-runs-a-loop` after PRs merge
- Rate limiting for `/api/chat` (tracked in Phase 6 TODO)

**Next blocker:** Approve one case study to unlock sector publishing.
<!-- LOOP-STATE:END -->

## Notes for the next agent

The 403 on the audit fetch is the first thing to fix. Every downstream trend in
`history/scores.jsonl` is empty until it is. The likely causes, in order: the
host is filtering the `gjh-content-loop/1.0` user agent, Cloudflare bot
protection is on, or the run has no egress. Check the response body before
changing the user agent — spoofing a browser to get past your own bot rules is
a way to lose the signal that the rules exist.
