---
title: "What to ask an AI vendor before you sign"
summary: "Five questions that separate a systems shop from a slidedeck. Ask them in the first meeting and most of the vendor scorecard fills itself in."
date: "2026-07-15"
topic: "Buying"
author: "GJH Inc."
---

Most organisations buy AI badly because they ask the wrong first question. They ask *which model*, and the honest answer is that the model is the least interesting part of an AI project. A retrieval system reads your data, joins it in ways nobody anticipated, and presents whatever it finds in fluent prose — the model is the last thing you should be deciding on.

Ask these five questions instead. They do not require AI expertise to score; they just require not letting a vendor talk you out of asking.

## 1. Which data will it read, exactly?

The vendor will name platforms. You want names of tables. When a system can name the sources it indexes, describe their freshness, and say what happens when one of them changes shape, that is a systems answer. "We connect to your application" is a pitch.

## 2. How will we tell if it is better next month than it is this month?

This is the question that sorts everyone. A real answer is an evaluation set — forty real inputs with agreed correct outputs — and a recorded baseline. Anything else is a demo with extra steps. If the vendor cannot say how improvement will be measured, improvement will not happen, because tuning without a measurement is guessing with better vocabulary.

## 3. What do you do when it is wrong?

Every AI system is wrong sometimes, and the difference between vendors is what happens then. Do false answers get traced, logged, and reviewed? Is there a mechanism for a user to flag something that will not catch it? The bad sign is a vendor who says *the model is very accurate*. The good sign is one who has already described the failure mode.

## 4. Who owns it when you leave?

Code, infrastructure, configuration, documentation. If the deliverable leaves you dependent on the vendor who built it, you have not bought a system, you have bought a dependency. The contract should make it easy to leave, because a contract that makes it hard to leave is how you become a captive customer.

## 5. What will you not build for us?

A good vendor rules things out. If the honest answer to a workflow is that a scheduled report and a cleaner join key would solve it at a fraction of the cost, the vendor should say so — and a vendor who will not say it is selling you a model you do not need.

None of these are gotcha questions. They are the same due diligence you would apply to any systems contract, translated for software that talks back. If a vendor cannot answer them in the first meeting, the systems work has not been done, and no amount of model performance makes up for that.