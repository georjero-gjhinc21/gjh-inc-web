import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell ${site.name} what you're trying to do. A paragraph is plenty.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Contact</p>
        <h1 className="h1 mt-5 max-w-[16ch]">Tell us what you&apos;re trying to do.</h1>
        <p className="lede mt-7">
          A paragraph is plenty. You will get a reply from someone who would work on it, not a
          scheduler bot.
        </p>
      </section>

      <div className="frame band grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div className="max-w-measure">
          <ContactForm />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card">
            <h2 className="eyebrow">Direct</h2>
            <a href={`mailto:${site.email}`} className="mt-3 block text-indigo underline underline-offset-2">
              {site.email}
            </a>
            <a href={site.linkedin} rel="noopener" className="mt-2 block text-indigo underline underline-offset-2">
              LinkedIn
            </a>
          </div>

          <div className="card mt-5">
            <h2 className="eyebrow">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <li>1. A reply within two business days, from a person.</li>
              <li>2. A 30-minute call to work out whether we are the right fit.</li>
              <li>3. If we are, a scoped assessment with a fixed price before any commitment.</li>
            </ol>
          </div>

          <div className="card mt-5">
            <h2 className="eyebrow">Federal opportunities</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Government contracting enquiries are handled by{" "}
              <a href={site.sister.url} rel="noopener" className="text-indigo underline underline-offset-2">
                {site.sister.name}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
