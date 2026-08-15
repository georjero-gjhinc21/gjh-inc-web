#!/usr/bin/env python3
"""Check frozen grading set for rubric inflation.

After any rubric change, re-grade the frozen fixtures. If mean score rises
while the fixtures themselves are unchanged, the rubric got easier — that's
inflation, not improvement.

Exit 0: no inflation detected (or within tolerance)
Exit 1: mean score rose significantly → rubric got easier

Usage:
    python loop/check-frozen.py
    python loop/check-frozen.py --tolerance 0.2  # allow 0.2 point rise
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import sys

# Add parent to path for llm import
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import llm

ROOT = pathlib.Path(__file__).resolve().parent.parent
FROZEN = ROOT / "loop" / "frozen"
RUBRIC = ROOT / "loop" / "rubric.md"

RUBRIC_WEIGHTS = {
    "problem_first": 1.0,
    "falsifiability": 1.5,
    "differentiation": 1.5,
    "buyer_fit": 1.0,
    "proof_density": 1.0,
    "machine_legibility": 1.0,
    "voice_discipline": 0.5,
}

GRADER_SYSTEM = """You grade website copy for GJH Inc. against a fixed rubric. You are a grader, not a copywriter — your job is to find what is wrong and state the exact fix.

Context you must hold:
- GJH Inc., founded 2009, partner to Anthropic, Google, AWS, Databricks, and Snowflake. An independent consulting firm helping organizations put AI and their data to practical use.
- Work: advisory (where AI is and isn't worth the effort), building (assistants, automations, internal tools that run against real systems), data foundations (warehouses, pipelines, models), and staying-with-it (monitoring, tuning, support).
- Working style: start small and paid with a short assessment of one workflow; senior people do the work; clients own everything built, with no vendor dependency by design.
- Buyers: commercial and non-profit organizations putting AI to work.

Rules:
- Never invent a metric, client name, or credential. If copy contains an unverifiable claim, that is a falsifiability failure, not something to preserve.
- Any criterion scored below 3 REQUIRES a fix containing literal replacement text.
- Respond with a single JSON object and nothing else. No markdown fence, no preamble.

Schema:
{"scores": {"problem_first": int 0-5, "falsifiability": int 0-5, "differentiation": int 0-5, "buyer_fit": int 0-5, "proof_density": int 0-5, "machine_legibility": int 0-5, "voice_discipline": int 0-5},
 "failures": [{"criterion": str, "evidence": str, "fix": str}],
 "relevancy_gaps": [str],
 "summary": str}"""


def rubric_hash() -> str:
    """Hash of the current rubric. Changes when rubric changes."""
    content = RUBRIC.read_text()
    return hashlib.sha256(content.encode()).hexdigest()[:12]


def weighted(scores: dict) -> float:
    total = sum(RUBRIC_WEIGHTS.values())
    return round(sum(scores[k] * w for k, w in RUBRIC_WEIGHTS.items()) / total, 2)


def parse_grade(raw: str) -> dict:
    import re
    raw = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    obj = json.loads(raw)
    missing = [k for k in RUBRIC_WEIGHTS if k not in obj.get("scores", {})]
    if missing:
        raise ValueError(f"grader omitted criteria: {missing}")
    return obj


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tolerance", type=float, default=0.15,
                    help="Max allowed mean score increase (default: 0.15)")
    ap.add_argument("--model", default="claude-sonnet-4-5-20250929")
    args = ap.parse_args()

    rubric_text = RUBRIC.read_text()
    rhash = rubric_hash()
    print(f"Rubric hash: {rhash}")
    print(f"Tolerance: +{args.tolerance}")
    print()

    fixtures = sorted(FROZEN.glob("fixture-*.json"))
    if not fixtures:
        print("ERROR: No frozen fixtures found in loop/frozen/", file=sys.stderr)
        return 1

    results = []
    for fpath in fixtures:
        fixture = json.loads(fpath.read_text())
        fid = fixture["id"]
        expected = fixture["expected_scores"]
        expected_overall = weighted(expected)

        print(f"[{fid}] {fixture['description']}")
        print(f"  Expected: {expected_overall}")

        # Re-grade with current rubric
        prompt = f"RUBRIC\n{rubric_text}\n\nPAGE TEXT\n{fixture['page_text']}"
        try:
            grade_json = llm.completion(args.model, GRADER_SYSTEM, prompt, max_tokens=3000)
            grade = parse_grade(grade_json)
            actual_overall = weighted(grade["scores"])
            delta = round(actual_overall - expected_overall, 2)
            print(f"  Actual: {actual_overall} (Δ {delta:+.2f})")

            results.append({
                "id": fid,
                "expected": expected_overall,
                "actual": actual_overall,
                "delta": delta,
            })
        except Exception as exc:
            print(f"  ERROR: {exc}", file=sys.stderr)
            return 1

    print()
    mean_expected = round(sum(r["expected"] for r in results) / len(results), 2)
    mean_actual = round(sum(r["actual"] for r in results) / len(results), 2)
    mean_delta = round(mean_actual - mean_expected, 2)

    print(f"Mean expected: {mean_expected}")
    print(f"Mean actual:   {mean_actual}")
    print(f"Mean delta:    {mean_delta:+.2f}")
    print()

    if mean_delta > args.tolerance:
        print(f"INFLATION DETECTED: mean score rose by {mean_delta:+.2f}, exceeding tolerance {args.tolerance}", file=sys.stderr)
        print("The rubric got easier. Revert the rubric change or adjust expected scores.", file=sys.stderr)
        return 1

    if mean_delta < -args.tolerance:
        print(f"Note: mean score dropped by {mean_delta:.2f}. Rubric may have gotten harder.")

    print("✓ No inflation detected. Frozen set scores are stable.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
