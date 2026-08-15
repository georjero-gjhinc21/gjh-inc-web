#!/usr/bin/env node
/**
 * check-claims.mjs — the deterministic evidence gate for gjh-inc.com.
 *
 * This runs before any model does. Everything a regex can decide, a regex
 * decides, for free, in about two seconds, identically every time. The model
 * loops downstream are then only asked to judge things that need judgement.
 *
 * Exit 0 = clean. Exit 1 = at least one failure. Warnings never fail the build
 * but are counted, and the weekly review trends the count.
 *
 *   node scripts/check-claims.mjs
 *   node scripts/check-claims.mjs --json
 *   node scripts/check-claims.mjs --changed "content/insights/a.md,src/lib/x.ts"
 *
 * No dependencies, on purpose. A gate with a supply chain is a gate that can be
 * broken by a dependency update.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/claims.config.json"), "utf8")
);

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const changedArg = args.find((a) => a.startsWith("--changed"));
const changedPaths = changedArg
  ? (changedArg.split("=")[1] ?? args[args.indexOf(changedArg) + 1] ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

const findings = [];
const add = (level, file, line, rule, message, fix) =>
  findings.push({ level, file, line, rule, message, fix });

// ---------------------------------------------------------------------------
// tiny helpers — no yaml/glob dependency
// ---------------------------------------------------------------------------

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

const rel = (f) => path.relative(ROOT, f).replaceAll("\\", "/");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/** Front matter: the flat `key: value` and `key:\n  - item` subset we use. */
function frontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return { data: {}, body: text, raw: "" };
  const data = {};
  let currentList = null;
  for (const raw of m[1].split(/\r?\n/)) {
    const listItem = /^\s+-\s+(.*)$/.exec(raw);
    if (listItem && currentList) {
      data[currentList].push(unquote(listItem[1]));
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(raw);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === "") {
      data[key] = [];
      currentList = key;
    } else {
      data[key] = unquote(value);
      currentList = null;
    }
  }
  return { data, body: text.slice(m[0].length), raw: m[1] };
}

const unquote = (s) => s.trim().replace(/^["'](.*)["']$/, "$1");

/** Ledger: a list of `- id: … status: …` blocks. Narrow parser, narrow file. */
function readLedger(file) {
  if (!fs.existsSync(file)) return {};
  const entries = {};
  let current = null;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*#/.test(raw) || raw.trim() === "") continue;
    const start = /^\s*-\s+id:\s*(.+)$/.exec(raw);
    if (start) {
      current = unquote(start[1]);
      entries[current] = { id: current };
      continue;
    }
    const kv = /^\s+([A-Za-z_][\w-]*):\s*(.+)$/.exec(raw);
    if (kv && current) entries[current][kv[1]] = unquote(kv[2]);
  }
  return entries;
}

/** Prose only. Masked, not deleted, so reported line numbers match the file. */
const blank = (m) => m.replace(/[^\n]/g, " ");
function prose(text) {
  return text
    .replace(/^---[\s\S]*?\n---/, blank)
    .replace(/```[\s\S]*?```/g, blank)
    .replace(/`[^`\n]*`/g, blank)
    .replace(/https?:\/\/\S+/g, blank)
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, (m, label, url) => `[${label}]` + blank(`(${url})`));
}

/** Front matter carries published copy too — titles and summaries are prose. */
function publishedFrontMatterText(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return "";
  return m[1]
    .split(/\r?\n/)
    .map((l) => (/^\s*(title|summary|topic):/.test(l) ? l : ""))
    .join("\n");
}

// ---------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------

const LEDGER = readLedger(path.join(ROOT, "content/editorial/ledger.yaml"));

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Match a banned or forbidden term as a whole word, including its ordinary
 * inflections. Config lists literals, not regexes — a rule file people edit
 * should not require them to be right about backslashes.
 *
 * `\b` only anchors next to a word character, so terms like "8(a)" need
 * explicit lookarounds.
 */
function termRe(term, flags = "gi") {
  let body = escape(term);
  if (/[a-z]$/i.test(term)) {
    body = /e$/i.test(term)
      ? `${escape(term)}(?:s|d)?|${escape(term.slice(0, -1))}(?:ing)?`
      : `${body}(?:s|es|ed|ing)?`;
  }
  const lead = /^\w/.test(term) ? "\\b" : "(?<![\\w])";
  const tail = /[\w)]$/.test(term) ? "(?![\\w])" : "(?![\\w])";
  return new RegExp(`${lead}(?:${body})${tail}`, flags);
}

/** R1 — banned vocabulary. */
function bannedVocabulary(file, text) {
  const scan = prose(text);
  for (const word of CONFIG.bannedWords) {
    const re = termRe(word);
    let m;
    while ((m = re.exec(scan))) {
      add(
        "error",
        rel(file),
        lineOf(scan, m.index),
        "banned-vocabulary",
        `"${m[0]}" is on the banned list`,
        "Say the specific thing instead. If the sentence dies without the word, the sentence had no content."
      );
    }
  }
}

/** R1b — title, summary and topic are published copy and get the same rules. */
function frontMatterCopy(file, fmText) {
  if (!fmText.trim()) return;
  for (const word of CONFIG.bannedWords) {
    const m = termRe(word).exec(fmText);
    if (m) add("error", rel(file), 1, "banned-vocabulary",
      `"${m[0]}" is on the banned list, in the front matter`,
      "Titles and summaries are the most-quoted copy on the site. They get the strictest reading, not the loosest.");
  }
  for (const pattern of CONFIG.tenureContradictions) {
    const m = new RegExp(pattern, "i").exec(fmText);
    if (m) add("error", rel(file), 1, "tenure-contradiction",
      `"${m[0].trim()}" in the front matter contradicts a ${CONFIG.foundedYear} founding date`, "");
  }
}

/** R2 — one canonical email address, everywhere. */
function canonicalEmail(file, text) {
  const re = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  let m;
  while ((m = re.exec(text))) {
    const found = m[0].toLowerCase();
    if (found === CONFIG.canonicalEmail) continue;
    if (CONFIG.allowedEmails.includes(found)) continue;
    add(
      "error",
      rel(file),
      lineOf(text, m.index),
      "email-divergence",
      `${m[0]} is not the canonical address`,
      `Use ${CONFIG.canonicalEmail}, imported from src/lib/site.ts rather than typed.`
    );
  }
}

/** R3 — tenure claims must agree with the founding date. */
function tenureConsistency(file, text) {
  const scan = prose(text);
  for (const pattern of CONFIG.tenureContradictions) {
    const re = new RegExp(pattern, "gi");
    let m;
    while ((m = re.exec(scan))) {
      add(
        "error",
        rel(file),
        lineOf(scan, m.index),
        "tenure-contradiction",
        `"${m[0].trim()}" contradicts a ${CONFIG.foundedYear} founding date`,
        `Write "consulting since ${CONFIG.foundedYear}" or state the real number of years.`
      );
    }
  }
}

/** R4 — regulated claims nobody has documentation for. */
function undocumentedCredentials(file, text) {
  const scan = prose(text);
  for (const term of CONFIG.forbiddenCredentialTerms) {
    const re = termRe(term);
    let m;
    while ((m = re.exec(scan))) {
      add(
        "error",
        rel(file),
        lineOf(scan, m.index),
        "undocumented-credential",
        `"${m[0]}" is a credential or identifier claim with no documentation on file`,
        "Move it to content/TODO-CLIENT-INPUT.md until an award letter or registration exists. Publishing an unverified set-aside status is a compliance exposure, not an SEO decision."
      );
    }
  }
}

/** R5 — numbers that function as claims need an evidence anchor. */
function anchoredNumbers(file, text, fm) {
  if (fm.claims === "illustrative") return;
  // Only a resolvable, approved anchor licenses a number. An id that is
  // missing or still awaiting approval anchors nothing.
  const anchored =
    Array.isArray(fm.evidence) &&
    fm.evidence.some((id) => LEDGER[id] && LEDGER[id].status === "published");
  const scan = prose(text);
  const units = CONFIG.claimUnits.join("|");
  const patterns = [
    { re: /\b\d+(?:\.\d+)?\s?%/g, kind: "a percentage" },
    { re: /[$£€]\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|bn|million|billion)?/gi, kind: "a currency figure" },
    { re: new RegExp(`\\b\\d{1,4}\\s+(?:${units})\\b`, "gi"), kind: "a counted claim" },
    { re: new RegExp(`\\b(?:${CONFIG.spelledNumbers.join("|")})\\s+(?:${units})\\b`, "gi"), kind: "a counted claim" },
  ];
  for (const { re, kind } of patterns) {
    let m;
    while ((m = re.exec(scan))) {
      const context = scan.slice(Math.max(0, m.index - 140), m.index + 60);
      if (CONFIG.hedgeMarkers.some((h) => context.toLowerCase().includes(h))) continue;
      if (anchored) continue;
      add(
        "error",
        rel(file),
        lineOf(scan, m.index),
        "unanchored-number",
        `"${m[0].trim()}" reads as ${kind} with no evidence anchor`,
        "Add an `evidence:` list to the front matter pointing at ids in content/editorial/ledger.yaml, or set `claims: illustrative` if the figure is a worked example rather than a result."
      );
    }
  }
}

/** R6 — evidence anchors must exist and be approved for publication. */
function evidenceAnchors(file, fm) {
  if (!Array.isArray(fm.evidence)) return;
  for (const id of fm.evidence) {
    const entry = LEDGER[id];
    if (!entry) {
      add("error", rel(file), 1, "missing-evidence", `evidence id "${id}" is not in the ledger`,
        "Add the entry to content/editorial/ledger.yaml with its source, or remove the claim it supports.");
      continue;
    }
    if (entry.status !== "published") {
      add("error", rel(file), 1, "unapproved-evidence",
        `evidence "${id}" has status "${entry.status ?? "unset"}"`,
        "Only `published` evidence may appear on the public site. Get written client approval, or generalise the claim until no client is identifiable.");
    }
    if (!entry.source) {
      add("warn", rel(file), 1, "sourceless-evidence", `evidence "${id}" has no source field`,
        "Every ledger entry needs a source a stranger could check.");
    }
  }
}

/** R7 — front matter schema. */
function frontMatterSchema(file, fm) {
  if (!rel(file).startsWith("content/insights/") && !rel(file).startsWith("content/examples/")) return;
  for (const key of CONFIG.requiredFrontMatter) {
    if (!fm[key]) add("error", rel(file), 1, "front-matter", `missing required key "${key}"`, "See README § Publishing an article.");
  }
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(fm.date))
    add("error", rel(file), 1, "front-matter", `date "${fm.date}" is not YYYY-MM-DD`, "");
  if (typeof fm.summary === "string" && fm.summary.length < 40)
    add("error", rel(file), 1, "front-matter",
      `summary is ${fm.summary.length} chars — too short to be a sentence a stranger could repeat`, "");
  if (typeof fm.summary === "string" && fm.summary.length > CONFIG.maxSummaryChars)
    add("error", rel(file), 1, "front-matter",
      `summary is ${fm.summary.length} chars (max ${CONFIG.maxSummaryChars})`,
      "One sentence a stranger could repeat accurately.");
  if (typeof fm.title === "string" && /^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z]/.test(fm.title))
    add("warn", rel(file), 1, "title-case", `"${fm.title}" looks like Title Case`, "Sentence case throughout.");
}

/** R8 — the staged ship rule: unpublished sectors must not render. */
function stagedSectorRule() {
  const pages = [
    "src/app/sectors/page.tsx",
    "src/app/page.tsx",
    "src/app/sitemap.ts",
  ].map((p) => path.join(ROOT, p)).filter(fs.existsSync);

  for (const page of pages) {
    const text = fs.readFileSync(page, "utf8");
    if (!/from\s+["']@\/lib\/sectors["']/.test(text)) continue;
    const iteratesAll = /\bsectors\s*\.\s*map\b/.test(text);
    const usesPublished = /\bpublishedSectors\s*\(/.test(text);
    if (iteratesAll && !usesPublished) {
      add("error", rel(page), lineOf(text, text.search(/\bsectors\s*\.\s*map\b/)),
        "staged-ship-rule",
        "renders every sector, including ones whose evidence is still `needs-approval`",
        "Map over `publishedSectors()`. The ship rule exists so the site never claims a sector it cannot evidence — a rule that is documented but not enforced is a rule that is not in force.");
    }
  }
}

/** R9 — the denylist, when running against a change set. */
function denylistCheck(paths) {
  const gate = fs.readFileSync(path.join(ROOT, "gate.yaml"), "utf8");
  const patterns = [];
  let inDeny = false;
  for (const raw of gate.split(/\r?\n/)) {
    if (/^denylist:/.test(raw)) { inDeny = true; continue; }
    if (/^\w/.test(raw)) inDeny = false;
    const item = /^\s*-\s*["']?(.+?)["']?\s*$/.exec(raw);
    if (inDeny && item) patterns.push(item[1]);
  }
  const toRe = (glob) =>
    new RegExp("^" + glob
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*\//g, "(?:.*/)?")
      .replace(/\*\*/g, ".*")
      .replace(/\*/g, "[^/]*")
      .replace(/\?/g, "[^/]") + "$");
  for (const p of paths) {
    if (patterns.some((g) => toRe(g).test(p))) {
      add("error", p, 1, "denylist",
        "an unattended run may not modify this path",
        "gate.yaml lists it. If the change is genuinely needed, a person opens that PR.");
    }
  }
  if (paths.length > 12)
    add("error", "(changeset)", 1, "max-files",
      `${paths.length} files changed (max 12)`,
      "Split it. A PR this size gets approved rather than reviewed.");
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

const contentFiles = walk(path.join(ROOT, "content"), [".md", ".mdx"]);
const sourceFiles = walk(path.join(ROOT, "src"), [".ts", ".tsx"]);

for (const file of contentFiles) {
  if (CONFIG.exemptPaths.some((p) => rel(file).startsWith(p))) continue;
  const text = fs.readFileSync(file, "utf8");
  const { data: fm } = frontMatter(text);
  const fmText = publishedFrontMatterText(text);
  bannedVocabulary(file, text);
  canonicalEmail(file, text);
  tenureConsistency(file, text);
  frontMatterCopy(file, fmText);
  undocumentedCredentials(file, text);
  anchoredNumbers(file, text, fm);
  evidenceAnchors(file, fm);
  frontMatterSchema(file, fm);
}

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  // Only string literals — variable names and comments are not published copy.
  const literals = text.match(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g)?.join("\n") ?? "";
  bannedVocabulary(file, literals);
  tenureConsistency(file, literals);
  undocumentedCredentials(file, literals);
  canonicalEmail(file, text);
}

stagedSectorRule();
if (changedPaths) denylistCheck(changedPaths);

const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

if (asJson) {
  console.log(JSON.stringify({ errors: errors.length, warnings: warnings.length, findings }, null, 2));
} else {
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, items] of byFile) {
    console.log(`\n${file}`);
    for (const i of items) {
      const tag = i.level === "error" ? "FAIL" : "warn";
      console.log(`  ${tag}  ${i.file}:${i.line}  [${i.rule}] ${i.message}`);
      if (i.fix) console.log(`        → ${i.fix}`);
    }
  }
  console.log(
    `\n${errors.length} error${errors.length === 1 ? "" : "s"}, ` +
    `${warnings.length} warning${warnings.length === 1 ? "" : "s"} ` +
    `across ${contentFiles.length + sourceFiles.length} files.`
  );
  if (errors.length === 0) console.log("Evidence gate: pass.");
}

process.exit(errors.length > 0 ? 1 : 0);
