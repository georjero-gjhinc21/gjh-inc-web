import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * X OAuth callback landing.
 *
 * Exists so the redirect URI registered in console.x.com resolves instead
 * of 404ing. It performs no token exchange and stores nothing — it shows
 * the one-time code so the operator can exchange it locally.
 */

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  const error = url.searchParams.get("error") ?? "";
  const errorDesc = url.searchParams.get("error_description") ?? "";

  if (error) {
    return new NextResponse(
      `<!doctype html><html><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">` +
        `<h1>Connection declined</h1>` +
        `<p>X returned: ${esc(error)}${errorDesc ? ` — ${esc(errorDesc)}` : ""}</p>` +
        `<p>Return to the terminal and generate a fresh authorize URL.</p>` +
        `</body></html>`,
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<!doctype html><html><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">` +
        `<h1>Nothing to exchange</h1>` +
        `<p>This address only receives the redirect after approval. No code arrived.</p>` +
        `</body></html>`,
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return new NextResponse(
    `<!doctype html><html><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">` +
      `<h1>Code received</h1>` +
      `<p>Copy the code below into the terminal exchange command. Single use, short expiry.</p>` +
      `<p><code style="word-break:break-all;background:#f4f4f4;padding:0.75rem;display:block">${esc(code)}</code></p>` +
      (state ? `<p>State: <code>${esc(state)}</code></p>` : "") +
      `<p>Command:</p>` +
      `<pre style="background:#f4f4f4;padding:0.75rem;white-space:pre-wrap">node scripts/x-oauth-test.mjs --oauth2-exchange CODE --verifier VERIFIER</pre>` +
      `</body></html>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
