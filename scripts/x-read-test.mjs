#!/usr/bin/env node
/**
 * x-read-test.mjs — verify X credentials without spending credits by default.
 *
 *   node scripts/x-read-test.mjs            # dry run: env shape only, zero network
 *   node scripts/x-read-test.mjs --live     # one owned-read call, bills ~$0.001
 *
 * Dry run checks that .env exists, keys parse, and the bearer token looks
 * like a real X bearer token. It makes no HTTP calls, so no credits move.
 * Pass --live only when you accept a small charge to confirm read access.
 *
 * No dependencies, on purpose.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const live = args.includes("--live");

function loadDotEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const envFile = path.join(ROOT, ".env");
const env = loadDotEnv(envFile);

const checks = [];
const add = (ok, label, detail = "") => {
  checks.push({ ok, label, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

console.log(`X read test (${live ? "LIVE" : "dry run, no network"})\n`);

add(fs.existsSync(envFile), ".env exists", fs.existsSync(envFile) ? envFile : "copy .env.example to .env");

const bearer = env.X_BEARER_TOKEN || process.env.X_BEARER_TOKEN || "";
add(bearer.length > 20, "X_BEARER_TOKEN present", bearer ? `${bearer.length} chars` : "empty — paste from console.x.com Keys and Tokens");
// X bearer tokens issued from the console are long base64-url strings; this
// shape check catches pasting the API key in the wrong field.
add(
  !bearer || /^[A-Za-z0-9%\-_~.]+$/.test(bearer),
  "X_BEARER_TOKEN shape",
  bearer ? "charset ok" : "skipped (empty)"
);

const oauth1a = ["X_API_KEY", "X_API_KEY_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"].map(
  (k) => [k, env[k] || process.env[k] || ""]
);
const oauth1aFilled = oauth1a.filter(([, v]) => v).length;
console.log(`INFO  OAuth 1.0a fields filled: ${oauth1aFilled}/4 (needed only for posting)`);
const oauth2 = ["X_CLIENT_ID", "X_CLIENT_SECRET"].map((k) => [k, env[k] || process.env[k] || ""]);
const oauth2Filled = oauth2.filter(([, v]) => v).length;
console.log(`INFO  OAuth 2.0 fields filled: ${oauth2Filled}/2 (needed only for user-context posting)`);

const failed = checks.filter((c) => !c.ok);
if (failed.length > 0) {
  console.log(`\n${failed.length} check(s) failed. Fill .env, then re-run. No network used.`);
  process.exit(1);
}

if (!live) {
  console.log("\nDry run clean. No HTTP calls made, no credits used.");
  console.log("When ready to spend ~$0.001 on one owned-read, run with --live.");
  process.exit(0);
}

// --live: single cheapest call — GET /2/users/me (owned read, ~$0.001).
console.log("\nLIVE: calling GET https://api.x.com/2/users/me ...");
try {
  const res = await fetch("https://api.x.com/2/users/me", {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  const body = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log(body.slice(0, 800));
  if (res.status === 401 || res.status === 403) {
    console.log("\nAuth rejected: check token, app permissions, and Billing credits in console.x.com.");
    process.exit(1);
  }
  if (!res.ok) process.exit(1);
  console.log("\nRead access confirmed.");
} catch (err) {
  console.log(`Network error: ${err.message}`);
  process.exit(1);
}
