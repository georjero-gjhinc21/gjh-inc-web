/**
 * Sectors.
 *
 * Same rule as `site.ts`: every line here must be traceable to work that was
 * actually done. Two sectors, not six — the evidence supports financial
 * services and energy/utilities. Everything else is a client list, not a
 * practice.
 *
 * SHIP RULE: a sector renders on the site only when `evidence` contains at
 * least one entry with status "published" — i.e. a live case study or a named
 * practitioner. A sector with nothing under it is a claim, and
 * `loop/rubric.md` will mark it down on proof_density and falsifiability.
 * That is the harness working, not a bug to route around.
 *
 * NAMES: engagements below were delivered by GJH people, several of them not
 * under a GJH contract. Client names do not ship without written approval —
 * see `content/TODO-CLIENT-INPUT.md`. The sector descriptions here are written
 * to be accurate without them.
 */

export type EvidenceStatus =
  /** Live on the site — a case study or a named person */
  | "published"
  /** True and documented, but needs client sign-off before it can be named */
  | "needs-approval"
  /** Claimed but not yet documented. Never renders. */
  | "unverified";

export type SectorEvidence = {
  what: string;
  status: EvidenceStatus;
  /** Slug of the case study that carries this, once one exists */
  caseStudy?: string;
};

export type Sector = {
  slug: string;
  name: string;
  short: string;
  lede: string;
  body: string[];
  /** The constraints that make this sector different. This is the part that
   *  demonstrates domain knowledge rather than asserting it. Keep it specific
   *  enough that a practitioner could disagree with an item. */
  constraints: string[];
  /** When a buyer in this sector should call */
  signals: string[];
  evidence: SectorEvidence[];
  relatedPractices: string[];
};

export const sectors: Sector[] = [
  {
    slug: "financial-services",
    name: "Financial services",
    short: "Banking, payments, and the parts an examiner reads.",
    lede:
      "Most of what makes AI hard in a bank is not the model. It is entitlements, lineage, and being able to reproduce an answer six months later.",
    body: [
      "A retrieval system in a bank inherits the bank's access-control problem. If the index can read everything, it can surface material the person asking is not entitled to see, and that is a finding rather than a bug. Entitlements have to be enforced at query time, propagated from the system of record, before anything reaches a model.",
      "The second constraint is reproducibility. An answer that was correct in March has to still be explainable in September, against the version of the data that existed in March. Bitemporal correctness is unglamorous and it is the difference between a system that survives an examination and one that gets switched off during one.",
    ],
    constraints: [
      "Document-level entitlements enforced at retrieval, not at the knowledge-base boundary",
      "As-of reproducibility — the answer given in March, explained in September",
      "Lineage from a reported figure back to the row that produced it",
      "Information barriers and material non-public information handling",
      "Retention and legal hold applied to conversation logs, not just source documents",
      "Model risk governance: someone will ask how the system was validated, and 'it seemed better' is not an answer",
    ],
    signals: [
      "An assistant works in a demo and stalls at the security review",
      "Two systems disagree on the same figure and nobody noticed until now",
      "A pilot needs a validation story before it can go to a risk committee",
    ],
    evidence: [
      {
        what:
          "Data platform architecture and a data curation go-live for a US regional bank — infrastructure, migration, and stakeholder sign-off, delivered on schedule and on budget",
        status: "needs-approval",
      },
      {
        what:
          "Warehouse design handling high-volume financial transactions and sensitive client data, with metadata management and compliance reporting under audit",
        status: "needs-approval",
      },
      {
        what:
          "Enterprise database performance work at national-bank scale across systems holding billions of records",
        status: "needs-approval",
      },
      {
        what: "Transaction analytics and reporting pipelines at a payments company",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "building", "advisory"],
  },
  {
    slug: "energy-utilities",
    name: "Energy and utilities",
    short: "Meter data, forecasting, and reporting a public board will read.",
    lede:
      "Interval data arrives late, arrives wrong, and gets restated. Everything downstream has to survive that without quietly changing last month's numbers.",
    body: [
      "Metering data is not a clean stream. Reads arrive out of order, corrections land weeks later, and settlement depends on getting the restatement right rather than on getting the first pass right. A pipeline that overwrites is a pipeline that will make a board report change after the board has read it.",
      "The reporting audience is also different. A community choice aggregator answers to a public board and to a regulator, which means a number on a dashboard is a number someone may be asked to defend in a public meeting. That raises the bar on lineage from 'nice to have' to the thing the whole architecture is arranged around.",
    ],
    constraints: [
      "Late-arriving and restated interval reads — corrections handled as versions, not overwrites",
      "Settlement accuracy, where being fast and wrong costs more than being slow and right",
      "Forecasting against weather, which means the model is wrong sometimes by design and the system has to say so",
      "Customer energy usage data — privacy obligations distinct from the billing relationship",
      "Public-board and regulator accountability: every published figure needs a defensible path back to source",
    ],
    signals: [
      "Reporting is a person, a spreadsheet, and a deadline",
      "A restated read silently changed a number that had already been published",
      "Forecasting exists but nobody can say how wrong it usually is",
    ],
    evidence: [
      {
        what:
          "Owned the data architecture and analytics platform for a California community choice aggregator — pipelines over millions of metering and customer-engagement records",
        status: "needs-approval",
      },
      {
        what:
          "Energy-demand forecasting and predictive analytics delivered into stakeholder reporting",
        status: "needs-approval",
      },
      {
        what:
          "Data governance, query performance, and compliance for a regulated provider accountable to a public board",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "advisory", "staying-with-it"],
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);

/** Sectors that have cleared the ship rule. Render from this, not from `sectors`. */
export const publishedSectors = () =>
  sectors.filter((s) => s.evidence.some((e) => e.status === "published"));

/** For JSON-LD `knowsAbout` and llms.txt. Safe to publish before the ship rule clears —
 *  naming a domain you work in is not the same as claiming a client. */
export const sectorKeywords = [
  "Financial services data architecture",
  "Banking analytics and regulatory reporting",
  "Energy and utility data platforms",
  "Metering and interval data pipelines",
];
