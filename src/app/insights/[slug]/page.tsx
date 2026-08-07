import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { formatDate, getCollection, getDoc } from "@/lib/content";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCollection("insights")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = await getDoc("insights", (await params).slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/insights/${doc.slug}` },
    openGraph: { type: "article", title: doc.title, description: doc.summary, publishedTime: doc.date },
  };
}

export default async function InsightPage({ params }: Params) {
  const doc = await getDoc("insights", (await params).slug);
  if (!doc) notFound();

  const related = (await getCollection("insights")).filter((p) => p.slug !== doc.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: doc.summary,
    datePublished: doc.date,
    author: { "@type": "Organization", name: doc.author ?? site.legalName },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/insights/${doc.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="frame border-b border-rule py-20">
          <Link href="/insights" className="eyebrow hover:text-ink">
            ← Insights
          </Link>
          <h1 className="h1 mt-6 max-w-[20ch] !text-d2">{doc.title}</h1>
          <p className="mt-6 font-mono text-label uppercase text-muted">
            {formatDate(doc.date)} · {doc.topic} · {doc.readingTime} min read
            {doc.author && ` · ${doc.author}`}
          </p>
        </header>

        <div className="frame band">
          <div className="prose-gjh" dangerouslySetInnerHTML={{ __html: doc.body }} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="frame border-t border-rule py-16">
          <h2 className="eyebrow">Related</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/insights/${r.slug}`} className="card-link block h-full">
                  <p className="font-mono text-label uppercase text-muted">{r.topic}</p>
                  <p className="mt-3 font-display text-lg">{r.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CalloutCTA
        title="Working on something like this?"
        body="Tell us what you're trying to do. A paragraph is plenty."
      />
    </>
  );
}
