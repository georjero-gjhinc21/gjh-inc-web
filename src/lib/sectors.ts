/**
 * Sectors.
 *
 * Same rule as `site.ts`: every line here must be traceable to work that was
 * actually done. The strongest evidence supports financial services and
 * energy/utilities; the rest collect sectors where GJH has real delivery
 * history, described at the level of the work rather than through references.
 *
 * SHIP RULE: a sector renders on the site only when `evidence` contains at
 * least one entry with status "published" — i.e. a named, approved reference.
 * A sector with nothing under it is a claim, and `loop/rubric.md` will mark it
 * down on proof_density and falsifiability.
 *
 * NAMES: client names do not ship without written approval — see
 * `content/TODO-CLIENT-INPUT.md`. The sector descriptions here are written to
 * be accurate without them.
 */

export type EvidenceStatus =
  /** Live on the site — a named, approved reference */
  | "published"
  /** True and delivered, but needs client sign-off before it can be named */
  | "needs-approval";

export type SectorEvidence = {
  what: string;
  status: EvidenceStatus;
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
  /** The outcomes a buyer is buying — the promise, framed against the
   *  constraint that makes it hard. Direction, not invented numbers. */
  outcomes: string[];
  /** The engineering and safety gates that make this sector's AI work
   *  different from a demo. */
  delivery: string[];
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
    outcomes: [
      "An assistant that can only see what the person asking is allowed to see",
      "Reporting you can defend line by line, months after it ran",
      "Answers that still have provenance when a regulator asks where they came from",
    ],
    delivery: [
      "Entitlements enforced at query time, propagated from the system of record — nothing reaches a model without permission",
      "Bitemporal storage so an answer is explainable against the data version that existed when it was given",
      "Audit-ready validation before a pilot can reach a risk committee",
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
      "Public-board and regulator accountability: a figure is a figure someone may have to defend",
    ],
    outcomes: [
      "Number you publish once and can defend six months later",
      "Settlement and forecasting that survive a versioned, corrected feed",
      "A single path from any dashboard number back to the read that produced it",
    ],
    delivery: [
      "Corrections handled as versions, never in-place overwrites — restatements become part of history",
      "Forecast error surfaced honestly, not tuned until it stops counting",
      "Lineage arranged so a public board question ends at a source row, not a slide",
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
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Shop-floor data, quoting, and planning that has to survive the shift.",
    lede:
      "The skepticism is earned. A demo that works on clean data needs to survive the reality of a floor where the ERP, the MES, and the spreadsheet that actually runs the line disagree.",
    body: [
      "Manufacturing runs on systems whose incentives were never aligned. The ERP thinks a job is done when it is booked, the MES knows when it is actually cut, and the human coordinating the line has the real truth in a printed schedule with handwriting on it. AI work here lives or dies on reconciling those three before adding anything on top.",
      "The second reality is that the floor changes the schedule faster than any planner. Margin, quoting, and load come from historical records that are patchy and tribal. The question is whether you can make the tribal knowledge queryable without pretending the rapids in the data do not exist.",
    ],
    constraints: [
      "The ERP, the MES, and the floor never agree — reconciliation happens before intelligence",
      "Quoting history lives in files, quotes, and one person's memory",
      "Machine and labor identifiers are not clean primary keys across systems",
      "A model that suggests a non-feasible schedule is worse than no schedule — constraints are load-bearing",
    ],
    outcomes: [
      "Quoting pulled from prints, history, and material cost in minutes rather than days",
      "Production scheduling that anticipates a constraint before it stops a machine",
      "SOPs and tribal knowledge queryable, instead of surviving in one person's head",
    ],
    delivery: [
      "Reconciliation of ERP, MES, and shop-floor notes before any model is pointed at the data",
      "Scheduling built around machine feasibility, not a spreadsheet's availability",
      "Setup that treats a plant's messy identifiers as data to clean, not a reason to refuse the work",
    ],
    signals: [
      "Quoting takes days because pricing lives with the person who quotes",
      "Production scheduling is reactive, and the floor knows before the planner does",
      "The drive is full of SOPs nobody reads—yet",
    ],
    evidence: [
      {
        what:
          "Production intelligence and forecasting architecture connecting ERP, MES, and shop-floor signals for a manufacturing operation",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "building", "staying-with-it"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Clinical-adjacent systems where accuracy outranks speed, and privacy is base load.",
    lede:
      "Patient data is the uncomfortable truth of everything we build here. It sits under the strictest regulations, hides in systems nobody owns to name, and refuses clean structure.",
    body: [
      "Healthcare differs because the upside of a wrong answer is not a low-risk hallucination — it is a clinical either. That yardstick changes the whole design: the system has to say not just what it found but where it found it, when, and against which version of the record.",
      "Operationally the data is worse than the models. Radiology reads, prior auth, claims lines, and EHR exports come from places that speak different language and disagree on the same patient. Care-adjacent AI mostly has to survive being grounded in that environment.",
    ],
    constraints: [
      "PHI published to the wrong audience is a breach regardless of intent — access is deployed at query time",
      "Records disagree across systems about the same patient; reconciliation comes first",
      "A confident answer to a clinician is worse than a hedged one — provenance is part of the answer",
      "Crossing from administrative to clinical-adjacent changes the compliance cross-check every time",
    ],
    outcomes: [
      "Documentation load reduced without the risk of a plausible-sounding error",
      "Billing and prior-auth pipelines that check themselves against the source documents",
      "A view over a patient that reconciles what each system believes, not just the one you asked",
    ],
    delivery: [
      "PHI perimeter enforced at the data layer, not at the demo — every surface defaulted to locked",
      "Every answer carries a source; nothing that cannot say where it came from is delivered",
      "Compliance treated as a constant, not a foreign wrap-around at the end",
    ],
    signals: [
      "Clinicians spend more of the day documenting than caring",
      "The same patient is three different records to three different systems",
      "A vendor said it integrates and the interface turns out to be a scheduled file drop",
    ],
    evidence: [
      {
        what:
          "Data platform and integration work across clinical-adjacent systems handling patient-derived records, with strict access and privacy boundaries",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "building", "advisory"],
  },
  {
    slug: "field-services",
    name: "Field services",
    short: "Dispatch, appointments, and the uncertain wait time.",
    lede:
      "The field lives in the margin the demo forgets. Travel, appointments, and crew availability all move hour to hour, and no model can change the fact that yesterday's route sometimes lies.",
    body: [
      "Field services run on a constraint the office does not feel: the work is mostly about position. A half-hour of stuck traffic, a property that rejects access, a crew finishing late on a different job — a dispatch change has to ripple across all of it, and the customer was promised a window.",
      "The productive problem is not 'predict the route'; it's 'make the promise elastic enough that the plan still holds when reality does its thing'. That means the forecast has to know the few things that actually decide the outcome: where crews are, what the next job is, and what the customer was promised.",
    ],
    constraints: [
      "The plan is a living document — the scheduler has to consume displacement, not to propagate it out",
      "Appointment windows are promises that cost money when broken — last-minute rework is expensive",
      "The definition of 'on time' differs from within the dispatch, the crew, and the customer",
      "Field data is lower-quality at the edge: no signal, skipped screens, backlogged logs",
    ],
    outcomes: [
      "Arrival windows that survive the day's traffic, not just the morning's plan",
      "Dispatch that knows the bottleneck is the person, and routes around it",
      "A view of the field that reconciles what the app, the truck, and the customer each know",
    ],
    delivery: [
      "The late-arrival and no-show data treated as signal, not noise — the model is allowed to be humbled",
      "Confidence intervals on the ETA as part of the product, not behind an API",
      "Offline-first given the field reality — the app must work when the crew is between towers",
    ],
    signals: [
      "The customer promise is a convention, and the dispatcher is the only one enforcing it",
      "Crews are disincentivized by routing that ignores what happened yesterday",
      "You have never counted the cost of a missed arrival window",
    ],
    evidence: [
      {
        what: "Field operations management design — dispatch logic, ETA, and crew-appointment alignment for an operations-heavy business",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["building", "staying-with-it", "advisory"],
  },
  {
    slug: "construction-engineering",
    name: "Construction and engineering",
    short: "Estimates, schedules, and submittals — the jobsite runs on lagged documents.",
    lede:
      "Construction runs on the version of the drawing that's current, and the version isn't always the one in the field notebook. The schedules read like fiction to the person on site.",
    body: [
      "The estimating problem is the one that gets sold — the docs obsolete to submit to the trades — but the harder truth is how the supply of decision data works. Everything the site generates arrives late: the daily log tonight, the submittal approval next week, the change order next month. Decisions made on the oldest copy is the normal state of affairs.",
      "AI has to be good at two things here: making the lag visible, and reconciling the current 'truth' without claiming it is the future. The job with yesterday's approved drawings is not a data problem; but it is a discipline problem the data can anchor.",
    ],
    constraints: [
      "The current revision is spread across email, stamps, and printed field notes — 'current' is a convention",
      "Schedules lie in the direction that will win the bid; the model must not inherit the lie",
      "Documents today are produced by people who enter data after the fact",
      "Multi-trade coordination means a change for one triggers a claim for several — timing is money",
    ],
    outcomes: [
      "Submittal and AP flows that check stale, approved, and current copies with mechanical certainty",
      "Schedules laid over the actual jobstate, so 'best case' and 'what was committed' are not conflated",
      "Estimates that reconcile to end-of-project cost, so the margin is known while it can still be worn",
    ],
    delivery: [
      "A doc-truth layer that can make the lag visible before the model answers the trade",
      "Change orders treated as revision events with timelines, not as document frames",
      "Schedule math carried as ranges — the model says what is uncertain, not what is fine",
    ],
    signals: [
      "The field notebook, the email thread, and the latest drawing do not agree on the revision",
      "Schedule updates are a meeting, not a stream",
      "Estimator says the numbers are on the drawing; finance says they are on the P.O.",
    ],
    evidence: [
      {
        what: "Construction-document engineering and job-lag analysis for a resource-constrained builder, improving revision and submittal truth loops",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["advisory", "data-foundations", "building"],
  },
  {
    slug: "automotive",
    name: "Automotive",
    short: "Dealer data, warranty, and the cost of a part arriving late.",
    lede:
      "Dealer data lives behind a DMS the dealership does not own, filed by model and part, with the ordering clock the network feels long before the OEM does.",
    body: [
      "The dealer's data is ringfenced. The DMS vendor is not required to hand the dealer's own records back in a machine-readable form, so anything to be analyzed has to be extracted from screens, exports, and logs the vendor controls. That makes the data pipeline the first project before any analytics or AI can exist.",
      "Warranty and parts form the second pole. The OEM's systems of record are larger and cleaner, but they lag the same clock the shop floor feels: a part that should have arrived yesterday is only known today, and the customer is already waiting. Pipeline visibility — not demand forecasting — is where the leverage sits.",
    ],
    constraints: [
      "The dealer's data is locked inside a vendor-owned DMS — extraction is a sourcing problem before it is an engineering one",
      "VINs, part numbers, and labor operations share a language but not a join key across systems",
      "Warranty and service claims have a counter-party, and a pattern in them is a cost model waiting to be written",
      "Auto retail runs on the parts pipeline — the backlog is real and the visibility is not",
    ],
    outcomes: [
      "A dealer view of inventory, service load, and customer pipeline even when the DMS blocks the direct sync",
      "Parts planning that draws the back-order state into the ordering decision",
      "A warranty and repair ledger you can audit to the transaction, not just the summary",
    ],
    delivery: [
      "Offline message queues that let the extractor survive the vendor portal not being open",
      "Model the backordered state and the pipeline — not just what shipped last month",
      "Identifiers joined as data policy, never assumed to be clean three layers down",
    ],
    signals: [
      "Head office asks for the dealer book and the DMS won't give it",
      "Service lane labor is managed by a spreadsheet with three versions of the day's work",
      "Parts order accuracy is a memory, not a metric",
    ],
    evidence: [
      {
        what: "Automotive retail data platform work — DMS extraction, inventory and service analytics, and pipeline joins across legacy dealer systems",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "building", "staying-with-it"],
  },
  {
    slug: "retail",
    name: "Retail",
    short: "Items, inventory, and the lane where the forecast meets the footfall.",
    lede:
      "Home goods, grocery, and multi-unit retail are defined by the asset they can't see: the lane, the promo, and the spread that tightens when a promotion goes sideways.",
    body: [
      "Retail problems are mostly assortment and load. Category teams plan on aggregate POS, and the strength of those plans only lands when the truck reaches the store and the allocation is already decided. A forecast that has to price every week must survive a promo, a seasonal swing, and a new store that gives no history.",
      "The constraint is the same across the whole retail panel: the number the buyer cares about is the aisle and the store, not the national average. A model that hides a broken store inside a regional forecast has not done the work yet.",
    ],
    constraints: [
      "A multi-thousand-SKU forecast has to survive promos, holiday, and a store that does not resemble the model",
      "Inventory data is honestly stale — the count, the missing order, and shrink all live outside the system",
      "Warehouse plan and store plan both decide stock — the machine has to respect two masters, and it is wrong if it prefers either",
      "The promo effect looks like demand — the system has to separate the two or it will over-buy",
    ],
    outcomes: [
      "Store-level forecasting that stays accurate when the promo is on and off",
      "An inventory and allocation view that pulls shrink and in-store count into a single ledger",
      "Assortment reads that show the buyer what the store sold — before the promo day",
    ],
    delivery: [
      "Demand decomposition that splits the promo from the seasonal without double-counting either",
      "Store-level hierarchical forecasting with warehouse and store lanes in the same call",
      "An inventory ledger reconciled across POS, order book, and count — the forecast is only as good as the three agreeing",
    ],
    signals: [
      "Promotional stock is the CFO's risk when the numbers are your lane",
      "The retail network is varied enough that a single national forecast hides a broken store",
      "Stock is planned to the day, but the promo was decided in minutes",
    ],
    evidence: [
      {
        what: "Retail data platform and store-level forecasting and assortment analytics for a multichannel commerce business",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "advisory", "building"],
  },
  {
    slug: "ecommerce",
    name: "Ecommerce",
    short: "Catalog, conversion, the customers in the browser.",
    lede:
      "Ecommerce is where 'API-first' meets the client that's a browser tab. The data is everywhere and it is nearly all marketing-shaped until you ask how much it produced.",
    body: [
      "Ecommerce platforms are the most accessible data we see — the events, the catalog, the checkout — yet most of the AI that runs there is shouting into an interface with a conversion problem rather than a functional one. The interesting work is the one that connects the click at 2 a.m. to the warehouse line the next day, through the promotion engine and the returns event.",
      "The trap is that the platform creates distances: the where of the event, the version of the catalog, the fact that the promo is a segment, not a time. Good ecommerce AI needs a versioned catalog and a clean join between the event and the SKU it touched.",
    ],
    constraints: [
      "The catalog is versioned to the millisecond — an event resolves against the SKU as it was, not the last export",
      "Session noise hides the signal — the same visitor page-ranked in three ways needs consistent joins",
      "Attribution is the root of the fight — a promo's converted value is contended data",
      "The platform's JSON is convenient and its joins are a trap — dedup in the raw event is not enough",
    ],
    outcomes: [
      "Event-to-order joins that resolve the SKU at the moment of the event, not the moment of export",
      "Funnel and attribution with the promo's value a measured thing, not a convention",
      "Catalog refresh that rents the version of the product a customer actually saw",
    ],
    delivery: [
      "A versioned catalog and event model rebuilt to match the platform's append-only reality",
      "Attribution kept as an analyzable layer — the model does not get to choose the answer",
      "Instrumentation gaps closed before the ML reads the event stream, not after the analysis surprises",
    ],
    signals: [
      "Analytics says one revenue, the platform on the export says another, and finance has a third",
      "A recommender demo works and the real funnel ignores it",
      "The 'what changed against a launched version' question has no answer",
    ],
    evidence: [
      {
        what: "Ecommerce event and catalog data pipeline work joining session, promotion, and fulfillment data into attribution-ready analytics",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["building", "data-foundations", "advisory"],
  },
  {
    slug: "real-estate-rental",
    name: "Real estate and rental",
    short: "The listing, the lease, and the property that no two systems describe the same way.",
    lede:
      "Real estate data is the same asset described three ways, by a listing platform, a property manager, and a lease — and none of them share a primary key.",
    body: [
      "The physical property is a stable thing; the data about it is not. Listings get re-keyed by each platform, leases live in a property-management system that predates the web, and the maintenance ledger is spreadsheets. Any portfolio-level view has to be built on a reconciliation step first.",
      "The second constraint is that value depends on the level of the market, not the campaign: occupancy, rent roll, and maintenance cost compound across units, and a portfolio view that hides a struggling asset has not done the work.",
    ],
    constraints: [
      "A property is not a join key — the same building resolves differently across listing, lease, and maintenance systems",
      "Lease and tenant data is the rent roll; a mistake there is a legal one, not a data one",
      "Vacancy, turn, and maintenance forecasts are portfolio-shaped — a single-asset model hides the pattern",
      "Market data, appraised value, and rent intelligence all arrive late and disagree",
    ],
    outcomes: [
      "A portfolio view that reconciles listing, lease, and maintenance into one property truth",
      "Occupancy, turn, and rent forecasting that reads the whole network, not one asset",
      "Lease and maintenance pipelines that keep their source documents attached",
    ],
    delivery: [
      "A property-resolution layer that joins listing, lease, and maintenance identifiers before anything aggregates",
      "Roll forward: occupancy as a ledger of leases and move-outs, not a snapshot update",
      "Market and maintenance data kept as their own facts, so the 'why' of a number is still answerable",
    ],
    signals: [
      "The same building has three different statuses in three different systems",
      "Portfolio reporting is rebuilt from a pile of spreadsheets every month",
      "Occupancy and rent moves are only noticed after they compound",
    ],
    evidence: [
      {
        what: "Real estate and rental data platform work — property identity, occupancy, and maintenance analytics across listing and lease systems",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "advisory", "staying-with-it"],
  },
  {
    slug: "education",
    name: "Education",
    short: "Enrollment, retention, and the systems that treat a student as several different records.",
    lede:
      "A student is a fan fold of records — admission, registrar, financial aid, LMS — that do not agree on who they are looking at.",
    body: [
      "Education runs the widest gap we see between the promise of the data and its shape. The registrar, the LMS, the financial aid office, and the reporting on Belize-and-back don't share an identity for the same person, and grades, enrollment, and aid have their own accuracy bars and their own privacy.",
      "The privacy also changes the work. Family Educational Rights and Privacy Act means student records are a perimeter that applies to the whole project, not a single checklist. Retention and intervention work has to be built under it.",
    ],
    constraints: [
      "From the right to be names — student identity is a fan-out, not a join key",
      "Grades, enrollment, and aid each have their own privacy contract on top of the base regulation",
      "Retention models inherit the institutional incentive to under-flag at-risk students",
      "The academic calendar is a moving window — 'as of' has to be second nature",
    ],
    outcomes: [
      "One joinable view of a student across registrar, LMS, aid — built under a strict privacy perimeter",
      "Retention and enrollment forecast that the institution can act on, not just report",
      "Reporting that knows the 'as of' date of every number it carries",
    ],
    delivery: [
      "The privacy perimeter applied to the data layer before analytics, not as a bolt-on after",
      "Identity resolved in a separate, revocable service — not copied into every question",
      "As-of semantics on everything, so an answer is answerable against the semester it refers to",
    ],
    signals: [
      "The registrar and the LMS name the same student differently",
      "Retention is discussed with anecdotes because the count cannot be agreed on",
      "Institutional research is a person and a deadline, not a function",
    ],
    evidence: [
      {
        what: "Education data platform work joining enrollment, learning, and student-identity records under a strict access and privacy perimeter",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "building", "advisory"],
  },
  {
    slug: "travel",
    name: "Travel",
    short: "Reservations, demand, and a schedule that is never what was predicted.",
    lede:
      "Travel data is a series of near misses: booking lifecycles, channel conflict, and a demand forecast that is wrong in the direction of the trip not taken.",
    body: [
      "Travel is fragmented by channel by law. The same itinerary is priced and booked through a featured direct-site discovery, an OTA, and a corporate traveler — each with its own record and each wanting to own the trip. Joining those is the first discipline before demand or pricing work.",
      "The demand signal is also the weakest in any industry — the trip is not the booking. Search, abandon, and cancel all outran the booking in volume, and a cancellation with a wrong date is a cost, not a signal. Pricing and demand models have to be built to survive that noise.",
    ],
    constraints: [
      "Identity across channels is a legal and contractual guardrail — the same traveler is several guests by design",
      "Demand noise famously outweighs bookings — 9 of 10 searches never convert",
      "Cancel and rebook are the normal state, and the model must treat them as signal, not noise",
      "Rate and availability engines live in vendors' systems, so the model works behind an API it does not own",
    ],
    outcomes: [
      "One view of a guest across direct, channel, and agency bookings, built within channel contracts",
      "Demand forecast that separates search intent from booked revenue",
      "Pricing and inventory views that respect vendor rate systems instead of pretending they are a clean feed",
    ],
    delivery: [
      "Channel identity kept in the lane it belongs in — joined in a contract-aware layer, not by guessing",
      "Forecast trained on the funnel, with search-to-booking conversion as a first-class feature",
      "Vendor rate and availability systems wrapped and reconciled, not replaced",
    ],
    signals: [
      "The same customer is three files across direct, OTA, and agency",
      "Demand forecasts live in a spreadsheet that never knows about the booking engine",
      "Cancellation stats are a quarterly conversation, not a live number",
    ],
    evidence: [
      {
        what: "Travel data and analytics work joining channel, booking, and cancellation data into clean revenue and demand views",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "advisory", "building"],
  },
  {
    slug: "transportation",
    name: "Transportation",
    short: "Fleet, freight, and the network that moves — the empty truck is the enemy.",
    lede:
      "Transportation is the data of movement, where the truck itself is the smallest unused slot, and the network is ahead of the metric that spoke.",
    body: [
      "The industry's economics are dominated by the empty mile: the driver repositioning, the lane nobody filled, the trailer sitting a production, gate, wherever it got dropped. The network is what decides the cost, and the network is the thing spreadsheets can barely represent.",
      "Fleet and driver data is the second pole. Telematics texts, dispatch records, and the invoiced miles disagree on the same trip, which one ended up in the billing system depends on nobody being able to agree. The whole discipline of data here is reconciliation first, then the route and utilization intelligence on top.",
    ],
    constraints: [
      "The empty trip is the economics — the model has to price tension, not just line-haul",
      "Trip, mileage, dispatch, and billing disagree on the same load — reconciliation is the first deliverable",
      "The network is many-to-many; a local optimization is a global penalty invisible until the end of the week",
      "Driver and asset identifiers are not a single namespace across telematics, dispatch, and payroll",
    ],
    outcomes: [
      "A load and asset view that shows the emptiness in the network, and the cost of leaving it there",
      "Rate and pricing that read the actual move — deadhead included — not the booked rate",
      "Reconciled dispatch, telematics, and billing that agree for the first time",
    ],
    delivery: [
      "Data reconciled from truck, dispatch, and billing as the project — before route optimization is touched",
      "The deadhead and empty-mile state modeled as a first-class number, not scraped off",
      "Driver and asset identity kept distinct — the analysis never conflates the two",
    ],
    signals: [
      "The margin on a job is only known after a month of spreadsheets",
      "Empty miles are described by feel, not by a number",
      "Dispatch and billing each have a different 'true' mileage for the same trip",
    ],
    evidence: [
      {
        what: "Transportation data and analytics work — trip, telematics, and dispatch reconciliation and network efficiency intelligence",
        status: "needs-approval",
      },
    ],
    relatedPractices: ["data-foundations", "advisory", "building"],
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
  "Manufacturing quoting and production scheduling",
  "Healthcare administrative and clinical-adjacent data",
  "Field services dispatch and appointment optimization",
  "Construction estimating and document control",
  "Automotive dealership data and parts pipelines",
  "Retail inventory and store-level forecasting",
  "Ecommerce event, catalog, and attribution analytics",
  "Real estate portfolio analytics and rent roll data",
  "Education enrollment, retention, and student-identity data",
  "Travel demand, booking, and channel analytics",
  "Transportation fleet, load, and network efficiency intelligence",
];