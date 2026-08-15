#!/usr/bin/env python3
"""Content and relevancy audit loop for gjh-inc.com.

Loop 1: fetch each target page, extract rendered text, hand it to the model with tools-worth of context.
Loop 2: grade against loop/rubric.md, retry on malformed or incomplete output, fail closed.
Loop 4 input: append every run to history/scores.jsonl so trends are computable.

Run:
    python loop/audit.py                 # live, needs ANTHROPIC_API_KEY
    python loop/audit.py --dry-run       # fixtures + stub grader, no network, no tokens
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import time

import requests
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOOP = ROOT / "loop"


RUBRIC_WEIGHTS = {
    "problem_first": 1.0,
    "falsifiability": 1.5,
    "differentiation": 1.5,
    "buyer_fit": 1.0,
    "proof_density": 1.0,
    "machine_legibility": 1.0,
    "voice_discipline": 0.5,
}


# --------------------------------------------------------------------------
# Loop 1 — fetch
# --------------------------------------------------------------------------
def fetch(url: str, timeout: int = 25) -> str:
    resp = requests.get(
        url,
        timeout=timeout,
        headers={"User-Agent": "gjh-content-loop/1.0 (+https://gjh-inc.com)"},
    )
    resp.raise_for_status()
    return resp.text


def load_fixture(target_id: str) -> str:
    path = LOOP / "fixtures" / f"{target_id}.html"
    if not path.exists():
        raise FileNotFoundError(f"no fixture for '{target_id}' at {path}")
    return path.read_text(encoding="utf-8")


def rendered_text(html: str) -> str:
    """Only what a non-JS crawler can read. That is the point of the check."""
    html = re.sub(r"(?is)<(script|style|noscript)\b.*?</\1>", " ", html)
    text = re.sub(r"(?s)<[^>]+>", " ", html)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\s+", " ", text).strip()


# --------------------------------------------------------------------------
# Loop 2a — deterministic pre-grader (free, objective, trends cleanly)
# --------------------------------------------------------------------------
def static_check(html: str, cfg: dict) -> dict:
    rules = cfg["static_checks"]
    text = rendered_text(html)
    low = text.lower()
    words = len(text.split())

    banned = sorted({w for w in rules["banned_words"] if w.lower() in low})
    missing_signals = sorted({s for s in rules["required_signals"] if s.lower() not in low})

    findings = {
        "rendered_words": words,
        "has_title": bool(re.search(r"(?is)<title[^>]*>\s*\S", html)),
        "has_meta_description": bool(
            re.search(r'(?is)<meta[^>]+name=["\']description["\'][^>]+content=["\']\s*\S', html)
        ),
        "has_schema_org": "application/ld+json" in html.lower() or "schema.org" in html.lower(),
        "banned_words_found": banned,
        "missing_signals": missing_signals,
    }

    fails = []
    if words < rules["min_rendered_words"]:
        fails.append(f"only {words} server-rendered words (min {rules['min_rendered_words']})")
    if rules["require_title"] and not findings["has_title"]:
        fails.append("no <title>")
    if rules["require_meta_description"] and not findings["has_meta_description"]:
        fails.append("no meta description")
    if rules["require_schema_org"] and not findings["has_schema_org"]:
        fails.append("no schema.org JSON-LD")
    if banned:
        fails.append("banned vocabulary: " + ", ".join(banned))
    if missing_signals:
        fails.append("positioning signals absent: " + ", ".join(missing_signals))

    findings["fails"] = fails
    findings["passed"] = not fails
    return findings


# --------------------------------------------------------------------------
# Loop 2b — model grader
# --------------------------------------------------------------------------
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


def _extract_opencode_text(raw: str) -> str:
    """Pull every assistant text block out of `opencode run --format json` output."""
    parts = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue  # stray non-JSON log line — skip
        if ev.get("type") == "text":
            parts.append(ev.get("part", {}).get("text", ""))
    return "\n".join(parts).strip()


def call_model(model: str, system: str, prompt: str, max_tokens: int = 4000) -> str:
    """Drive the loop's model work through the headless opencode CLI.

    Replaces the Anthropic HTTP call with `opencode run` so the harness runs the
    same coding agent that works on the repo, pointed at a configured model
    (e.g. a free DeepSeek one) with no API key required.
    """
    cmd = [
        "opencode", "run",
        "-m", model,
        "--format", "json",
        "--pure",                # no external plugins in CI
        "--auto",                # don't block on permission prompts, headless
        f"{system}\n\n{prompt}",
    ]
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600,
            env={**os.environ,
                 "OPENCODE_DISABLE_PROJECT_CONFIG": "1",
                 "CI": "1"},
        )
    except FileNotFoundError:
        raise RuntimeError("opencode CLI is not installed (needs `npm i -g opencode-ai` or the install script)")
    if proc.returncode != 0:
        raise RuntimeError(f"opencode run failed ({proc.returncode}): {proc.stderr[-400:]}")
    return _extract_opencode_text(proc.stdout)


def parse_grade(raw: str) -> dict:
    raw = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    obj = json.loads(raw)
    missing = [k for k in RUBRIC_WEIGHTS if k not in obj.get("scores", {})]
    if missing:
        raise ValueError(f"grader omitted criteria: {missing}")
    for k, v in obj["scores"].items():
        if not isinstance(v, int) or not 0 <= v <= 5:
            raise ValueError(f"score for {k} out of range: {v!r}")
    for f in obj.get("failures", []):
        if obj["scores"].get(f.get("criterion"), 5) < 3 and not f.get("fix", "").strip():
            raise ValueError(f"criterion {f.get('criterion')} scored <3 with no fix text")
    return obj


def grade(page_text: str, target: dict, rubric: str, cfg: dict, static: dict) -> dict:
    """The verification loop: grade, validate, retry with the error fed back."""
    prompt = (
        f"RUBRIC\n{rubric}\n\n"
        f"PAGE INTENT\n{target['intent']}\n\n"
        f"DETERMINISTIC PRE-GRADER FINDINGS\n{json.dumps(static['fails'], indent=2)}\n\n"
        f"RENDERED PAGE TEXT (url: {target['url']})\n{page_text[:60000]}"
    )
    last_err = None
    for attempt in range(1, cfg["thresholds"]["max_grader_retries"] + 1):
        try:
            ask = prompt if attempt == 1 else (
                f"{prompt}\n\nYour previous response was rejected: {last_err}\n"
                "Return only the corrected JSON object."
            )
            return parse_grade(call_model(cfg["models"]["grader"], GRADER_SYSTEM, ask))
        except (json.JSONDecodeError, ValueError) as exc:
            last_err = str(exc)
            print(f"  grader attempt {attempt} rejected: {last_err}", file=sys.stderr)
            time.sleep(2 * attempt)
    raise RuntimeError(f"grader failed after {cfg['thresholds']['max_grader_retries']} attempts: {last_err}")


def stub_grade(static: dict, target: dict) -> dict:
    """Dry-run grader. Exercises the whole pipeline without tokens."""
    penalty = min(len(static["fails"]), 4)
    base = max(0, 5 - penalty)
    return {
        "scores": {k: base for k in RUBRIC_WEIGHTS},
        "failures": [
            {"criterion": "differentiation", "evidence": "stub run", "fix": "STUB — no model called"}
        ] if base < 3 else [],
        "relevancy_gaps": ["stub run — no competitor comparison performed"],
        "summary": f"Dry run for {target['id']}; {len(static['fails'])} static failures.",
    }


def weighted(scores: dict) -> float:
    total = sum(RUBRIC_WEIGHTS.values())
    return round(sum(scores[k] * w for k, w in RUBRIC_WEIGHTS.items()) / total, 2)


def rubric_hash(rubric_text: str) -> str:
    """Hash of the rubric. A trend line that crosses a rubric change is two trend lines."""
    return hashlib.sha256(rubric_text.encode()).hexdigest()[:12]


# --------------------------------------------------------------------------
# Orchestration
# --------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="fixtures + stub grader, no network or tokens")
    ap.add_argument("--config", default=str(LOOP / "config.yaml"))
    args = ap.parse_args()

    cfg = yaml.safe_load(pathlib.Path(args.config).read_text())
    rubric_text = (LOOP / "rubric.md").read_text()
    rhash = rubric_hash(rubric_text)
    run_id = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    results = []

    for target in cfg["targets"]:
        print(f"[{target['id']}] {target['url']}")
        try:
            html = load_fixture(target["id"]) if args.dry_run else fetch(target["url"])
        except Exception as exc:
            print(f"  fetch failed: {exc}", file=sys.stderr)
            results.append({"id": target["id"], "url": target["url"], "error": str(exc)})
            continue

        static = static_check(html, cfg)
        print(f"  static: {'pass' if static['passed'] else 'FAIL — ' + '; '.join(static['fails'])}")

        text = rendered_text(html)
        model_grade = stub_grade(static, target) if args.dry_run else grade(text, target, rubric_text, cfg, static)
        overall = weighted(model_grade["scores"])
        print(f"  overall: {overall}")

        results.append({
            "id": target["id"],
            "url": target["url"],
            "overall": overall,
            "static": static,
            **model_grade,
        })

    ok = [r for r in results if "overall" in r]
    run = {
        "run_id": run_id,
        "dry_run": args.dry_run,
        "rubric_hash": rhash,
        "mean_overall": round(sum(r["overall"] for r in ok) / len(ok), 2) if ok else None,
        "pages": results,
    }

    hist = ROOT / "history" / "scores.jsonl"
    hist.parent.mkdir(exist_ok=True)
    with hist.open("a") as fh:
        fh.write(json.dumps(run) + "\n")

    report_path = ROOT / "reports" / f"{run_id[:10]}-audit.md"
    report_path.parent.mkdir(exist_ok=True)
    report_path.write_text(render_report(run, cfg))
    print(f"\nreport: {report_path.relative_to(ROOT)}")

    # Emit signals the workflow branches on.
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        prev = previous_mean(hist, run_id)
        delta = round(run["mean_overall"] - prev, 2) if (prev and run["mean_overall"]) else 0.0
        th = cfg["thresholds"]
        status = "ok"
        if run["mean_overall"] is not None and run["mean_overall"] < th["fail_below"]:
            status = "below_threshold"
        elif delta <= -th["regression_delta"]:
            status = "regression"
        with open(gh_out, "a") as fh:
            fh.write(f"mean_overall={run['mean_overall']}\n")
            fh.write(f"delta={delta}\n")
            fh.write(f"status={status}\n")
            fh.write(f"report_path={report_path.relative_to(ROOT)}\n")

    return 0


def previous_mean(hist_path: pathlib.Path, current_run_id: str):
    means = []
    for line in hist_path.read_text().splitlines():
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if rec.get("run_id") != current_run_id and not rec.get("dry_run") and rec.get("mean_overall"):
            means.append(rec["mean_overall"])
    return means[-1] if means else None


def render_report(run: dict, cfg: dict) -> str:
    lines = [
        f"# Content loop audit — {run['run_id']}",
        "",
        f"Site: {cfg['site']}  |  Mean score: **{run['mean_overall']}**  |  Dry run: {run['dry_run']}",
        "",
        "| Page | Overall | Static | Top failure |",
        "| --- | --- | --- | --- |",
    ]
    for p in run["pages"]:
        if "error" in p:
            lines.append(f"| {p['id']} | — | fetch error | {p['error'][:60]} |")
            continue
        top = p["failures"][0]["criterion"] if p.get("failures") else "—"
        lines.append(
            f"| {p['id']} | {p['overall']} | {'pass' if p['static']['passed'] else 'fail'} | {top} |"
        )
    for p in run["pages"]:
        if "error" in p:
            continue
        lines += ["", f"## {p['id']} — {p['url']}", "", p.get("summary", "")]
        if not p["static"]["passed"]:
            lines += ["", "**Deterministic failures**"] + [f"- {f}" for f in p["static"]["fails"]]
        if p.get("failures"):
            lines += ["", "**Rubric failures**"]
            for f in p["failures"]:
                lines += [
                    f"- **{f['criterion']}** — {f['evidence']}",
                    f"  - Fix: {f['fix']}",
                ]
        if p.get("relevancy_gaps"):
            lines += ["", "**Relevancy gaps**"] + [f"- {g}" for g in p["relevancy_gaps"]]
    lines += ["", "---", "", "Generated by `loop/audit.py`. Human review required before any copy change merges."]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    sys.exit(main())
