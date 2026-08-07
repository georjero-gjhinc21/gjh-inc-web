import Link from "next/link";
import { nav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="frame py-28">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-5 max-w-[16ch]">That page isn&apos;t here.</h1>
      <p className="lede mt-6">It may have moved, or the link may be wrong. Try one of these instead.</p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {[...nav, { href: "/contact", label: "Contact" }].map((n) => (
          <li key={n.href}>
            <Link href={n.href} className="btn-ghost">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
