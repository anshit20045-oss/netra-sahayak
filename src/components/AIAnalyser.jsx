import { useCallback, useEffect, useRef, useState } from "react";
import FundusScan from "./FundusScan";
import { ANALYSIS_PROFILES, DEMO_IMAGES, fingerprintImage } from "../data/analysisProfiles";

/* ─── helpers ────────────────────────────────────────────── */
const STATUS_COLORS = {
  normal:   { dot: "#22c55e", bg: "rgba(34,197,94,0.10)",   text: "#16a34a" },
  warning:  { dot: "#f59e0b", bg: "rgba(245,158,11,0.10)",  text: "#b45309" },
  critical: { dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   text: "#dc2626" },
};

const URGENCY_BADGE = {
  none:    { label: "No Referral",        color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
  routine: { label: "Routine Follow-up",  color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
  soon:    { label: "Refer Soon",         color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  urgent:  { label: "URGENT REFERRAL",    color: "#ef4444", bg: "rgba(239,68,68,0.14)"   },
};

const SCAN_STEPS = [
  "Ingesting image data…",
  "Running quality gate…",
  "Detecting lesion candidates…",
  "Grading with ICDR scale…",
  "Generating saliency map…",
  "Compiling clinical report…",
];

function useTypewriter(text, speed = 18, active = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);
  return displayed;
}

/* ─── sub-components ─────────────────────────────────────── */
function ScanningOverlay({ step }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: "rgba(0,0,0,0.55)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      {/* animated ring */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.15)",
        borderTopColor: "#38bdf8",
        animation: "spin 0.85s linear infinite",
      }} />
      <p style={{ color: "#e2e8f0", fontSize: 11, textAlign: "center", maxWidth: 130, lineHeight: 1.5 }}>{step}</p>
    </div>
  );
}

function FindingRow({ label, value, status }) {
  const c = STATUS_COLORS[status];
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "9px 12px", borderRadius: 8,
      background: c.bg, marginBottom: 5,
    }}>
      <span style={{
        marginTop: 4, flexShrink: 0, width: 8, height: 8, borderRadius: "50%",
        background: c.dot, display: "inline-block",
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: c.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </span>
        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#334155", lineHeight: 1.45 }}>{value}</p>
      </div>
    </div>
  );
}

function GradeBar({ grade, label, confidence }) {
  const pct = (grade / 4) * 100;
  const color = grade === 0 ? "#22c55e" : grade === 1 ? "#86efac" : grade === 2 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>ICDR Grade {grade} — {label}</span>
        <span style={{ fontSize: 12.5, color: "#64748b" }}>Conf. {(confidence * 100).toFixed(0)}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: color,
          width: `${pct}%`, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {["Grade 0", "Grade 1", "Grade 2", "Grade 3", "Grade 4"].map((g, i) => (
          <span key={i} style={{ fontSize: 10, color: i <= grade ? color : "#cbd5e1" }}>{g}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export default function AIAnalyser() {
  const [mode, setMode] = useState("idle");         // idle | scanning | result
  const [profile, setProfile] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [uploadedSrc, setUploadedSrc] = useState(null);
  const [scanStep, setScanStep] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const dropRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const analysedProfile = profile ? ANALYSIS_PROFILES[profile] : null;
  const typeNote = useTypewriter(
    analysedProfile?.clinicalNote || "",
    14,
    mode === "result"
  );

  /* scanning simulation */
  const runScan = useCallback((profileKey) => {
    setMode("scanning");
    setShowHeatmap(false);
    setScanStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => {
          setProfile(profileKey);
          setMode("result");
          setTimeout(() => setShowHeatmap(true), 1200);
        }, 600);
      }
    }, 420);
  }, []);

  /* demo selection */
  const handleDemo = (demo) => {
    setSelectedDemo(demo.id);
    setUploadedSrc(null);
    runScan(demo.id);
  };

  /* file upload */
  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedSrc(e.target.result);
      setSelectedDemo(null);

      // fingerprint via hidden canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 40, 40);
        const imageData = ctx.getImageData(0, 0, 40, 40);
        const key = fingerprintImage(imageData);
        runScan(key);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setMode("idle");
    setProfile(null);
    setSelectedDemo(null);
    setUploadedSrc(null);
    setShowHeatmap(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const urgencyBadge = analysedProfile ? URGENCY_BADGE[analysedProfile.referralUrgency] : null;

  return (
    <section id="ai-analyser" style={{
      borderTop: "1px solid var(--color-line)",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
      padding: "80px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* background glow */}
      <div style={{
        position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* header */}
        <div style={{ marginBottom: 40, maxWidth: 620 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)",
            borderRadius: 99, padding: "5px 14px", marginBottom: 18,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#38bdf8", letterSpacing: "0.06em" }}>AI RETINA ANALYSER — PROTOTYPE</span>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, lineHeight: 1.25, color: "#f1f5f9", margin: 0 }}>
            Upload a retinal image or try a demo
          </h2>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "#94a3b8" }}>
            Drop any fundus photograph and the system will analyse it for diabetic retinopathy,
            grade it on the ICDR scale, and generate a clinical report — all in seconds.
            Demo cases use illustrated retinas, not real patient imagery.
          </p>
        </div>

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: mode === "result" ? "1fr 1fr" : "1fr", alignItems: "start" }}>

          {/* LEFT PANEL */}
          <div>
            {/* upload zone */}
            {mode !== "result" && (
              <div
                ref={dropRef}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => mode === "idle" && fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? "#38bdf8" : "rgba(148,163,184,0.30)"}`,
                  borderRadius: 16,
                  background: dragOver ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.03)",
                  padding: "40px 24px",
                  textAlign: "center",
                  cursor: mode === "idle" ? "pointer" : "default",
                  transition: "all 0.2s",
                  marginBottom: 20,
                  position: "relative",
                  minHeight: 180,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                }}
              >
                {mode === "scanning" ? (
                  <>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      border: "3px solid rgba(255,255,255,0.10)",
                      borderTopColor: "#38bdf8",
                      animation: "spin 0.85s linear infinite",
                    }} />
                    <p style={{ color: "#94a3b8", fontSize: 13.5, margin: 0 }}>{SCAN_STEPS[scanStep]}</p>
                    <p style={{ color: "#475569", fontSize: 11.5, margin: 0 }}>
                      Step {scanStep + 1} of {SCAN_STEPS.length}
                    </p>
                  </>
                ) : (
                  <>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p style={{ color: "#cbd5e1", fontSize: 14, margin: 0, fontWeight: 500 }}>
                      Drop retinal image here or click to browse
                    </p>
                    <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>JPG, PNG, WEBP supported</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
              </div>
            )}

            {/* demo thumbnails */}
            {mode !== "result" && (
              <div>
                <p style={{ fontSize: 11.5, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  — or choose a demo case —
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {DEMO_IMAGES.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => mode === "idle" && handleDemo(d)}
                      style={{
                        background: selectedDemo === d.id ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${selectedDemo === d.id ? "rgba(56,189,248,0.5)" : "rgba(148,163,184,0.15)"}`,
                        borderRadius: 12, padding: "12px 14px", textAlign: "left", cursor: "pointer",
                        transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                        border: "2px solid rgba(255,255,255,0.08)", overflow: "hidden",
                      }}>
                        <FundusScan severity={d.severity} quality={d.quality} size={44} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>{d.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{d.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* result left: image + grade */}
            {mode === "result" && analysedProfile && (
              <div>
                {/* retina preview */}
                <div style={{
                  background: "#020617", borderRadius: 16,
                  padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                  border: "1px solid rgba(148,163,184,0.12)",
                }}>
                  <div style={{ position: "relative" }}>
                    {uploadedSrc ? (
                      <div style={{ position: "relative" }}>
                        <img
                          src={uploadedSrc}
                          alt="Uploaded retinal image"
                          style={{ width: 240, height: 240, borderRadius: "50%", objectFit: "cover", display: "block" }}
                        />
                        {/* heatmap overlay on real image */}
                        {showHeatmap && (
                          <div style={{
                            position: "absolute", inset: 0, borderRadius: "50%",
                            background: "radial-gradient(ellipse 55% 45% at 60% 55%, rgba(255,60,30,0.45) 0%, rgba(255,140,30,0.25) 40%, transparent 70%)",
                            mixBlendMode: "screen",
                          }} />
                        )}
                      </div>
                    ) : (
                      <FundusScan
                        severity={analysedProfile.severity}
                        quality="good"
                        showHeatmap={showHeatmap}
                        size={240}
                      />
                    )}
                    {mode === "scanning" && <ScanningOverlay step={SCAN_STEPS[scanStep]} />}
                  </div>

                  {/* quality badge */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                    <span style={{
                      fontSize: 11.5, padding: "4px 12px", borderRadius: 99,
                      background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)",
                    }}>
                      ✓ Gradable — Quality {analysedProfile.qualityScore}%
                    </span>
                    <span style={{
                      fontSize: 11.5, padding: "4px 12px", borderRadius: 99,
                      background: urgencyBadge.bg, color: urgencyBadge.color,
                      border: `1px solid ${urgencyBadge.color}40`,
                      fontWeight: urgencyBadge.label.startsWith("URGENT") ? 700 : 500,
                    }}>
                      {urgencyBadge.label}
                    </span>
                  </div>
                </div>

                {/* grade bar */}
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(148,163,184,0.12)",
                  borderRadius: 12, padding: "18px 20px", marginTop: 14,
                }}>
                  <GradeBar
                    grade={analysedProfile.icdrGrade}
                    label={analysedProfile.icdrLabel}
                    confidence={analysedProfile.confidence}
                  />
                  <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>
                    <strong style={{ color: "#94a3b8" }}>Follow-up:</strong> {analysedProfile.followUp}
                  </p>
                </div>

                <button onClick={reset} style={{
                  marginTop: 14, width: "100%", padding: "11px 0", borderRadius: 10,
                  background: "transparent", border: "1px solid rgba(148,163,184,0.25)",
                  color: "#64748b", fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"}
                >
                  ← Analyse another image
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL — clinical report */}
          {mode === "result" && analysedProfile && (
            <div style={{
              background: "rgba(255,255,255,0.035)", border: "1px solid rgba(148,163,184,0.12)",
              borderRadius: 16, padding: "24px 22px", maxHeight: 620, overflowY: "auto",
            }}>
              {/* report header */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(148,163,184,0.10)" }}>
                <p style={{ margin: 0, fontSize: 10.5, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Netra Sahayak · AI Analysis Report
                </p>
                <h3 style={{ margin: "6px 0 0", fontSize: 20, fontFamily: "Georgia, serif", color: "#f1f5f9" }}>
                  {analysedProfile.icdrLabel}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#64748b" }}>
                  {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* findings */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Retinal Findings
                </p>
                {analysedProfile.findings.map((f) => (
                  <FindingRow key={f.label} {...f} />
                ))}
              </div>

              {/* clinical note */}
              <div style={{
                background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)",
                borderRadius: 10, padding: "14px 16px",
              }}>
                <p style={{ margin: "0 0 6px", fontSize: 10.5, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>
                  AI Clinical Note
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>
                  {typeNote}
                  <span style={{ animation: "blink 1s step-end infinite", color: "#38bdf8" }}>|</span>
                </p>
              </div>

              {/* disclaimer */}
              <p style={{ marginTop: 14, fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
                ⚠ This report is generated by a prototype AI for demonstration purposes only.
                It is not a substitute for clinical diagnosis by a qualified ophthalmologist.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* keyframe animations injected once */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
