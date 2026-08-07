# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router | Static generation for every content route; API routes where server work is genuinely needed |
| Language | TypeScript, strict | |
| Styling | Tailwind 3 with a closed token set | Tokens in `tailwind.config.ts` are the design system; see `docs/DESIGN.md` |
| Content | Markdown + front matter in `/content` | No database on the request path. Swap `src/lib/content.ts` for a CMS adapter when editorial volume justifies it — nothing else changes |
| Email | Resend | Single dependency, generous free tier |
| Analytics | Plausible | Cookieless, so no consent banner, so no CLS from a consent banner |
| Assistant | Anthropic Claude, server-side only | |
| Hosting | Any Node host. Vercel or Cloudflare Pages recommended | |

## Rendering

Every content route is prerendered at build time. Two dynamic routes exist:
`/api/contact` and `/api/chat`. Nothing else touches a server at request time.

Consequences worth keeping:

- 106 kB First Load JS. Budget is 120 kB — check the build output before adding
  a dependency.
- A broken internal route fails `npm run build`. This is the guardrail against
  the dead-link problem the previous site had.
- The sitemap is generated from the same modules that render the pages, so it
  cannot drift out of date the way a hand-edited `sitemap.xml` does.

## Grounding (the part that matters)

`src/app/api/chat/route.ts` builds its knowledge block from `src/lib/site.ts`,
`practices.ts`, and `partners.ts` — the same modules the pages render from. The
assistant cannot know something the site does not say.

The system prompt explicitly forbids stating certifications, contract vehicles,
NAICS codes, clearances, prices, timelines, or past clients. None are in the
knowledge block, and a confident wrong answer about set-aside status from a
consultancy's own website is a compliance problem, not a UX problem.

When the knowledge block grows past what fits comfortably in a system prompt,
move to retrieval over the same source modules. Do not move to a free-text
knowledge base an admin can edit without review.

## The path to agents

The consolidated PRD specifies seven autonomous agents. That is the right
destination and the wrong starting point — five of them have no data to act on
until the site has traffic and a lead history.

Sequence that works:

1. **Now.** Static site. Contact intake logs to console, emails via Resend once
   keyed.
2. **Next.** Postgres behind `/api/contact`. Leads persist. The assistant goes
   live, grounded as above. Plausible in.
3. **Then.** One worker, not five: a scheduled job that runs link checking and
   PageSpeed against the live site and writes a report. It is the agent with the
   clearest input and the least risk, and it proves the pattern.
4. **After that.** Content drafting into a review queue, then nurture sequences.
   Both need a human approval gate — that is not a nicety, it is the thing
   standing between an automated content engine and a credibility problem.

Admin dashboard, Stripe storefront, and multi-channel outreach come after there
is something to administer, sell, and outreach to. Build them when the volume
makes them cheaper than doing it by hand, not before.

## What was deliberately not carried over

- **Glassmorphism and gradient blobs.** See `docs/DESIGN.md`.
- **The 17-logo animated ticker.** Five named partnerships with a stated reason
  each. Volume reads as padding to the audience this site is for.
- **Google Tag Manager.** It was on the old pages, costs render-blocking script,
  and Plausible covers what is actually needed.
- **Tally embedded forms.** Third-party iframe, layout shift, and the data goes
  somewhere GJH does not control. Replaced with a native form.
- **`info@gjhconsulting.net` on `/terms`.** Fixed. `src/lib/site.ts` is now the
  only place an address is written down.
