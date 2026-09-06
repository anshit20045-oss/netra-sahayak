const GAPS = [
  {
    title: "Quality is an afterthought",
    body: "Image quality is usually a preprocessing step, not a decision point — so a blurry or poorly-lit capture gets graded anyway.",
  },
  {
    title: "Confidence is invisible",
    body: "An uncertain prediction looks exactly as confident as a certain one, unless the system is built to show the difference.",
  },
  {
    title: "No evidence to inspect",
    body: "A grade without lesion locations or a heatmap gives a clinician nothing to check the model's reasoning against.",
  },
  {
    title: "No path to a person",
    body: "An abnormal result only matters if it connects to a human reviewer and a referral — not just a number on a screen.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="border-t border-[var(--color-line)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-serif text-[30px] leading-tight">
              Early screening is hard in rural India, and not for the reason people assume
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
              Automated DR detection already works reasonably well in
              controlled conditions. What breaks it in the field is
              specialist availability, image quality, connectivity and
              follow-up capacity — the workflow around the model, not the
              model itself.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
              Portable fundus cameras with offline AI, and
              tele-ophthalmology, both help. Neither solves what happens
              when the captured image itself isn't usable, or when the
              model is guessing.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
            {GAPS.map((g) => (
              <div key={g.title} className="bg-[var(--color-paper-raised)] p-6">
                <h3 className="text-[15px] font-medium">{g.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
