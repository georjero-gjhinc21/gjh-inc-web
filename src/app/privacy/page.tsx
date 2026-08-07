import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.legalName} handles information you send through this site.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="h1 mt-5 !text-d2">Privacy policy</h1>
        <p className="mt-6 font-mono text-label uppercase text-muted">
          Last updated {new Date().getFullYear()}
        </p>
      </section>

      <div className="frame band">
        <div className="prose-gjh">
          <h2>What we collect</h2>
          <p>
            Only what you send us: your name, email address, organization if you give it, and the
            content of your message. We do not use advertising cookies and we do not run third-party
            trackers on this site.
          </p>

          <h2>Analytics</h2>
          <p>
            We use privacy-first, cookieless analytics to count page views. It does not identify you,
            follow you across sites, or store a persistent identifier.
          </p>

          <h2>How we use it</h2>
          <p>
            To reply to you and to carry out work you have asked us to do. We do not sell, rent, or
            share your information with third parties for their own purposes.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiries are kept while there is an active conversation and for a reasonable period after,
            so that we can pick up where we left off. Ask us to delete yours and we will.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> and we will action it.
          </p>

          <h2>Security</h2>
          <p>
            Information is held on access-controlled systems in the United States. Client project data
            stays in the client&apos;s own infrastructure under their controls; we do not copy it into
            ours.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy go to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
