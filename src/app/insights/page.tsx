import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from GJH Inc. engagements on AI systems, data architecture, evaluation, and the things that go wrong in between.",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const posts = await getCollection("insights");
  const topics = Array.from(new Set(posts.map((p) => p.topic)));

  return (
    <>
      <section className="frame border-b border-rule py-20">
        <p className="eyebrow">Insights</p>
        <h1 className="h1 mt-5 max-w-[16ch]">Notes from the work</h1>
        <p className="lede mt-7">
          Written by the people doing the engagements. Specific enough to disagree with.
        </p>
        {topics.length > 1 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {topics.map((t) => (
              <li key={t} className="rounded-chip border border-rule px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="frame band">
        {posts.length === 0 ? (
          <p className="text-muted">No posts yet. Add markdown files to <code className="font-mono">content/insights/</code>.</p>
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group grid gap-3 py-8 transition-colors hover:bg-paper-raised sm:grid-cols-[11rem_1fr] sm:gap-10"
                >
                  <div className="font-mono text-label uppercase text-muted">
                    <p>{formatDate(post.date)}</p>
                    <p className="mt-1.5">{post.topic}</p>
                    <p className="mt-1.5">{post.readingTime} min read</p>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl group-hover:text-indigo">{post.title}</h2>
                    <p className="mt-3 max-w-measure leading-relaxed text-muted">{post.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
