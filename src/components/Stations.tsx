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
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.station');
      sections.forEach((sec, i) => {
        const card = sec.querySelector('.station-card');
        // arrival: pin this station to its body region (camera target + highlight)
        ScrollTrigger.create({
          trigger: sec,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) {
              setActive(i);
              state.target = stations[i].bodyY;
            }
          },
        });
        // content fade, synced to scroll
        if (card) {
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
