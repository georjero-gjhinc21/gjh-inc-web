import type { Metadata } from "next";
import { CalloutCTA } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.legalName} has been doing technology consulting since ${site.founded}, most of it in enterprise data.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">About</p>
        <h1 className="h1 mt-5 max-w-[18ch]">Fifteen years of data work, then AI arrived.</h1>
      </section>

      <div className="frame band grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div className="prose-gjh">
          <p>
            GJH Inc. has been doing technology consulting since {site.founded}, most of it in enterprise
            data — the unglamorous architecture underneath reporting, analytics, and now AI. That
            background is why we tend to ask about your data before we talk about models.
          </p>
          <p>
            It also shapes how we sell. Data work teaches you quickly that the interesting-sounding
            project is usually not the one that pays back, and that the person who tells you so early
            is worth more than the one who agrees enthusiastically for six months. We would rather
            lose the second phase than sell you one that will not work.
          </p>

          <h2>What we are not</h2>
          <p>
            We are not a staffing firm and we do not place bodies. We do not resell licences. We do not
            take engagements where the deliverable is a slide deck about someone else&apos;s roadmap. If
            what you need is any of those, we can usually point you to someone who does it well.
          </p>

          <h2>Why we ask before we build</h2>
          <p>
            Most AI projects are data projects in a better suit. More often than not, the work that
            actually moves a number is a pipeline, a join key, or a clean semantic model rather than a
            new model. We are happy to tell you so early — we would rather you save the budget than
            spend it on a demo that cannot survive contact with your real data.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <dl className="card divide-y divide-rule !p-0">
            {[
              { k: "Founded", v: site.founded },
              { k: "Focus", v: "AI systems and data engineering" },
              { k: "Model", v: "Senior-only delivery" },
              { k: "IP", v: "Client owns everything" },
              { k: "Contact", v: site.email },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline justify-between gap-4 px-6 py-4">
                <dt className="font-mono text-label uppercase text-muted">{row.k}</dt>
                <dd className="text-right text-sm">{row.v}</dd>
              </div>
            ))}
          </dl>
          {/* Team bios pending — see content/TODO-CLIENT-INPUT.md */}
        </aside>
      </div>

      <CalloutCTA title="Work with us" body="Tell us what you're trying to do. A paragraph is plenty." />
    </>
  );
}
