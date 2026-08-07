# Needed from GJH before launch

Nothing in this list is invented anywhere in the codebase. Every claim that
ships is traceable to something GJH has published or confirmed.

## Hard blockers

**1. Positioning decision.** AI/data consultancy (what gjh-inc.com says today,
what this repo builds) or federal contracting platform (what the PRD says)?
See `docs/ROADMAP.md` for the recommendation and reasoning. One line of
direction unblocks everything else.

**2. Case studies — at least two.** `/case-studies` currently renders an empty
state. Use `content/case-studies/TEMPLATE.md.example`. For each: the problem,
what was built, and two or three numbers that moved. Client name only with
written approval — otherwise a sector description ("a mid-market insurer")
works and is common practice.

## Needed, but the site ships without them

**3. Team.** Names, roles, and two or three sentences each. `/about` has the
slot. "Senior people do the work" is a stronger claim when the seniors are
named.

**4. Two real proof numbers.** `src/lib/site.ts` has `TBD` placeholders for
engagements delivered and median time to first working system. Anything
defensible beats a round number, and a round number that is wrong is worse than
no number.

**5. Certifications, if any.** SBA 8(a), HUBZone, SDVOSB, WOSB — current status
and expiry dates, with the award letter. **Nothing goes on `/capability` or
into the assistant's knowledge until documentation exists.** The PRD lists
these as unconfirmed; publishing them anyway is a real exposure.

**6. Federal identifiers.** UEI, CAGE, NAICS codes, and any contract vehicles.
Same rule as above.

**7. Partner confirmation.** Five partnerships are listed in
`src/lib/partners.ts`, taken from the live site. Confirm each is current and
that logo usage is permitted before any logo is added — partner marks are
trademark use.

**8. Contact routing.** Does `info@gjh-inc.com` reach a monitored inbox? The
form promises a reply within two business days.

**9. Accounts.** Anthropic API key, Resend, Plausible, Cal.com link. All Wave 2.

## Corrections already applied

- `/terms` said `info@gjhconsulting.net`. Now `info@gjh-inc.com`, sourced from
  `src/lib/site.ts` so it cannot diverge again.
- Founding year is 2009 throughout, matching the live site.
- Every nav item and card resolves to a real page; a dead internal route now
  fails the build.
- The 17-logo ticker is five named partnerships with a stated rationale.
- Google Tag Manager and the Tally iframe are gone.
