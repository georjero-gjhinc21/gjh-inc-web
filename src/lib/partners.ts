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
  tier?: string; // publish only when confirmed by the partner programme
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
    slug: "openai",
    name: "OpenAI",
    domain: "Models",
    why: "We deploy GPT-4 and o1 models where clients need them, and offer model choice for teams who need to compare approaches or have existing OpenAI investments.",
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
  {
    slug: "zoom",
    name: "Zoom",
    domain: "Communications & customer experience",
    tier: "Silver partner",
    why: "We help teams shape collaboration, phone, and contact-centre deployments, with access to partner support and specialist delivery resources when a project needs them.",
    verified: true,
  },
  {
    slug: "omnissa",
    name: "Omnissa",
    domain: "Digital workspace",
    tier: "Silver partner",
    why: "We help teams plan secure digital workspace and endpoint-management programmes, connecting platform delivery with the data and automation work around it.",
    verified: true,
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    domain: "Cloud & business applications",
    why: "We help teams connect Microsoft cloud, productivity, data, and automation services to governed AI and operational workflows in their own environment.",
    verified: true,
  },
];
