# The content engine

How gjh-inc.com produces depth on a schedule without producing filler.

## The problem this shape solves

The obvious build is: schedule an agent, point it at a topic list, publish
daily. It works for about six weeks, and then the site is full of competent,
substitutable prose that says nothing a competitor could not say, at which point
the firm's stated differentiator — that it ships verifiable things rather than
promises — has been contradicted by its own homepage.

The failure is structural, not editorial. Daily volume against a finite stock of
real experience forces invention, and invention on a consultancy site is a
falsifiability problem, not a quality problem.

So the engine is built round a scarce resource, and the scarce resource is
evidence.

## The shape

```
ledger.yaml            what may be asserted, and by whose authority
      │
      ▼
calendar.yaml          finite queue: each entry has a thesis and an artifact
      │
      ▼
insight-writer         maker — drafts one piece against its anchors
      │
      ▼
check-claims.mjs       deterministic gate — free, ~2s, fails closed
      │
      ▼
evidence-checker       adversarial review — rejects, never rewrites
      │
      ▼
machine-legibility     does the argument survive a non-JS reader
      │
      ▼
draft PR               a human merges. Always.
      │
      ▼
publishing.jsonl       trend: drafts vs merges, edit size, waiver count
      │
      ▼
weekly review          proposes calendar and rubric changes. Applies nothing.
```

Three properties matter more than the parts:

**The queue is finite and cannot be extended by an agent.** An empty ready-queue
opens an issue asking for input. The loop is allowed to fail; it is not allowed
to invent.

**The cheap check runs before the expensive one.** `check-claims.mjs` costs
nothing and catches banned vocabulary, unanchored numbers, credential leakage,
email divergence, and schema breaks. The model reviewer is then asked only for
judgement — is this argument substitutable, is the artifact real, is the client
reconstructible — which is what a model is actually good for.

**Nothing customer-facing merges without a person.** Not because the drafts are
untrustworthy but because the human merge is where the training signal lives.
The diff between draft and merge is the most useful data the system produces.

## Cadence

Three insights a week, two examples a month. Not daily, deliberately.

Three defensible pieces outrun five forgettable ones on every measure a buyer
uses. The measure that matters is whether a piece gets forwarded inside a
prospect's company, and nothing gets forwarded because it was published on time.

If the ready-queue supports more, raise it. If a week produces two good pieces
and one blocked one, ship two.

## What actually converts

Ranked, from the evidence of how technical buyers behave:

1. **A case study with a named client and real numbers.** Blocked on one
   approval. Nothing else in this document substitutes for it.
2. **A runnable example.** A cloneable eval harness, a retrieval regression
   gate, a trace schema. A buyer who clones a repo has begun the engagement in
   their own head. These need no client approval, which makes them the highest
   available return right now.
3. **A teardown that diagnoses a system honestly**, including what the people
   who built it got right.
4. **An argument with an artifact in it.**
5. **An argument.**

The calendar is weighted accordingly. `this-site-runs-a-loop` sits near the top
because the harness is real, running, committed, and checkable by anyone — which
is the exact property the firm claims to sell and the cheapest possible proof
of it.

## Promotion from L1 to L2

Start with the loop drafting and a human rewriting heavily. Track the edit size.

Promote when the median human edit stops touching the argument and starts
touching only the sentences — roughly, when you are no longer changing what the
piece claims. That is usually four to six weeks in, and it is a measurement, not
a feeling. `history/publishing.jsonl` carries the data.

Never promote past L2 for anything under `content/`. The gate on customer-facing
claims is the product.

## What to fix in the engine when it disappoints

| Symptom | Likely cause | Where to fix it |
|---|---|---|
| Drafts read generic | `thesis` in the calendar entry is a topic, not a claim | `calendar.yaml` |
| Drafts read generic and the thesis is fine | Voice guide is too abstract | `VOICE.md`, with examples from merged pieces |
| Same gate failure every run | The rule is right and the drafting prompt does not know it | `insight-writer.md` |
| Same gate failure and the rule is wrong | Change the rule, in its own PR, with a reason | `claims.config.json` |
| Scores rising, quality flat | Rubric drift | `loop/improve.py` output, and D4 in `docs/DEFECTS.md` |
| Nothing to write about | The real constraint: no approved evidence | Get one case study approved |
