#!/usr/bin/env python3
"""Loop 4 — the self-improvement loop.

Reads history/scores.jsonl (the trace store), finds failures that keep recurring
across runs, and proposes changes to the harness itself: the rubric, the grader's
standing context, and the content priorities for the next cycle.

It never edits the harness directly. It writes a proposal that a human merges.

Run:
    python loop/improve.py                # needs ANTHROPIC_API_KEY
    python loop/improve.py --dry-run      # trend analysis only, no model call
"""
from __future__ import annotations

import argparse
import collections
import datetime as dt
import json
import os
import pathlib
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOOP = ROOT / "loop"
sys.path.insert(0, str(LOOP))

from audit import RUBRIC_WEIGHTS, call_model  # noqa: E402
MIN_RUNS = 3          # don't propose harness changes off a single bad day
RECURRENCE = 3        # a criterion must fail in this many runs to count as systemic

IMPROVER_SYSTEM = """You improve the harness of a website content-audit agent for GJH Inc.

You are given: the current rubric, and trend data showing which criteria keep failing across many runs.

A criterion that fails every single run is usually a harness problem, not a content problem — either the rubric is asking for something the site cannot express, the criterion is redundant with another, or the grader lacks the context needed to score it fairly. Say so plainly when that is what the data shows.

Propose the smallest change that would fix the recurring failure. Prefer amending the rubric or the grader's standing context over adding new criteria. Adding criteria is a last resort and must come with a weight and a reason the existing ones cannot cover it.

Never propose a change that would make the grader more lenient in order to raise scores. Score inflation is the failure mode this loop exists to prevent.

Respond with a single JSON object, no markdown fence:
{"diagnosis": str,
 "rubric_amendments": [{"section": str, "rationale": str, "replacement_text": str}],
 "grader_context_additions": [str],
 "content_priorities": [{"page": str, "action": str, "why": str}],
 "confidence": "low"|"medium"|"high"}"""


def load_history(path: pathlib.Path, include_dry: bool = False) -> list[dict]:
    if not path.exists():
        return []
    runs = []
    for line in path.read_text().splitlines():
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if rec.get("dry_run") and not include_dry:
            continue
        runs.append(rec)
    return runs


def trend(runs: list[dict]) -> dict:
    per_criterion = collections.defaultdict(list)
    fail_counts = collections.Counter()
    static_fails = collections.Counter()

    for run in runs:
        for page in run.get("pages", []):
            for crit, score in page.get("scores", {}).items():
                per_criterion[crit].append(score)
                if score < 3:
                    fail_counts[crit] += 1
            for f in page.get("static", {}).get("fails", []):
                static_fails[f.split(":")[0]] += 1

    means = {c: round(sum(v) / len(v), 2) for c, v in per_criterion.items() if v}
    first = [r["mean_overall"] for r in runs[:3] if r.get("mean_overall")]
    last = [r["mean_overall"] for r in runs[-3:] if r.get("mean_overall")]
    direction = 0.0
    if first and last:
        direction = round(sum(last) / len(last) - sum(first) / len(first), 2)

    return {
        "runs_analyzed": len(runs),
        "criterion_means": means,
        "recurring_failures": {c: n for c, n in fail_counts.items() if n >= RECURRENCE},
        "recurring_static_failures": dict(static_fails.most_common(8)),
        "movement": direction,
        "latest_mean": runs[-1].get("mean_overall") if runs else None,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--include-dry-runs", action="store_true", help="analyze dry-run traces too (testing)")
    args = ap.parse_args()

    cfg = yaml.safe_load((LOOP / "config.yaml").read_text())
    runs = load_history(ROOT / "history" / "scores.jsonl", include_dry=args.include_dry_runs)

    if len(runs) < MIN_RUNS:
        print(f"only {len(runs)} runs on record; need {MIN_RUNS} before proposing harness changes")
        emit({"has_proposal": "false", "runs": len(runs)})
        return 0

    t = trend(runs)
    print(json.dumps(t, indent=2))

    if not t["recurring_failures"] and t["movement"] >= 0:
        print("no systemic failure and trend is flat or improving; nothing to propose")
        emit({"has_proposal": "false", "runs": len(runs)})
        return 0

    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    out = ROOT / "reports" / f"{stamp}-harness-proposal.md"

    if args.dry_run:
        out.write_text(render(t, {"diagnosis": "DRY RUN — no model call", "rubric_amendments": [],
                                  "grader_context_additions": [], "content_priorities": [],
                                  "confidence": "low"}))
        print(f"proposal (stub): {out.relative_to(ROOT)}")
        emit({"has_proposal": "true", "proposal_path": str(out.relative_to(ROOT)), "runs": len(runs)})
        return 0

    prompt = (
        f"CURRENT RUBRIC\n{(LOOP / 'rubric.md').read_text()}\n\n"
        f"TREND DATA ACROSS {t['runs_analyzed']} RUNS\n{json.dumps(t, indent=2)}"
    )
    raw = call_model(cfg["models"]["improver"], IMPROVER_SYSTEM, prompt, max_tokens=6000)
    try:
        proposal = json.loads(raw.strip().strip("`"))
    except json.JSONDecodeError as exc:
        print(f"improver returned unparseable output: {exc}", file=sys.stderr)
        return 1

    out.write_text(render(t, proposal))
    print(f"proposal: {out.relative_to(ROOT)}")
    emit({"has_proposal": "true", "proposal_path": str(out.relative_to(ROOT)),
          "confidence": proposal.get("confidence", "low"), "runs": len(runs)})
    return 0


def emit(pairs: dict) -> None:
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if not gh_out:
        return
    with open(gh_out, "a") as fh:
        for k, v in pairs.items():
            fh.write(f"{k}={v}\n")


def render(t: dict, p: dict) -> str:
    lines = [
        f"# Harness change proposal — {dt.datetime.now(dt.timezone.utc):%Y-%m-%d}",
        "",
        "> Generated by `loop/improve.py`. **Nothing here is applied automatically.**",
        "> Merging this PR changes how every future audit is scored.",
        "",
        "## Trend",
        "",
        f"- Runs analyzed: {t['runs_analyzed']}",
        f"- Latest mean: {t['latest_mean']}",
        f"- Movement (last 3 vs first 3): {t['movement']:+}",
        "",
        "| Criterion | Mean | Weight | Runs failed |",
        "| --- | --- | --- | --- |",
    ]
    for crit, weight in RUBRIC_WEIGHTS.items():
        lines.append(
            f"| {crit} | {t['criterion_means'].get(crit, '—')} | {weight} | "
            f"{t['recurring_failures'].get(crit, 0)} |"
        )
    lines += ["", "## Diagnosis", "", p.get("diagnosis", "")]

    if p.get("rubric_amendments"):
        lines += ["", "## Proposed rubric amendments"]
        for a in p["rubric_amendments"]:
            lines += [
                "", f"### {a['section']}", "", f"_Why:_ {a['rationale']}", "",
                "```md", a["replacement_text"], "```",
            ]
    if p.get("grader_context_additions"):
        lines += ["", "## Proposed grader context additions"] + [f"- {c}" for c in p["grader_context_additions"]]
    if p.get("content_priorities"):
        lines += ["", "## Content priorities for next cycle", "", "| Page | Action | Why |", "| --- | --- | --- |"]
        for c in p["content_priorities"]:
            lines.append(f"| {c['page']} | {c['action']} | {c['why']} |")
    lines += ["", f"Confidence: **{p.get('confidence', 'low')}**", ""]
    return "\n".join(lines)


if __name__ == "__main__":
    sys.exit(main())
