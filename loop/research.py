#!/usr/bin/env python3
"""Loop 5 — market research agent.

Fetches the live site and the configured competitors, and produces a
market-alignment report: positioning gaps, differentiation, and buyer-language
drift. The report is saved to reports/ and its top items are fed back into the
daily audit's grader context so the site copy is judged against the market, not
in a vacuum.

The agent is a plain sequential pipeline:
  fetch_all  ->  fetch each URL (with a fixture fallback for dry runs)
  analyze    ->  one model call per page, structured reply, retried on malformed
  render     ->  merge per-page findings into a ranked market-alignment report

It never edits the site. It writes a report a human reads. The config decides
the model via loop/llm.py, so it runs on the free opencode route in CI.

Run:
    python loop/research.py                # live
    python loop/research.py --dry-run      # fixtures + stub analyzer
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import sys
import re

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOOP = ROOT / "loop"
sys.path.insert(0, str(LOOP))

from llm import ModelError, call_model  # noqa: E402
from audit import rendered_text, load_fixture, fetch  # noqa: E402

MIN_ITERATIONS = 1            # fetch each URL at least once
MAX_ITERATIONS = 3            # retry cap on a malformed analyzer reply

RESEARCH_SYSTEM = """You are the market-research agent for GJH Inc. (gjh-inc.com), an independent AI/data consultancy founded in 2009, partnered with Anthropic, Google, AWS, Databricks, and Snowflake.

You compare GJH's positioning against competitor homepages. You are an analyst, not a copywriter: your output identifies where the market is and where GJH stands relative to it.

Ground rules:
- Never assert a GJH metric, client, certification, or contract that is not in the page text you are given.
- A positioning gap is a claim a competitor makes that GJH does not address; a differentiation item is a GJH claim a competitor is unlikely to match (advisory-before-building, paid one-workflow assessment, senior people doing the work, client owns everything).
- Keep every finding concrete enough that an editor can act on it.

Reply with a single JSON object, no markdown fence:
{"page": str,
 "positioning_gaps": [{"gap": str, "competitor_evidence": str, "why_it_matters": str}],
 "differentiators": [{"claim": str, "why_defensible": str}],
 "buyer_language_drift": [{"term": str, "who_uses_it": str, "suggested_usage": str}],
 "overall_note": str}"""


def analyze_page(site_text: str, competitor_texts: dict, target: dict, cfg: dict) -> dict:
    """One structured call comparing one GJH page against competitors."""
    prompt = (
        f"GJH PAGE INTENT\n{target['intent']}\n\n"
        f"GJH PAGE TEXT (url: {target['url']})\n{site_text[:40000]}\n\n"
        f"COMPETITOR PAGES\n"
        + "\n".join(
            f"--- {name} ({url}) ---\n{text[:20000]}"
            for name, (url, text) in competitor_texts.items()
        )
        or "no competitor text available"
    )
    last_err = None
    for attempt in range(1, MAX_ITERATIONS + 1):
        ask = prompt if attempt == 1 else f"{prompt}\n\nYour previous reply was rejected: {last_err}\nReturn only corrected JSON."
        raw = call_model("researcher", RESEARCH_SYSTEM, ask, cfg)
        try:
            obj = json.loads(raw.strip().strip("`"))
            obj.setdefault("positioning_gaps", [])
            obj.setdefault("differentiators", [])
            obj.setdefault("buyer_language_drift", [])
            return obj
        except json.JSONDecodeError as exc:
            last_err = str(exc)
            print(f"  analyzer attempt {attempt} unparseable: {exc}", file=sys.stderr)
    raise ModelError(f"analyzer failed after {MAX_ITERATIONS} attempts: {last_err}")


def stub_analyze(target: dict) -> dict:
    return {
        "page": target["url"],
        "positioning_gaps": [{"gap": "stub run", "competitor_evidence": "no model called", "why_it_matters": ""}],
        "differentiators": [{"claim": "stub", "why_defensible": "stub run"}],
        "buyer_language_drift": [],
        "overall_note": f"Dry run for {target['id']}; no competitor comparison performed.",
    }


def iter_pages(urls: dict, dry_run: bool) -> dict:
    """Fetch every URL once (with fixture fallback on dry/open failures)."""
    out = {}
    for name, url in urls.items():
        try:
            html = load_fixture(name) if dry_run else fetch(url)
        except Exception:
            html = load_fixture(name) if not dry_run else None
        if html and html != "NO_FIXTURE":
            out[name] = {"url": url, "text": rendered_text(html)}
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--config", default=str(LOOP / "config.yaml"))
    args = ap.parse_args()

    cfg = yaml.safe_load(pathlib.Path(args.config).read_text())
    targets = {t["id"]: t for t in cfg["targets"]}
    competitor_urls = {
        re.sub(r"https?://|\W+", "", c).strip()[:24] or f"c{i}": c
        for i, c in enumerate(cfg.get("competitors", []))
    }

    # The whole site is targets; competitors are fetched once, shared.
    all_urls = {**{t["id"]: t["url"] for t in targets.values()}, **competitor_urls}
    pages = iter_pages(all_urls, args.dry_run)

    findings = []
    for tid, target in targets.items():
        site_text = pages.get(tid, {}).get("text", "")
        if not site_text:
            print(f"[{tid}] no page text; skipping", file=sys.stderr)
            continue
        competitors = {n: (p["url"], p["text"]) for n, p in pages.items() if n in competitor_urls}
        finding = stub_analyze(target) if args.dry_run else analyze_page(site_text, competitors, target, cfg)
        finding["target_id"] = tid
        findings.append(finding)
        print(f"[{tid}] {'stub ' if args.dry_run else ''}research done — {len(finding['positioning_gaps'])} gaps")

    stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d")
    report_path = ROOT / "reports" / f"{stamp}-market-alignment.md"
    report_path.parent.mkdir(exist_ok=True)
    report_path.write_text(render_report(findings, cfg, args.dry_run))
    print(f"\nreport: {report_path.relative_to(ROOT)}")
    return 0


def render_report(findings: list, cfg: dict, dry_run: bool) -> str:
    lines = [
        "# Market alignment report",
        "",
        f"Site: {cfg['site']}  |  Generated: {dt.datetime.now(dt.timezone.utc):%Y-%m-%d}  |  Dry run: {dry_run}",
        "",
        "> Generated by `loop/research.py`. **Nothing here is applied automatically.**",
        "> Feeds the daily audit's grader context via `loop/audit.py --with-market`.",
        "",
    ]
    for f in findings:
        lines += [f"## {f['target_id']}", f"URL: {f.get('page', '—')}", "", f.get("overall_note", "")]
        if f.get("positioning_gaps"):
            lines += ["", "### Positioning gaps"]
            for g in f["positioning_gaps"]:
                lines += [
                    f"- **{g.get('gap')}** — {g.get('competitor_evidence', '')}",
                    f"  - Why it matters: {g.get('why_it_matters', '')}",
                ]
        if f.get("differentiators"):
            lines += ["", "### Differentiators GJH can stand on"]
            for d in f["differentiators"]:
                lines += [f"- **{d.get('claim')}** — {d.get('why_defensible', '')}"]
        if f.get("buyer_language_drift"):
            lines += ["", "### Buyer-language drift"]
            for b in f["buyer_language_drift"]:
                lines += [
                    f"- `{b.get('term')}` — used by {b.get('who_uses_it', '?')}; suggested: {b.get('suggested_usage', '')}"
                ]
        lines += ["", "---", ""]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    sys.exit(main())