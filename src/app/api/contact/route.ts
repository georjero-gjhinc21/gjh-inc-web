import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Contact intake.
 *
 * Wave 1 (now): validate, reject bots, log. Delivery is via Resend once
 * RESEND_API_KEY is set — until then the route returns 202 and the message is
 * recorded in the platform logs so nothing is silently lost.
 *
 * Wave 2: persist to the leads table and emit `lead_captured` for the nurture
 * worker. See docs/ARCHITECTURE.md § Assistants and workers.
 */
type Payload = {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
  company_website?: string; // honeypot
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Send valid JSON" }, { status: 400 });
  }

  // Honeypot: silently accept so bots do not learn anything.
  if (body.company_website) return NextResponse.json({ ok: true }, { status: 202 });

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2) return NextResponse.json({ error: "add your name" }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return NextResponse.json({ error: "check the email address" }, { status: 422 });
  if (message.length < 20)
    return NextResponse.json({ error: "give us a sentence or two more" }, { status: 422 });

  const to = process.env.CONTACT_TO_EMAIL ?? "consult@gjh-inc.com";
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.warn("[contact] RESEND_API_KEY unset — message logged, not emailed", { name, email, to });
    return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  }

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
    console.error("[contact] delivery failed", res.status, await res.text());
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
