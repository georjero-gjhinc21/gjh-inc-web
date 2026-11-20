import type { Metadata } from "next";
import { CalloutCTA, PartnerWall } from "@/components/ui";
import { partners } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "GJH Inc. works with Anthropic, OpenAI, Databricks, Snowflake, AWS, Google, Zoom, Omnissa, and Microsoft, with distributor associations supporting delivery and procurement.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Partners</p>
        <h1 className="h1 mt-5 max-w-[18ch]">Partnerships that earn their place in delivery.</h1>
        <p className="lede mt-7">
          A long logo wall is a claim about relationships, not capability. These are the platforms we
          actually build on, with what we do on each one stated plainly.
        </p>
      </section>

      <div className="frame band">
        <PartnerWall items={partners.map(({ name, domain, tier, why }) => ({ name, domain, tier, why }))} />

        <section className="card mt-10" aria-labelledby="distribution-partners-heading">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="eyebrow">Distribution and partner associations</p>
              <h2 id="distribution-partners-heading" className="h3 mt-3">A practical route from platform choice to procurement.</h2>
              <p className="mt-4 max-w-measure leading-relaxed text-muted">
                These associations support licensing, sourcing, fulfilment, and partner-led delivery paths for commercial and public-sector work when a project requires them.
              </p>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-card border border-rule bg-rule sm:grid-cols-2" aria-label="Distribution partner associations">
              {["TD SYNNEX", "Carahsoft", "Ingram Micro", "Arrow Electronics"].map((name) => (
                <li key={name} className="bg-paper-raised px-5 py-5 font-display text-xl">{name}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="card mt-10 max-w-measure">
          <h2 className="eyebrow">On vendor neutrality</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Partnerships give us support channels, early access, and training. They do not decide
            architecture. If your organisation is already standardised on something we do not partner
            with, we will build there — and say so before you sign anything.
          </p>
        </div>
      </div>

      <CalloutCTA
        title="Already on one of these platforms?"
        body="Tell us which, and what is not working. That is usually a faster conversation."
      />
    </>
  );
}
