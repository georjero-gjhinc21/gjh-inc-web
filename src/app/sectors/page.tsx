import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { sectors } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Financial services and energy & utilities — where the constraints are specific enough that the work looks different.",
  alternates: { canonical: "/sectors" },
};

export default function SectorsPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20 lg:py-24">
        <p className="eyebrow">Sectors</p>
        <h1 className="h1 mt-5 max-w-[18ch]">Two areas where the constraints do the talking.</h1>
        <p className="lede mt-7">
          The work looks different in a bank than it does at a utility. That is not a marketing
          distinction — the constraints are load-bearing, and each sector has its own.
        </p>
      </section>

      <div className="frame band space-y-5">
        {sectors.map((s, i) => (
          <Link key={s.slug} href={`/sectors/${s.slug}`} className="card-link block">
            <div className="grid gap-6 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span className="font-mono text-label uppercase text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="h3">{s.name}</h2>
                <p className="lede mt-3 !text-base">{s.short}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.constraints.slice(0, 3).map((c) => (
                    <li
                      key={c}
                      className="rounded-chip border border-rule px-2 py-1 font-mono text-[11px] text-muted"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CalloutCTA
        title="Unsure which sector this is?"
        body="If the work sits outside both, tell us. Ruling a sector out is an answer too."
      />
    </>
  );
}