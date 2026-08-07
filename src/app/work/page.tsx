import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { practices } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Advisory, building, data foundations, and ongoing support — the four practices GJH Inc. delivers, plus public sector work through GJH Consulting.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20 lg:py-24">
        <p className="eyebrow">Work</p>
        <h1 className="h1 mt-5 max-w-[18ch]">We would rather rule things out than sell you all of them.</h1>
        <p className="lede mt-7">
          Five practice areas. Most clients need one or two, and the honest answer is often that the
          third is not worth doing yet.
        </p>
      </section>

      <div className="frame band space-y-5">
        {practices.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="card-link block">
            <div className="grid gap-6 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span className="font-mono text-label uppercase text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="h3">{p.name}</h2>
                <p className="lede mt-3 !text-base">{p.short}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-chip border border-rule px-2 py-1 font-mono text-[11px] text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CalloutCTA
        title="Not sure which one you need?"
        body="That is what the assessment is for. Describe the problem and we will tell you which practice it belongs to — or that it belongs to none of them."
      />
    </>
  );
}
