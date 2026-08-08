import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trace } from "@/components/trace";
import { CalloutCTA } from "@/components/ui";
import { getPractice, practices } from "@/lib/practices";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getPractice((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.short,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.name} · ${site.name}`, description: p.short },
  };
}

export default async function PracticePage({ params }: Params) {
  const p = getPractice((await params).slug);
  if (!p) notFound();

  return (
    <>
      <section className="frame border-b border-rule py-20">
        <Link href="/work" className="eyebrow hover:text-ink">
          ← Work
        </Link>
        <h1 className="h1 mt-6 max-w-[16ch]">{p.name}</h1>
        <p className="lede mt-6 !text-lede">{p.lede}</p>
      </section>

      <div className="frame band grid gap-14 lg:grid-cols-[1fr_25rem] lg:gap-20">
        <div>
          <div className="prose-gjh">
            {p.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <section className="mt-16">
            <h2 className="eyebrow">What you get</h2>
            <ul className="mt-5 divide-y divide-rule border-y border-rule">
              {p.delivers.map((d) => (
                <li key={d} className="flex gap-4 py-4 text-[0.95rem] leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="eyebrow">Call us when</h2>
            <ul className="mt-5 space-y-3">
              {p.signals.map((s) => (
                <li key={s} className="card !p-5 text-[0.95rem] leading-relaxed text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="on-ink">
            <Trace label={`${p.slug} · shape`} steps={p.trace} caption="Indicative. Real timelines follow the assessment." />
          </div>
          <div className="card mt-5">
            <h2 className="eyebrow">Typical stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-chip bg-paper-sunk px-2 py-1 font-mono text-[11px]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <CalloutCTA
        title={`Talk to us about ${p.name.toLowerCase()}`}
        body="Describe the situation in a paragraph. We will reply with what we would look at first and what it would cost to find out."
      />
    </>
  );
}
