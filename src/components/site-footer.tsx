import Link from "next/link";
import { practices } from "@/lib/practices";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="band-ink border-t border-white/10">
      <div className="frame py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
              <img src="/gjh-logo-full.png" alt="" width={28} height={28} className="h-8 w-8" />
              <p className="font-display text-2xl">{site.name}</p>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">{site.tagline}</p>
            <p className="mt-4 font-mono text-label uppercase text-ink-muted">
              Consulting since {site.founded}
            </p>
          </div>

          <FooterCol title="Practices">
            {practices.map((p) => (
              <FooterLink key={p.slug} href={`/work/${p.slug}`}>
                {p.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Site">
            {nav.map((n) => (
              <FooterLink key={n.href} href={n.href}>
                {n.label}
              </FooterLink>
            ))}
            <FooterLink href="/capability">Capability statement</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          <FooterCol title="Elsewhere">
            <FooterLink href={site.linkedin} external>
              LinkedIn
            </FooterLink>
            <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <div className="flex gap-6">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls = "text-sm text-ink-muted transition-colors hover:text-paper";
  return (
    <li>
      {external ? (
        <a href={href} className={cls} rel="noopener">
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
