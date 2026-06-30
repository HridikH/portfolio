import { useState } from 'react';
import { links } from '../data/stations';

const BASE = import.meta.env.BASE_URL;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="beat" id="contact">
      <p className="label">End of diagnostic</p>
      <h2>Building future readiness today.</h2>
      <p>Open to a Fall 2026 co-op or internship in robotics and controls. Champaign, IL.</p>

      <div className="contact-id">
        <img src={`${BASE}media/headshot.jpg`} alt="Hridik Hingorani" />
        <div>
          <div className="contact-email">{links.email}</div>
          <div className="btn-row" style={{ marginTop: '0.8rem' }}>
            <button className="btn" onClick={copy}>{copied ? 'copied' : 'copy email'}</button>
            <a className="btn" href={links.resume} target="_blank" rel="noopener noreferrer">
              Resume ↓
            </a>
          </div>
        </div>
      </div>

      <div className="btn-row">
        <a className="btn" href={links.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a className="btn" href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>

      <p className="muted">
        STATUS: <span className="ok">open to Fall 2026 co-op / internship (robotics &amp; controls)</span>
      </p>
    </section>
  );
}
