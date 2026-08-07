# gjh-inc.com

The GJH Inc. website. Next.js 15 (App Router), TypeScript, Tailwind, statically
generated. Content lives in markdown; there is no database on the critical path.

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm run build        # static export of every route
npm run typecheck
```

## Where things live

| Path | What it is |
|---|---|
| `src/lib/site.ts` | Company facts, nav, JSON-LD. **Single source of truth.** |
| `src/lib/practices.ts` | Practice areas and their engagement traces |
| `src/lib/partners.ts` | Partnerships. Verified entries only |
| `src/lib/content.ts` | Markdown loader for insights and case studies |
| `content/insights/*.md` | Articles |
| `content/case-studies/*.md` | Case studies (client-approved only) |
| `src/components/trace.tsx` | The signature element — see `docs/DESIGN.md` |
| `src/app/api/contact` | Contact intake |
| `src/app/api/chat` | Grounded site assistant (needs `ANTHROPIC_API_KEY`) |

## Publishing an article

Drop a markdown file in `content/insights/` with front matter:

```yaml
---
title: "..."
summary: "One sentence a stranger could repeat accurately."
date: "2026-08-01"
topic: "AI systems"
author: "GJH Inc."
---
```

The route, sitemap entry, Article JSON-LD, reading time, and related links are
generated. Nothing else to update.

## Rules that are not negotiable

1. **`info@gjh-inc.com` everywhere.** Never `info@gjhconsulting.net`. The old
   site had this wrong on `/terms`.
2. **No unverified claims.** Certifications, NAICS codes, contract vehicles,
   client names, and metrics go in `content/TODO-CLIENT-INPUT.md` until GJH
   supplies documentation. This applies to the assistant too — see the system
   prompt in `src/app/api/chat/route.ts`.
3. **No dead links.** Every nav item and card resolves to a real page. Run
   `npm run build` — an unresolvable route fails the build.
4. **First Load JS stays under 120 kB.** It is 106 kB today. Check the build
   output before merging anything that adds a dependency.

## Docs

- `docs/DESIGN.md` — the design system and why each choice was made
- `docs/ARCHITECTURE.md` — stack, rendering, and the path to agents
- `docs/ROADMAP.md` — waves, with what blocks each one
- `content/TODO-CLIENT-INPUT.md` — what GJH must supply before launch

## Deploying

Static output; any Node host works. Vercel or Cloudflare Pages are the least
friction. Set the env vars from `.env.example`, point DNS, done.
