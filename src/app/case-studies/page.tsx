import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How GJH Inc. engagements ran, what was built, and what measurably changed.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const studies = await getCollection("case-studies");

  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Case studies</p>
        <h1 className="h1 mt-5 max-w-[16ch]">What actually changed</h1>
        <p className="lede mt-7">
          Problem, approach, and result — with the numbers we could measure and the ones we could not.
        </p>
      </section>

      <div className="frame band">
        {studies.length === 0 ? (
          <div className="card">
            <p className="eyebrow">Awaiting client sign-off</p>
            <p className="mt-4 max-w-measure leading-relaxed text-muted">
              Case studies go live once the client has approved the write-up. Add approved studies as
              markdown in <code className="font-mono text-sm">content/case-studies/</code>.
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {studies.map((s) => (
              <li key={s.slug}>
                <Link href={`/case-studies/${s.slug}`} className="card-link flex h-full flex-col">
                  <p className="font-mono text-label uppercase text-muted">{s.sector ?? s.topic}</p>
                  <h2 className="h3 mt-3">{s.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{s.summary}</p>
                  {s.results && (
                    <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6 [margin-top:1.5rem]">
                      {s.results.map((r) => (
                        <div key={r.metric}>
                          <dt className="font-mono text-label uppercase text-muted">{r.metric}</dt>
                          <dd className="mt-1 font-display text-2xl">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CalloutCTA title="Want the long version?" body="We can walk you through a comparable engagement in detail, under NDA if needed." />
    </>
  );
}
