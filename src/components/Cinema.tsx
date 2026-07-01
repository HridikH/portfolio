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

      // capture any produced clips in the background; swap frames in when ready.
      // (Empty URLs return [] instantly, so the fallback stills just stay.)
      if (!reduced) {
        for (const la of loaded) {
          if (!la.act.clipUrl) continue;
          captureClip(la.act.clipUrl).then((frames) => {
            if (!disposed && frames.length) la.frames = frames;
          });
        }
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
    </div>
  );
}
