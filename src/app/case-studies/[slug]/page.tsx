import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { getCollection, getDoc } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCollection("case-studies")).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = await getDoc("case-studies", (await params).slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/case-studies/${doc.slug}` },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const doc = await getDoc("case-studies", (await params).slug);
  if (!doc) notFound();

  return (
    <>
      <section className="frame border-b border-rule py-20">
        <Link href="/case-studies" className="eyebrow hover:text-ink">
          ← Case studies
        </Link>
        <p className="eyebrow mt-6">{doc.sector ?? doc.topic}</p>
        <h1 className="h1 mt-4 max-w-[20ch] !text-d2">{doc.title}</h1>
        <p className="lede mt-6">{doc.summary}</p>
      </section>

      {doc.results && (
        <section className="band-ink">
          <div className="frame py-14">
            <h2 className="eyebrow">Result</h2>
            <dl className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {doc.results.map((r) => (
                <div key={r.metric}>
                  <dd className="font-display text-d3 text-signal">{r.value}</dd>
                  <dt className="mt-2 text-sm text-ink-muted">{r.metric}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <div className="frame band">
        <div className="prose-gjh" dangerouslySetInnerHTML={{ __html: doc.body }} />
      </div>

      <CalloutCTA title="Similar problem?" body="Describe it in a paragraph and we will tell you how close the parallel really is." />
    </>
  );
}
