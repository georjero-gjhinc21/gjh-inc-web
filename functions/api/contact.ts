/**
 * Cloudflare Pages Function for /api/contact.
 *
 * The site is a static export (`output: "export"`), so the Next.js route
 * handler at src/app/api/contact/route.ts never runs on Cloudflare Pages —
 * API routes are omitted from the export. This function takes over the same
 * contract on the Pages runtime: validate, reject bots, then deliver to
 * info@gjh-inc.com via Resend.
 *
 * Env vars (set in the Cloudflare Pages dashboard):
 *   RESEND_API_KEY   — required. Sending domain must be verified in Resend.
 *   CONTACT_TO_EMAIL — defaults to info@gjh-inc.com.
 *
 * Canary: POST a body whose message starts with "@ping" to return config state
 * without sending — for diagnosing delivery issues from a shell here.
 */

const toEmail = (env: Env) => env.CONTACT_TO_EMAIL ?? "info@gjh-inc.com";

type Env = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
};

type EventContext = {
  request: Request;
  env: Env;
};

type Payload = {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
  company_website?: string; // honeypot
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost = async ({ request, env }: EventContext) => {
    let body: Payload;
    try {
      body = (await request.json()) as Payload;
    } catch {
      return json({ error: "Send valid JSON" }, 400);
    }

    // Honeypot: silently accept so bots do not learn anything.
    if (body.company_website) return json({ ok: true }, 202);

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (name.length < 2) return json({ error: "add your name" }, 422);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return json({ error: "check the email address" }, 422);
    if (message.length < 20)
      return json({ error: "give us a sentence or two more" }, 422);

    const to = toEmail(env);
    const key = env.RESEND_API_KEY;

    if (!key) {
      console.warn("[contact] RESEND_API_KEY unset — cannot deliver", { name, email, to });
      return json({ error: "delivery is not configured" }, 502);
    }

    // Canary for diagnosing delivery: response with config state only, no send.
    if (message.trim().toLowerCase().startsWith("@ping")) {
      return json({
        debug: true,
        keySet: Boolean(key),
        to,
        envKeys: Object.keys(env),
      });
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "gjh-inc.com <no-reply@gjh-inc.com>",
          to: [to],
          reply_to: email,
          subject: `Enquiry — ${name}${body.organization ? ` (${body.organization})` : ""}`,
          text: `${name} <${email}>\nOrganization: ${body.organization || "—"}\n\n${message}`,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("[contact] delivery failed", res.status, detail);
        return json({ error: "delivery failed", detail, upstream: res.status }, 502);
      }

      return json({ ok: true, delivered: true });
    } catch (err) {
      console.error("[contact] delivery threw", String(err));
      return json({ error: "delivery threw", detail: String(err) }, 502);
    }
  };
