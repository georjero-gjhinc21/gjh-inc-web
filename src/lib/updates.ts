export type ProjectUpdate = {
  slug: string;
  status: "In development" | "Delivery design" | "Architecture complete";
  area: string;
  title: string;
  summary: string;
  deliverables: string[];
};

/**
 * Anonymised work only. Keep identities, locations, procurement references,
 * volumes, commercial terms, and unverified outcomes out of this file.
 */
export const projectUpdates: ProjectUpdate[] = [
  {
    slug: "regulated-document-review",
    status: "In development",
    area: "Regulated operations",
    title: "Human-reviewed document decisions in an isolated environment",
    summary:
      "A secure workflow that accepts documents through controlled channels, extracts the material needed for review, and records the human decision without moving sensitive files into an uncontrolled workspace.",
    deliverables: [
      "Controlled document intake",
      "Traceable extraction and review",
      "Human decision record",
    ],
  },
  {
    slug: "communications-deployment",
    status: "Delivery design",
    area: "Communications & digital workspace",
    title: "One delivery path across communications and endpoint operations",
    summary:
      "A partner-led delivery model that keeps discovery, requirements, implementation ownership, and support handoff visible across communications and digital workspace platforms.",
    deliverables: [
      "Requirements and dependency map",
      "Partner responsibility model",
      "Operational handoff plan",
    ],
  },
  {
    slug: "rfp-delivery-pipeline",
    status: "Architecture complete",
    area: "Opportunity operations",
    title: "RFP intake with evidence at every review point",
    summary:
      "A workflow for turning source documents into a requirements matrix, delivery plan, and review packet while keeping source references attached to every material claim.",
    deliverables: [
      "Source and amendment intake",
      "Requirements traceability",
      "Review-ready evidence packet",
    ],
  },
];
