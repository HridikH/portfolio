# Prompt for a new Fable 5 chat — real-3D portfolio rebuild

Copy everything below the line into a fresh chat with the Portfolio folder connected.

---

Build me a new portfolio site from scratch with REAL interactive 3D — not scroll-video,
not pre-rendered frames. My previous site (in this folder, branch `scroll-cinema`) faked
3D by scrubbing AI-generated clips; this one must render an actual 3D humanoid robot in
WebGL that the camera moves around as you scroll.

## The robot — exact match, hyperrealistic
1. Use the real Unitree G1 geometry. Unitree open-sources their robot descriptions:
   github.com/unitreerobotics/unitree_ros (`robots/g1_description` — URDF + mesh files).
   Download the meshes, assemble per the URDF joint tree, convert to a single GLB
   (Blender CLI or a Node pipeline), Draco-compress it. Check the repo license permits
   this use and tell me what it says before proceeding.
2. If the G1 meshes are unusable for any reason, fall back to `public/models/robot.glb`
   (a 34-part custom android already in this folder, region-mapped in NOTES.md) — but
   tell me first.
3. Hyperrealism is the whole point. Target this pipeline (three.js / react-three-fiber
   + drei + postprocessing):
   - PBR metal/rough materials: brushed + anodized aluminum, dark glass visor with
     emissive glow, subtle clearcoat on polymer panels
   - HDRI studio environment for reflections (drei Environment or Lightformers)
   - ACES filmic tone mapping, physically correct lights
   - N8AO/SSAO, selective bloom on the visor, SSR or MeshReflectorMaterial floor,
     soft contact shadows, gentle DoF on close-ups
   - KTX2 textures, Draco/meshopt GLB, device-tiered quality (drop SSR/AO on mobile),
     target 60fps on an M-series laptop
   - Match the material/lighting look of my reference renders (open and study them):
     https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260702_010047_ff13ae34-2fd5-40e9-9206-9d32d86ef319.png
     (Apple-light studio) and
     https://d8j0ntlcm91z4.cloudfront.net/user_3FuSeYO5zpBMAPRXca3TEu5cb04/hf_20260701_203243_b4e8486b-fa2e-4074-b011-0f322e00fd4e.png
     (dark cinematic). Build the light version; keep the palette swappable.

## The concept (keep from the old site)
A "diagnostic walk down the robot": scroll drives a damped camera rig down the body,
and each region is a station for a real project. `src/data/stations.ts` in this folder
is the single source of truth — 8 projects, copy, links, region map. Do NOT invent
facts. Order: brain/EEG board, eyes/UR3 vision arm, face/animatronic Grogu, jaw/Jarvis
voice assistant, spine/RISC-V kernel, arms/CRS force-control arm, core/BB-8 reaction
wheel, legs/LQR inverted pendulum. Then an "off the clock" writing beat, then contact
(hridikhingorani@gmail.com). Highlight the active region on the model itself (emissive
or material swap), not just in the HUD.

## Interaction
- Scroll = camera dolly along the body (Lenis or native + lerp — ONE smoothing layer
  only, ~100ms max input latency; my last site felt laggy from stacked smoothers)
- Subtle idle animation when not scrolling (breathing, servo micro-motion)
- Light mouse parallax on desktop; prefers-reduced-motion gets a static fallback
- Camera order down the body: head+torso → hands → legs → pull back out to full body

## Stack & delivery
Vite + React 18 + TypeScript + react-three-fiber + drei + postprocessing. New folder or
a fresh branch — do not destroy the scroll-cinema build. Deployable to GitHub Pages
(`npm run deploy`, base path `/portfolio/`). Copy voice for any new text: dry, deadpan,
concise, no hype, no em dashes.

## Palette (current site, keep)
Stage #f5f5f7, text #1d1d1f, accent #0071e3, secondary #0066cc, steel #6e6e73,
frosted-white cards, white text halos over the render.

Start by: (1) checking the Unitree license, (2) getting the G1 GLB assembled and
rendering in a minimal scene so we can judge realism early, before building the site
around it. Show me the model in the browser as step one.
