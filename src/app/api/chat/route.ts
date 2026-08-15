import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { practices } from "@/lib/practices";
import { partners } from "@/lib/partners";
import { site } from "@/lib/site";

export const runtime = "edge";

/**
 * Site assistant — Wave 2.
 *
 * Grounding rule: the assistant answers only from the knowledge block below,
 * which is built from the same modules that render the site. If a question
 * falls outside it, the assistant says so and hands off. That is the whole
 * point — a consultancy that sells AI cannot ship a chatbot that invents its
 * own certifications. See docs/ARCHITECTURE.md § Grounding.
 *
 * D7 hardening: input validation, output sanitization, logging with request IDs.
 * TODO: Per-IP rate limiting (requires middleware — see DEFECTS.md D7).
 */

// D7: Forbidden terms that must not appear in assistant output
// Load from same config the evidence gate uses to avoid duplication
import claimsConfig from "@/../scripts/claims.config.json";

const FORBIDDEN_OUTPUT_TERMS = [
  ...claimsConfig.forbiddenCredentialTerms,
  "$", "USD", "price", "pricing", "cost",
] as const;

const MAX_INPUT_CHARS = 4000;  // Per message, server-enforced

const knowledge = () =>
  [
    `COMPANY: ${site.legalName} (${site.name}). Founded ${site.founded}. Contact: ${site.email}.`,
    `POSITIONING: ${site.description}`,
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
2. Never quote prices or timelines beyond what KNOWLEDGE states. Scope drives both.
3. Do not claim past clients or results that are not in KNOWLEDGE.
4. Be brief and plain. Two or three sentences is usually right. Link to the relevant page when there is one.
5. Match the register of the site: direct, unhurried, no sales language, no exclamation marks.

KNOWLEDGE
---
${knowledge()}
---`;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

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
    console.error(`[chat:${requestId}] invalid input: not a messages array`);
    return NextResponse.json({ error: "Send a messages array" }, { status: 400 });
  }

  // D7: Input length validation (reject, don't truncate)
  for (const msg of messages) {
    if (typeof msg.content !== "string" || msg.content.length > MAX_INPUT_CHARS) {
      console.error(`[chat:${requestId}] input too long: ${msg.content?.length || 0} chars`);
      return NextResponse.json(
        { error: `Input too long. Max ${MAX_INPUT_CHARS} characters per message.` },
        { status: 413 }
      );
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  console.log(`[chat:${requestId}] messages: ${messages.length}, last: "${messages[messages.length - 1]?.content?.slice(0, 60)}..."`);

  const reply = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600,  // D7: low output cap (site assistant, not essay generator)
    system: SYSTEM,
    messages: messages.slice(-12),
  });

  const text = reply.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // D7: Output validation — drop if forbidden terms appear
  const lowerText = text.toLowerCase();
  for (const term of FORBIDDEN_OUTPUT_TERMS) {
    if (lowerText.includes(term.toLowerCase())) {
      console.error(`[chat:${requestId}] BLOCKED: output contained forbidden term "${term}"`);
      return NextResponse.json({
        reply: "I cannot answer that. Please contact " + site.email + " directly for those details.",
      });
    }
  }

  console.log(`[chat:${requestId}] ok: ${text.length} chars`);
  return NextResponse.json({ reply: text });
}
