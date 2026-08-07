"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Copy note: labels name what the person controls, the button says what
 * happens, and the success state uses the same verb. Errors say what went
 * wrong and give a way through — they do not apologise.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Request failed");
      setState("sent");
    } catch {
      // No API on this host — compose a mailto the visitor can send themselves.
      const d = data as Record<string, string>;
      const subject = encodeURIComponent(`Enquiry from your website — ${d.name ?? "Someone"}`);
      const body = encodeURIComponent(
        `Name: ${d.name ?? ""}\nEmail: ${d.email ?? ""}\nOrganization: ${d.organization ?? ""}\n\n${d.message ?? ""}`
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="card">
        <p className="chip-ok !text-signal">Sent</p>
        <p className="mt-4 leading-relaxed">
          We read every message ourselves and reply within two business days. If it is urgent, email{" "}
          <a className="text-indigo underline underline-offset-2" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <Field name="name" label="Your name" autoComplete="name" required />
      <Field name="email" label="Email" type="email" autoComplete="email" required />
      <Field name="organization" label="Organization" autoComplete="organization" />

      <div>
        <label htmlFor="message" className="font-mono text-label uppercase text-muted">
          What you&apos;re trying to do
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={20}
          placeholder="A paragraph is plenty. What is the work, and what is currently in the way?"
          className="mt-2 w-full rounded border border-rule-strong bg-paper px-4 py-3 text-[0.95rem] leading-relaxed placeholder:text-muted/60 focus:border-indigo"
        />
      </div>

      {/* Honeypot — bots fill this, people never see it. */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state === "error" && (
        <p role="alert" className="rounded border border-indigo/40 bg-indigo-wash px-4 py-3 text-sm">
          That did not send: {error}. Email{" "}
          <a className="underline underline-offset-2" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          and it will reach the same place.
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>

      <p className="text-sm text-muted">
        We use what you send to reply to you. Nothing else. See our{" "}
        <a className="text-indigo underline underline-offset-2" href="/privacy">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-label uppercase text-muted">
        {label}
        {!required && <span className="ml-2 normal-case tracking-normal opacity-70">optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded border border-rule-strong bg-paper px-4 py-3 text-[0.95rem] focus:border-indigo"
      />
    </div>
  );
}
