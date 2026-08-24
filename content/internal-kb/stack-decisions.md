# Stack Decisions

**What we use, why, and when to deviate.**

---

## Languages

### Python (Primary for Agents/Loops)
**Use for:** Agents, data processing, automation, AI/ML tasks

**Why:**
- Anthropic SDK is Python-first
- LangGraph/LangChain ecosystem
- Data manipulation (pandas, numpy) when needed
- Rich ecosystem for agent frameworks

**Exceptions:**
- Edge functions → TypeScript/JavaScript
- Static sites → Next.js (JavaScript/TypeScript)
- Performance-critical paths → Consider Rust (but verify need first)

### TypeScript/JavaScript (Primary for Web)
**Use for:** Web apps, Next.js sites, API routes, GitHub Actions

**Why:**
- Next.js App Router is a proven choice for static + dynamic
- Edge runtime (Cloudflare Workers/Vercel Edge)
- Single language for frontend + backend
- Huge ecosystem, fast iteration

**Exceptions:**
- Heavy data processing → Python
- Agent orchestration → Python

### Bash (Utility Scripts)
**Use for:** Setup scripts, automation, git workflows

**Why:**
- Universally available
- No dependencies
- Perfect for gluing other tools

**Don't use for:** Anything complex. If you need arrays/functions, use Python.

---

## Databases

### SQLite (Default for Agents)
**Use for:** Single-process agents, audit logs, local state

**Why:**
- Zero ops (just a file)
- Fast enough for <1M rows
- Excellent for read-heavy (agents querying)
- Git-friendly (can commit for testing)

**Examples:**
- DMARC agent: SQLite for parsed reports
- Content audit: history/scores.jsonl (even simpler)

**When to upgrade to Postgres:**
- >1M rows
- Concurrent writes from multiple processes
- Need full-text search (Postgres FTS >> SQLite FTS)
- Deploying to cloud (Supabase free tier)

### JSONL (Simplest)
**Use for:** Append-only logs, time-series data

**Why:**
- One write = one line appended
- No corruption risk (unlike JSON array)
- Trivial to parse in any language
- Human-readable

**Examples:**
- `history/scores.jsonl` — audit scores over time
- `loop-run-log.md` — one line per run

**When SQLite is better:**
- Need to query/filter efficiently
- Need joins
- >10K records

### Supabase (Postgres + Auth + Realtime)
**Use for:** Client projects needing backend

**Why:**
- Free tier: 500MB, 2GB transfer
- Row-level security (RLS) built-in
- Realtime subscriptions (if needed)
- Zero DevOps

**Examples:**
- Meeting Intelligence app (Supabase)

**When NOT to use:**
- Agent-only project (SQLite is simpler)
- High-volume writes (free tier limits)

---

## AI/Model Tools

### Anthropic Claude (Primary)
**Models:**
- **Sonnet 4.5** — Default for production agents
- **Opus 5** — Complex reasoning, multi-step tasks
- **Haiku 4.5** — Fast/cheap classification

**Why:**
- Best reasoning (especially Opus)
- Function calling reliability
- Prompt caching (saves $)

**When to consider alternatives:**
- Client has OpenAI contract → Use theirs
- Extremely cost-sensitive → DeepSeek (via opencode CLI)

### LangGraph (Agent Orchestration)
**Use for:** Multi-step workflows, state machines, subagent coordination

**Why:**
- Graph-based (visual debugging)
- Checkpointing (resume on failure)
- LangSmith tracing

**Alternatives:**
- Simple scripts → Just call Anthropic SDK directly
- Complex research → deep-agents-from-scratch patterns

### opencode CLI (Free Model Routing)
**Use for:** CI/GitHub Actions where cost matters

**Why:**
- Free tier of DeepSeek/other models
- Headless (no browser needed)
- JSON format output

**Example:**
```bash
opencode run -m opencode/deepseek-v4-flash-free \
  --format json \
  --pure \
  "Grade this text..."
```

**When NOT to use:**
- Production client work (Anthropic reliability > cost savings)
- Needs Claude-specific features (extended context, caching)

---

## Web Stack

### Next.js 15 (App Router)
**Use for:** Marketing sites, dashboards, anything with pages

**Why:**
- Static generation (fast)
- API routes (backend + frontend in one)
- Edge runtime (deploy to Cloudflare)
- TypeScript strict mode

**Don't use for:**
- Pure API (Fastify/Express is simpler)
- Heavy real-time (WebSocket server is better)

### Tailwind CSS (Styling)
**Use for:** All styling

**Why:**
- Faster than writing CSS
- Design system via tokens
- Tree-shaking (only used classes ship)

**Alternatives:**
- Component library with strong opinions → Chakra/MUI
- But default to Tailwind first

### React (UI)
**Use for:** Next.js components, dashboards

**Why:**
- Next.js is React
- Component reuse

**Alternatives:**
- Static site with no JS → Astro
- But Next.js static gen is good enough

---

## Deployment

### Cloudflare Pages (Static + Edge Functions)
**Use for:** Next.js sites, static sites

**Why:**
- Free tier: Unlimited bandwidth
- Edge functions (like Vercel Edge)
- Fast (global CDN)

**Examples:**
- gjh-inc.com → Cloudflare Pages

**When Vercel is better:**
- Need Vercel-specific features (Image Optimization, Middleware)
- Client already on Vercel

### GitHub Actions (CI/Automation)
**Use for:** Scheduled tasks, loops, content publishing

**Why:**
- Free for public repos
- Good free tier for private (2000 min/month)
- Integrated with repo

**Examples:**
- Content audit loop (daily)
- Evidence gate (every PR)
- Weekly review (Fridays)

**When NOT to use:**
- >2000 min/month → Move to dedicated cron server
- Need state/queue → Use Supabase + cron trigger

---

## Development Tools

### uv (Python Package Manager)
**Use for:** New Python projects

**Why:**
- Faster than pip
- Lock files (reproducible)
- Workspace support

**Example:**
```bash
uv sync         # Install from lockfile
uv add package  # Add dependency
uv run script.py
```

**When pip is fine:**
- Existing project already using pip
- Simple script with 1-2 dependencies

### Git Worktrees (Isolation)
**Use for:** Agent making risky changes

**Why:**
- Isolated filesystem
- Main branch untouched
- Discard on failure (just delete worktree)

**Example:**
```bash
git worktree add ../gjh-wt-$RUN_ID -b loop/$RUN_ID
cd ../gjh-wt-$RUN_ID
# ... agent makes changes ...
# If good: merge. If bad: delete worktree.
```

---

## When to Deviate

**Good reasons:**
- Client has existing stack (match theirs)
- Specific requirement (real-time → WebSocket, not Next.js)
- Cost constraint (free tier doesn't fit)

**Bad reasons:**
- "This is newer" (stick to proven unless clear benefit)
- "I want to learn X" (client work ≠ learning time)
- "Everyone uses Y" (we're not everyone)

---

## Decision Template

When considering a new tool:

1. **What's the specific problem?** (Not "we should use X", but "Y is too slow/expensive/limited")
2. **Does current stack already solve it?** (Often yes)
3. **What's the switching cost?** (Hours to migrate, hours to learn)
4. **What's the lock-in risk?** (Can we export/migrate later?)
5. **Does client's team use it?** (Handoff matters)

**Default answer: No.** Prove the new tool is worth it.

---

## Costs (Rough Guide)

**Anthropic:**
- Sonnet 4.5: ~$3 input / $15 output per 1M tokens
- Opus 5: ~$15 input / $75 output per 1M tokens
- Haiku 4.5: ~$0.30 input / $1.50 output per 1M tokens

**Hosting:**
- Cloudflare Pages: Free (unlimited bandwidth)
- Vercel: Free tier, then $20/month
- Supabase: Free 500MB, then $25/month

**Storage:**
- GitHub LFS: $5/month for 50GB
- Cloudflare R2: $0.015/GB/month (cheaper than S3)

**When cost becomes an issue:**
- Use caching (Anthropic prompt caching)
- Smaller model when possible (Haiku vs Sonnet)
- Batch operations (daily vs real-time)
