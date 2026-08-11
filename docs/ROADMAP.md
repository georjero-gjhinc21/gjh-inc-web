# Roadmap

Each wave ships something usable on its own. Nothing here depends on a wave
that has not shipped.

## Wave 1 — Site (this repo, done)

Eleven routes, statically generated, 106 kB first load. Design system, content
pipeline, SEO, contact intake, legal pages with the correct address.

**Blocked on GJH for launch:** the items in `content/TODO-CLIENT-INPUT.md`.
One is a hard blocker — a decision on the positioning question below. The rest
can follow.

## Wave 2 — Instrumented

- Postgres behind `/api/contact`; leads persist with source and page history
- Resend keyed; enquiries reach an inbox
- Plausible on
- Site assistant live, grounded as specified in `docs/ARCHITECTURE.md`
- Cal.com embed on `/contact`

*Needs:* database, Resend account, Anthropic key, Cal.com link.

## Wave 3 — One worker

A single scheduled job: crawl the site, check every internal and external link,
pull PageSpeed, validate JSON-LD, write a report. It has the clearest input,
the least risk, and it proves the worker pattern before anything writes
customer-facing text.

*Needs:* Wave 2. PageSpeed Insights API key.

## Wave 4 — Content engine, with a gate

Drafting into a review queue. Nothing publishes without approval — the human
gate is the product, not a limitation. Editorial calendar. LinkedIn snippets on
approval.

*Needs:* Wave 3, and an editorial voice guide so drafts do not read as generic.
The two seed articles in `content/insights/` are the reference.

## Wave 5 — Pipeline

Lead scoring, nurture sequences by tier, admin view. Build when lead volume
makes manual follow-up expensive — not before, or you will be automating a
process nobody has run yet.

## Deliberately deferred

**Stripe storefront (five productized offerings).** The PRD specifies this.
Fixed-price productized consulting is a real model, but it needs the five
scopes written, priced, and delivered manually at least twice before it is
worth building checkout for. Selling an undelivered product from a website is
how a consultancy acquires a refund process.

**Admin dashboard.** Wave 5 at the earliest. Until there are leads, orders, and
agent events, it is a UI over empty tables.

**SAM.gov opportunity tracker, Apollo enrichment, SMS outreach.** All belong to
the federal practice. Build them on gjhconsulting.net if they get built.

---

## The open question, which is not a technical one

There are currently two incompatible GJH stories in circulation:

- **The live gjh-inc.com** — an AI and data consultancy, founded 2009, partnered
  with Anthropic, Google, AWS, Databricks, and Snowflake. Four practices. No
  government-contracting language, no certifications claimed. Restrained, and
  believable.
- **The consolidated PRD** — a federal contracting platform with 8(a)/HUBZone
  positioning, seventeen partners, five productized offerings, and seven agents.

This repo builds the first, with the federal practice cross-linked to
gjhconsulting.net, because:

1. The PRD lists the certifications as *unconfirmed open items*. Publishing
   set-aside status that has not been verified is a compliance exposure in
   federal marketing, not an SEO tactic.
2. The PRD treats gjhconsulting.net as a competitor to track keywords against.
   It is GJH's own property. Two GJH sites competing for the same federal terms
   split the authority instead of building it.
3. The Anthropic and Databricks partnerships are a genuinely differentiated
   position. "Government contracting consultancy" is a crowded one.

If GJH wants the federal positioning on gjh-inc.com instead, that is a
legitimate call — but it is a decision to make explicitly, not to arrive at by
merging both documents. Say which, and this repo follows in about a day.
