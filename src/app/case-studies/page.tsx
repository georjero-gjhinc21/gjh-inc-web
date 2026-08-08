import type { Metadata } from "next";
import { CalloutCTA } from "@/components/ui";
import { CaseStudyGrid } from "@/components/case-study-grid";
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
          <CaseStudyGrid studies={studies} />
        )}
      </div>

      <CalloutCTA title="Want the long version?" body="We can walk you through a comparable engagement in detail, under NDA if needed." />
    </>
  );
}
