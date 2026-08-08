import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalloutCTA } from "@/components/ui";
import { getSector, sectors } from "@/lib/sectors";
import { getPractice } from "@/lib/practices";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getSector((await params).slug);
  if (!s) return {};
  return {
    title: `${s.name} · GJH`,
    description: s.short,
    alternates: { canonical: `/sectors/${s.slug}` },
  };
}

export default async function IndustryPage({ params }: Params) {
  const s = getSector((await params).slug);
  if (!s) notFound();

  const related = s.relatedPractices
    .map((slug) => getPractice(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <section className="frame border-b border-rule py-20">
        <Link href="/sectors" className="eyebrow hover:text-ink">
          ← Industries
        </Link>
        <h1 className="h1 mt-6 max-w-[18ch]">{s.name}</h1>
        <p className="lede mt-6 !text-lede max-w-[60ch]">{s.lede}</p>
      </section>

      <div className="frame band grid gap-14 lg:grid-cols-[1fr_25rem] lg:gap-20">
        <div>
          <div className="prose-gjh">
            {s.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <section className="mt-16">
            <h2 className="eyebrow">What you get</h2>
            <p className="lede mt-3 !text-base">
              The promise, kept honest. Direction, not invented numbers.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {s.outcomes.map((o, i) => (
                <li key={o} className="card !p-5">
                  <span className="font-mono text-label uppercase text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{o}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="eyebrow">The constraints</h2>
            <p className="lede mt-3 !text-base">
              The parts that make this industry different. If one of these sounds like your problem,
              that is the conversation to have.
            </p>
            <ul className="mt-6 space-y-3">
              {s.constraints.map((c) => (
                <li key={c} className="card !p-5 text-[0.95rem] leading-relaxed text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="eyebrow">How we deliver</h2>
            <p className="lede mt-3 !text-base">
              The engineering gates that separate a demo from a deployment in this industry.
            </p>
            <ul className="mt-6 space-y-3">
              {s.delivery.map((d) => (
                <li key={d} className="card !p-5 text-[0.95rem] leading-relaxed text-muted">
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="eyebrow">Call us when</h2>
            <ul className="mt-5 space-y-3">
              {s.signals.map((sg) => (
                <li key={sg} className="card !p-5 text-[0.95rem] leading-relaxed text-muted">
                  {sg}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card">
            <h2 className="eyebrow">Knowledge we draw on</h2>
            <ul className="mt-4 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="text-indigo underline underline-offset-2">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{p.short}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CalloutCTA
        title={`Building in ${s.name.toLowerCase()}?`}
        body="Describe the situation in a paragraph. We will tell you what we would look at first and what it would cost to find out."
      />
    </>
  );
}