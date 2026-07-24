# robot-3d

The WebGL rebuild. A real Unitree G1 rendered in three.js; scroll drives a
damped camera down the body, one station per project.

## Run

```bash
npm install
npm run dev
```

- `/portfolio/` — the site
- `/portfolio/viewer.html` — model-only realism check (orbit, palette toggle,
  region cycle; also `?palette=dark`, `?region=arms`, `?mat=normal|basic|standard`
  for debugging)

## Deploy

```bash
npm run deploy
```

Builds and pushes `dist/` to the repo's `gh-pages` branch, base path
`/portfolio/`. Warning: this replaces whatever the `gh-pages` branch is
currently serving (the scroll-cinema build, if that's live).

## The model

`public/models/g1.glb` — assembled from Unitree's open-source G1 description
(`unitreerobotics/unitree_ros`, `robots/g1_description`,
`g1_29dof_with_hand_rev_1_0.urdf` + STL meshes). BSD 3-Clause; notice shipped
at `public/models/UNITREE-LICENSE.txt`. Pipeline (see `scripts/assemble_g1.py`):
URDF forward kinematics at a relaxed pose, hard/soft edge split at 35°,
per-link pivots preserved (idle servo motion rotates real joint frames),
meshopt simplify 50%, Draco. 4.5 MB, 49 named nodes.

The URDF meshes carry no UVs, so materials are untextured PBR — do not add
texture maps or anisotropy without generating UVs first.

## Structure

- `src/data/stations.ts` — single source of truth: 8 projects, copy, links,
  region map. Copied verbatim from the scroll-cinema build.
- `src/three/materials.ts` — PBR set + region→node mapping (URDF link names)
- `src/three/RobotModel.tsx` — GLB load, material assignment, face LED,
  region emissive highlight, idle micro-motion
- `src/three/Stage.tsx` — PMREM RoomEnvironment, key/rim lights, reflector
  floor (high tier), contact shadows, light/dark palette
- `src/three/Effects.tsx` — N8AO, selective bloom (HDR threshold, only the
  LED crosses it), gentle DoF on close-ups (high tier)
- `src/three/CameraRig.tsx` — scroll → keyframes → single damp (~100 ms).
  The only smoothing layer; scroll itself is native.
- `src/three/quality.ts` — device tiers: low (no post, capped DPR),
  med (AO half-res + bloom), high (everything + reflective floor)

Reduced motion: static hero frame, no idle animation, cards fully opaque.
