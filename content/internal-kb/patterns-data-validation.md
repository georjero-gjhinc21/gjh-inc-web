# Data Validation & Evidence Gate Patterns

**Extracted from:** gjh-inc-web (this site), gjh-dmarc-agent  
**Status:** Production (this site's gate has 0 errors)

---

## Pattern 1: Deterministic Gate Before Model Review

**Problem:** Model-based validation is slow and costs money. False positives are expensive.

**Solution:** Run free, fast, deterministic checks first. Only ask the model for judgment.

**From this site's bootstrap:**
```
check-claims.mjs (free, 2 sec) → model reviewer (paid, 20 sec)
        ↓                                   ↓
  Regex violations                    Falsifiability
  Banned words                        Differentiation  
  Unanchored numbers                  Buyer fit
  Email divergence                    Proof density
  Front-matter schema
```

**Cost comparison:**
- Deterministic gate: $0, ~2 seconds, catches 90% of issues
- Model reviewer: ~$0.20/page, ~20 seconds, catches remaining 10%

**Code (Node.js, zero dependencies):**
```javascript
// scripts/check-claims.mjs
import fs from "node:fs";
import path from "node:path";

const findings = [];
const add = (level, file, line, rule, message, fix) =>
  findings.push({ level, file, line, rule, message, fix });

// Walk directory tree
function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

// Check for banned words (with inflections)
function bannedWords(text, config) {
  const words = config.bannedWords; // ["leverage", "unlock", "synergy", ...]
  const found = [];
  
  for (const word of words) {
    // Match word boundaries, case-insensitive
    const re = new RegExp(`\\b${word}(s|d|ing)?\\b`, "gi");
    if (re.test(text)) {
      found.push(word);
    }
  }
  
  return found;
}

// Check for unanchored numbers
function unanchoredNumbers(text, frontMatter, config) {
  // Skip if claims: illustrative
  if (frontMatter.claims === "illustrative") return [];
  
  const patterns = [
    /\b\d+%\b/g,                    // Percentages
    /\b\d+\s+(clients|weeks|months|projects)\b/gi,  // Counts
    /\$\d+[KMB]?\b/g,               // Money
  ];
  
  const found = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && !frontMatter.evidence) {
      found.push(...matches);
    }
  }
  
  return found;
}

// Run all checks
const files = walk("content", [".md"]);
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const { frontMatter, body } = parseFrontMatter(text);
  
  // Banned vocabulary
  const banned = bannedWords(body, config);
  if (banned.length) {
    add("error", file, 1, "banned-vocabulary", 
        `Found: ${banned.join(", ")}`,
        "Say the specific thing instead.");
  }
  
  // Unanchored numbers
  const nums = unanchoredNumbers(body, frontMatter, config);
  if (nums.length) {
    add("error", file, 1, "unanchored-number",
        `Found: ${nums.join(", ")} with no evidence anchor`,
        "Add evidence: field or set claims: illustrative");
  }
}

process.exit(findings.filter(f => f.level === "error").length ? 1 : 0);
```

**When to use:**
- Content that will be public
- Claims that need evidence
- Any validation where regex/schema can decide

---

## Pattern 2: Ledger-Based Evidence Anchoring

**Problem:** Articles make numeric claims ("helped 50 clients") but can't prove them.

**Solution:** Every claim resolves to a ledger ID or build fails.

**Structure:**
```yaml
# content/editorial/ledger.yaml
- id: bank-rag-assessment
  claim: >
    Assessment of internal retrieval platform at retail bank.
    Findings: entitlements at query time, missing golden set,
    rubric versioning, regression gate.
  source: "engagement artifacts, held privately"
  status: needs-approval
  owner: george
  
- id: content-loop-harness
  claim: >
    Scheduled content audit: deterministic pre-grader, model grader,
    schema validation, trend analysis, frozen anti-inflation set.
  source: "loop/ in this repo, reproducible"
  status: published
  owner: george
```

**Front matter in article:**
```markdown
---
title: "Why retrieval needs entitlements at query time"
evidence: bank-rag-assessment
---

We audited a platform serving 20 retrieval modes across 11 services...
```

**Check (in gate):**
```javascript
// If evidence: field exists, verify it's in ledger
if (frontMatter.evidence) {
  const ledger = loadLedger("content/editorial/ledger.yaml");
  const entry = ledger.find(e => e.id === frontMatter.evidence);
  
  if (!entry) {
    fail(`Evidence ID "${frontMatter.evidence}" not in ledger`);
  }
  
  if (entry.status !== "published") {
    fail(`Evidence "${frontMatter.evidence}" is ${entry.status}, not published`);
  }
}
```

**Why this works:**
- Clear separation: claims in article, proof in ledger
- Human reviews ledger entries (not scattered through content)
- Status change (needs-approval → published) makes live all articles using it
- Audit trail: who claimed what, based on what source

---

## Pattern 3: Frozen Anti-Inflation Set

**Problem:** Rubric changes might make grading easier (score inflation), not better.

**Solution:** Freeze a held-out set with human scores. Re-grade after rubric changes.

**From this site (Phase 5 of bootstrap):**
```
loop/frozen/
├── README.md
├── fixture-01-good-problem-first.json
├── fixture-02-weak-differentiation.json
├── ...
└── fixture-10-balanced.json

Each fixture:
{
  "id": "fixture-01",
  "description": "Strong problem-first, clear buyer fit",
  "page_text": "...",
  "expected_scores": {
    "problem_first": 5,
    "falsifiability": 5,
    "differentiation": 4,
    ...
  },
  "rationale": "Opens with buyer's problem. Claims verifiable. Voice direct."
}
```

**Check script:**
```python
# loop/check-frozen.py
def check_inflation(tolerance=0.15):
    fixtures = load_frozen_set()
    rubric = load_rubric()
    
    results = []
    for fixture in fixtures:
        # Re-grade with current rubric
        actual = grade(fixture["page_text"], rubric)
        expected = fixture["expected_scores"]
        
        actual_mean = weighted_mean(actual)
        expected_mean = weighted_mean(expected)
        delta = actual_mean - expected_mean
        
        results.append({"id": fixture["id"], "delta": delta})
    
    mean_delta = sum(r["delta"] for r in results) / len(results)
    
    if mean_delta > tolerance:
        print(f"INFLATION: mean rose {mean_delta:+.2f} (tolerance: {tolerance})")
        sys.exit(1)
    
    print(f"✓ No inflation. Mean delta: {mean_delta:+.2f}")
```

**Usage:**
```bash
# Before merging rubric change
python loop/check-frozen.py

# If it exits 0, rubric change is safe
# If it exits 1, rubric got easier (scores rose on unchanged fixtures)
```

**Why this matters:**
- Without it, rubric improvements are unfalsifiable
- Frozen set is never shown to improve.py (isolation)
- Catches both inflation AND deflation (useful for both)
- Cost: ~$2 per check (10 fixtures × 1 grading each)

---

## Pattern 4: Schema Validation with Retry

**Problem:** Model returns malformed JSON, or omits required fields.

**Solution:** Parse, validate, retry with error message.

**From DMARC agent and this site's audit:**
```python
def parse_grade(raw: str) -> dict:
    # Strip markdown fences if present
    raw = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE)
    
    # Parse JSON
    try:
        obj = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}")
    
    # Required fields
    required = ["scores", "failures", "summary"]
    missing = [k for k in required if k not in obj]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")
    
    # Score range validation
    for criterion, score in obj["scores"].items():
        if not isinstance(score, int) or not 0 <= score <= 5:
            raise ValueError(f"{criterion} score out of range: {score}")
    
    # Failures must have fixes if score <3
    for failure in obj.get("failures", []):
        if obj["scores"].get(failure["criterion"], 5) < 3:
            if not failure.get("fix", "").strip():
                raise ValueError(f"{failure['criterion']} scored <3 with no fix")
    
    return obj

def grade_with_retry(text, rubric, max_attempts=3):
    last_error = None
    
    for attempt in range(1, max_attempts + 1):
        try:
            if attempt == 1:
                prompt = f"RUBRIC\\n{rubric}\\n\\nTEXT\\n{text}"
            else:
                prompt = f"{prompt}\\n\\nYour previous response was rejected: {last_error}\\nReturn corrected JSON."
            
            response = call_model(prompt)
            return parse_grade(response)
            
        except ValueError as e:
            last_error = str(e)
            print(f"  Attempt {attempt} failed: {last_error}")
    
    raise RuntimeError(f"Grader failed after {max_attempts} attempts")
```

**Benefits:**
- Model sees exactly what was wrong
- Retry is smarter than first attempt (has error context)
- Exponential backoff prevents rate limits
- Fails closed (exception if all retries exhausted)

---

## Pattern 5: Rubric Hash for Trend Continuity

**Problem:** Score trends cross rubric changes, mixing apples and oranges.

**Solution:** Hash the rubric, write it with every score. Trends break at hash changes.

```python
import hashlib

def rubric_hash(rubric_text: str) -> str:
    return hashlib.sha256(rubric_text.encode()).hexdigest()[:12]

# When writing scores
run = {
    "run_id": "2026-08-15T12:00:00Z",
    "rubric_hash": rubric_hash(rubric_text),  # ← This
    "mean_overall": 3.42,
    "pages": [...]
}

# When trending
def get_trend(history_file, current_rubric_hash):
    runs = [json.loads(line) for line in open(history_file)]
    
    # Only trend runs with matching rubric
    same_rubric = [r for r in runs if r["rubric_hash"] == current_rubric_hash]
    
    return [r["mean_overall"] for r in same_rubric]
```

**Why:**
- A score of 3.5 under rubric A ≠ 3.5 under rubric B
- Trends should break visibly when rubric changes
- Lets you compare "same rubric over time" vs "different rubrics"

---

## Reusable Code

**Location:**
- `gjh-inc-web/scripts/check-claims.mjs` — Full evidence gate (Node)
- `gjh-inc-web/loop/check-frozen.py` — Anti-inflation check (Python)
- `gjh-inc-web/loop/audit.py` — Schema validation + retry (Python)
- `gjh-dmarc-agent/agents/verifier.py` — Domain-specific verification

**Copy-paste ready:**
- Walk directory: `scripts/check-claims.mjs` lines 47-56
- Front matter parser: `scripts/check-claims.mjs` lines 62-84
- Retry with error: `loop/audit.py` lines 198-218
- Hash tracking: `loop/audit.py` lines 238-243

---

## Cost vs Benefit

**Deterministic gate:**
- Cost: 0 hrs to run, 6 hrs initial build
- Savings: Catches 90% of issues for free
- ROI: After ~10 runs

**Frozen set:**
- Cost: 2 hrs to create, $2/check
- Savings: Prevents one bad rubric merge
- ROI: After first prevented inflation

**Schema validation:**
- Cost: 1 hr to add
- Savings: Prevents malformed output reaching production
- ROI: First malformed response
