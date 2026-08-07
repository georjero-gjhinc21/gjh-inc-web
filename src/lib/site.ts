/**
 * Single source of truth for site-wide facts.
 *
 * RULE: every claim in this file must be verifiable. Anything GJH has not
 * confirmed in writing belongs in content/TODO-CLIENT-INPUT.md, not here.
 */

export const site = {
  name: "GJH Inc.",
  legalName: "GJH INC",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gjh-inc.com",
  email: "info@gjh-inc.com", // canonical everywhere
  linkedin: "https://www.linkedin.com/company/gjhinc",
  founded: "2009",
  tagline: "Consulting for organizations putting AI to work.",
  description:
    "GJH Inc. helps teams find where AI genuinely helps, build the systems that deliver it, and keep the data underneath in good order. Consulting since 2009.",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/insights", label: "Insights" },
  { href: "/partners", label: "Partners" },
  { href: "/about", label: "About" },
] as const;

/** Proof numbers. Each needs a source before it ships. */
export const proof = [
  { value: "2009", label: "Consulting since", note: "verified — stated on gjh-inc.com" },
  { value: "5", label: "Cloud & AI partnerships", note: "verified — Anthropic, Google, AWS, Databricks, Snowflake" },
  { value: "TBD", label: "Engagements delivered", note: "NEEDS GJH INPUT" },
  { value: "TBD", label: "Median time to first working system", note: "NEEDS GJH INPUT" },
] as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    email: site.email,
    foundingDate: site.founded,
    description: site.description,
    sameAs: [site.linkedin],
    knowsAbout: [
      "Artificial intelligence consulting",
      "Data engineering",
      "Data warehousing",
      "Retrieval augmented generation",
      "Workflow automation",
      "Analytics engineering",
    ],
    areaServed: "US",
  };
}
