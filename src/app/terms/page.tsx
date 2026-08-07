import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `Terms for using the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="h1 mt-5 !text-d2">Terms of use</h1>
        <p className="mt-6 font-mono text-label uppercase text-muted">
          Last updated {new Date().getFullYear()}
        </p>
      </section>

      <div className="frame band">
        <div className="prose-gjh">
          <p>
            These terms cover your use of gjh-inc.com, operated by {site.legalName}. Using the site
            means you accept them.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content and design of this site belong to {site.legalName} unless marked otherwise.
            Partner and client names and marks belong to their owners.
          </p>

          <h2>Using the site</h2>
          <p>
            Use it lawfully and do not interfere with anyone else&apos;s use of it. Do not attempt to
            gain unauthorised access to any part of the site or its systems.
          </p>

          <h2>What this site is not</h2>
          <p>
            Material here is general information about our services. It is not professional, legal, or
            financial advice, and it does not create a client relationship. Engagements are governed by
            a signed agreement, and where that agreement conflicts with this page, the agreement wins.
          </p>

          <h2>Liability</h2>
          <p>
            We provide this site as-is and are not liable for losses arising from your use of it, to the
            extent the law allows.
          </p>

          <h2>Changes</h2>
          <p>
            We may revise these terms. Continued use after a change means you accept the revised version.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms go to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
