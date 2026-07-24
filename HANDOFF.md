# Portfolio — scroll-cinema handoff

## What this project is
Hridik Hingorani's portfolio. A single-page "diagnostic walk down a humanoid robot" — each
body region maps to a real project. The old real-time WebGL (three.js / react-three-fiber)
layer has been **replaced by a scroll-cinema engine**: a few short clips are captured once to
in-memory WebP frames, and a canvas paints frame-by-frame in lock-step with scroll. Nothing
renders in real time.

- Repo: `hridik/portfolio` · live (OLD build): https://hridikh.github.io/portfolio/
- Working branch: **`scroll-cinema`**
- Local folder: `/Users/hridik7/Claude/Projects/Portfolio`
- Stack: **Vite + React 18 + TypeScript**, GSAP + ScrollTrigger, Lenis, hand-written rAF
  scrubber. No three.js in the shipped bundle.

## Decisions already made (don't re-litigate)
- **Framework:** kept Vite, engine ported as a self-contained module (`src/cinema/`). NOT
  migrated to Next — nothing needs SSR.
- **Accent:** unified on **cyan** (`#33d1e8`, sampled from the visor), cool-blue `#6aa8ff`
  secondary, ground `#070708`. The `--amber` CSS var name is legacy; its value is cyan.

## Architecture
- `src/data/stations.ts` — SINGLE SOURCE OF TRUTH: 8 real projects, copy, links, region map.
  Do NOT invent project facts.
- `src/cinema/assets.ts` — THE file you edit: clip URLs (`CLIPS`), act timeline (`ACTS`),
  spans, grade constants, `SCROLL_LERP`, `ACT_TAIL`.
- `src/cinema/capture.ts` — plays a clip once via requestVideoFrameCallback → WebP frames.
- `src/cinema/idb.ts` — IndexedDB cache (`hh-scroll`), keyed `url|width`.
- `src/cinema/scrubber.ts` — rAF loop: scroll → frame index → drawImage.
- `src/components/Cinema.tsx` — mounts canvas + overlays, loads stills, runs captures.
- Other components: Hud, Hero, Stations, OffClock, Contact, Fallback.
- `src/r3f/` — DEAD legacy WebGL. Excluded in tsconfig, imported by nothing. Delete locally.

## Station / act map (head → toe)
brain/EEG, eyes/UR3 vision, face/Grogu, jaw/Jarvis, spine/RISC-V kernel, arms/CRS arm,
core/BB-8, legs/LQR pendulum. Stations overlay at sub-spans of the scroll.
**Act order (REORDERED 2026-07-02, user request — body order head→hand→legs):**
open (idle hero) → `upper` (descent clip, win [0,.55]: head+torso) → `macro`
(win [.22,1]: visor→hand, the head→hand bridge) → `orbit` (win [.3,1]: hand zoom)
→ `lower` (descent clip, win [.55,1]: legs) → `pullback` (reverseOf 'lower', full
descent reversed: enters on the exact frame lower ends on — match cut — and
glides feet→head→hero wide for the close). The descent clip serves THREE acts
(upper, lower, reversed close); `win: [in, out]` on each act selects its slice
(replaced trimIn). Tune win values if a body-region boundary sits wrong.

## APPLE LIGHT THEME + 4K reel (2026-07-02, latest)
The whole site flipped to an Apple-product-page look, user request. Two halves:
- **Assets:** new Apple-style hero (nano_banana_pro 2K, white studio cyclorama,
  silver aluminum + white polymer, job `ff13ae34`) + all four clips re-seeded from
  it (kling3_0_turbo @ 1080p native, restrained motion) + Topaz 2160p upscales of
  all four. URLs in `assets.ts`. ALL region fallback stills point at the Apple hero
  (old dark `public/renders/*.jpg` would flash black on the white stage).
- **Chrome (global.css):** light theme via the legacy var names — `--void`=#f5f5f7,
  `--paper`=#1d1d1f, accent `--amber`=#0071e3 (Apple blue), `--violet`=#0066cc,
  steel grays flipped. Overlays/vignette now white veils; `.cinema-floor` is a
  multiply contact-shadow (was cyan screen glow); text halos white; card/btn
  backgrounds frosted white. `GRADE` near-neutral (1.0/1.02/1.05) — the old dark
  pump blows out white. `captureWidth` capped 2560 + `BMP_MAX` 32 for 4K sources.
- **MCP quirk:** parallel Higgsfield calls intermittently drop the proxy connection
  ("MCP server connection lost") and a "failed" call MAY still be charged+completed
  server-side — check `show_generations`/`balance` before re-running. Call
  SEQUENTIALLY. Upscales: max 2 concurrent on this plan.
- Credits after all of it: **75**.
- Dark-theme rollback: previous reels still on CDN (see comment in `assets.ts`) +
  git history has the dark palette.

## Higgsfield assets (HYPERREAL re-seed, 2026-07-02 — SUPERSEDED by Apple reel above)
The entire reel was regenerated in a hyperrealistic 3D-render style (PBR metals,
micro-scratches, ray-traced reflections, volumetric haze; same robot design, cyan
visor, same act structure). Old (stylized) URLs replaced in `assets.ts`. Models:
hero = `nano_banana_pro` (2K, 16:9, image-to-image restyle of the old hero); clips =
`kling3_0_turbo` @ 720p, all seeded from the new hero (job `b4e8486b`). CDN:
`d8j0ntlcm91z4.cloudfront.net`. Credits: topped up 2026-07-02; **184 left** after
the 1080p upscale pass. Upscale rate limit: max 2 concurrent jobs on basic plan.
- HERO still (hyperreal, 2752×1536) → `STILLS.hero`
- descent (10s, head→feet) → `CLIPS.descent`
- **orbit slot = arm zoom-in** (8s push-in to forearm/hand; label "Manipulators",
  fallback `STILLS.arm`) → `CLIPS.orbit`
- macro (8s visor→hand) → `CLIPS.macro`
- idle (5s static-cam micro-motion loop) → `CLIPS.idle`
- **bridge = gone from the timeline** (`CLIPS.bridge` key kept but unused): overlap
  dissolves + `trimIn` made the hero detour unnecessary; pullback still closes on the hero.
- **Topaz upscales DONE (2026-07-02):** all four clips at 1080p (prob-4, ~0.6 credits/sec,
  ~18 total). URLs swapped in `assets.ts`; 720p originals still on CDN (hf_20260701_2037xx_*).
  Scrubber `BMP_MAX` lowered 72 → 48 for the heavier 1080p frames. 2160p deliberately
  skipped: 4K frames would blow the decode-cache memory budget (33 MB/frame decoded).
- NOT yet verified in a browser (sandbox has none): scrub the reel on localhost and
  check the descent actually travels head→feet and the idle loops cleanly. Old-look
  fallback stills (`public/renders/*.jpg`) now mismatch the hyperreal clips — only
  visible pre-capture / if CORS capture fails; regenerate or ignore.

## Work done this session
1. Stripped dead WebGL from the bundle (removed three/r3f manualChunks + deps, cleaned
   `store.ts`, excluded `src/r3f`). Build green: `tsc` clean, no three/r3f in output.
2. Generated + wired all Higgsfield assets above.
3. **Perf refactor** (site was laggy): grade + velocity blur moved to a GPU CSS `filter` on
   the canvas element; darkening/vignette/glow moved to static DOM layers (`.cinema-overlays`,
   `.cinema-floor`); captures now run ONE at a time (deduped) instead of 4 at once.
4. **Smoother transitions (REWORKED TWICE 2026-07-02):** the `ACT_TAIL` rewind was jerky
   (whole clip rewound in the 16% tail = ~5x-speed backward playback + direction snap) —
   REMOVED, along with the time-based boundary crossfade. Now: **two-layer overlap
   dissolve** (`ACT_BLEND` = 0.15, scroll-position-driven, symmetric both directions).
   The incoming act's motion timeline starts inside the outgoing act's tail and fades in
   while already moving — both dissolve layers are live footage, never a frozen frame.
   **`trimIn`** per act (orbit/macro = 0.22) skips each clip's hero-wide opening, so acts
   hand off part-to-part instead of returning to the hero at every seam (user request).
   The **bridge act was removed from ACTS** — it only existed to route back to the hero.
   Also: two-frame blending on fractional frame position kills quantization stutter.
5. **Lag fixes (2026-07-02):** three stacked causes, all addressed. (a) Input latency:
   Lenis lerp (0.09) + scrubber lerp were two exponential smoothers in series ≈ 300ms
   behind the wheel → Lenis lerp now 0.12, `SCROLL_LERP` now 0.3 (light, quantization-
   softening only — don't lower one without stiffening the other). (b) Velocity blur
   (CSS `blur()` up to 4px over a Retina-size canvas, recomputed while scrolling) was
   GPU-heavy and smeared the image → `MAX_BLUR = 0` (disabled; set >0 to re-enable).
   (c) The real dropped frames: hundreds of 720p WebP `<img>` frames can't all stay
   decoded, so every scrubbed frame forced a synchronous re-decode → scrubber now pins
   a sliding window of `ImageBitmap`s around the playhead (prefetch ±, FIFO eviction,
   ~72 bitmaps ≈ 260 MB cap) and falls back to the `<img>` only while a decode is in
   flight.
5. **Legibility fixes** (verified in Chrome): `.btn` had native OS styling (COPY EMAIL rendered
   as a white box) → added `appearance:none` + dark translucent bg + blur; added dark
   text-halos to hero/beat text so it reads over the bright robot; lifted `--steel` to `#939aa6`.

## Environment constraints hit (important)
- **Cannot commit from the tooling** — a stale `.git/index.lock` can't be deleted by the
  sandbox. On the machine: `rm .git/index.lock`, then commit the branch. All edits are saved
  to disk, just uncommitted.
- **Cannot delete files** in the mounted folder from the sandbox (e.g. `src/r3f`, old model
  glbs). Delete locally.
- **Cannot download the Higgsfield CDN assets** into the repo (proxy 403) → they're referenced
  as CDN URLs. **CORS caveat:** frame capture needs CORS headers from the CDN; if absent, the
  engine falls back to the still (no breakage). If it falls back, download clips into
  `public/media/` and point `CLIPS` at local paths.
- No browser in the sandbox; preview verified via the user's own Chrome on `localhost:5173/portfolio/`.

## Open / optional next steps
- Commit + deploy (`npm run deploy` → gh-pages). Dev: `npm run dev` → localhost:5173/portfolio/.
- Delete `src/r3f/` + old `public/models/*.glb` locally.
- Optional: Topaz-upscale keeper clips; generate a real bridge clip; add a faint dark scrim
  behind the contact sub-line ("…robotics and controls") where it grazes the torso.
- Tunables in `src/cinema/assets.ts`: `ACT_BLEND` (overlap width; raise for lazier
  dissolves, lower toward 0.08 for snappier seams), per-act `trimIn` in `ACTS` (0.22 on
  orbit/macro — raise if a seam still flashes the hero, lower if an act enters too deep
  into its move), `SCROLL_LERP` (now 0.3, paired with Lenis lerp 0.12 — one light + one
  medium smoother; change them together), `MAX_BLUR` (0 = velocity blur off).

## Voice (for any new copy)
Dry, deadpan, concise. No corporate filler, no em dashes, no hype. Quiet turn where it fits.
