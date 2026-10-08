import type { Metadata } from "next";
import Link from "next/link";
import { CalloutCTA } from "@/components/ui";
import { publishedSectors } from "@/lib/sectors";

export const metadata: Metadata = { title: "Industries", description: "Industry workflows explained through documented, anonymized work.", alternates: { canonical: "/sectors" } };

export default function IndustriesPage() {
  const published = publishedSectors();
  return <>
    <section className="frame border-b border-rule py-20 lg:py-24">
      <p className="eyebrow">Industries</p>
      <h1 className="h1 mt-5 max-w-[20ch]">Industry workflows, explained through the work.</h1>
      <p className="lede mt-7">Explore how information is captured, how requests move between systems, and where people remain responsible for decisions. Examples focus on documented functionality rather than customer identities or unverified outcomes.</p>
    </section>
    <section className="frame band" aria-labelledby="manufacturing-heading">
      <p className="eyebrow">Manufacturing and order operations</p>
      <h2 id="manufacturing-heading" className="h3 mt-5">Structured product requests with human confirmation</h2>
      <p className="mt-4 max-w-measure leading-relaxed text-muted">A configurable-product order-request workflow captures selected options and acknowledgment fields, then sends a structured notification for review. Submitting a request does not automatically confirm an order.</p>
      <p className="mt-4 max-w-measure leading-relaxed text-muted">Verification records document test submissions and notification receipt. This example describes implemented functionality, not measured commercial improvements or final client acceptance.</p>
      <Link href="/work/structured-order-intake" className="btn-ghost mt-6">Explore the order-intake example</Link>
    </section>
    <section className="frame band border-t border-rule" aria-labelledby="professional-services-heading">
      <p className="eyebrow">Professional services and enterprise operations</p>
      <h2 id="professional-services-heading" className="h3 mt-5">Meeting intelligence with accountable follow-through</h2>
      <p className="mt-4 max-w-measure leading-relaxed text-muted">A meeting-intelligence workflow processes transcripts into reviewable decisions, commitments, risks, and follow-ups, with role-based classification and supporting context kept visible for human judgment.</p>
      <p className="mt-4 max-w-measure leading-relaxed text-muted">Optional connected-system handoff can move an approved action into an operating workflow. The pattern is useful across consulting, legal, financial, healthcare administration, construction, and other meeting-heavy organizations, while this example avoids customer identities and private meeting content.</p>
      <Link href="/work/meeting-intelligence" className="btn-ghost mt-6">Explore the meeting-intelligence example</Link>
    </section>
    {published.length > 0 && <section className="frame border-t border-rule py-12">
      <h2 className="h3">More published industry work</h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-2">{published.map((sector) => <li key={sector.slug}><Link href={`/sectors/${sector.slug}`} className="card-link block">{sector.name}</Link></li>)}</ul>
    </section>}
    <section className="frame border-t border-rule py-12">
      <h2 className="h3">Confidentiality by design</h2>
      <p className="mt-4 max-w-measure leading-relaxed text-muted">These examples omit customer identities, locations, product brands, meeting contents, and identifying operational details. They describe the workflows without publishing private project records.</p>
    </section>
    <CalloutCTA title="Discuss an operational workflow" body="Describe the request, the systems it touches, and where a person needs to make the decision." />
  </>;
}
