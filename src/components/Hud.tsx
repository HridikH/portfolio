import { useEffect, useRef } from 'react';
import { state, useActiveStation } from '../store';
import { stations } from '../data/stations';

// Body height ~1.8 m -> express camera depth as mm down the body, for telemetry flavor.
const BODY_MM = 1830;

export default function Hud() {
  const active = useActiveStation();
  const s = stations[Math.max(0, Math.min(stations.length - 1, active))];
  const pct = useRef<HTMLSpanElement>(null);
  const depth = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = state.progress;
      if (pct.current) pct.current.textContent = (p * 100).toFixed(0).padStart(2, '0') + '%';
      if (depth.current) depth.current.textContent = (p * BODY_MM).toFixed(0).padStart(4, '0') + 'mm';
      if (bar.current) bar.current.style.width = (p * 100).toFixed(2) + '%';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="hud" aria-hidden="true">
        <div className="cell tl">
          <div><span className="k">SUBJECT</span> UNIT-HH / HUMANOID</div>
          <div><span className="k">MODE</span> <span className="v">DIAGNOSTIC</span></div>
        </div>
        <div className="cell tr">
          <div className="big">{s.hud}</div>
          <div><span className="k">ID</span> <span className="v">{s.no}</span></div>
        </div>
        <div className="cell bl">
          <div><span className="k">DEPTH</span> <span className="v" ref={depth}>0000mm</span></div>
          <div><span className="k">REGION</span> {s.anatomy}</div>
        </div>
        <div className="cell br">
          <div><span className="k">TRAVERSE</span> <span className="v" ref={pct}>00%</span></div>
          <div><span className="k">STATION</span> {active + 1} / {stations.length}</div>
        </div>
      </div>
      <div className="hud-bar" aria-hidden="true"><i ref={bar} /></div>
    </>
  );
}
