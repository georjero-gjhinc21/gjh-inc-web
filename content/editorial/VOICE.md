# Voice guide

The two seed articles in `content/insights/` are the reference. This file says
what they are doing so a draft can do it deliberately rather than by imitation.

## The register

Write like a senior engineer explaining a decision to another senior engineer
who will have to live with it. Not a vendor, not a teacher, not a newsletter.

The reader is a data lead, a platform engineer, or an agency CIO. They have been
sold to before and it did not go well. They discount superlatives on sight, and
they are looking for one thing: evidence that the writer has actually done this
and knows where it breaks.

## What every piece must do

**Open on the reader's problem.** First sentence names a situation they
recognise. Never open with what GJH does, never open with an industry trend,
never open with "in recent years".

**Make a claim someone could disagree with.** If no competent person could read
the thesis and say "no, that's wrong", there is no thesis. "Write the evaluation
set before you write the prompt" is a claim. "Evaluation is important" is not.

**Name the failure mode.** Say what goes wrong when people do it the other way,
concretely, with the shape of the failure. Six weeks of prompt tuning that made
things worse and nobody could tell. A retrieval registry with twenty modes and
no golden set. A polished chat surface over 50% document accuracy.

**Show machinery.** A schema, a code block, a trace, a directory layout, a
config file. One concrete artifact per piece minimum. This is the difference
between a post a buyer reads and a post a buyer forwards.

**Say what it costs.** Time, tokens, headcount, or a trade-off given up.
Anything presented as free is not believed.

**End on order of operations.** What to do first, second, third. The reader
should be able to start on Monday.

## Length and shape

900–1,600 words. Three to five `##` sections. No `###` unless the piece is a
reference. Headings state claims, not labels: "The failure mode this avoids",
not "Background".

No introduction paragraph that announces what the article will cover. Start.

## Sentences

- Sentence case in headings and buttons.
- Active voice. The subject does the thing.
- Short sentences beat long ones. A long one is fine when it is carrying
  structure, and bad when it is carrying hedges.
- Contractions are fine. Exclamation marks are not.
- Do not address the reader's emotional state. No "you might be frustrated by".
- Do not use "we" to mean the industry. "We" is GJH.

## Words that end a draft

The full list is enforced in `scripts/claims.config.json`. The spirit of it:
any word that would survive being pasted onto a competitor's site is a word
carrying no information. If a sentence needs "transformative" to have weight,
the sentence has no weight.

Also avoid, though not machine-checked: "simply", "just", "of course",
"obviously", "it's important to note", "at the end of the day", "in today's
landscape", and any sentence beginning "As AI continues to".

## Numbers

Every number is a claim and the gate treats it as one. Three legitimate ways to
use one:

1. **Anchored.** Add `evidence: [id]` to the front matter, with the id resolving
   to a `published` entry in `ledger.yaml`. Use this for anything that happened.
2. **Illustrative.** Set `claims: illustrative` in the front matter when the
   whole piece is a worked example — a cost model, a sizing exercise, a "here is
   how the arithmetic goes" argument. The reader must be able to tell.
3. **Hedged in place.** "As a starting point, forty cases." "Suppose the
   corpus is a hundred thousand documents." The gate recognises these markers.

Never a fourth way. A round unattributed number is worse than no number,
because it invites exactly the question you cannot answer.

## Client material

No client is named until the ledger entry says `published`, which requires
written approval. Until then, write the shape of the problem without the
identity: "a retail bank's internal retrieval platform" is publishable, the
bank's name is not. Do not stack details until the identity is reconstructible
— three specifics about an unnamed company in one paragraph is a name.

## The self-check before opening a PR

1. Could a competitor paste any paragraph of this onto their own site
   unchanged? Rewrite those paragraphs.
2. Is there at least one artifact a reader could copy?
3. Does the first sentence describe the reader's situation?
4. Is every number anchored, illustrative, or hedged?
5. Is there a claim in here that a competent reader could disagree with?
6. Does `npm run check:claims` pass?

Five yeses and a pass. Otherwise it is not ready.
