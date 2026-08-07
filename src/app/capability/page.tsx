import type { Metadata } from "next";
import { CalloutCTA } from "@/components/ui";
import { practices } from "@/lib/practices";
import { partners } from "@/lib/partners";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Capability statement",
  description: `${site.legalName} capability statement — core competencies, platforms, and contact details.`,
  alternates: { canonical: "/capability" },
};

/**
 * Rendered from the same data as the rest of the site, so it cannot drift out
 * of date the way a PDF does. Print styles make it a one-page handout.
 *
 * DO NOT add NAICS codes, CAGE, UEI, set-aside certifications, or contract
 * vehicles here until GJH supplies current documentation. See
 * content/TODO-CLIENT-INPUT.md.
 */
export default function CapabilityPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Capability statement</p>
        <h1 className="h1 mt-5 max-w-[18ch]">{site.legalName}</h1>
        <p className="lede mt-7">{site.description}</p>
      </section>

      <div className="frame band grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="eyebrow">Core competencies</h2>
          <ul className="mt-5 divide-y divide-rule border-y border-rule">
            {practices.map((p) => (
              <li key={p.slug} className="py-4">
                <p className="font-display text-lg">{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.short}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="eyebrow">Differentiators</h2>
          <ul className="mt-5 divide-y divide-rule border-y border-rule">
            {[
              `Data engineering practice operating continuously since ${site.founded}`,
              "Senior-only delivery — no bench, no substitution after award",
              "Evaluation-first AI builds: measurable pass rates, not demos",
              "Client retains all code, infrastructure, and documentation",
              "Systems deployed in the client's own cloud accounts and controls",
            ].map((d) => (
              <li key={d} className="py-4 text-sm leading-relaxed">
                {d}
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mt-12">Platforms</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {partners.map((p) => (
              <li key={p.slug} className="rounded-chip border border-rule px-2.5 py-1 font-mono text-[11px]">
                {p.name}
              </li>
            ))}
          </ul>

          <h2 className="eyebrow mt-12">Contact</h2>
          <dl className="mt-5 divide-y divide-rule border-y border-rule">
            {[
              { k: "Email", v: site.email },
              { k: "Web", v: "gjh-inc.com" },
              { k: "Founded", v: site.founded },
            ].map((r) => (
              <div key={r.k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="font-mono text-label uppercase text-muted">{r.k}</dt>
                <dd>{r.v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <CalloutCTA
        title="Need this as a document?"
        body="This page prints to a single sheet. For a signed capability statement on letterhead, email us and we will send one the same day."
      />
    </>
  );
}
