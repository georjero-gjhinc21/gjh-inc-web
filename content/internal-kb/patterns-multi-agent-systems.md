# Multi-Agent System Patterns

**Extracted from:** gjh-dmarc-agent, gjh-security-sentinel  
**Status:** Production-tested, reusable

---

## Pattern 1: Main Agent + Specialized Subagents

**Problem:** Complex analysis tasks fill the main agent's context with detail-heavy work.

**Solution:** Main agent orchestrates, subagents handle detail, only summaries come back up.

**Architecture (DMARC Agent):**
```
mailbox → ingest → parse → Postgres → facts (deterministic)
                                         ↓
                                  ┌─── deep agent ───┐
                                  │  source-forensics │  <- subagents
                                  │  policy-advisor   │
                                  └─────────┬─────────┘
                                            ↓
                                       assessment
                                            │
                            ┌───────── verifier ─────────┐
                            │ IPs real? volumes match?   │
                            │ every failing source       │
                            │ accounted for? policy safe?│
                            └───────┬────────────┬───────┘
                              fail  │            │ pass
                        critique ───┘            ▼
                        (≤3 attempts)      report + alerts
```

**Key principles:**
1. **Deterministic first** — Parse XML, extract facts, write to DB (no LLM)
2. **Facts → Analysis** — Agent reads clean data, not raw logs
3. **Subagents for depth** — Forensic investigation happens in isolated context
4. **Verifier catches mistakes** — Before any human sees output, verify against source
5. **Retry with critique** — Failed verification gets 3 attempts with escalating models

**When to use:**
- Input is high-volume (daily DMARC reports, security logs)
- Analysis requires domain expertise (email auth, IP reputation)
- Output consequences are high (alerting client about potential breach)

**Code structure:**
```python
# main_agent.py
def analyze_dmarc_report(report_id):
    # 1. Load deterministic facts
    facts = db.get_report_facts(report_id)
    
    # 2. Spawn subagents for analysis
    forensics = agent.run("source-forensics", facts)
    policy = agent.run("policy-advisor", forensics)
    
    # 3. Combine + verify
    assessment = combine(forensics, policy)
    verified = verifier.check(assessment, facts)  # Fail-closed
    
    if not verified:
        return retry_with_critique(assessment, verified.errors)
    
    return assessment
```

**Reusable code:** `~/gjh-dmarc-agent/agents/`

---

## Pattern 2: Security Agent Swarm

**Problem:** Multiple attack vectors, each needing different detection logic.

**Solution:** Specialized agents per threat class, coordinator aggregates.

**Architecture (Security Sentinel):**
```
┌─ LinkedIn Monitor ──┐  Every 30 min
│ Unauthorized posts  │
└──────────┬──────────┘
           │
┌─ Credential Sentinel┐  Every hour
│ Token health, leaks │
└──────────┬──────────┘
           │
┌─ Network Watcher ───┐  Every 15 min       ┌─── Incident Responder ───┐
│ IP access, brute    │────────►────────────┤ Email, protect, lockdown │
└──────────┬──────────┘                     └──────────────────────────┘
           │
┌─ Repo Guardian ─────┐  Every 30 min
│ File integrity      │
└──────────┬──────────┘
           │
           ▼
   Recommendation Engine (daily)
```

**Agent specialization:**
- **LinkedIn Monitor:** API-based, checks for posts NOT in our DB
- **Credential Sentinel:** Scans logs, detects token misuse, checks haveibeenpwned
- **Network Watcher:** SSH logs, API rate patterns, geo-anomaly
- **Repo Guardian:** File hashes, commit signatures, workflow tampering
- **Incident Responder:** Cross-agent trigger, auto-response playbook
- **Recommendation Engine:** Trend analysis, proactive hardening

**When to use:**
- Multiple independent threat surfaces
- Different check frequencies needed
- Some agents must be real-time, others can batch
- Findings need correlation (IP + credential + unusual post = high severity)

**GitHub Actions pattern:**
```yaml
# .github/workflows/security-sentinel.yml
on:
  schedule:
    - cron: '*/15 * * * *'  # Network watcher (fast)
    - cron: '*/30 * * * *'  # LinkedIn + Repo (medium)
    - cron: '0 * * * *'     # Credential (slow but thorough)
    - cron: '0 6 * * *'     # Recommendations (daily)
```

**Reusable code:** `~/gjh-security-sentinel/agents/`

---

## Pattern 3: Agent Registry + Dynamic Dispatch

**Problem:** Hard to test agents in isolation, hard to add new agents.

**Solution:** Registry pattern with agent metadata.

```python
# agents/registry.py
AGENTS = {
    "linkedin-monitor": {
        "check_fn": linkedin_check,
        "frequency": "30min",
        "priority": "high",
        "escalate_on": ["unauthorized_post", "profile_change"],
    },
    "credential-sentinel": {
        "check_fn": credential_check,
        "frequency": "1hour",
        "priority": "critical",
        "escalate_on": ["token_leak", "brute_force"],
    },
}

def run_agent(agent_id):
    config = AGENTS[agent_id]
    findings = config["check_fn"]()
    
    for finding in findings:
        if finding.type in config["escalate_on"]:
            incident_responder.handle(finding, priority=config["priority"])
    
    return findings
```

**Benefits:**
- Add agent = add dict entry
- Test agent = call check_fn directly
- Adjust frequency = change one number
- See all agents = print registry

---

## Pattern 4: Verification Loop

**From DMARC agent — the thing that made it production-safe.**

```python
def verify_assessment(assessment: dict, source_facts: dict) -> VerifyResult:
    """Check agent output against deterministic facts before showing it."""
    
    errors = []
    
    # Every IP mentioned must exist in source data
    for ip in assessment.get("failing_ips", []):
        if ip not in source_facts["all_ips"]:
            errors.append(f"Invented IP {ip} not in source data")
    
    # Volumes must match
    claimed_total = sum(assessment["category_volumes"].values())
    actual_total = source_facts["total_volume"]
    if abs(claimed_total - actual_total) > 0.01 * actual_total:
        errors.append(f"Volume mismatch: {claimed_total} vs {actual_total}")
    
    # Every failing source must have an explanation
    unexplained = set(source_facts["failing_sources"]) - set(assessment["explanations"].keys())
    if unexplained:
        errors.append(f"No explanation for: {unexplained}")
    
    # Policy advice must be valid
    for policy in assessment.get("policy_changes", []):
        if not is_valid_dmarc_policy(policy):
            errors.append(f"Invalid DMARC policy: {policy}")
    
    return VerifyResult(passed=not errors, errors=errors)
```

**Why this matters:**
- Catch hallucinations before they reach client
- Verify recommendations are actionable (not "enable SPF" when SPF is already enabled)
- Force agent to account for every data point
- Retry with concrete errors = agent learns what it missed

**Reuse this for:**
- Any agent making recommendations
- Any agent summarizing data
- Any agent that could invent plausible-sounding nonsense

---

## Lessons Learned

**What worked:**
1. **Parse first, reason second** — LLMs on clean data > LLMs on logs
2. **Subagents keep main context clean** — Only summaries bubble up
3. **Verification is non-negotiable** — Cost: 2 extra API calls. Benefit: Catches every hallucination
4. **Registry > hardcoded dispatch** — Makes testing trivial

**What didn't:**
1. ❌ **One big prompt** — Context filled with irrelevant detail, poor accuracy
2. ❌ **No verification** — Plausible but wrong recommendations shipped
3. ❌ **Synchronous agents** — Slow agents blocked fast ones
4. ❌ **No retry budget** — First failure = escalation (too noisy)

**Cost per run:**
- DMARC agent: ~$0.15/report (main + 2 subagents + verifier)
- Security Sentinel: ~$0.05/hourly sweep (6 agents, most cached)

**Time investment:**
- Initial build: 12 hours (DMARC), 8 hours (Sentinel)
- Maintenance: ~30 min/month (mostly tweaking thresholds)
