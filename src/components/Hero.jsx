import FundusScan from "./FundusScan";

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-[14.5px] text-[var(--color-ink-soft)]">
            Smart India Hackathon · Problem statement SIH26038
          </p>
          <h1 className="font-serif text-[40px] leading-[1.12] tracking-tight md:text-[52px]">
            Know when to trust the AI —
            <br />
            and when to send a person instead.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[var(--color-ink-soft)]">
            A screening workflow for diabetic retinopathy that treats image
            quality, model confidence and human review as first-class parts
            of the system — not afterthoughts bolted onto a classifier.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#demo"
              className="rounded-sm bg-[var(--color-ink)] px-5 py-3 text-[14.5px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Walk through the live demo
            </a>
            <a
              href="#problem"
              className="text-[14.5px] font-medium text-[var(--color-ink)] underline decoration-[var(--color-line)] underline-offset-4 hover:decoration-[var(--color-ink)]"
            >
              Read the problem
            </a>
          </div>

          <div className="mt-14 grid max-w-md grid-cols-2 gap-8 border-t border-[var(--color-line)] pt-7">
            <div>
              <p className="font-serif text-[28px] leading-none">93.3%</p>
              <p className="mt-2 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
                sensitivity for referable DR, offline AI, rural Punjab, 2026
              </p>
            </div>
            <div>
              <p className="font-serif text-[28px] leading-none">38%</p>
              <p className="mt-2 text-[13.5px] leading-snug text-[var(--color-ink-soft)]">
                of community-captured images were ungradable
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-8">
            <FundusScan severity="moderate" quality="good" showHeatmap size={280} />
            <p className="mt-4 max-w-[280px] text-center text-[12.5px] leading-snug text-[var(--color-ink-soft)]">
              Illustrative fundus capture with lesion evidence highlighted — not a real patient image
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
