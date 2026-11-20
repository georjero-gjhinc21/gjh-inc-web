import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h2 mt-3">{title}</h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn-ghost shrink-0">
          {action.label} →
        </Link>
      )}
    </div>
  );
}

/**
 * Partner wall. Named, with the reason stated — not a logo ticker.
 * A technical buyer discounts logo volume; they read the "why".
 */
export function PartnerWall({
  items,
}: {
  items: { name: string; domain: string; tier?: string; why?: string }[];
}) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-card border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.name} className="bg-paper p-6">
          <p className="font-mono text-label uppercase text-muted">{p.domain}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="font-display text-xl">{p.name}</p>
            {p.tier && <span className="rounded-chip border border-indigo/25 bg-indigo/[0.06] px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-indigo">{p.tier}</span>}
          </div>
          {p.why && <p className="mt-3 text-sm leading-relaxed text-muted">{p.why}</p>}
        </li>
      ))}
    </ul>
  );
}

export function CalloutCTA({
  title,
  body,
  primary = { href: "/contact", label: "Start a conversation" },
  secondary,
}: {
  title: string;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="band-ink">
      <div className="frame py-20">
        <div className="max-w-2xl">
          <h2 className="h2">{title}</h2>
          <p className="lede mt-5">{body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={primary.href} className="btn-primary">
              {primary.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn-ghost">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
