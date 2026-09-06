const STAGES = [
  { n: "01", title: "Capture", body: "Fundus camera or smartphone adapter captures the retinal image at the point of care." },
  { n: "02", title: "Quality check", body: "Blur, exposure and field-of-view are scored before grading is even attempted." },
  { n: "03", title: "Improve or retake", body: "If the image isn't usable, the operator gets specific retake guidance — not a rejected upload." },
  { n: "04", title: "Detect", body: "Lesion and retinal-structure detection locates the features that matter for grading." },
  { n: "05", title: "Grade", body: "ICDR severity, 0 to 4, with a calibrated confidence score attached to the prediction." },
  { n: "06", title: "Explain", body: "A heatmap and lesion evidence give the clinician something concrete to check." },
  { n: "07", title: "Act", body: "Low-confidence or high-severity cases route to human review and referral." },
];

export default function Pipeline() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 max-w-xl">
        <h2 className="font-serif text-[30px] leading-tight">
          One screen, from capture to an actionable result
        </h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
          The core idea: don't force the AI to grade an unusable image. Image
          quality is part of the screening decision, not a step before it.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s) => (
          <li key={s.n} className="bg-[var(--color-paper-raised)] p-6">
            <span className="font-serif text-[13px] text-[var(--color-marigold)]">{s.n}</span>
            <h3 className="mt-2 text-[16px] font-medium">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
