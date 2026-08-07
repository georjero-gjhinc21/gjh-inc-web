/**
 * Partnerships currently claimed on gjh-inc.com. Verified against the live
 * site on 2026-08-07. Do not add a partner here without a signed agreement
 * or a public listing — partner logos are trademark use.
 *
 * The previous static site ran a 17-logo animated ticker. That reads as
 * padding to a technical buyer. Named partnerships with a stated reason
 * carry more weight than volume. See docs/DESIGN.md § Partner wall.
 */

export type Partner = {
  slug: string;
  name: string;
  domain: string; // where the work lands
  why: string; // what GJH actually does with it
  verified: boolean;
};

export const partners: Partner[] = [
  {
    slug: "anthropic",
    name: "Anthropic",
    domain: "Models",
    why: "Claude is the default model in our assistant and document work. Partner status gives us early access to capability and safety guidance we pass through to clients.",
    verified: true,
  },
  {
    slug: "databricks",
    name: "Databricks",
    domain: "Lakehouse",
    why: "Our primary platform for lakehouse architecture, pipeline orchestration, and putting governed data next to model workloads.",
    verified: true,
  },
  {
    slug: "snowflake",
    name: "Snowflake",
    domain: "Warehouse",
    why: "Where we build warehouse and semantic layers for organisations already standardised on it.",
    verified: true,
  },
  {
    slug: "aws",
    name: "AWS",
    domain: "Infrastructure",
    why: "Most systems we build run in the client's own AWS account, under their controls and their billing.",
    verified: true,
  },
  {
    slug: "google",
    name: "Google",
    domain: "Cloud & workspace",
    why: "Cloud infrastructure and workspace integration for teams whose day runs inside Google.",
    verified: true,
  },
];
