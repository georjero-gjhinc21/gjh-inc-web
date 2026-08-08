import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { sectors } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Where the constraints make the work different — financial services, energy, manufacturing, healthcare, field services, construction, automotive, retail, ecommerce, real estate, education, travel, and transportation.",
  alternates: { canonical: "/sectors" },
};

export default function IndustriesPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20 lg:py-24">
        <p className="eyebrow">Industries</p>
        <h1 className="h1 mt-5 max-w-[20ch]">
          The work looks different in a bank than it does at a builder.
        </h1>
        <p className="lede mt-7 max-w-[60ch]">
          Thirteen industries where GJH has delivered. Each one has constraints that are
          load-bearing — the part that makes the work different, before any model
          is pointed at the data.
        </p>
      </section>

      <div className="border-t border-rule bg-paper">
        <ul className="frame divide-y divide-rule">
          {sectors.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/sectors/${s.slug}`}
                className="group grid gap-6 px-2 py-10 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-8 sm:px-0"
              >
                <span className="font-mono text-label uppercase text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="h3 transition-colors group-hover:text-indigo">
                    {s.name}
                  </h2>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.short}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.outcomes.slice(0, 2).map((o) => (
                      <li
                        key={o}
                        className="rounded-chip border border-rule px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hidden items-center self-center text-sm text-indigo sm:flex">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <CalloutCTA
        title="Industry not listed?"
        body="Name the industry and the problem. If it is a real deployment problem, it is probably on our list — we just have not written it up yet."
      />
    </>
  );
}