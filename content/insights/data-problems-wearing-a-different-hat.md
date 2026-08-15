---
title: "Most failed AI pilots are data failures with better branding"
summary: "Six pilots that stalled, and what was actually wrong in each. In five of them the model was fine."
date: "2026-07-22"
topic: "AI systems"
author: "GJH Inc."
claims: illustrative
---

A pattern shows up often enough now to be worth writing down. An organisation runs an AI pilot. The demo lands. Six weeks later the thing is quietly switched off, and the post-mortem blames the model — too expensive, too slow, hallucinated, not ready.

In most of the cases we have been called into, the model was not the problem.

## What the failures actually were

**The retrieval corpus was stale.** Documents were indexed once at pilot start. Four months later a third of the answers cited superseded policy. Nobody had built a reindexing job because in the demo the corpus was fixed.

**Two systems disagreed and nobody had noticed.** The assistant read from both. It gave confident, contradictory answers depending on phrasing. The underlying disagreement had existed for years; the assistant just made it visible and fast.

**Permissions were not modelled.** The retrieval layer had read access to everything, so it could surface material the asking user was not entitled to see. This was caught in week two of a security review and the project stopped there.

**There was no evaluation set.** The team tuned prompts on vibes. Every change made something better and something else worse, and there was no way to tell which was which. Six weeks of work produced a system nobody could prove was better than the first version.

**Latency came from the joins, not the model.** Inference took 900ms. Assembling context took nine seconds, because the retrieval query hit an unindexed table with a full scan.

**One genuinely was the model.** A summarisation task needed reasoning over long numeric tables and the chosen model was not good at it. Swapping models fixed it in an afternoon.

That is one out of six.

## Why this keeps happening

A demo has to work once, on data you chose. A system has to work every day on data you did not choose, that changes shape without telling you, at a volume nobody tested. Almost everything that separates the two lives below the model.

The uncomfortable version: if your data infrastructure could not support a reliable weekly report, it will not support a reliable assistant. The assistant is a harder consumer of that data, not an easier one. It reads more of it, joins it in ways nobody anticipated, and presents whatever it finds in fluent prose that is very hard to spot as wrong.

## What to check before blaming the model

Ask three questions before the next pilot.

**Can you trace a number back to its row?** If a figure appears on a dashboard, can someone follow the lineage to the source record without asking a specific colleague? If not, the assistant's citations will be equally unverifiable.

**Do you have forty graded examples?** Not a test plan — forty real inputs with agreed correct outputs. Without them you cannot tell improvement from movement.

**Who gets paged when it breaks?** If the answer is the person who built the pilot, and that person has other work, you have a prototype regardless of what it is called.

None of this is a reason not to build. It is a reason to spend the first two weeks somewhere other than the prompt.
