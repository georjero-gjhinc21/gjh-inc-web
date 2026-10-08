import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Configurable-product order intake",
  description: "An anonymized implementation example covering structured product requests, submission notifications, and human order confirmation.",
};

export default function StructuredOrderIntakePage() {
  return (
    <article className="frame py-20 lg:py-24">
      <p className="font-mono text-label uppercase text-muted">Work example / Manufacturing and order operations</p>
      <h1 className="h1 mt-5 max-w-[24ch]">Configurable-product order intake with human confirmation</h1>
      <p className="lede mt-7 max-w-[60ch]">A structured request workflow that records product choices, communicates the submission, and preserves a human review step before an order is confirmed.</p>
      <div className="mt-12 max-w-[65ch] space-y-10">
        <section>
          <h2 className="h3">The workflow</h2>
          <p className="mt-4 leading-relaxed">Configurable-product requests can include dimensions, finishes, component arrangements, contact details, and acknowledgments. The application captures these details in structured submissions and sends a summary for review.</p>
          <p className="mt-4 leading-relaxed">The receiving team remains responsible for checking the request and confirming the order. A submission notification is not an automatic order acceptance.</p>
        </section>
        <section>
          <h2 className="h3">Implemented functionality</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed">
            <li>Structured capture of selected product options.</li>
            <li>Request context and acknowledgment fields included in submission summaries.</li>
            <li>Email notifications that communicate the request for review.</li>
            <li>An explicit distinction between submitting a request and confirming an order.</li>
          </ul>
        </section>
        <section>
          <h2 className="h3">What the verification shows</h2>
          <p className="mt-4 leading-relaxed">Reviewed operational records document test submissions across multiple form variants and receipt of their structured notifications. These records demonstrate configuration capture and notification behavior during verification; they are not a count of real customer orders.</p>
        </section>
        <section>
          <h2 className="h3">Scope and limitations</h2>
          <p className="mt-4 leading-relaxed">This is an application-engineering and workflow-automation example. It does not claim AI functionality, ERP integration, payment processing, measured error reduction, time savings, production adoption, or final client acceptance. Signature fields are described as captured acknowledgments, not a claim of legally validated electronic signing.</p>
        </section>
        <section>
          <h2 className="h3">Privacy</h2>
          <p className="mt-4 leading-relaxed">Customer identities, locations, product brands, domains, contact details, order references, submission identifiers, and raw correspondence are omitted. The example explains the general workflow without reproducing private project records.</p>
        </section>
        <nav aria-label="Related pages" className="flex flex-wrap gap-6 border-t border-rule pt-8">
          <Link href="/sectors" className="underline">Industries</Link>
          <Link href="/work" className="underline">More work</Link>
          <Link href="/contact" className="underline">Discuss a workflow</Link>
        </nav>
      </div>
    </article>
  );
}
