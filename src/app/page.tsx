import Link from "next/link";
import { Trace } from "@/components/trace";
import { CalloutCTA, PartnerWall, SectionHead } from "@/components/ui";
import { practices } from "@/lib/practices";
import { partners } from "@/lib/partners";
import { publishedSectors } from "@/lib/sectors";
import { getCollection, formatDate } from "@/lib/content";
import { site } from "@/lib/site";

export default async function HomePage() {
  const insights = (await getCollection("insights")).slice(0, 3);
  return <>
    <section className="border-b border-rule">
      <div className="frame grid gap-14 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
        <div>
          <p className="eyebrow">Consulting since {site.founded}</p>
          <h1 className="h1 mt-5 max-w-[15ch]">Most AI projects are data projects in a better suit.</h1>
          <p className="lede mt-7">We help teams find where AI genuinely helps, build the systems that deliver it, and keep the data underneath in good order. We started with the last part, in 2009.</p>
          <div className="mt-10 flex flex-wrap gap-3"><Link href="/contact" className="btn-primary">Start a conversation</Link><Link href="/work" className="btn-ghost">How we work</Link></div>
        </div>
        <div className="on-ink"><Trace label="assessment · one workflow" steps={practices[0].trace} caption="Every engagement starts here: short, paid, and scoped so you can judge the work before committing to more." /></div>
      </div>
    </section>
    <section className="band frame">
      <SectionHead eyebrow="What we do" title="Full AI services" lede="Advisory, building, data foundations, and ongoing support. One company across the whole lifecycle." action={{ href: "/work", label: "All practices" }} />
      <ul className="grid gap-5 md:grid-cols-2">{practices.slice(0, 4).map((p, i) => <li key={p.slug}><Link href={`/work/${p.slug}`} className="card-link flex h-full flex-col"><span className="eyebrow">{String(i + 1).padStart(2, "0")}</span><h3 className="h3 mt-3">{p.name}</h3><p className="mt-3 leading-relaxed text-muted">{p.short}</p><span className="mt-6 text-sm text-indigo">Read more →</span></Link></li>)}</ul>
    </section>
    <section className="band-ink"><div className="frame band">
      <SectionHead eyebrow="How we work" title="Three commitments we put in writing" />
      <dl className="grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 md:grid-cols-3">{[
        { t: "Start small and paid", d: "A short assessment of one workflow, so you can judge the work before committing to more. Most engagements begin under a month." },
        { t: "Full AI services", d: "Assessment, building, data foundations, and support after launch. One company for the whole job." },
        { t: "You own everything", d: "Code, infrastructure, and documentation, in your accounts. No dependency on us by design." }
      ].map((c) => <div key={c.t} className="bg-ink p-7"><dt className="font-display text-xl">{c.t}</dt><dd className="mt-3 text-sm leading-relaxed text-ink-muted">{c.d}</dd></div>)}</dl>
    </div></section>
    <section className="band frame border-t border-rule">
      <SectionHead eyebrow="Industries" title="Industry workflows, explained through the work" lede="Documented functionality and clear human decision points, without customer identities or unverified outcomes." action={{ href: "/sectors", label: "Explore industries" }} />
      <ul className="grid gap-5 md:grid-cols-2">
        <li><Link href="/work/structured-order-intake" className="card-link flex h-full flex-col"><span className="eyebrow">Manufacturing and order operations</span><h3 className="h3 mt-3">Configurable-product order intake with human confirmation</h3><p className="mt-3 leading-relaxed text-muted">Structured product requests and submission notifications, with a review step before order confirmation. Verification records document test submissions, not measured commercial outcomes.</p><span className="mt-6 text-sm text-indigo">Explore the work →</span></Link></li>
        {publishedSectors().map((s) => <li key={s.slug}><Link href={`/sectors/${s.slug}`} className="card-link flex h-full flex-col"><span className="eyebrow">{s.name}</span><h3 className="h3 mt-3">{s.short}</h3><p className="mt-3 leading-relaxed text-muted">{s.lede}</p><span className="mt-6 text-sm text-indigo">Read more →</span></Link></li>)}
      </ul>
    </section>
    <section className="band frame border-t border-rule">
      <SectionHead eyebrow="Partnerships" title="Platforms we build on" lede="What matters is what we do with them." action={{ href: "/partners", label: "Details" }} />
      <PartnerWall items={partners.map(({ name, domain, why }) => ({ name, domain, why }))} />
    </section>
    {insights.length > 0 && <section className="band frame border-t border-rule">
      <SectionHead eyebrow="Insights" title="Notes from the work" action={{ href: "/insights", label: "All insights" }} />
      <ul className="divide-y divide-rule border-y border-rule">{insights.map((post) => <li key={post.slug}><Link href={`/insights/${post.slug}`} className="group grid gap-3 py-7 hover:bg-paper-raised sm:grid-cols-[9rem_1fr] sm:gap-8"><p className="eyebrow">{formatDate(post.date)} · {post.readingTime} min</p><div><h3 className="font-display text-xl group-hover:text-indigo">{post.title}</h3><p className="mt-2 max-w-measure leading-relaxed text-muted">{post.summary}</p></div></Link></li>)}</ul>
    </section>}
    <CalloutCTA title="Tell us what you're trying to do." body="A paragraph is plenty. We will tell you whether it is a job for AI, a job for a pipeline, or not a job at all." secondary={{ href: "/capability", label: "Capability statement" }} />
  </>;
}
