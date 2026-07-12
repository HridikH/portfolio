// The site: fixed WebGL stage + native scroll column driving the camera rig.
// Sections: hero, 8 stations (from stations.ts, single source of truth),
// off the clock, contact.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import RobotModel from './three/RobotModel';
import Stage from './three/Stage';
import Effects from './three/Effects';
import CameraRig from './three/CameraRig';
import { detectTier, prefersReducedMotion } from './three/quality';
import type { PaletteMode } from './three/materials';
import { stations, links, offClock, contact, Station, Region } from './data/stations';
import { recordSections, phone, RecordSectionData } from './data/resume';

const SECTIONS = 1 + stations.length + recordSections.length + 2;

// Per-section scroll mapping: measures actual .panel offsets so sections of
// unequal height (the record dossiers) stay aligned with camera keyframes.
function useScrollProgress(reduced: boolean) {
  const progress = useRef(0);
  const [section, setSection] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const panels = () => Array.from(document.querySelectorAll<HTMLElement>('.panel'));
    const onScroll = () => {
      const els = panels();
      if (!els.length) return;
      const y = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      let frac = 0;
      for (let i = 0; i < els.length; i++) {
        const top = els[i].offsetTop;
        const h = els[i].offsetHeight || 1;
        if (y >= top && y < top + h) {
          idx = i;
          frac = (y - top) / h;
          break;
        }
        if (y >= top + h) idx = i + (i === els.length - 1 ? 1 : 0);
      }
      // Sampling at viewport center: a section is "reached" when centered,
      // so shift by half a section to land keyframe i exactly at center of i.
      const pos = Math.max(0, Math.min(idx + frac - 0.5, SECTIONS - 1));
      progress.current = pos / (SECTIONS - 1);
      setSection(Math.round(pos));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);
  return { progress, section };
}

function RecordCard({ data, active }: { data: RecordSectionData; active: boolean }) {
  return (
    <div className={`card wide center-h ${active ? 'active' : ''}`}>
      <div className="card-hud">
        <span className="card-region">{data.hud}</span>
      </div>
      <h2>{data.title}</h2>
      {data.groups.map((g) => (
        <div className="rec-group" key={g.heading}>
          <div className="rec-heading">{g.heading}</div>
          {g.entries.map((e) => (
            <div className={`rec-entry ${e.featured ? 'featured' : ''}`} key={e.role}>
              <div className="rec-role">
                {e.role} <span className="rec-org">· {e.org}</span>
              </div>
              <div className="rec-meta">{e.meta}</div>
              {e.lines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StationCard({ s, active }: { s: Station; active: boolean }) {
  const planned = !!s.status;
  return (
    <div className={`card ${s.side} ${planned ? 'planned' : ''} ${active ? 'active' : ''}`}>
      <div className="card-index">{s.no.replace('PRJ-', '')}</div>
      <div className="card-hud">
        <span className="card-no">{s.no}</span>
        <span className="card-region">{s.hud}</span>
        {planned && <span className="card-status">{s.status}</span>}
      </div>
      <h2>{s.title}</h2>
      <div className="card-anatomy">{s.anatomy}</div>
      <p>{s.blurb}</p>
      {s.progress && (
        <div className="card-progress">
          <span className="card-progress-label">Progress</span>
          {s.progress}
        </div>
      )}
      {s.metric && <div className="card-metric">{s.metric}</div>}
      {s.media?.type === 'video' && (
        <video src={s.media.src} poster={s.media.poster} muted loop playsInline autoPlay={active} />
      )}
      {s.media?.type === 'image' && <img src={s.media.src} alt="" loading="lazy" />}
      <div className="card-tags">
        {s.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {s.link ? (
        <a className="card-link" href={s.link} target="_blank" rel="noopener noreferrer">
          View project ↗
        </a>
      ) : planned ? (
        <span className="card-link pending">In progress · repo coming</span>
      ) : null}
    </div>
  );
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function App() {
  const tier = useMemo(detectTier, []);
  const reduced = useMemo(prefersReducedMotion, []);
  const hasWebGL = useMemo(webglAvailable, []);
  const [modelReady, setModelReady] = useState(false);
  const [mode] = useState<PaletteMode>('light'); // palette swappable here
  const { progress, section } = useScrollProgress(reduced);
  const mouse = useRef({ x: 0, y: 0 });
  const focus = useRef(new THREE.Vector3(0, 0.8, 0));
  const [dofClose, setDofClose] = useState(false);

  // active station: sections 1..8
  const activeStation: Station | null =
    section >= 1 && section <= stations.length ? stations[section - 1] : null;
  const activeRegion: Region | null = activeStation?.region ?? null;

  useEffect(() => {
    if (reduced || tier === 'low') return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, tier]);

  // No WebGL (restricted networks, old drivers): static single-column page.
  const staticMode = !hasWebGL;

  return (
    <div className={`site ${staticMode ? 'static' : ''}`} data-mode={mode}>
      {!staticMode && (
      <div className="stage-fixed">
        {!modelReady && <img className="hero-poster" src={`${import.meta.env.BASE_URL}poster.jpg`} alt="" />}
        <Canvas
          shadows
          dpr={tier === 'low' ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 1.0, 3.1], fov: 35, near: 0.05, far: 60 }}
          gl={{
            antialias: tier === 'low',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            powerPreference: 'high-performance',
          }}
          frameloop={reduced ? 'demand' : 'always'}
        >
          <Suspense fallback={null}>
            <Stage mode={mode} tier={tier} />
            <RobotModel
              activeRegion={activeRegion}
              idle={!reduced}
              onReady={() => setModelReady(true)}
            />
            <Effects tier={tier} focusTarget={focus.current} dofEnabled={dofClose && !reduced} />
          </Suspense>
          <CameraRig
            progress={progress}
            mouse={mouse}
            parallax={!reduced && tier !== 'low'}
            frozen={reduced}
            onFocusChange={(t, d) => {
              focus.current.copy(t);
              const close = d < 0.7;
              if (close !== dofClose) setDofClose(close);
            }}
          />
        </Canvas>
      </div>
      )}

      {/* HUD: name + status left/center, persistent actions right */}
      <header className="hud">
        <div className="hud-name">HRIDIK HINGORANI</div>
        <div className="hud-status">
          {activeStation ? `${activeStation.no} · ${activeStation.hud}` : 'DIAGNOSTIC MODE'}
        </div>
        <nav className="hud-actions">
          <a href={links.resume} target="_blank" rel="noopener noreferrer">Resume ↓</a>
          <a href={`mailto:${links.email}`}>Contact</a>
        </nav>
      </header>

      {/* scroll column */}
      <main className="scroll-col">
        <section className="panel hero">
          <div className="hero-copy">
            <p className="hero-kicker">Portfolio · diagnostic mode</p>
            <h1>Hridik Hingorani</h1>
            <p className="hero-role">Robotics, controls, embedded systems.</p>
            <p className="hero-sub">
              Nine projects, mapped head to toe on the robot. Scroll to run the check.
            </p>
            <p className="hero-note">
              The render is a Unitree G1 model, used here for visualization.
            </p>
            <div className="scroll-cue">▼</div>
          </div>
        </section>

        {stations.map((s, i) => (
          <section className="panel" key={s.id}>
            <StationCard s={s} active={section === i + 1} />
          </section>
        ))}

        {recordSections.map((r, i) => (
          <section className="panel record" key={r.hud}>
            <RecordCard data={r} active={section === stations.length + 1 + i} />
          </section>
        ))}

        <section className="panel beat">
          <div className="card center">
            <div className="card-anatomy">{offClock.label}</div>
            <h2>{offClock.title}</h2>
            <p>{offClock.body}</p>
            <blockquote>{offClock.pull}</blockquote>
            <div className="btn-row">
              <a className="btn primary" href={links.instagram} target="_blank" rel="noopener noreferrer">
                Read on Instagram ↗
              </a>
              <a className="btn" href={links.fiction} target="_blank" rel="noopener noreferrer">
                Read fiction ↗
              </a>
            </div>
          </div>
        </section>

        <section className="panel beat">
          <div className="card center">
            <div className="card-anatomy">{contact.label}</div>
            <h2>{contact.title}</h2>
            <p>{contact.body}</p>
            <div className="contact-email">
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </div>
            <div className="contact-phone">{phone}</div>
            <div className="btn-row">
              <a className="btn" href={links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a className="btn" href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="btn primary" href={links.cvFull} target="_blank" rel="noopener noreferrer">Full CV ↓</a>
              <a className="btn" href={links.resume} target="_blank" rel="noopener noreferrer">Resume (concise) ↓</a>
            </div>
            <p className="muted">
              STATUS: <span className="ok">{contact.status}</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
