# Xai — Intelligence Workspace

A high-fidelity, interactive product experience prototype built for the **Xai Frontend Challenge**. This project demonstrates the transformation of raw data into structured intelligence through custom motion, 3D interaction, and deliberate UI/UX design — built with Next.js, Three.js (React Three Fiber), GSAP, and Framer Motion.

**Live Demo:** [Add your Vercel/Netlify URL here]
**Figma Design:** [Add your public Figma link here]
**Video Walkthrough:** [Add your YouTube/Google Drive link here]

---

## Project Overview

Xai — Intelligence Workspace is a single-page product experience that visually narrates a single idea:

> **Raw data → structured intelligence → actionable insight → AI automations**

Rather than building a marketing landing page, the goal was to design a calm, technically confident product surface — something a decision-maker would trust — and express the data-to-insight pipeline through geometry, motion, and interaction rather than static illustration or copy.

The experience is composed of five sections, each mapping to a stage of that pipeline:

1. **Hero** — a particle field that resolves from chaotic noise into a structured grid as the user scrolls, introducing the "raw data → structure" idea immediately and physically.
2. **Insight Flow** — a horizontally pinned, scroll-scrubbed sequence explaining the three-stage pipeline (Ingest → Analyze → Generate).
3. **Dashboard Preview** — a mocked product surface (sidebar, metrics, chart, ranked insights) representing where that intelligence actually lives.
4. **Signature Interaction** — a draggable 3D particle cluster that self-organizes on command, the "wow moment" tying the whole narrative together.
5. **Footer** — a quiet close to the page.

---

## Tech Stack

| Purpose | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Choreography | Framer Motion |
| Scroll Timelines | GSAP + ScrollTrigger + ScrollToPlugin |
| 3D Rendering | Three.js via React Three Fiber (`@react-three/fiber`) |
| Styling | Tailwind CSS v4 (`@theme` token system) |
| Fonts | `next/font/google` — Space Grotesk (display), Inter (body), JetBrains Mono (mono/labels) |

No backend, CMS, or external API is used — all data is intentionally static/mocked, per the challenge scope.

---

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Root layout, font loading, metadata
│   ├── page.js            # Composes all sections
│   └── globals.css        # Design tokens (Tailwind v4 @theme), base styles
├── components/
│   ├── Navbar.js           # Fixed, blurred nav with entrance animation
│   ├── Hero.js              # Section 1 — scroll/cursor-driven 3D hero
│   ├── DataField.js         # R3F particle system: noise → grid morph
│   ├── InsightFlow.js       # Section 2 — GSAP pinned horizontal scroll
│   ├── Dashboard.js         # Section 3 — mock product UI, tab switching
│   ├── BarChart.js          # Animated bar chart (Framer Motion)
│   ├── SignatureInteraction.js # Section 4 — drag + reorganize control
│   ├── ClusterField.js      # R3F particle system: scattered → clustered
│   └── Footer.js
└── lib/
    └── mockData.js          # Static nav items, metrics, chart data, table rows
```

Each section owns a single responsibility and its own animation logic, so the motion architecture stays local and readable rather than centralized in one large orchestrator.

---

## Key Animation & Interaction Decisions

**Why three separate motion tools instead of one?**
Each library was chosen for the kind of motion it's actually good at, rather than forcing one tool to do everything:
- **Framer Motion** drives UI-level choreography — entrance states, `AnimatePresence` tab transitions, layout animations (`layoutId` for the sidebar's active-tab indicator). It's declarative and pairs naturally with React state.
- **GSAP + ScrollTrigger** drives the Insight Flow's pinned, scroll-scrubbed horizontal timeline. This kind of scroll-locked, scrubbed sequencing is where GSAP's timeline control outperforms Framer Motion's scroll utilities.
- **React Three Fiber / Three.js** handles the two particle systems (Hero and Signature Interaction), since true depth, camera control, and thousands of individually positioned points need a real 3D renderer, not CSS/SVG.

**Hero — noise-to-grid particle morph (`DataField.js`)**
1,800 points are generated in two coordinate sets: a spherical random distribution (`buildRandomPositions`) and a structured grid (`buildGridPositions`). Each frame, positions are interpolated between the two sets using an eased scroll progress value (`progressRef`), while a separate `pointerRef` drives subtle group rotation from the cursor. This keeps the "structuring" motion tied directly to scroll intent, and the rotation tied to cursor intent, so the visual reads as responsive rather than pre-baked.

**Insight Flow — pinned horizontal scroll (`InsightFlow.js`)**
The three stage panels are pinned and scrubbed horizontally against vertical scroll, so scrolling down feels like moving forward through a pipeline rather than down a page. A progress line (SVG `stroke-dashoffset`) fills in sync with the same scrub, and per-panel spotlight/hover effects use CSS custom properties updated via `pointermove` for a lightweight, GPU-friendly cursor glow.

**Dashboard — state without a backend (`Dashboard.js`)**
Tab switching uses `AnimatePresence` with a shared `layoutId` for the active-tab background, so the indicator physically slides between tabs instead of just toggling opacity. This was chosen specifically to demonstrate "state transition" quality motion, per the challenge brief, without needing real data behind it.

**Signature Interaction — self-organizing cluster (`ClusterField.js`)**
1,200 points sit in one of two states — scattered or clustered around four fixed centers — and lerp between them on a manual toggle. Drag input is captured as raw pointer deltas and converted into rotational velocity with exponential decay (`vx *= 0.9`), giving the field inertia rather than feeling rigidly locked to the cursor. This was the deliberate "wow moment": a system that looks alive, responds to touch, and resolves into order on command — directly echoing the challenge's "data cluster that reorganizes itself" example.

---

## Design System Notes

Color, spacing, and typography tokens are centralized in `globals.css` using Tailwind v4's `@theme` directive (`--color-bg`, `--color-surface`, `--color-cyan`, `--color-violet`, etc.), so every component references the same palette rather than hardcoding hex values inline. Typography uses three purpose-built font families — a display face for headlines, a body face for copy, and a monospace face for labels/tags — reinforcing the "technical but calm" tone the brief asked for.

---

## Getting Started

**Requirements:** Node.js 18.18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

**Production build (used to verify before deployment):**
```bash
npm run build
npm run start
```

---

## Known Considerations

- All particle systems are built with `THREE.Points` rather than instanced meshes, prioritizing smooth interpolation of large point counts over per-particle geometry detail.
- Reduced-motion preference is respected globally (`prefers-reduced-motion` in `globals.css`).
- The project favors static/mocked data throughout, as explicitly permitted by the challenge brief — no backend or live data source is used.

---

## Deliverables Checklist

- [x] Next.js engineering build (this repository)
- [x] Framer Motion, GSAP, and React Three Fiber each used meaningfully
- [ ] Figma high-fidelity design file (public link above)
- [ ] Video walkthrough of animation/interaction decisions (link above)
- [ ] Live deployment (Vercel/Netlify link above)

---

## Author

Built as a frontend engineering + product design prototype for the Xai Frontend Challenge.
