# Internal Knowledge Base

**Private documentation of GJH's own systems and reusable patterns.**

This directory contains:
- Case studies of our own work (no client approval needed)
- Reusable code patterns extracted from past projects
- Architecture decisions and their outcomes
- Technical approaches that worked (and what didn't)

**Status:** Internal only (not published to site)

## Contents

1. **patterns-multi-agent-systems.md** — Agent architecture patterns from DMARC agent, Security Sentinel
2. **patterns-github-actions-automation.md** — Workflow patterns for monitoring, scheduling, reporting
3. **patterns-credential-management.md** — Secure credential handling and tracking
4. **patterns-data-validation.md** — Evidence gates, schema validation, fail-closed design
5. **patterns-ai-loop-systems.md** — Self-improving loops with frozen sets and rubric tracking
6. **stack-decisions.md** — What we use and why (Python/Node, SQLite/Postgres, etc.)

## How to Use

When starting client work:
1. Scan relevant pattern docs for similar problems
2. Copy-paste working code snippets
3. Adapt to client context
4. Document what changes worked/didn't

When completing client work:
1. Extract new reusable patterns
2. Add to relevant pattern doc
3. Note what was different about this case
4. Update stack decisions if tools changed

## What NOT to Put Here

- Client-specific code (unless fully generalized)
- Credentials or API keys (obviously)
- Client names or identifying details
- Anything that requires approval

**If it's ours, it goes here. If it's theirs, it goes in ledger.yaml as needs-approval.**
