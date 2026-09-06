# Netra Sahayak — SIH26038 Prototype

Explainable AI screening workflow for diabetic retinopathy in rural India.
Built for Smart India Hackathon (problem statement SIH26038).

## What this is

A working front-end prototype, not a live AI model. The "Live demo" section
walks through the full screening flow — Capture → Quality → Detect → Grade →
Explain → Act — using three pre-scripted sample cases, so you can present it
to a jury without depending on a real model, a camera, or an internet
connection.

## Run it in VS Code

You need [Node.js](https://nodejs.org) 18+ installed.

1. Open this folder in VS Code.
2. Open a terminal (Ctrl+`) and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL it prints (usually http://localhost:5173).

The page hot-reloads as you edit files — nothing to rebuild manually while
you tweak copy or colors before the demo.

## Where things live

- `src/data/cases.js` — the three sample cases and their outcomes. Edit
  names, ICDR grades, confidence, or the referral action here.
- `src/components/LiveDemo.jsx` — the interactive console (case picker,
  stepper, readout panel). This is the part judges will click through.
- `src/components/FundusScan.jsx` — the procedurally-drawn retina graphic
  (no real patient images are used anywhere in this project).
- `src/components/` — one file per page section (Hero, Problem, Pipeline,
  Impact, Architecture, References, Footer).
- `src/index.css` — the color/type tokens (the `@theme` block at the top).

## Before you present

- `npm run build` produces a static `dist/` folder — drag it into Netlify
  or Vercel, or serve `dist/index.html` locally, if you want a link to
  share instead of running `npm run dev` live.
- Everything is editable plain React + Tailwind, so if the jury asks "can
  it do X," you can change it on the spot.
