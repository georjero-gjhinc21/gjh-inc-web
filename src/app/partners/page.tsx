import type { Metadata } from "next";
import { CalloutCTA, PartnerWall } from "@/components/ui";
import { partners } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "GJH Inc. partners with Anthropic, Databricks, Snowflake, AWS, and Google — and builds in the client's own accounts.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Partners</p>
        <h1 className="h1 mt-5 max-w-[18ch]">Five partnerships, each earning its place.</h1>
        <p className="lede mt-7">
          A long logo wall is a claim about relationships, not capability. These are the platforms we
          actually build on, with what we do on each one stated plainly.
        </p>
      </section>

      <div className="frame band">
        <PartnerWall items={partners.map(({ name, domain, why }) => ({ name, domain, why }))} />

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
