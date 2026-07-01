# Hridik Hingorani — Portfolio (WebGL rebuild)

A full-page WebGL site. The viewport is a 3D canvas; scrolling runs a diagnostic down a
humanoid robot, head to toe. Each body region is a station that maps to a project. When
the camera arrives, that region lights sodium-amber and the project content fades in over
the canvas. A fixed corner HUD reads like telemetry.

Built with Vite, React, TypeScript, react-three-fiber, drei, Three.js, GSAP + ScrollTrigger,
and Lenis. Single bright color (amber) on a near-black blue void; literary serif for
display, clean sans for body, mono for labels.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173/portfolio/
```

```bash
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Deploy to GitHub Pages

The Vite `base` is `/portfolio/` (set in `vite.config.ts`) so it matches
`https://hridikh.github.io/portfolio`. To publish a different repo name, run with
`BASE_PATH=/your-repo/ npm run build`.

One-time: install the deploy helper is already in `devDependencies` (`gh-pages`).

```bash
npm run deploy   # builds, then pushes dist/ to the gh-pages branch
```

Then in the GitHub repo: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`**.
A `.nojekyll` file is included so the `assets/` folder is served untouched.

> If you currently serve the old single-file site from `main`/root, switch the Pages
> source to the `gh-pages` branch after the first `npm run deploy`.

## Structure

```
src/
  App.tsx                Lenis + ScrollTrigger setup, WebGL gate, lazy-loads the scene
  store.ts               tiny external store (scene reads it per-frame; UI subscribes)
  data/stations.ts       SINGLE SOURCE OF TRUTH — projects, copy, links, region mapping
  lib/webgl.ts           WebGL + reduced-motion detection
  r3f/
    Scene.tsx            <Canvas> wrapper (lazy chunk)
    Experience.tsx       lights, camera traverse, mouse parallax, starfield
    Humanoid.tsx         segmented primitive humanoid; SWAP POINT for the GLB
  components/
    Hud.tsx              corner telemetry (region, project id, depth, traverse %)
    Hero.tsx             name, eyebrow, tagline
    Stations.tsx         per-station overlay cards, ScrollTrigger fades + region pinning
    OffClock.tsx         writer / off-the-clock beat
    Contact.tsx          real links, copy-email, resume
    Fallback.tsx         graceful 2D version when WebGL is unavailable
```

## Notes

See `NOTES.md` for the region→project mapping, the humanoid asset status, and the items
left as placeholders to fill in.

## Scroll-cinema engine (`scroll-cinema` branch)

The 3D real-time layer is replaced by a **pre-rendered, scroll-scrubbed frame engine** so the
humanoid can be photoreal without a live GPU cost. Self-contained in `src/cinema/`.

**Framework choice:** kept **Vite + React + TS**, engine ported as a standalone module — not
migrated to Next.js. A Next migration would change the deploy pipeline (GitHub Pages) and buys
nothing for a static scroll page. Nothing here needs SSR.

**Accent choice:** **unified on cyan** (sampled from the robot's visor), with a cool-blue
secondary for the wordmark. Ground is `#070708`. (The alternative — amber UI + cyan only on the
robot — was dropped for cohesion.)

### How it works
- **Capture once, scrub forever.** `capture.ts` plays each clip through a hidden `<video>` once,
  and via `requestVideoFrameCallback` exports every decoded frame to a **WebP blob** → `Image`.
  After that, scrolling never touches the video — the scrubber just picks a frame index and
  `drawImage`s. Capture width is device-bound and never upscales
  (`min(3840, max(mobile?900:1920, innerW*dpr))`).
- **Cache:** each WebP sequence is stored in **IndexedDB** (`idb.ts`, store `hh-scroll`, key
  `url|width`). First visit buffers; return visits restore instantly. Partial captures are never
  persisted.
- **Scrubber (`scrubber.ts`):** a hand-written rAF loop. Scroll progress (lerp `0.09`) maps to
  act spans → frame index → `drawImage`. Live canvas grade every frame
  (`brightness 1.13 / contrast 1.08 / saturate 1.22`, plus `0–4px` velocity blur), breathing
  scale `1.05 + sin·0.03`, edge/vignette darkening, and a cyan floor-glow.
- **Idle loop:** when scroll is idle the `idle` act's frames advance on their own so the robot
  stays alive; scrubbing pauses it.
- **Fallbacks:** no `requestVideoFrameCallback` **or** no clips yet → crossfade the active
  station's still on the graded stage (this is what ships today, with empty URLs).
  `prefers-reduced-motion` → one static still, no animation. **Empty clip URLs are valid** — the
  engine skips them and falls back, so the site builds and runs at every stage.

### Adding a clip
1. Render the clip (see the prompt spec) and host it (CDN or `public/`).
2. Put the URL in **`src/cinema/assets.ts`** → `CLIPS` (e.g. `descent: '…/descent.webm'`).
   Segment spans live in the `ACTS` array in the same file.
3. Reload. First load buffers it behind the hero, caches to IndexedDB, then scrubs it. The
   `pullback` act reuses `macro`'s frames reversed automatically (`reverseOf`).

The typed assets file is the only thing you edit as you produce footage.
