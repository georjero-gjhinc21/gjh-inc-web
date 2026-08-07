---
title: "Write the evaluation set before you write the prompt"
summary: "Forty graded cases, drawn from real inputs, cost about a day. Skipping them costs about six weeks."
date: "2026-06-18"
topic: "Evaluation"
author: "GJH Inc."
---

The single highest-return hour on an AI build is the one spent writing down what a correct answer looks like, before anyone touches a prompt.

## The failure mode this avoids

Without a graded set, prompt engineering becomes a search with no fitness function. You change a line, try three inputs, and it feels better. It probably is better on those three. You have no idea what it did to the other four hundred.

We have seen teams spend six weeks in this loop and finish with a system that was measurably worse than their first draft, which nobody could tell because nobody had measured the first draft.

## What a usable set looks like

Forty cases is enough to start. Fewer than twenty and noise dominates.

Draw them from real inputs — actual support tickets, actual documents, actual questions people asked. Invented cases test the system against your imagination, which is not the thing that will be using it.

Include the ugly ones deliberately. The malformed input, the question that assumes something false, the request that should be refused, the one where the correct answer is *I don't know*. A system that never says it does not know will confidently make things up, and your happy-path cases will never catch it.

Grade in whatever way is cheapest and still honest. Exact match where there is a right answer. A checklist where there is not. A second model as a judge, calibrated against a human on a subset, where volume demands it — but check the judge before you trust it.

## What it buys you

Once the set exists, everything downstream gets easier. Model swaps become a measurement instead of a debate. Retrieval changes get attributed. Regression from a dependency update gets caught before a user finds it. Someone asking *is this working* gets a number rather than an anecdote.

It also changes the conversation with the people paying for the work. "Pass rate went from 71% to 92% and here are the twelve cases still failing" is a different kind of update from "it's coming along well."

## The order that works

Define the task. Collect forty real inputs. Agree what correct means, in writing, with whoever owns the outcome. Run the naive version and record its score — this is your baseline, and it is often better than people expect.

Only then start improving.
