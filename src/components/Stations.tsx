import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stations } from '../data/stations';
import { setActive, state } from '../store';
import { prefersReducedMotion } from '../lib/webgl';

gsap.registerPlugin(ScrollTrigger);

export default function Stations() {
  const root = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    const reduce = prefersReducedMotion();
    const N = stations.length;
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };
    const ctx = gsap.context(() => {
      // master timeline: one scrubbed trigger over the whole stations region drives which
      // part is active and the rack-focus zoom. No vertical dolly — the camera rig reads
      // the live part position and frames it.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          state.progress = p;
          const pos = p * (N - 1); // 0 .. N-1
          const active = Math.round(pos);
          setActive(Math.min(N - 1, Math.max(0, active)));
          // framed (zoom 1) when centered on a station; breathes out toward ~0.55 between
          const d = Math.abs(pos - active); // 0 .. 0.5
          state.zoom = reduce ? 0 : 1 - smoothstep(0, 0.5, d) * 0.45;
        },
      });

      // per-station content cards still fade in as they scroll through
      gsap.utils.toArray<HTMLElement>('.station').forEach((sec) => {
        const card = sec.querySelector('.station-card');
        if (!card) return;
        if (reduce) {
          gsap.set(card, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            card,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: { trigger: sec, start: 'top 78%', end: 'top 42%', scrub: true },
            },
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="overlay">
      {stations.map((s, i) => (
        <section
          key={s.id}
          id={`station-${i}`}
          className={`station ${s.side}`}
          aria-labelledby={`${s.id}-title`}
        >
          <article className="station-card">
            <div className="station-meta">
              <b>{s.no}</b>
              <span>{s.hud}</span>
            </div>
            <h2 id={`${s.id}-title`}>{s.title}</h2>
            <p>{s.blurb}</p>
            {s.media && (
              <div className="station-media">
                {s.media.type === 'video' ? (
                  <video
                    src={s.media.src}
                    poster={s.media.poster}
                    controls
                    muted
                    playsInline
                    preload="none"
                  />
                ) : (
                  <img src={s.media.src} alt={`${s.title} preview`} loading="lazy" />
                )}
              </div>
            )}
            <ul className="tags">
              {s.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className="station-link" href={s.link} target="_blank" rel="noopener noreferrer">
              REPO ↗
            </a>
          </article>
        </section>
      ))}
    </div>
  );
}
