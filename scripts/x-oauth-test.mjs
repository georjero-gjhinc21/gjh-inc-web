#!/usr/bin/env node
/**
 * x-oauth-test.mjs — verify OAuth 1.0a and OAuth 2.0 without surprise bills.
 *
 *   node scripts/x-oauth-test.mjs --check
 *     shape checks only, zero network, zero credits
 *
 *   node scripts/x-oauth-test.mjs --oauth1a-live
 *     one signed GET /2/users/me (~$0.001 owned read)
 *
 *   node scripts/x-oauth-test.mjs --oauth2-url [--callback URL]
 *     prints the authorize URL + PKCE verifier, zero network, zero credits
 *
 *   node scripts/x-oauth-test.mjs --oauth2-exchange CODE --verifier V [--callback URL]
 *     exchanges CODE for a user token (free), then one GET /2/users/me (~$0.001)
 *
 * No dependencies, on purpose. Secrets are never printed.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const get = (flag, fallback = null) => {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  return args[i + 1] ?? fallback;
};

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

const env = loadDotEnv(path.join(ROOT, ".env"));
const v = (k) => env[k] || process.env[k] || "";
const DEFAULT_CALLBACK = "https://gjh-inc.com/api/x/callback";

// RFC 3986 encoding (encodeURIComponent leaves ! ' ( ) * unescaped).
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function oauth1aHeader({ apiKey, apiSecret, accessToken, accessSecret, method, baseUrl }) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${enc(k)}=${enc(params[k])}`)
    .join("&");
  const base = `${method.toUpperCase()}&${enc(baseUrl)}&${enc(sorted)}`;
  const key = `${enc(apiSecret)}&${enc(accessSecret)}`;
  const sig = crypto.createHmac("sha1", key).update(base).digest("base64");
  const headerParams = { ...params, oauth_signature: sig };
  return (
    "OAuth " +
    Object.keys(headerParams)
      .sort()
      .map((k) => `${enc(k)}="${enc(headerParams[k])}"`)
      .join(", ")
  );
}

if (args.includes("--check")) {
  let fail = 0;
  const check = (ok, label) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
    if (!ok) fail++;
  };
  check(v("X_API_KEY").length > 5, "X_API_KEY present");
  check(v("X_API_KEY_SECRET").length > 10, "X_API_KEY_SECRET present");
  check(v("X_ACCESS_TOKEN").length > 10, "X_ACCESS_TOKEN present");
  check(v("X_ACCESS_TOKEN_SECRET").length > 10, "X_ACCESS_TOKEN_SECRET present");
  check(v("X_CLIENT_ID").length > 5, "X_CLIENT_ID present");
  check(v("X_CLIENT_SECRET").length > 5, "X_CLIENT_SECRET present");
  console.log(fail ? `\n${fail} missing. Fill .env. No network used.` : "\nAll OAuth fields present. No network used.");
  process.exit(fail ? 1 : 0);
}

if (args.includes("--oauth1a-live")) {
  const apiKey = v("X_API_KEY");
  const apiSecret = v("X_API_KEY_SECRET");
  const accessToken = v("X_ACCESS_TOKEN");
  const accessSecret = v("X_ACCESS_TOKEN_SECRET");
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.log("FAIL  OAuth 1.0a needs all four fields in .env. No network used.");
    process.exit(1);
  }
  const url = "https://api.x.com/2/users/me";
  const auth = oauth1aHeader({ apiKey, apiSecret, accessToken, accessSecret, method: "GET", baseUrl: url });
  console.log("LIVE OAuth 1.0a: GET /2/users/me ...");
  const res = await fetch(url, { headers: { Authorization: auth } });
  const body = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log(body.slice(0, 800));
  if (res.status === 401 || res.status === 403) {
    console.log("\nRejected: check app permissions are Read and Write, tokens match the app, and Billing has credits.");
    process.exit(1);
  }
  process.exit(res.ok ? 0 : 1);
}

if (args.includes("--oauth2-url")) {
  const clientId = v("X_CLIENT_ID");
  if (!clientId) {
    console.log("FAIL  X_CLIENT_ID missing in .env. No network used.");
    process.exit(1);
  }
  const callback = get("--callback", DEFAULT_CALLBACK);
  const verifier = b64url(crypto.randomBytes(48)); // 64 chars
  const challenge = b64url(crypto.createHash("sha256").update(verifier).digest());
  const state = b64url(crypto.randomBytes(16));
  const scope = "tweet.read users.read offline.access";
  const url =
    `https://x.com/i/oauth2/authorize?response_type=code&client_id=${enc(clientId)}` +
    `&redirect_uri=${enc(callback)}&scope=${enc(scope)}&state=${enc(state)}` +
    `&code_challenge=${enc(challenge)}&code_challenge_method=S256`;
  console.log("Open this URL in the browser signed in as @gjhinc21:\n");
  console.log(url);
  console.log(`\nCALLBACK must match console.x.com exactly (used here: ${callback})`);
  console.log(`\nSave this verifier (needed for --oauth2-exchange, keep private):\n${verifier}`);
  console.log(`\nSTATE (CSRF check): ${state}`);
  console.log("\nZero network used, zero credits used.");
  process.exit(0);
}

if (args.includes("--oauth2-exchange")) {
  const code = get("--oauth2-exchange", "");
  const verifier = get("--verifier", "");
  const callback = get("--callback", DEFAULT_CALLBACK);
  const clientId = v("X_CLIENT_ID");
  const clientSecret = v("X_CLIENT_SECRET");
  if (!code || !verifier || !clientId || !clientSecret) {
    console.log("Usage: node scripts/x-oauth-test.mjs --oauth2-exchange CODE --verifier VERIFIER [--callback URL]");
    console.log("CODE comes from the ?code= param after approving the --oauth2-url page. No network used yet.");
    process.exit(1);
  }
  console.log("Exchanging code for user token (token exchange itself is free) ...");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${basic}` },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callback,
      code_verifier: verifier,
    }).toString(),
  });
  const tokenBody = await tokenRes.text();
  console.log(`Token HTTP ${tokenRes.status}`);
  if (!tokenRes.ok) {
    console.log(tokenBody.slice(0, 800));
    console.log("\nExchange failed: code expired (one use, ~30s window), wrong callback, or wrong verifier.");
    process.exit(1);
  }
  const { access_token: userToken } = JSON.parse(tokenBody);
  if (!userToken) {
    console.log("No access_token in response.");
    process.exit(1);
  }
  console.log("Exchange ok. Calling GET /2/users/me with user token (~$0.001) ...");
  const me = await fetch("https://api.x.com/2/users/me", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`HTTP ${me.status}`);
  console.log((await me.text()).slice(0, 800));
  console.log("\nStore the user token + refresh_token server-side; access tokens expire in ~2h.");
  process.exit(me.ok ? 0 : 1);
}

console.log(`Usage:
  node scripts/x-oauth-test.mjs --check
  node scripts/x-oauth-test.mjs --oauth1a-live
  node scripts/x-oauth-test.mjs --oauth2-url [--callback URL]
  node scripts/x-oauth-test.mjs --oauth2-exchange CODE --verifier VERIFIER [--callback URL]`);
process.exit(1);
