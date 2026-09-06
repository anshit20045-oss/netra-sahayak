const ROWS = [
  { challenge: "Poor image quality", handling: "Quality score with specific operator retake guidance", stakeholder: "Health worker", value: "Clear capture feedback without needing specialist training" },
  { challenge: "Cataract or lens opacity", handling: "Marked ungradable rather than forced to a grade", stakeholder: "Patient", value: "Earlier identification of people who need an eye exam" },
  { challenge: "False alerts", handling: "Confidence score plus lesion evidence plus human review", stakeholder: "Ophthalmologist", value: "Attention directed to high-risk or uncertain cases" },
  { challenge: "Weak or no internet", handling: "Offline inference with later synchronisation", stakeholder: "Health programme", value: "Offline-friendly workflow that scales across camps" },
  { challenge: "Limited specialist time", handling: "High-risk and uncertain cases are prioritised", stakeholder: "Health programme", value: "Fewer routine images sent for specialist review" },
];

export default function Impact() {
  return (
    <section id="impact" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-xl">
        <h2 className="font-serif text-[30px] leading-tight">Built for the actual environment of a screening camp</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
          The value isn't more AI predictions — it's better screening
          decisions, for the people who act on them.
        </p>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--color-line)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
              <th className="px-5 py-3.5 font-medium text-[var(--color-ink-soft)]">Challenge</th>
              <th className="px-5 py-3.5 font-medium text-[var(--color-ink-soft)]">How it's handled</th>
              <th className="px-5 py-3.5 font-medium text-[var(--color-ink-soft)]">Who benefits</th>
              <th className="px-5 py-3.5 font-medium text-[var(--color-ink-soft)]">What changes for them</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.challenge} className={i !== ROWS.length - 1 ? "border-b border-[var(--color-line)]" : ""}>
                <td className="px-5 py-4 font-medium">{r.challenge}</td>
                <td className="px-5 py-4 text-[var(--color-ink-soft)]">{r.handling}</td>
                <td className="px-5 py-4 text-[var(--color-ink-soft)]">{r.stakeholder}</td>
                <td className="px-5 py-4 text-[var(--color-ink-soft)]">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
