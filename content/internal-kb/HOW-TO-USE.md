# How to Use the Internal Knowledge Base

**Location:** `content/internal-kb/`  
**Purpose:** Speed up client work by providing reusable patterns and code from past projects.

---

## What's Here

### 1. Multi-Agent Systems (`patterns-multi-agent-systems.md`)

**Extracted from:** DMARC agent, Security Sentinel, Meeting Intelligence

**4 Patterns:**
- **Main Agent + Specialized Subagents** — Coordinator dispatches to experts (DMARC architecture)
- **Security Agent Swarm** — Parallel security checks with aggregation (Security Sentinel)
- **Agent Registry + Dynamic Dispatch** — Plugin-style agent routing
- **Verification Loop** — Two-phase check: claim → verify → report

**When to use:**
- Client needs automated security checks → Security Agent Swarm
- Complex workflow with distinct phases → Main + Subagents
- Multiple specialized tasks → Agent Registry

**Copy-paste ready code:**
- SQLite schema for agent coordination
- Subagent dispatch pattern
- Verification loop with retry
- Cost tracking per agent

---

### 2. Data Validation (`patterns-data-validation.md`)

**Extracted from:** gjh-inc-web (this site), DMARC agent

**5 Patterns:**
- **Deterministic Gate Before Model Review** — Free regex checks before paid model ($0 → $0.20)
- **Ledger-Based Evidence Anchoring** — Claims resolve to ledger IDs or build fails
- **Frozen Anti-Inflation Set** — Detect rubric changes that make grading easier
- **Schema Validation with Retry** — Parse, validate, retry with error context
- **Rubric Hash for Trend Continuity** — Trends break when rubric changes

**When to use:**
- Content validation → Deterministic Gate + Model Review
- Claims need proof → Ledger-Based Anchoring
- Scoring system → Frozen Set + Rubric Hash
- JSON from model → Schema Validation with Retry

**Copy-paste ready code:**
- Full evidence gate (Node.js, zero dependencies)
- Directory walker, front-matter parser
- Anti-inflation check script (Python)
- Grade parser with retry

---

### 3. Stack Decisions (`stack-decisions.md`)

**What we use, why, when to deviate.**

**Quick lookup for:**
- Which language for what (Python agents, TypeScript web, Bash glue)
- Database choices (SQLite, JSONL, Supabase)
- AI tools (Claude models, LangGraph, opencode)
- Web stack (Next.js, Tailwind, Cloudflare)
- Development tools (uv, git worktrees)

**Decision template:** 5 questions to ask before adding new tech

**Costs:** Anthropic pricing, hosting costs, when to optimize

---

## How to Use This in Client Work

### Starting a New Agent Project

1. **Read:** `patterns-multi-agent-systems.md`
2. **Pick pattern:** Based on project needs (single expert, swarm, registry)
3. **Copy code:** SQLite schema, dispatch logic
4. **Reference:** `stack-decisions.md` for language/DB choice

**Time saved:** ~4-6 hours (no architecture from scratch)

### Adding Content Validation

1. **Read:** `patterns-data-validation.md`, Pattern 1
2. **Copy:** `check-claims.mjs` from gjh-inc-web repo
3. **Customize:** Config file for project-specific rules
4. **Wire:** Add to CI (GitHub Actions example in file)

**Time saved:** ~8 hours (gate + config + CI setup)

### Choosing Technology

1. **Check:** `stack-decisions.md` for default choice
2. **Apply decision template:** If considering deviation
3. **Document:** Why you deviated (for next project)

**Time saved:** 1-2 hours (no research, clear defaults)

---

## Maintaining the Knowledge Base

### When to Add a New Pattern

- You built something for a client that worked well
- It's reusable (not client-specific)
- It has measurable benefit (cost, time, quality)
- You'd use it again on the next similar project

### What to Include

Each pattern document should have:
- **Problem:** What it solves
- **Solution:** How it works
- **Code:** Copy-paste ready snippets
- **When to use:** Decision criteria
- **Cost:** Time to implement, savings
- **Examples:** From real projects (anonymized if needed)

### How to Add

1. Create new `.md` file in `content/internal-kb/`
2. Follow existing structure (see other pattern files)
3. Add to `README.md` index
4. Commit with description of pattern

### What NOT to Add

- Client-specific code with sensitive data
- Untested patterns (only proven ones)
- Language/framework tutorials (link to external docs)
- One-off solutions (must be reusable)

---

## Cost Recovery

**Time invested creating this KB:** ~6 hours  
**Expected savings per reuse:** 4-8 hours  
**Break-even:** 1-2 client projects

**Example:**
- Agent architecture pattern reused 3 times → 12-18 hours saved
- Evidence gate pattern reused 2 times → 16 hours saved
- Stack decisions referenced 5 times → 5-10 hours saved

**Total savings (first year estimate):** 30-40 hours

---

## Next Steps

**High-priority additions:**
1. **GitHub Actions patterns** — CI/CD workflows, cron schedules, secrets
2. **Credential management** — Secure API key handling, rotation
3. **AI loop systems** — Autonomous agents, kill switches, budget tracking

**Ongoing:**
- Add patterns as you complete client work
- Update costs when they change
- Archive deprecated patterns (mark as "Historical")

---

## Questions?

When using these patterns:
- If something is unclear → Add clarification to the pattern doc
- If you find a better approach → Update the pattern with new code
- If a pattern fails → Document the failure case and fix

The KB gets better the more you use it and update it.
