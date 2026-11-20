import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { projectUpdates } from "@/lib/updates";

export const metadata: Metadata = {
  title: "Project updates",
  description:
    "Anonymized updates from current GJH Inc. delivery work, with project status, system boundaries, and review points stated without client details.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20 lg:py-24">
        <p className="eyebrow">Project updates</p>
        <h1 className="h1 mt-5 max-w-[18ch]">Current work, without the client-identifying detail.</h1>
        <p className="lede mt-7">
          These notes describe the system boundary, delivery state, and artifacts under review. They do not publish customer names, locations, commercial terms, or outcome claims.
        </p>
      </section>

      <section className="frame band" aria-label="Current project updates">
        <ul className="space-y-5">
          {projectUpdates.map((update) => (
            <li key={update.slug} className="card grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,.8fr)]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-chip bg-signal/[0.12] px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-ink">{update.status}</span>
                  <span className="eyebrow">{update.area}</span>
                </div>
                <h2 className="h3 mt-5">{update.title}</h2>
                <p className="mt-4 max-w-measure leading-relaxed text-muted">{update.summary}</p>
              </div>
              <div className="border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="eyebrow">Review artifacts</p>
                <ul className="mt-4 space-y-3">
                  {update.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-measure text-sm leading-relaxed text-muted">
          More detail is available in a scoped conversation where confidentiality permits. For public examples with implementation detail, see <Link href="/work" className="text-indigo underline decoration-indigo/30 underline-offset-[3px] hover:decoration-indigo">how we work</Link>.
        </p>
      </section>

      <CalloutCTA
        title="A project update should expose the work, not the customer."
        body="Tell us the workflow and the boundary around it. We will show what can be assessed without asking for sensitive material first."
      />
    </>
  );
}
