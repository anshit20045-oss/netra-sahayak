// Stylized, procedurally-drawn retinal fundus illustration.
// Deliberately not photorealistic — this is a screening-workflow demo, not a
// diagnostic tool, and no real patient imagery is used anywhere in this build.

const LESION_SETS = {
  none: [],
  mild: [{ x: 210, y: 150, r: 3, type: "dot" }],
  moderate: [
    { x: 210, y: 150, r: 3.5, type: "dot" },
    { x: 175, y: 205, r: 3, type: "dot" },
    { x: 245, y: 230, r: 4, type: "flame" },
    { x: 150, y: 160, r: 2.5, type: "dot" },
  ],
  severe: [
    { x: 210, y: 150, r: 4, type: "dot" },
    { x: 175, y: 205, r: 3.5, type: "dot" },
    { x: 245, y: 230, r: 5, type: "flame" },
    { x: 150, y: 160, r: 3, type: "dot" },
    { x: 130, y: 220, r: 4, type: "flame" },
    { x: 260, y: 175, r: 3, type: "dot" },
    { x: 195, y: 260, r: 3.5, type: "exudate" },
  ],
  pdr: [
    { x: 210, y: 150, r: 4, type: "dot" },
    { x: 175, y: 205, r: 3.5, type: "dot" },
    { x: 245, y: 230, r: 5, type: "flame" },
    { x: 150, y: 160, r: 3, type: "dot" },
    { x: 130, y: 220, r: 4, type: "flame" },
    { x: 260, y: 175, r: 3, type: "dot" },
    { x: 195, y: 260, r: 3.5, type: "exudate" },
    { x: 220, y: 195, r: 5, type: "vessel-tuft" },
    { x: 160, y: 130, r: 3, type: "exudate" },
  ],
};

function Lesion({ x, y, r, type }) {
  if (type === "flame") {
    return (
      <path
        d={`M ${x} ${y - r * 1.6} Q ${x + r} ${y} ${x} ${y + r * 1.6} Q ${x - r} ${y} ${x} ${y - r * 1.6} Z`}
        fill="#8a2418"
        opacity="0.85"
      />
    );
  }
  if (type === "exudate") {
    return <circle cx={x} cy={y} r={r} fill="#f4e04d" opacity="0.9" stroke="#c9a812" strokeWidth="0.5" />;
  }
  if (type === "vessel-tuft") {
    return (
      <g opacity="0.85">
        <circle cx={x} cy={y} r={r} fill="none" stroke="#8a2418" strokeWidth="1.6" />
        <circle cx={x} cy={y} r={r * 0.5} fill="none" stroke="#8a2418" strokeWidth="1.2" />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={r} fill="#5c1710" opacity="0.85" />;
}

export default function FundusScan({
  quality = "good", // good | blur | exposure | fov
  severity = "none", // none | mild | moderate | severe | pdr
  showHeatmap = false,
  size = 320,
  className = "",
}) {
  const lesions = LESION_SETS[severity] || [];
  const filterId = "fundus-blur";
  const clipId = "fundus-clip";

  return (
    <svg
      viewBox="0 0 420 420"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Illustrative fundus image, quality: ${quality}, severity: ${severity}`}
    >
      <defs>
        <radialGradient id="fundusBase" cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#f0855a" />
          <stop offset="55%" stopColor="#d85f3f" />
          <stop offset="100%" stopColor="#8f2f22" />
        </radialGradient>
        <radialGradient id="opticDisc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fce9b8" />
          <stop offset="70%" stopColor="#f6cf7c" />
          <stop offset="100%" stopColor="#e0a94a" />
        </radialGradient>
        <radialGradient id="macula" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6b1c12" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#6b1c12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3b1f" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ff8a1f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd21f" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx="210" cy="210" r="200" />
        </clipPath>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g clipPath={`url(#${clipId})`} filter={quality === "blur" ? `url(#${filterId})` : undefined}>
        {/* base fundus */}
        <circle cx="210" cy="210" r="200" fill="url(#fundusBase)" />

        {/* vasculature */}
        <g stroke="#7a1f16" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.75">
          <path d="M 210 210 C 175 175, 150 130, 120 90" />
          <path d="M 175 190 C 150 165, 120 150, 90 140" />
          <path d="M 210 210 C 245 175, 270 130, 300 95" />
          <path d="M 245 190 C 270 165, 300 150, 330 145" />
          <path d="M 210 210 C 190 250, 175 290, 160 330" />
          <path d="M 210 210 C 230 250, 250 290, 270 325" />
          <path d="M 210 210 C 170 220, 130 235, 95 250" />
          <path d="M 210 210 C 250 220, 290 235, 325 250" />
        </g>
        <g stroke="#7a1f16" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6">
          <path d="M 175 190 C 160 170, 150 155, 145 130" />
          <path d="M 245 190 C 260 170, 270 155, 275 130" />
          <path d="M 190 260 C 175 280, 165 300, 155 315" />
          <path d="M 230 260 C 245 280, 255 300, 265 315" />
        </g>

        {/* macula shadow */}
        <circle cx="255" cy="220" r="55" fill="url(#macula)" />

        {/* optic disc */}
        <circle cx="210" cy="205" r="30" fill="url(#opticDisc)" stroke="#c98f2e" strokeWidth="1.5" />
        <circle cx="210" cy="205" r="30" fill="none" stroke="#8f2f22" strokeWidth="1" opacity="0.3" />

        {/* vignette */}
        <circle cx="210" cy="210" r="200" fill="none" stroke="#4a140d" strokeWidth="14" opacity="0.35" />

        {/* lesions */}
        {lesions.map((l, i) => (
          <Lesion key={i} {...l} />
        ))}

        {/* heatmap overlay */}
        {showHeatmap &&
          lesions.map((l, i) => (
            <circle key={`h${i}`} cx={l.x} cy={l.y} r={l.r * 4.5} fill="url(#heat)" />
          ))}

        {/* exposure defect: overexposed wash */}
        {quality === "exposure" && <circle cx="210" cy="210" r="200" fill="#fff8e8" opacity="0.55" />}

        {/* field-of-view defect: dark crescent cropping the field */}
        {quality === "fov" && (
          <path d="M 60 40 A 220 220 0 0 0 40 260 L 40 40 Z" fill="#0c0a08" opacity="0.92" />
        )}
      </g>

      {/* field border */}
      <circle cx="210" cy="210" r="200" fill="none" stroke="var(--color-line)" strokeWidth="2" />
    </svg>
  );
}
