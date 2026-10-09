import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API cost control for an AI-enabled platform",
  description: "An anonymized ongoing project covering usage metering, spend limits, evaluated model routing, customer-owned credentials, and partner-agency delivery under a common change-control process.",
};

export default function ApiCostControlPage() {
  return (
    <article className="frame py-20 lg:py-24">
      <p className="font-mono text-label uppercase text-muted">Ongoing project / Technology platforms and digital products</p>
      <h1 className="h1 mt-5 max-w-[22ch]">API cost control for an AI-enabled platform</h1>
      <p className="lede mt-7 max-w-[62ch]">An ongoing requirements and architecture engagement is helping a digital product platform establish stronger control over third-party AI API costs. The work measures actual usage, defines cost and quota policies before provider calls, and creates an auditable foundation for later implementation.</p>
      <div className="mt-12 max-w-[65ch] space-y-10">
        <section>
          <h2 className="h3">Where the work stands</h2>
          <p className="mt-4 leading-relaxed">This is a requirements and architecture engagement, not a completed production rollout. The useful work at this stage is deciding what must be measured, what must be refused, and who approves a change before any provider call is altered.</p>
          <p className="mt-4 leading-relaxed">No savings percentage, production outcome, provider capacity, or deployment result is claimed. Those figures do not exist yet, and publishing an estimate would turn a design constraint into a result.</p>
        </section>
        <section>
          <h2 className="h3">The control strategy</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed">
            <li>Usage metering and reconciliation against provider invoices, so spend is checked against observed calls rather than a dashboard assumption.</li>
            <li>Request, token, and estimated-spend limits applied before a provider call, not after the invoice arrives.</li>
            <li>Model routing only after a quality evaluation. A cheaper model is not a control if it fails the task.</li>
            <li>Cache strategies based on observed request behavior, not on an assumed repeat rate.</li>
            <li>Customer-owned provider credentials and infrastructure. The platform keeps the accounts; GJH does not become the billing intermediary.</li>
            <li>Custom compatibility layers and provider adapters, so a workflow is not forced through one vendor&apos;s interface.</li>
            <li>Human approval, testing, and rollback controls before a production change.</li>
          </ul>
        </section>
        <section>
          <h2 className="h3">Partner agencies and custom solutions</h2>
          <p className="mt-4 leading-relaxed">Where a platform needs specialized delivery capacity, GJH can coordinate approved partner agencies. That coordination keeps one architecture, one security boundary, one set of acceptance criteria, and one change-control process. It does not hand the design to whoever has spare capacity.</p>
          <p className="mt-4 leading-relaxed">Custom solutions stay fitted to the platform&apos;s workflows. A generic product is not assumed to be the right control surface for every use case.</p>
        </section>
        <section>
          <h2 className="h3">What this page does not claim</h2>
          <p className="mt-4 leading-relaxed">The engagement has not published a measured cost reduction, a production cutover, or a provider-capacity result. Implementation remains ahead of this write-up. Anything that later ships will need its own verification before it is described as done.</p>
        </section>
        <section>
          <h2 className="h3">Privacy</h2>
          <p className="mt-4 leading-relaxed">The customer name, commercial terms, traffic volumes, provider-account information, credentials, agency identities, locations, internal decisions, and proprietary implementation details are omitted. The example describes the control strategy without reproducing private project records.</p>
        </section>
        <nav aria-label="Related pages" className="flex flex-wrap gap-6 border-t border-rule pt-8">
          <Link href="/work" className="underline">More work</Link>
          <Link href="/sectors" className="underline">Industries</Link>
          <Link href="/contact" className="underline">Discuss a workflow</Link>
        </nav>
      </div>
    </article>
  );
}
