const REFS = [
  { source: "SIH26038 problem statement", detail: "Specifies quality assessment and enhancement, lesion/retinal structure analysis, ICDR grading 0–4, Grad-CAM, calibrated confidence and human-in-the-loop review." },
  { source: "BMJ Open, 2026 — rural Punjab", detail: "Offline AI showed 93.3% sensitivity and 85.1% specificity for referable DR; 38% of community images were ungradable, highlighting image-quality and media-opacity problems." },
  { source: "Portable / offline retinal screening research", detail: "Published Indian community-screening work shows portable fundus imaging and offline AI can extend screening outside tertiary hospitals." },
  { source: "Explainable AI research", detail: "Grad-CAM can provide visual evidence for model attention, but explanation quality should be checked by clinicians rather than treated as proof by itself." },
];

export default function References() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-serif text-[26px] leading-tight">Research and references</h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            The strongest opportunity isn't another standalone DR classifier
            — it's a quality-aware, explainable screening workflow that
            knows when to trust its own output, and when not to.
          </p>
        </div>
        <ol className="space-y-6 border-t border-[var(--color-line)] pt-6">
          {REFS.map((r) => (
            <li key={r.source}>
              <p className="text-[14px] font-medium">{r.source}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{r.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
