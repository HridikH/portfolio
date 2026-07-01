import { useEffect, useRef } from 'react';
import { stations } from '../data/stations';
import { state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

const BASE = import.meta.env.BASE_URL;
const SRC = {
  hero: `${BASE}renders/hero.jpg`,
  head: `${BASE}renders/head.jpg`,
  torso: `${BASE}renders/torso.jpg`,
  arm: `${BASE}renders/arm.jpg`,
  legs: `${BASE}renders/legs.jpg`,
} as const;
type Key = keyof typeof SRC;

// station region -> which render frames it
function keyForRegion(region: string): Key {
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

export default function Stills() {
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  const glow = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useRef(prefersReducedMotion());

  useEffect(() => {
    let raf = 0;
    let scale = 1;
    const keys = Object.keys(SRC) as Key[];
    const step = () => {
      // pick the frame for the current phase/station
      let key: Key = 'hero';
      if (state.phase === 'stations') {
        const s = stations[Math.max(0, Math.min(stations.length - 1, state.active))];
        key = keyForRegion(s?.region ?? 'hero');
      }
      // smooth the zoom readout (also feeds the HUD FOCUS%)
      const zk = 1 - Math.pow(0.0009, 0.016);
      state.zoomDisp += ((reduce.current ? 0 : state.zoom) - state.zoomDisp) * zk;
      const z = state.zoomDisp;

      // crossfade layers
      for (const k of keys) {
        const el = layers.current[k];
        if (el) el.style.opacity = k === key ? '1' : '0';
      }
      // focus-pull scale (subtle) + gentle breath
      const target = reduce.current ? 1 : 1 + z * 0.06;
      scale += (target - scale) * 0.06;
      if (wrap.current) wrap.current.style.transform = `scale(${scale.toFixed(4)})`;
      // blue diagnostic glow tracks the zoom
      if (glow.current) glow.current.style.opacity = (reduce.current ? 0.25 : 0.2 + z * 0.6).toFixed(3);

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="stills-fixed" aria-hidden="true">
      <div className="stills-wrap" ref={wrap}>
        {(Object.keys(SRC) as Key[]).map((k) => (
          <div
            key={k}
            className="stills-layer"
            ref={(el) => (layers.current[k] = el)}
            style={{ backgroundImage: `url(${SRC[k]})`, opacity: k === 'hero' ? 1 : 0 }}
          />
        ))}
        {!reduce.current && <div className="stills-scan" />}
      </div>
      <div className="stills-glow" ref={glow} />
    </div>
  );
}
