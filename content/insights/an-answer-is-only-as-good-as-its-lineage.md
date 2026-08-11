---
title: "An answer is only as good as the lineage behind it"
summary: "Before you wire a language model to your data, ask whether a number on your dashboard can be traced to the row that produced it. If it cannot, neither can your citations."
date: "2026-07-30"
topic: "Data foundations"
author: "GJH Inc."
---

A retrieval system inherits every quality problem in the tables it reads, and then presents them in confident prose. That sentence is doing a lot of work, so let us unpack the part that is least obvious: the retrieval system cannot be more trustworthy than the data's lineage, because the citations it produces are just lineage rendered as prose.

## What lineage means here

Lineage is the answer to the question *where did this come from*. For a weekly report, it is being able to follow a figure from the dashboard back to the source row that produced it — through the join, the transform, and the aggregation — without asking a specific colleague.

For an assistant, the same question applies to every sentence. When the answer cites a document, a person should be able to reach that document, in the version that was current when the answer was given. That is not a documentation nicety. It is the mechanism by which a confident wrong answer becomes detectable.

## What happens without it

Two things, both of which we have watched happen.

First, the citations quietly drift. Documents get indexed once and re-edited; the assistant keeps citing superseded versions. Nobody notices because nobody built the reindexing job, and in the demo the corpus was fixed.

Second, the answer becomes unverifiable, and unverifiable is worse than wrong. A wrong answer with a traceable source can be corrected. An answer that nobody can trace gets argued about for three weeks and then the whole project gets switched off — because you cannot prove the system is right often enough to trust it, and you cannot prove the system is wrong often enough to fix it.

## The question to ask before you hook a model to anything

Pick a number that appears on your most important dashboard. Ask someone to follow it back to the row that produced it, unassisted, in under fifteen minutes.

If nobody can, then no assistant you build on that data will produce citations you can defend. The model will be fluent, and fluency without provenance is exactly how a bad answer sounds confident.

The good news is the fix is not exotic. Version the source data so a citation points at what was true when it was given. Keep a lineage record from dashboard to row. Watch freshness and schema drift before they become stale answers. Those are data-engineering habits, not model magic — which is the uncomfortable part: the hard work in most AI projects sits below the model, and it does not have a clever name.