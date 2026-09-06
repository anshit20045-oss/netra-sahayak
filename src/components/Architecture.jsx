const BLOCKS = [
  { title: "Input", detail: "Fundus camera or smartphone adapter" },
  { title: "Quality gate", detail: "Blur, exposure, field-of-view scoring" },
  { title: "AI analysis", detail: "DR classifier + lesion detection" },
  { title: "XAI", detail: "Grad-CAM evidence + calibrated confidence" },
  { title: "Output", detail: "ICDR grade + report + referral" },
];

const NOTES = [
  { title: "Offline-first", body: "Inference runs on-device at rural sites; reports synchronise once connectivity returns." },
  { title: "Nothing gets lost", body: "A local queue and autosave mean a temporary power or network failure doesn't lose a case." },
  { title: "Measured, not assumed", body: "Sensitivity, specificity, ICDR agreement and ungradable-image rate are tracked across cameras, lighting and populations." },
  { title: "Human in the loop", body: "A clinician reviews high-risk and uncertain cases before any referral is finalised." },
];

export default function Architecture() {
  return (
    <section id="architecture" className="border-t border-[var(--color-line)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-xl">
          <h2 className="font-serif text-[30px] leading-tight">A modular pipeline, evaluated independently</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
            The quality model, the DR classifier and the explanation layer
            can each be tested and improved without touching the others.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap items-stretch gap-3">
          {BLOCKS.map((b, i) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="w-40 rounded-sm border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
                <p className="text-[14px] font-medium">{b.title}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-ink-soft)]">{b.detail}</p>
              </div>
              {i < BLOCKS.length - 1 && (
                <span className="text-[18px] text-[var(--color-line)]" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
          {NOTES.map((n) => (
            <div key={n.title} className="bg-[var(--color-paper)] p-6">
              <h3 className="text-[15px] font-medium">{n.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{n.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[13.5px] text-[var(--color-ink-soft)]">
          Suggested development tools: MATLAB / Deep Learning Toolbox, image
          processing, Grad-CAM, and a lightweight deployment interface.
        </p>
      </div>
    </section>
  );
}
