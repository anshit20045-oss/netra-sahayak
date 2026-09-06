import { useMemo, useState } from "react";
import FundusScan from "./FundusScan";
import { CASES, STEPS } from "../data/cases";

const QUALITY_ISSUE_COPY = {
  blur: { label: "Blurred", reason: "Motion blur detected — hold the device steady for 2 seconds during capture." },
  exposure: { label: "Overexposed", reason: "Illumination too high — reduce flash intensity or reposition the light source." },
  fov: { label: "Incomplete field", reason: "Optic disc partially outside frame — recenter and move closer to the eye." },
};

const TONE_STYLES = {
  marigold: { bg: "bg-[var(--color-marigold-soft)]", text: "text-[#8a5a12]", dot: "bg-[var(--color-marigold)]" },
  clinical: { bg: "bg-[var(--color-clinical-soft)]", text: "text-[var(--color-clinical)]", dot: "bg-[var(--color-clinical)]" },
  alert: { bg: "bg-[var(--color-alert-soft)]", text: "text-[var(--color-alert)]", dot: "bg-[var(--color-alert)]" },
};

export default function LiveDemo() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [retaken, setRetaken] = useState(false);

  const activeCase = CASES[caseIndex];
  const needsRetake = activeCase.initialQuality !== "good";
  const showingImprove = needsRetake && !retaken && stepIndex === 1;

  const currentQuality = needsRetake && !retaken ? activeCase.initialQuality : "good";
  const passedQuality = currentQuality === "good";

  const selectCase = (i) => {
    setCaseIndex(i);
    setStepIndex(0);
    setRetaken(false);
  };

  const goNext = () => {
    if (showingImprove) {
      setRetaken(true);
      return;
    }
    setStepIndex((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goPrev = () => setStepIndex((s) => Math.max(s - 1, 0));
  const jumpTo = (i) => {
    setStepIndex(i);
    if (i > 1) setRetaken(true);
  };

  const stepId = STEPS[stepIndex].id;
  const showLesions = stepId === "detect" || stepId === "grade" || stepId === "explain" || stepId === "act";
  const showHeatmap = stepId === "explain" || stepId === "act";
  const displaySeverity = showLesions ? activeCase.severity : "none";
  const toneStyle = TONE_STYLES[activeCase.tone];

  const readout = useMemo(() => {
    switch (stepId) {
      case "capture":
        return {
          heading: "Image captured",
          body: `${activeCase.context}. Raw capture forwarded to the quality gate before any grading is attempted.`,
        };
      case "quality":
        if (showingImprove) {
          const issue = QUALITY_ISSUE_COPY[activeCase.initialQuality];
          return {
            heading: `Not gradable — ${issue.label.toLowerCase()}`,
            body: issue.reason,
            failed: true,
          };
        }
        return {
          heading: "Gradable",
          body: needsRetake
            ? "Retake accepted. Blur, exposure and field-of-view are within range for grading."
            : "Blur, exposure and field-of-view are within range for grading.",
        };
      case "detect":
        return {
          heading: `${activeCase.severity === "none" ? "No lesions" : "Lesions located"}`,
          body: "Microaneurysms, haemorrhages and exudates are localised against retinal structures before a grade is assigned.",
        };
      case "grade":
        return {
          heading: `ICDR ${activeCase.icdrGrade} — ${activeCase.icdrLabel}`,
          body: `Model confidence: ${(activeCase.confidence * 100).toFixed(0)}%. Calibration reflects how reliable this specific prediction is, not just overall accuracy.`,
        };
      case "explain":
        return {
          heading: "Evidence generated",
          body: "Heatmap regions correspond to the lesions above. A clinician can check the evidence directly rather than trust the grade alone.",
        };
      case "act":
      default:
        return {
          heading: activeCase.action,
          body: "Case, image, grade, confidence and evidence are attached to the referral record for the reviewing clinician.",
        };
    }
  }, [stepId, activeCase, showingImprove, needsRetake]);

  return (
    <section id="demo" className="border-t border-[var(--color-line)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-xl">
          <h2 className="font-serif text-[30px] leading-tight">Try the screening console</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--color-ink-soft)]">
            Pick a sample case captured at a screening camp, then step through
            what the operator and clinician each see. Nothing here is a real
            patient image — the retina is drawn to illustrate the workflow.
          </p>
        </div>

        {/* case selector */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => selectCase(i)}
              className={`rounded-sm border p-4 text-left transition-colors ${
                i === caseIndex
                  ? "border-[var(--color-ink)] bg-[var(--color-paper)]"
                  : "border-[var(--color-line)] hover:border-[var(--color-ink-soft)]"
              }`}
            >
              <p className="text-[14px] font-medium">{c.name}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-ink-soft)]">{c.context}</p>
            </button>
          ))}
        </div>

        {/* stepper */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => jumpTo(i)}
              className="flex items-center gap-2 rounded-full border border-[var(--color-line)] py-1.5 pl-1.5 pr-3.5 text-[13px] transition-colors"
              style={
                i === stepIndex
                  ? { borderColor: "var(--color-ink)", color: "var(--color-ink)" }
                  : { color: "var(--color-ink-soft)" }
              }
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[11px]"
                style={
                  i === stepIndex
                    ? { backgroundColor: "var(--color-ink)", color: "#fff" }
                    : { backgroundColor: "var(--color-paper)", color: "var(--color-ink-soft)" }
                }
              >
                {i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* console */}
        <div className="grid gap-6 rounded-sm border border-[var(--color-line)] bg-[var(--color-paper)] p-6 md:grid-cols-[320px_1fr] md:p-8">
          <div className="flex flex-col items-center">
            <div className="rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
              <FundusScan quality={currentQuality} severity={displaySeverity} showHeatmap={showHeatmap} size={230} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[var(--color-ink-soft)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: passedQuality ? "var(--color-clinical)" : "var(--color-alert)" }}
              />
              {passedQuality ? "Gradable capture" : "Capture not yet gradable"}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[12.5px] uppercase tracking-wide text-[var(--color-ink-soft)]" style={{ letterSpacing: "0.02em" }}>
                Step {stepIndex + 1} of {STEPS.length} · {STEPS[stepIndex].label}
              </p>
              <h3 className="mt-2 font-serif text-[24px] leading-snug">{readout.heading}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                {readout.body}
              </p>

              {stepId === "grade" && (
                <div className="mt-5 max-w-xs">
                  <div className="flex justify-between text-[12.5px] text-[var(--color-ink-soft)]">
                    <span>Confidence</span>
                    <span>{(activeCase.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-[var(--color-line)]">
                    <div
                      className="h-2 rounded-full bg-[var(--color-ink)]"
                      style={{ width: `${activeCase.confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {stepId === "act" && (
                <div className={`mt-5 inline-flex items-center gap-2 rounded-sm px-3.5 py-2 text-[13.5px] font-medium ${toneStyle.bg} ${toneStyle.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${toneStyle.dot}`} />
                  {activeCase.action}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[var(--color-line)] pt-5">
              <button
                onClick={goPrev}
                disabled={stepIndex === 0}
                className="text-[13.5px] font-medium text-[var(--color-ink-soft)] transition-opacity hover:text-[var(--color-ink)] disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                onClick={goNext}
                disabled={stepIndex === STEPS.length - 1 && !showingImprove}
                className="rounded-sm bg-[var(--color-ink)] px-4 py-2 text-[13.5px] font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-30"
              >
                {showingImprove ? "Guide retake" : stepIndex === STEPS.length - 1 ? "End of flow" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
