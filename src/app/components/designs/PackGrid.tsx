// A picture-first grid of covers, with the clients and what a full pack includes. Not used yet:
// kept for the Artwork (/designs) page, which will show every pack in this format.
import { Link } from "react-router";
import { featuredWork, packContents } from "../../data/featuredWork";

export function PackGrid() {
  return (
    <section className="s-panel s-pad s-pgrid" aria-label="Designs">
      <div className="s-sec-head">
        <span className="s-mono">Designs</span>
        <span className="s-mono">Covers for labels and artists</span>
      </div>
      <h2 className="s-big s-pgrid-title">Cover art &amp; release packs</h2>
      <ul className="s-pgrid-grid">
        {featuredWork.map((w) => (
          <li key={w.title}>
            <Link to="/designs" className="s-pgrid-card">
              <img src={w.image} alt={`${w.title} cover art for ${w.client}`} loading="lazy" />
              <span className="s-mono">
                {w.client} · {w.date}
              </span>
              <span className="s-pgrid-name">{w.release}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="s-pgrid-foot">
        <ul aria-label="A full pack includes">
          {packContents.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <div className="s-ctas">
          <Link className="s-btn" to="/designs">
            All designs ↗
          </Link>
          <Link className="s-btn s-btn-solid" to="/contact">
            Commission a pack
          </Link>
        </div>
      </div>
    </section>
  );
}
