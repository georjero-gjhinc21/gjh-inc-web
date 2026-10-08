import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { practices } from "@/lib/practices";

export const metadata: Metadata = { title: "Work", description: "Advisory, building, data foundations, ongoing support, and anonymized implementation examples for order intake and meeting intelligence.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <>
    <section className="frame border-b border-rule py-20 lg:py-24">
      <p className="eyebrow">Work</p>
      <h1 className="h1 mt-5 max-w-[18ch]">We would rather rule things out than sell you all of them.</h1>
      <p className="lede mt-7">Four practice areas. Most clients need one or two, and the honest answer is often that the third is not worth doing yet.</p>
    </section>
    <section className="frame band" aria-labelledby="work-example-heading">
      <p className="eyebrow">Implementation examples</p>
      <h2 id="work-example-heading" className="h3 mt-4">Workflows with explicit human decision points</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Link href="/work/structured-order-intake" className="card-link block">
          <p className="eyebrow">Manufacturing and order operations</p>
          <h3 className="h3 mt-3">Configurable-product order intake with human confirmation</h3>
          <p className="mt-3 max-w-measure leading-relaxed text-muted">Structured product requests, submission notifications, and a human review step before confirmation. The example describes verified test behavior without customer identities or unmeasured outcome claims.</p>
          <span className="mt-6 block text-sm text-indigo">Explore the work →</span>
        </Link>
        <Link href="/work/meeting-intelligence" className="card-link block">
          <p className="eyebrow">Meeting operations and follow-through</p>
          <h3 className="h3 mt-3">Meeting intelligence with accountable follow-through</h3>
          <p className="mt-3 max-w-measure leading-relaxed text-muted">Transcript ingestion, structured action extraction, executive classification, and optional task handoff. The example describes implemented behavior without exposing participants, organizations, or meeting content.</p>
          <span className="mt-6 block text-sm text-indigo">Explore the work →</span>
        </Link>
      </div>
    </section>
    <div className="frame band space-y-5 border-t border-rule">{practices.map((p, i) => <Link key={p.slug} href={`/work/${p.slug}`} className="card-link block">
      <div className="grid gap-6 sm:grid-cols-[4rem_1fr] sm:gap-8"><span className="eyebrow">{String(i + 1).padStart(2, "0")}</span><div><h2 className="h3">{p.name}</h2><p className="lede mt-3 !text-base">{p.short}</p><ul className="mt-5 flex flex-wrap gap-2">{p.stack.map((s) => <li key={s} className="rounded-chip border border-rule px-2 py-1 font-mono text-[11px] text-muted">{s}</li>)}</ul></div></div>
    </Link>)}</div>
    <CalloutCTA title="Not sure which one you need?" body="That is what the assessment is for. Describe the problem and we will tell you which practice it belongs to — or that it belongs to none of them." />
  </>;
}
