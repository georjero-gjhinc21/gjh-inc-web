# Design system

Written so a future contributor can tell a decision from a habit.

## The brief, restated

Three references were given: keep the previous gjh-inc.com aesthetic where it
worked, borrow from gjhconsulting.net, and take LangChain's approach to
technical content because it demonstrates capability more credibly.

Those three pull in different directions. The resolution below takes the
*structural* lesson from LangChain, the *editorial* lesson from
gjhconsulting.net, and the *palette* from the previous GJH site — and drops
what each does badly.

| Reference | Kept | Dropped, and why |
|---|---|---|
| Previous gjh-inc.com | Indigo `#4338CA`, Inter, warm paper `#FBFBF9` | Glassmorphism, blurred gradient blobs, `rounded-full` pills, violet as a second accent. All of it reads as 2023 template SaaS and none of it says anything true about GJH. |
| gjhconsulting.net | Article metadata pattern (date · topic · read time), topic tagging | "Next-Gen", "cutting-edge", "unlock". Superlative copy is what a technical buyer discounts first. |
| langchain.com | Machinery shown rather than described; proof stated as measurements; docs-grade type discipline | The logo wall. LangChain has Nvidia and Cisco to show. GJH does not, and a thin imitation of that section actively hurts. |

## Palette

Two surfaces, one accent, one status colour. That is the entire system.

```
--paper       #FBFBF9   base, carried over from the current site
--paper-raised #F4F3EF  hover and subtle banding
--paper-sunk  #EDEBE5   inline code, chips
--ink         #14142B   dark bands
--ink-raised  #1E1E3A   cards on ink
--indigo      #4338CA   brand, preserved. links and primary action
--indigo-lift #6366F1   hover, and actor names in the trace
--signal      #10B981   status only — never decoration
--rule        #E2E1DA   hairlines
```

Violet is gone. It was doing nothing that indigo was not, and two accents plus
a gradient is how a palette stops meaning anything.

**The alternation carries meaning.** Paper is what we say — prose, argument,
practice descriptions. Ink is what we ship — traces, results, machinery. Once
you know the rule, the page structure is legible before you read a word.

## Typography

Three roles, deliberately not one family doing all three.

- **Display — Newsreader.** An optical-size serif, set at normal weight with
  tight tracking. Editorial gravity rather than tech-startup grotesque. It says
  the firm writes and thinks, which is the actual product in an advisory
  engagement. Used large and sparingly.
- **Body — Inter.** Kept from the existing brand. It is a good UI face and
  changing it would be change for its own sake.
- **Utility — JetBrains Mono.** Eyebrows, labels, metrics, chips, and the
  trace. Also kept from the existing brand system, but promoted from
  "code blocks only" to a load-bearing role.

The serif/mono pairing with no display sans is the deliberate choice here.
Newsreader against JetBrains Mono reads as *a firm that publishes*, which is
the register federal and enterprise buyers respond to.

Display sizes are fluid `clamp()` — no jumps at breakpoints.

## Structure

Eyebrows label the *role* of a section, not a number. Numbered markers appear
in exactly two places — the practice list and the "what happens next" steps —
because in both cases order carries information the reader needs. Nowhere else.

Radius is 4px on chips, 10px on cards. The old `rounded-full` pill button is
gone. A pill against a hairline rule is a mismatch; if GJH wants it back, it is
one token in `tailwind.config.ts`.

No blur, no shadow, no gradient anywhere in the system. Separation is done with
hairlines and surface changes. This is a discipline, not a limitation — it is
also most of why First Load JS is 106 kB.

## Signature: the engagement trace

`src/components/trace.tsx`.

A GJH engagement renders as a run log — timestamped, attributed to an actor,
with a status chip and a blinking indicator. It is the artifact the buyer (a
data lead, a platform engineer, an agency CIO) reads all day, so it argues for
competence in a form they already trust rather than asserting it in prose.

It is honest structure, not decoration: every row carries a real sequence
position, a real owner, and a real output. When the content stops being true
the component should be changed, not the content bent to fit it.

It recurs on purpose — engagement shape on practice pages, delivery history on
case studies, the first two weeks on the homepage. One idea, used three times,
is what makes a site memorable. Three ideas used once each is what makes it
noise.

**Boldness is spent here and nowhere else.** Everything around the trace is
deliberately quiet.

## Copy

Sentence case throughout. Active voice. The button says what happens
("Send message") and the success state uses the same verb ("Sent"). Errors say
what went wrong and give a route through; they do not apologise.

No superlatives, no "cutting-edge", no "unlock", no exclamation marks. The
homepage headline names a claim you could disagree with, which is the point.

## Quality floor

Not announced anywhere in the UI, just met: responsive to 320px, visible
keyboard focus with a consistent shape, `prefers-reduced-motion` respected,
skip link, `aria-current` on active nav, semantic landmarks, AA contrast on
both surfaces.
