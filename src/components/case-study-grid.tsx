"use client";

import Link from "next/link";
import { useState } from "react";

type Study = {
  slug: string;
  title: string;
  summary: string;
  sector?: string;
  topic?: string;
  results?: { metric: string; value: string }[];
};

/**
 * Case-study list with a sector filter. The filter row renders only when the
 * collection contains two or more distinct sector values, so it appears and
 * disappears with the content rather than with a fixed decision.
 */
export function CaseStudyGrid({ studies }: { studies: Study[] }) {
  const [active, setActive] = useState<string | null>(null);
  const sectors = [...new Set(studies.map((s) => s.sector).filter(Boolean))] as string[];
  const show = active ? studies.filter((s) => s.sector === active) : studies;

  return (
    <div>
      {sectors.length >= 2 && (
        <div className="mb-8">
          <p className="font-mono text-label uppercase text-muted">Sector</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive(null)}
              className={filterBtn(active === null)}
              aria-pressed={active === null}
            >
              All
            </button>
            {sectors.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActive(active === s ? null : s)}
                className={filterBtn(active === s)}
                aria-pressed={active === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="grid gap-5 md:grid-cols-2">
        {show.map((s) => (
          <li key={s.slug}>
            <Link href={`/case-studies/${s.slug}`} className="card-link flex h-full flex-col">
              <p className="font-mono text-label uppercase text-muted">{s.sector ?? s.topic}</p>
              <h3 className="h3 mt-3">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.summary}</p>
              {s.results && (
                <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6 [margin-top:1.5rem]">
                  {s.results.map((r) => (
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
    </div>
  );
}

function filterBtn(on: boolean) {
  return `rounded-chip border px-3 py-1.5 font-mono text-[12px] transition-colors ${
    on
      ? "border-indigo bg-indigo text-paper"
      : "border-rule bg-paper text-muted hover:border-rule-strong hover:text-ink"
  }`;
}