import { stations, links } from '../data/stations';

// Graceful 2D fallback when WebGL is unavailable. Same content, no canvas.
export default function Fallback() {
  return (
    <div className="fallback">
      <p className="eyebrow">Computer Engineer · Robotics &amp; Controls</p>
      <h1>Hridik Hingorani</h1>
      <p className="tagline" style={{ marginBottom: '2rem' }}>Builder of things that move.</p>
      <p className="muted" style={{ marginBottom: '2rem' }}>
        Your browser does not support WebGL, so here is the plain version.
      </p>
      {stations.map((s) => (
        <div className="item" key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.blurb}</p>
          <a className="station-link" href={s.link} target="_blank" rel="noopener noreferrer">
            REPO ↗
          </a>
        </div>
      ))}
      <p className="muted" style={{ marginTop: '2rem' }}>
        {links.email} · <a href={links.github}>GitHub</a> · <a href={links.linkedin}>LinkedIn</a>
      </p>
    </div>
  );
}
