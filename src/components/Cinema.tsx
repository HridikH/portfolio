import { useEffect, useRef } from 'react';
import { ACTS, STILLS } from '../cinema/assets';
import { captureClip } from '../cinema/capture';
import { Scrubber, type LoadedAct } from '../cinema/scrubber';
import { stations } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

const ACCENT_GLOW = 'rgba(53, 208, 230, 0.22)'; // cyan floor glow

// which still frames the active station (used only in fallback, until clips land)
function stillForRegion(region: string): keyof typeof STILLS {
  switch (region) {
    case 'brain':
    case 'eyes':
    case 'face':
    case 'jaw':
      return 'head';
    case 'spine':
    case 'core':
      return 'torso';
    case 'arms':
      return 'arm';
    case 'legs':
      return 'legs';
    default:
      return 'hero';
  }
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function Cinema() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotion();
    let scrubber: Scrubber | null = null;
    let disposed = false;

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
    };
    size();
    addEventListener('resize', size);

    (async () => {
      // load fallback stills (already in the repo)
      const stillCache: Record<string, HTMLImageElement> = {};
      await Promise.all(
        Object.values(STILLS).map(async (s) => {
          try {
            stillCache[s] = await loadImg(s);
          } catch {
            /* ignore */
          }
        }),
      );

      const loaded: LoadedAct[] = ACTS.map((act) => ({
        act,
        frames: [],
        fallback: stillCache[act.fallback] ?? null,
      }));

      if (disposed) return;
      const getFallbackImg = () => {
        let key: keyof typeof STILLS = 'hero';
        if (state.phase === 'stations') {
          const s = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
          key = stillForRegion(s?.region ?? 'hero');
        }
        return stillCache[STILLS[key]] ?? stillCache[STILLS.hero] ?? null;
      };
      scrubber = new Scrubber(canvas, loaded, {
        reducedMotion: reduced,
        accent: ACCENT_GLOW,
        getFallbackImg,
        onProgress: () => {
          // keep the HUD FOCUS readout alive (Stations sets state.zoom)
          state.zoomDisp += (state.zoom - state.zoomDisp) * 0.08;
        },
      });
      scrubber.start();

      // Capture produced clips ONE AT A TIME (never several decodes at once — that
      // is what janks the first load / phones). Dedupe by URL, then assign the
      // captured frames to every act that shares it. Empty URLs are skipped, so the
      // fallback stills just stay. A short idle gap lets first paint settle first.
      if (!reduced) {
        const order = ['upper', 'open', 'macro', 'orbit']; // spine (descent clip) first; 'lower' shares its URL
        const byUrl = new Map<string, LoadedAct[]>();
        for (const la of loaded) {
          if (!la.act.clipUrl) continue;
          const arr = byUrl.get(la.act.clipUrl) ?? [];
          arr.push(la);
          byUrl.set(la.act.clipUrl, arr);
        }
        const urls = [...byUrl.entries()].sort(
          (a, b) => order.indexOf(a[1][0].act.id) - order.indexOf(b[1][0].act.id),
        );
        const runNext = async (i: number) => {
          if (disposed || i >= urls.length) return;
          const [url, acts] = urls[i];
          const frames = await captureClip(url);
          if (!disposed && frames.length) for (const la of acts) la.frames = frames;
          setTimeout(() => runNext(i + 1), 200); // yield between clips
        };
        setTimeout(() => runNext(0), 600);
      }
    })();

    return () => {
      disposed = true;
      removeEventListener('resize', size);
      scrubber?.stop();
    };
  }, []);

  return (
    <div className="cinema-fixed" aria-hidden="true">
      <canvas ref={canvasRef} className="cinema-canvas" />
      {/* static, GPU-composited darkening + accent floor glow (no per-frame canvas work) */}
      <div className="cinema-overlays" />
      <div className="cinema-floor" />
    </div>
  );
}
