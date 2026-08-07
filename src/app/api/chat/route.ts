import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { practices } from "@/lib/practices";
import { partners } from "@/lib/partners";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Site assistant — Wave 2.
 *
 * Grounding rule: the assistant answers only from the knowledge block below,
 * which is built from the same modules that render the site. If a question
 * falls outside it, the assistant says so and hands off. That is the whole
 * point — a consultancy that sells AI cannot ship a chatbot that invents its
 * own certifications. See docs/ARCHITECTURE.md § Grounding.
 */

const knowledge = () =>
  [
    `COMPANY: ${site.legalName} (${site.name}). Founded ${site.founded}. Contact: ${site.email}.`,
    `POSITIONING: ${site.description}`,
    `FEDERAL: Government contracting is handled by the sister practice ${site.sister.name} at ${site.sister.url}.`,
    "",
    "PRACTICES:",
    ...practices.map(
      (p) =>
        `- ${p.name} (/work/${p.slug}): ${p.short} Delivers: ${p.delivers.join("; ")}. Typical stack: ${p.stack.join(", ")}.`
    ),
    "",
    "PARTNERSHIPS:",
    ...partners.map((p) => `- ${p.name} (${p.domain}): ${p.why}`),
    "",
    "ENGAGEMENT MODEL: Start with a short paid assessment of one workflow, usually under a month. Senior people deliver. The client owns all code, infrastructure, and documentation.",
  ].join("\n");

const SYSTEM = `You answer questions about ${site.legalName} on its website.

Rules, in order of priority:
1. Answer only from the KNOWLEDGE block. If the answer is not there, say you do not have it and offer to pass the question to the team at ${site.email}. Never guess.
2. Never state or imply that GJH holds any certification, contract vehicle, NAICS code, security clearance, or set-aside status. None are listed in KNOWLEDGE. If asked, say the team will confirm directly.
3. Never quote prices or timelines beyond what KNOWLEDGE states. Scope drives both.
4. Do not claim past clients or results that are not in KNOWLEDGE.
5. Be brief and plain. Two or three sentences is usually right. Link to the relevant page when there is one.
6. Match the register of the site: direct, unhurried, no sales language, no exclamation marks.

KNOWLEDGE
---
${knowledge()}
---`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Assistant is not configured yet. Email " + site.email + "." },
      { status: 503 }
    );
  }

  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Send a messages array" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const reply = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600,
    system: SYSTEM,
    messages: messages.slice(-12),
  });

  const text = reply.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return NextResponse.json({ reply: text });
}
