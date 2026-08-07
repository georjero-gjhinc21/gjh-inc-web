import Link from "next/link";
import { Trace } from "@/components/trace";
import { CalloutCTA, PartnerWall, SectionHead } from "@/components/ui";
import { practices } from "@/lib/practices";
import { partners } from "@/lib/partners";
import { getCollection, formatDate } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * HERO THESIS — see docs/DESIGN.md § Hero.
 * The most characteristic thing about GJH is not that it does AI; it is that
 * it did data engineering for fifteen years first, and therefore knows which
 * AI projects are actually data projects. The hero states that, and the trace
 * beside it shows what the first two weeks look like. No stat grid, no
 * gradient — the proof object is the trace.
 */
export default async function HomePage() {
  const insights = (await getCollection("insights")).slice(0, 3);
  const studies = (await getCollection("case-studies")).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-rule">
        <div className="frame grid gap-14 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
          <div>
            <p className="eyebrow">Consulting since {site.founded}</p>
            <h1 className="h1 mt-5 max-w-[15ch]">
              Most AI projects are data projects in a better suit.
            </h1>
            <p className="lede mt-7">
              We help teams find where AI genuinely helps, build the systems that deliver it, and keep
              the data underneath in good order. We started with the last part, in 2009.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Start a conversation
              </Link>
              <Link href="/work" className="btn-ghost">
                How we work
              </Link>
            </div>
          </div>

          <div className="on-ink">
            <Trace
              label="assessment · one workflow"
              steps={practices[0].trace}
              caption="Every engagement starts here: short, paid, and scoped so you can judge the work before committing to more."
            />
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="band frame">
        <SectionHead
          eyebrow="What we do"
          title="Four practices, one team"
          lede="Senior people do the work. You will not be handed to a team you have not met."
          action={{ href: "/work", label: "All practices" }}
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {practices.slice(0, 4).map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="card-link flex h-full flex-col">
                <span className="font-mono text-label uppercase text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h3 mt-3">{p.name}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.short}</p>
                <span className="mt-6 text-sm text-indigo">Read more →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How we work — the three commitments, stated plainly */}
      <section className="band-ink">
        <div className="frame band">
          <SectionHead
            eyebrow="How we work"
            title="Three commitments we put in writing"
          />
          <dl className="grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              {
                t: "Start small and paid",
                d: "A short assessment of one workflow, so you can judge the work before committing to more. Most engagements begin under a month.",
              },
              {
                t: "Senior people do the work",
                d: "The person in the first meeting is the person writing the code. No handoff to a bench you have not met.",
              },
              {
                t: "You own everything",
                d: "Code, infrastructure, and documentation, in your accounts. No dependency on us by design.",
              },
            ].map((c) => (
              <div key={c.t} className="bg-ink p-7">
                <dt className="font-display text-xl">{c.t}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink-muted">{c.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Case studies */}
      {studies.length > 0 && (
        <section className="band frame">
          <SectionHead
            eyebrow="Selected work"
            title="What the work looks like"
            lede="Problem, approach, and what actually changed — with the numbers we could measure."
            action={{ href: "/case-studies", label: "All case studies" }}
          />
          <ul className="grid gap-5 md:grid-cols-2">
            {studies.map((s) => (
              <li key={s.slug}>
                <Link href={`/case-studies/${s.slug}`} className="card-link flex h-full flex-col">
                  <span className="font-mono text-label uppercase text-muted">{s.sector ?? s.topic}</span>
                  <h3 className="h3 mt-3">{s.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>
                  {s.results && (
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-5">
                      {s.results.slice(0, 3).map((r) => (
                        <div key={r.metric}>
                          <dt className="font-mono text-label uppercase text-muted">{r.metric}</dt>
                          <dd className="mt-1 font-display text-2xl">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Partners */}
      <section className="band frame border-t border-rule">
        <SectionHead
          eyebrow="Partnerships"
          title="Platforms we build on"
          lede="Five partnerships, each earning its place. What matters is what we do with them."
          action={{ href: "/partners", label: "Details" }}
        />
        <PartnerWall items={partners.map(({ name, domain, why }) => ({ name, domain, why }))} />
      </section>

      {/* Insights */}
      {insights.length > 0 && (
        <section className="band frame border-t border-rule">
          <SectionHead
            eyebrow="Insights"
            title="Notes from the work"
            action={{ href: "/insights", label: "All insights" }}
          />
          <ul className="divide-y divide-rule border-y border-rule">
            {insights.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group grid gap-3 py-7 transition-colors hover:bg-paper-raised sm:grid-cols-[9rem_1fr] sm:gap-8"
                >
                  <p className="font-mono text-label uppercase text-muted">
                    {formatDate(post.date)} · {post.readingTime} min
                  </p>
                  <div>
                    <h3 className="font-display text-xl group-hover:text-indigo">{post.title}</h3>
                    <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-muted">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CalloutCTA
        title="Tell us what you're trying to do."
        body="A paragraph is plenty. We will tell you whether it is a job for AI, a job for a pipeline, or not a job at all."
        secondary={{ href: "/capability", label: "Capability statement" }}
      />
    </>
  );
}
