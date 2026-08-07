import type { TraceStep } from "@/lib/practices";

/**
 * SIGNATURE ELEMENT — the engagement trace.
 *
 * A GJH engagement is rendered as a run log: timestamped, attributed, with a
 * status chip. This is the artifact the buyer (a VP of data, a platform lead,
 * an agency CIO) reads all day, so it argues for our competence in a form
 * they already trust. The structure carries real information — sequence,
 * owner, and output — so it is not decoration.
 *
 * It recurs deliberately: engagement shape on practice pages, delivery
 * history on case studies, operating rhythm on the homepage.
 */
export function Trace({
  steps,
  caption,
  label = "engagement",
}: {
  steps: TraceStep[];
  caption?: string;
  label?: string;
}) {
  return (
    <figure className="trace overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5">
        <span className="font-mono text-label uppercase text-ink-muted">{label}</span>
        <span className="chip-run" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-blip" />
          trace
        </span>
      </div>

      <ol className="list-none">
        {steps.map((s, i) => (
          <li key={i} className="trace-row animate-trace-in" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="trace-t">{s.t}</span>
            <span className="text-indigo-lift">{s.actor}</span>
            <span className="col-span-2 text-paper/80 sm:col-span-1">
              {s.detail}
              {s.status === "ok" && <span className="ml-2 text-signal" aria-label="complete">✓</span>}
            </span>
          </li>
        ))}
      </ol>

      {caption && (
        <figcaption className="border-t border-white/10 px-4 py-3 font-sans text-sm text-ink-muted sm:px-5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
