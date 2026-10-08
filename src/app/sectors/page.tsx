import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { publishedSectors } from "@/lib/sectors";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industry workflows explained through documented work, without disclosing customer identities or locations.",
};

export default function IndustriesPage() {
  const published = publishedSectors();
  return (
    <>
      <section className="frame border-b border-rule py-20 lg:py-24">
        <p className="font-mono text-label uppercase text-muted">Industries</p>
        <h1 className="h1 mt-5 max-w-[20ch]">Industry workflows, explained through the work.</h1>
        <p className="lede mt-7 max-w-[60ch]">Explore how information is captured, how requests move between systems, and where people remain responsible for decisions. Examples focus on documented functionality rather than customer identities or unverified outcomes.</p>
      </section>
      <section className="frame py-20" aria-labelledby="manufacturing-heading">
        <p className="font-mono text-label uppercase text-muted">Manufacturing and order operations</p>
        <h2 id="manufacturing-heading" className="h3 mt-5">Structured product requests with human confirmation</h2>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">A configurable-product order-request workflow captures selected options and acknowledgment fields, then sends a structured notification for review. Submitting a request does not automatically confirm an order.</p>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">Verification records document test submissions and notification receipt. This example describes implemented functionality, not measured commercial improvements or final client acceptance.</p>
        <Link href="/work/structured-order-intake" className="mt-6 inline-block underline">Explore the order-intake example</Link>
      </section>
      {published.length > 0 && (
        <section className="frame border-t border-rule py-12" aria-labelledby="published-sectors-heading">
          <h2 id="published-sectors-heading" className="h3">More published industry work</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {published.map((sector) => (
              <li key={sector.slug}>
                <Link href={`/sectors/${sector.slug}`} className="card-link block">{sector.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="frame border-t border-rule py-12">
        <h2 className="h3">Confidentiality by design</h2>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">This example omits customer identities, locations, product brands, and identifying operational details. It describes the workflow without publishing private project records.</p>
      </section>
      <CalloutCTA />
    </>
  );
}
