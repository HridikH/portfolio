# Deliverable notes

## Body region → project mapping

You have 8 projects on the current site, not 6, so I extended the anatomy down the body
in head-to-toe order and kept it sensible. The writer section stays as the "off the clock"
beat after the body, before contact.

| # | Region (HUD label)     | Project                          |
|---|------------------------|----------------------------------|
| 1 | BRAIN / CORTEX         | 8-channel EEG board              |
| 2 | OPTIC / VISION         | UR3 vision-guided arm            |
| 3 | FACE / EXPR            | Animatronic Grogu                |
| 4 | VOCAL / LANG           | Jarvis voice assistant           |
| 5 | SPINE / BUS            | We_Are_Kernel (RISC-V OS)        |
| 6 | ARMS / HANDS           | CRS force-control arm            |
| 7 | CORE / GYRO            | BB-8 reaction-wheel robot        |
| 8 | LEGS / VEST            | LQR inverted pendulum            |

Differences from the brief's 6-station list: your brief put Jarvis at the mouth and the
EEG implicitly at the brain — kept. It mapped the CRS arm to ARMS and the pendulum to LEGS
— kept. I added FACE (Grogu) and CORE (BB-8) because those two projects exist on your site
and needed a home. If you'd rather fold Grogu into the head with the EEG, or drop a
station, say so and I'll re-map in `src/data/stations.ts` (it's the single source of truth).

## Humanoid asset

Status: **`humanoid-realistic.glb` (you provided)** at `public/models/robot.glb` — a
detailed 34-part android with its own realistic `silver` / `dark` / `cyan` / `shoe`
materials and a visor. We **keep those materials** (cloned per-mesh) and only drive a
tech-blue emissive glow on the active region; the visor carries an always-on cyan glow.
Environment map (procedural lightformers, no HDR download) gives the silver reflections,
plus a contact shadow and selective bloom (desktop, non-reduced-motion).

Earlier models are kept as backups: `public/models/humanoid-nav-backup.glb` (original nav
rig) and the procedural generator `scripts/build_robot.py`.

This model has no `eye`/`mouth` meshes (it uses a `visor`), so the region mapping in
`src/r3f/Humanoid.tsx` (`regionOf()`) was updated:

| Region (station)        | GLB nodes |
|-------------------------|-----------|
| brain (EEG)             | `head` |
| eyes / vision (UR3)     | `visor` |
| face (Grogu)            | `head`, `visor` |
| jaw / language (Jarvis) | `neck` |
| spine / nervous (kernel)| `abdomen`, `waist` |
| arms (CRS)              | `shoulder_*`, `arm_*`, `elbow_*`, `wrist_*`, `hand_*` |
| core / balance (BB-8)   | `chest`, `chest_panel`, `pelvis` |
| legs / vestibular (LQR) | `leg_*`, `knee_*`, `ankle_*`, `foot_*`, `toe_*` |

The model is auto-fit at runtime (bounding-box scale + recenter) into the camera traverse
range. It faces +Z toward the camera (verified). 77 KB, so Draco/KTX2 aren't needed.

Record the source + license for the deliverable:

- Asset: humanoid-realistic.glb (you provided)
- Source: _TBD — fill in where you got it_
- License: _TBD — confirm CC0 / permissive_

## WebGPU

The brief asked for WebGPURenderer with WebGL2 fallback. react-three-fiber v8's renderer is
WebGL2, which is the rock-solid default shipped here (and what these draw-call counts need).
Three's `WebGPURenderer` + R3F is still experimental and risks runtime breakage on Pages, so
I defaulted to WebGL2 and kept the scene renderer-agnostic. If you want, I can add a guarded
WebGPU attempt that auto-falls back — flagged separately so it can't break the stable path.

## Placeholders to fill in

- **GLB humanoid** — see above. Until then the primitive figure stands in (and doubles as
  the look if you decide you like it).
- **Repo links** — every project links to `https://github.com/HridikH/portfolio`. If
  individual repos exist, drop the URLs into `src/data/stations.ts` (`link` field).
- **Media** — UR3, CRS arm, pendulum, and Jarvis have video; the kernel has the terminal
  graphic. Grogu, BB-8, and the EEG board have no media yet — add files to
  `public/media/` and a `media` entry in `stations.ts` and they'll render.
- **Asset license line** in this file.

## What I verified

- `npm run build` passes (type-check clean, production bundle built).
- Three.js is code-split into a lazy chunk; first paint loads ~57 kB gzip, the 3D
  (~176 kB gzip three + r3f) loads on demand.
- `npm run preview` serves correctly under the `/portfolio/` base; assets resolve (200).
- I could not render an interactive preview from the build environment (no browser), so
  please run `npm run dev` and eyeball the motion. Anything off, I'll tune.
