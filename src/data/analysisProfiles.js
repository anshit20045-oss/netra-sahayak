// Demo analysis profiles mapped to retina image fingerprints.
// In production these would be replaced by real model inference.

export const DEMO_IMAGES = [
  {
    id: "healthy",
    label: "Healthy Retina",
    description: "Normal vasculature, no lesions detected",
    severity: "none",
    quality: "good",
  },
  {
    id: "mild",
    label: "Mild NPDR",
    description: "Early-stage non-proliferative diabetic retinopathy",
    severity: "mild",
    quality: "good",
  },
  {
    id: "moderate",
    label: "Moderate NPDR",
    description: "Multiple microaneurysms and haemorrhages",
    severity: "moderate",
    quality: "good",
  },
  {
    id: "pdr",
    label: "Proliferative DR",
    description: "Neovascularisation — urgent clinical review required",
    severity: "pdr",
    quality: "good",
  },
];

export const ANALYSIS_PROFILES = {
  healthy: {
    icdrGrade: 0,
    icdrLabel: "No Apparent DR",
    confidence: 0.97,
    severity: "none",
    quality: "good",
    qualityScore: 94,
    findings: [
      { label: "Optic Disc", value: "Well-defined margins, normal cup-to-disc ratio (~0.3)", status: "normal" },
      { label: "Macula", value: "Foveal reflex intact, no oedema", status: "normal" },
      { label: "Vasculature", value: "A/V ratio 2:3, no arteriovenous nicking", status: "normal" },
      { label: "Microaneurysms", value: "None detected", status: "normal" },
      { label: "Haemorrhages", value: "None detected", status: "normal" },
      { label: "Hard Exudates", value: "None detected", status: "normal" },
      { label: "Neovascularisation", value: "Absent", status: "normal" },
    ],
    recommendation: "No referral required",
    referralUrgency: "none",
    followUp: "Routine screening in 24 months",
    clinicalNote:
      "The retinal image shows a healthy fundus with a clearly defined optic disc and intact foveal reflex. No diabetic lesions detected at any severity level. Continue standard preventative care and monitor HbA1c if patient is diabetic.",
  },
  mild: {
    icdrGrade: 1,
    icdrLabel: "Mild NPDR",
    confidence: 0.88,
    severity: "mild",
    quality: "good",
    qualityScore: 91,
    findings: [
      { label: "Optic Disc", value: "Normal, well-defined margins", status: "normal" },
      { label: "Macula", value: "No clinically significant macular oedema", status: "normal" },
      { label: "Vasculature", value: "Mild arteriolar narrowing noted", status: "warning" },
      { label: "Microaneurysms", value: "1–2 microaneurysms, peripheral zone", status: "warning" },
      { label: "Haemorrhages", value: "None detected", status: "normal" },
      { label: "Hard Exudates", value: "Trace exudates, far periphery", status: "warning" },
      { label: "Neovascularisation", value: "Absent", status: "normal" },
    ],
    recommendation: "Routine follow-up with GP / diabetologist",
    referralUrgency: "routine",
    followUp: "Review in 12 months or sooner if symptoms develop",
    clinicalNote:
      "Early signs of diabetic retinopathy are present. Microaneurysms are the earliest detectable lesion. Blood glucose and blood pressure optimisation is the primary intervention at this stage. Patient does not require ophthalmologist referral at this time but should be re-screened within 12 months.",
  },
  moderate: {
    icdrGrade: 2,
    icdrLabel: "Moderate NPDR",
    confidence: 0.91,
    severity: "moderate",
    quality: "good",
    qualityScore: 89,
    findings: [
      { label: "Optic Disc", value: "Normal margins, mild temporal pallor", status: "normal" },
      { label: "Macula", value: "Possible early macular oedema — further evaluation needed", status: "warning" },
      { label: "Vasculature", value: "Moderate arteriolar narrowing, beading noted", status: "warning" },
      { label: "Microaneurysms", value: "Multiple (>=5), scattered across 2 quadrants", status: "warning" },
      { label: "Haemorrhages", value: "Dot & blot haemorrhages in 2 quadrants", status: "warning" },
      { label: "Hard Exudates", value: "Clusters near fovea — possible lipid deposits", status: "warning" },
      { label: "Neovascularisation", value: "Absent", status: "normal" },
    ],
    recommendation: "Route to ophthalmologist for review",
    referralUrgency: "soon",
    followUp: "Ophthalmologist review within 3 months",
    clinicalNote:
      "Moderate NPDR with features concerning for macular involvement. The presence of hard exudates near the foveal centre warrants ophthalmological evaluation to rule out clinically significant macular oedema (CSMO). Systemic risk factor management is critical. Intravitreal therapy may be indicated pending OCT findings.",
  },
  pdr: {
    icdrGrade: 4,
    icdrLabel: "Proliferative DR",
    confidence: 0.95,
    severity: "pdr",
    quality: "good",
    qualityScore: 87,
    findings: [
      { label: "Optic Disc", value: "Disc neovascularisation (NVD) present", status: "critical" },
      { label: "Macula", value: "Macular oedema — significant, likely CSMO", status: "critical" },
      { label: "Vasculature", value: "Irregular calibre, severe beading, IRMA present", status: "critical" },
      { label: "Microaneurysms", value: "Extensive throughout all quadrants", status: "critical" },
      { label: "Haemorrhages", value: "Flame + dot haemorrhages, pre-retinal possible", status: "critical" },
      { label: "Hard Exudates", value: "Dense lipid ring encircling macula", status: "critical" },
      { label: "Neovascularisation", value: "NVD + NVE confirmed — high risk of vitreous haemorrhage", status: "critical" },
    ],
    recommendation: "Urgent referral — within the week",
    referralUrgency: "urgent",
    followUp: "Emergency ophthalmologist within 5–7 days",
    clinicalNote:
      "Proliferative diabetic retinopathy represents a sight-threatening emergency. New vessel formation from the optic disc (NVD) and elsewhere (NVE) carry a high risk of vitreous haemorrhage and traction retinal detachment. Panretinal photocoagulation (PRP) laser or intravitreal anti-VEGF therapy must be initiated urgently. Patient should be counselled about visual risk.",
  },
};

// Heuristic fingerprinting for uploaded images.
// Maps image pixel statistics to closest analysis profile.
// This is intentionally a demo approximation — not real clinical AI.
export function fingerprintImage(imageData) {
  const data = imageData.data;
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    rSum += data[i];
    gSum += data[i + 1];
    bSum += data[i + 2];
    count++;
  }
  const avgR = rSum / count;
  const avgG = gSum / count;
  const avgB = bSum / count;
  const brightness = (avgR + avgG + avgB) / 3;
  const redness = avgR / (avgG + avgB + 1);

  // Heuristic mapping — purely for demo purposes
  if (brightness > 170) return "healthy";
  if (redness > 1.4 && brightness < 80) return "pdr";
  if (redness > 1.2 && brightness < 110) return "moderate";
  return "mild";
}
