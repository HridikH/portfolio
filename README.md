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
