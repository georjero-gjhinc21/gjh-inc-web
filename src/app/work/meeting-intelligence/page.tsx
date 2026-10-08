import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meeting intelligence and action tracking",
  description: "An anonymized implementation example covering transcript ingestion, structured action extraction, executive classification, and optional task handoff.",
};

export default function MeetingIntelligencePage() {
  return (
    <article className="frame py-20 lg:py-24">
      <p className="font-mono text-label uppercase text-muted">Work example / Meeting operations and follow-through</p>
      <h1 className="h1 mt-5 max-w-[24ch]">Meeting intelligence with accountable follow-through</h1>
      <p className="lede mt-7 max-w-[60ch]">A transcript-processing workflow that turns meeting records into structured actions, classifies them for the relevant business roles, and preserves a reviewable path before tasks move into an operating system.</p>
      <div className="mt-12 max-w-[65ch] space-y-10">
        <section>
          <h2 className="h3">The workflow</h2>
          <p className="mt-4 leading-relaxed">Meeting transcripts can arrive as text, caption files, office documents, or selected files from Google Drive. The application normalizes the content, records the source context, and submits the transcript to a server-side extraction endpoint.</p>
          <p className="mt-4 leading-relaxed">The extraction step identifies genuine decisions, commitments, risks, issues, and follow-ups. Each proposed item remains visible with its classification and supporting context so a person can review it before relying on it operationally.</p>
        </section>
        <section>
          <h2 className="h3">Implemented functionality</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed">
            <li>Transcript intake for plain text, caption, document, presentation, PDF, and rich-text formats.</li>
            <li>Google Drive file selection using read-only access when the integration is configured.</li>
            <li>Structured extraction of action title, description, stakeholder role, tracking level, priority, due date, executive office, and insight category.</li>
            <li>A per-item reasoning field that provides review context for the proposed classification.</li>
            <li>Optional creation of a Salesforce task after authentication, carrying the action description, status, priority, due date, and meeting-intelligence context.</li>
          </ul>
        </section>
        <section>
          <h2 className="h3">Human control</h2>
          <p className="mt-4 leading-relaxed">The system proposes structured actions; it does not make final business decisions. Authentication is required for connected systems, Google Drive access is read-only, and task handoff is a distinct step rather than an invisible side effect of transcript processing.</p>
        </section>
        <section>
          <h2 className="h3">Scope and limitations</h2>
          <p className="mt-4 leading-relaxed">This is an application-engineering and AI-assisted workflow example. It does not claim perfect transcription, perfect extraction, automatic assignment acceptance, measured productivity gains, organization-wide adoption, or unattended decision-making. Long transcripts may be clipped before extraction, and connected services require their own configuration and authorization.</p>
        </section>
        <section>
          <h2 className="h3">Privacy</h2>
          <p className="mt-4 leading-relaxed">Participant names, organizations, email addresses, meeting links, dates, locations, transcript excerpts, action contents, record identifiers, and credentials are omitted. The example explains the implemented pattern without reproducing private meetings or customer records.</p>
        </section>
        <nav aria-label="Related pages" className="flex flex-wrap gap-6 border-t border-rule pt-8">
          <Link href="/work" className="underline">More work</Link>
          <Link href="/capability" className="underline">Capabilities</Link>
          <Link href="/contact" className="underline">Discuss a workflow</Link>
        </nav>
      </div>
    </article>
  );
}
