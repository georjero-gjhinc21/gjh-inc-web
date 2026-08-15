# Internal Knowledge Base

**Private documentation of GJH's own systems and reusable patterns.**

This directory contains:
- Case studies of our own work (no client approval needed)
- Reusable code patterns extracted from past projects
- Architecture decisions and their outcomes
- Technical approaches that worked (and what didn't)

**Status:** Internal only (not published to site)

**→ [Read HOW-TO-USE.md](./HOW-TO-USE.md) first** for usage guide, cost recovery, and maintenance.

---

## Contents

### ✅ Created

1. **patterns-multi-agent-systems.md** — Agent architecture patterns from DMARC agent, Security Sentinel
   - Main Agent + Specialized Subagents
   - Security Agent Swarm
   - Agent Registry + Dynamic Dispatch
   - Verification Loop

2. **patterns-data-validation.md** — Evidence gates, schema validation, fail-closed design
   - Deterministic Gate Before Model Review
   - Ledger-Based Evidence Anchoring
   - Frozen Anti-Inflation Set
   - Schema Validation with Retry
   - Rubric Hash for Trend Continuity

3. **stack-decisions.md** — What we use and why (Python/Node, SQLite/Postgres, etc.)
   - Languages, Databases, AI Tools
   - Web Stack, Deployment
   - Development Tools
   - Decision Template

### 📋 Planned (High Priority)

4. **patterns-github-actions-automation.md** — Workflow patterns for monitoring, scheduling, reporting
5. **patterns-credential-management.md** — Secure credential handling and tracking
6. **patterns-ai-loop-systems.md** — Self-improving loops with frozen sets and rubric tracking

---

## Quick Start

When starting client work:
1. Read relevant pattern doc (see Contents above)
2. Copy-paste working code snippets
3. Adapt to client context
4. Document what worked/didn't

When completing client work:
1. Extract new reusable patterns
2. Add to relevant pattern doc (or create new one)
3. Update README.md index
4. Commit with description

## What NOT to Put Here

- Client-specific code (unless fully generalized)
- Credentials or API keys (obviously)
- Client names or identifying details
- Anything that requires approval

**If it's ours, it goes here. If it's theirs, it goes in ledger.yaml as needs-approval.**
