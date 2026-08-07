/**
 * Practice areas. These expand the four areas already published on
 * gjh-inc.com rather than inventing a new taxonomy, plus one public-sector
 * area that routes to the sister property.
 *
 * `trace` is the engagement shape rendered by <Trace/> — it is the honest
 * sequence of a real engagement, not marketing steps. Keep it accurate.
 */

export type TraceStep = {
  t: string;
  actor: string;
  detail: string;
  status?: "ok" | "run";
};

export type Practice = {
  slug: string;
  name: string;
  short: string;
  lede: string;
  body: string[];
  delivers: string[];
  signals: string[]; // when a buyer should call about this
  stack: string[];
  trace: TraceStep[];
};

export const practices: Practice[] = [
  {
    slug: "advisory",
    name: "Advisory",
    short: "Where AI is worth the effort, and where it isn't.",
    lede:
      "We look at the work your team actually does before recommending anything. Most of the value in an AI assessment is in what it rules out.",
    body: [
      "An advisory engagement starts with observation, not a workshop. We sit with the people doing the work, read the artifacts they produce, and time the loops they repeat. That produces a short list of candidate workflows ranked by how much of the task is genuinely language-shaped and how much is data plumbing wearing a costume.",
      "You get a written recommendation with the losers named as clearly as the winners. If the honest answer is that a scheduled report and a cleaner join key would solve the problem, we will say so and it will cost you a fraction of a model deployment.",
    ],
    delivers: [
      "Workflow inventory with time-on-task measured, not estimated",
      "Ranked opportunity list with expected effort and failure modes",
      "Explicit do-not-build list with reasoning",
      "Reference architecture for the top one or two candidates",
      "Cost model covering inference, storage, and the people who keep it running",
    ],
    signals: [
      "A board or agency head has asked what the AI plan is",
      "A pilot worked in a demo and stalled on contact with real data",
      "Several vendors are quoting wildly different numbers for the same problem",
    ],
    stack: ["Claude", "Databricks", "Snowflake", "dbt", "Python"],
    trace: [
      { t: "day 01", actor: "gjh.discovery", detail: "shadow 3 workflows · interview 6 practitioners", status: "ok" },
      { t: "day 04", actor: "gjh.data", detail: "profile source systems · row counts, freshness, null rates", status: "ok" },
      { t: "day 09", actor: "gjh.analysis", detail: "score 11 candidates → 2 build · 3 defer · 6 decline", status: "ok" },
      { t: "day 14", actor: "gjh.delivery", detail: "recommendation memo + reference architecture", status: "ok" },
      { t: "day 15", actor: "client", detail: "decide: proceed, defer, or stop — no obligation", status: "run" },
    ],
  },
  {
    slug: "building",
    name: "Building",
    short: "Assistants, automations, and internal tools that hold up in production.",
    lede:
      "Systems that run against your real records and keep working once people depend on them daily.",
    body: [
      "A demo has to work once. A system has to work on the Monday after a schema change, when the source API is rate limiting and the person who understood the edge case is on leave. We build for the second case: retrieval grounded in your own records, evaluation sets written from real failures, and the operational surface — logs, traces, cost per run — visible from day one.",
      "Every build ships with an evaluation harness. Before we change a prompt, a retrieval strategy, or a model, we can tell you whether the change made things better and by how much. Without that, tuning an AI system is guessing with extra steps.",
    ],
    delivers: [
      "Working system in your infrastructure, in your cloud account",
      "Evaluation suite with graded cases drawn from real inputs",
      "Tracing and cost instrumentation from the first deploy",
      "Runbook covering failure modes, escalation, and rollback",
      "Handover sessions until your team can change it without us",
    ],
    signals: [
      "A pilot needs to become something the business can rely on",
      "Staff are copying between systems because nothing connects them",
      "An assistant answers plausibly but nobody can prove it answers correctly",
    ],
    stack: ["Claude", "Model Context Protocol", "TypeScript", "Python", "Postgres", "AWS"],
    trace: [
      { t: "wk 01", actor: "gjh.scope", detail: "define eval set · 40 graded cases from real tickets", status: "ok" },
      { t: "wk 02", actor: "gjh.retrieval", detail: "index 4 sources · lineage + freshness checks wired", status: "ok" },
      { t: "wk 03", actor: "gjh.build", detail: "assistant v1 · tracing on · baseline 71% pass", status: "ok" },
      { t: "wk 05", actor: "gjh.tune", detail: "retrieval rewrite → 92% pass · p95 latency 2.1s", status: "ok" },
      { t: "wk 06", actor: "gjh.handover", detail: "runbook + two working sessions with your engineers", status: "ok" },
      { t: "live", actor: "client.team", detail: "owns repo, keys, and infrastructure", status: "run" },
    ],
  },
  {
    slug: "data-foundations",
    name: "Data foundations",
    short: "Warehouses, pipelines, and models — the part everyone skips.",
    lede:
      "Most disappointing AI projects are data problems wearing a different hat. This is the practice we have been running since 2009.",
    body: [
      "Before there was a reason to call it AI work, this was the whole business: the unglamorous architecture underneath reporting and analytics. That background is why we ask about your data before we talk about models. A retrieval system inherits every quality problem in the tables it reads, and then presents them in confident prose.",
      "We build lakehouse and warehouse architecture, the pipelines that feed it, and the semantic models that make it queryable by both people and machines. Tested, documented, and version controlled — with lineage you can follow from a number on a dashboard back to the row that produced it.",
    ],
    delivers: [
      "Lakehouse or warehouse architecture on Databricks, Snowflake, or your existing platform",
      "Ingestion and transformation pipelines with tests and alerting",
      "Semantic and metric layer so one definition of revenue exists",
      "Data quality monitoring: freshness, volume, distribution, schema drift",
      "Documented lineage from dashboard figure to source row",
    ],
    signals: [
      "Two teams present different numbers for the same metric",
      "Reporting is a person with a spreadsheet and a Tuesday",
      "An AI initiative is blocked because nobody trusts the underlying tables",
    ],
    stack: ["Databricks", "Snowflake", "dbt", "Airflow", "Python", "SQL"],
    trace: [
      { t: "wk 01", actor: "gjh.audit", detail: "profile 40 tables · flag 9 with silent freshness gaps", status: "ok" },
      { t: "wk 02", actor: "gjh.design", detail: "target model · bronze/silver/gold + metric layer", status: "ok" },
      { t: "wk 04", actor: "gjh.pipeline", detail: "ingestion live · 214 tests · alerting to your channel", status: "ok" },
      { t: "wk 07", actor: "gjh.semantic", detail: "metric definitions agreed and locked with finance", status: "ok" },
      { t: "wk 08", actor: "gjh.cutover", detail: "parallel run complete · legacy reports retired", status: "ok" },
    ],
  },
  {
    slug: "staying-with-it",
    name: "Staying with it",
    short: "Monitoring, tuning, and support after launch.",
    lede:
      "For as long as it is useful to you, and no longer. Support is a service, not a hostage arrangement.",
    body: [
      "AI systems drift. Usage patterns shift, source data changes shape, and a model update can quietly move behaviour that nobody was watching. Ongoing support means we run the evaluation suite on a schedule, watch cost and latency, and tell you when something has moved before your users do.",
      "You own everything we build — the code, the infrastructure, the documentation. There is no dependency on us by design. If you want to take support in-house at month four, that is a successful outcome, and we will help you get there.",
    ],
    delivers: [
      "Scheduled evaluation runs with regression alerting",
      "Cost and latency monitoring with monthly written review",
      "Model and dependency upgrade testing before you adopt them",
      "Named senior contact, not a ticket queue",
      "Exit plan on request, with knowledge transfer",
    ],
    signals: [
      "Something is live and nobody is watching whether it still works",
      "Costs are moving and no one can attribute the change",
      "Your team wants to own it but needs a bridge to get there",
    ],
    stack: ["Evaluation harness", "Tracing", "Plausible", "Your cloud account"],
    trace: [
      { t: "monthly", actor: "gjh.evals", detail: "regression suite · pass rate + drift report", status: "ok" },
      { t: "monthly", actor: "gjh.cost", detail: "spend by workflow · flag anomalies over 15%", status: "ok" },
      { t: "on release", actor: "gjh.upgrade", detail: "test model and dependency updates before adoption", status: "ok" },
      { t: "ongoing", actor: "client.team", detail: "full access · can take over at any time", status: "run" },
    ],
  },
  {
    slug: "public-sector",
    name: "Public sector",
    short: "Federal procurement, delivered through GJH Consulting.",
    lede:
      "Government contracting, GSA schedules, and federal compliance run through our sister practice at gjhconsulting.net.",
    body: [
      "Public sector work has its own vocabulary, its own review cycles, and its own evidence standards. We keep that practice on a separate property so neither audience has to read past the other's material.",
      "The engineering is the same team. If a federal engagement needs data architecture or an AI system built, the practice areas on this site are what deliver it.",
    ],
    delivers: [
      "Federal procurement strategy and capture support",
      "GSA schedule guidance",
      "Compliance and security documentation support",
      "Technical delivery drawn from the practices on this site",
    ],
    signals: [
      "You are pursuing a federal opportunity with a technical scope",
      "An agency programme needs data or AI delivery under existing contract",
    ],
    stack: ["See gjhconsulting.net"],
    trace: [
      { t: "step 01", actor: "gjh.consulting", detail: "opportunity and capture strategy", status: "ok" },
      { t: "step 02", actor: "gjh.inc", detail: "technical approach and architecture", status: "ok" },
      { t: "step 03", actor: "joint", detail: "delivery under the awarded scope", status: "run" },
    ],
  },
];

export const getPractice = (slug: string) => practices.find((p) => p.slug === slug);
