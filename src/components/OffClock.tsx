import { links } from '../data/stations';

export default function OffClock() {
  return (
    <section className="beat" id="writing">
      <p className="label">Off the clock</p>
      <h2>The other half compiles too.</h2>
      <p>
        Alongside the engineering, Hridik writes poetry and literary fiction. The poems lean on
        Mumbai-specific references, Hinglish code-switching, and language he tries to keep precise.
        Posted, fairly regularly, on Instagram.
      </p>
      <blockquote className="pull">
        Engineering and writing are both just ways of making something out of nothing.
      </blockquote>
      <div className="btn-row">
        <a className="btn primary" href={links.instagram} target="_blank" rel="noopener noreferrer">
          Read on Instagram ↗
        </a>
        <a className="btn" href={links.fiction} target="_blank" rel="noopener noreferrer">
          Read fiction ↗
        </a>
      </div>
    </section>
  );
}
