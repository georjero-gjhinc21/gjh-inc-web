# Needed from GJH before launch

Nothing in this list is invented anywhere in the codebase. Every claim that
ships is traceable to something GJH has published or confirmed.

## Hard blockers

**1. Positioning decision.** AI/data consultancy (what gjh-inc.com says today,
what this repo builds) or federal contracting platform (what the PRD says)?
See `docs/ROADMAP.md` for the recommendation and reasoning. One line of
direction unblocks everything else.

## Needed, but the site ships without them

**2. Team.** Names, roles, and two or three sentences each. `/about` has the
slot. "Senior people do the work" is a stronger claim when the seniors are
named.

**3. Two real proof numbers.** `src/lib/site.ts` has `TBD` placeholders for
engagements delivered and median time to first working system. Anything
defensible beats a round number, and a round number that is wrong is worse than
no number.

**4. Certifications, if any.** SBA 8(a), HUBZone, SDVOSB, WOSB — current status
and expiry dates, with the award letter. **Nothing goes on `/capability` or
into the assistant's knowledge until documentation exists.** The PRD lists
these as unconfirmed; publishing them anyway is a real exposure.

**5. Federal identifiers.** UEI, CAGE, NAICS codes, and any contract vehicles.
Same rule as above.

**6. Partner confirmation.** Five partnerships are listed in
`src/lib/partners.ts`, taken from the live site. Confirm each is current and
that logo usage is permitted before any logo is added — partner marks are
trademark use.

**7. Contact routing.** Does `consult@gjh-inc.com` reach a monitored inbox? The
form promises a reply within two business days.

**8. Accounts.** Anthropic API key, Resend, Plausible, Cal.com link. All Wave 2.

## Corrections already applied

- `/terms` said `info@gjhconsulting.net`. Now `consult@gjh-inc.com`, sourced from
  `src/lib/site.ts` so it cannot diverge again. One canonical address for the
  whole site — the form, the API, the Cloudflare function, and the footers all
  read the same value.
- Founding year is 2009 throughout, matching the live site.
- Every nav item and card resolves to a real page; a dead internal route now
  fails the build.
- The 17-logo ticker is five named partnerships with a stated rationale.
- Google Tag Manager and the Tally iframe are gone.
