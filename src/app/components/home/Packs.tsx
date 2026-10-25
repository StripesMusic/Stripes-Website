// Designs: a picture-first grid of recent covers, with the clients and what a full pack includes.
import { Link } from "react-router";
import { featuredWork, packContents } from "../../data/featuredWork";

const clients = [...new Set(featuredWork.map((w) => w.client).filter((c) => c !== "Self-released"))];

export function Packs() {
  return (
    <section className="s-panel s-pad s-packs" aria-label="Designs">
      <div className="s-sec-head">
        <span className="s-mono">Designs</span>
        <span className="s-mono">Covers for {clients.join(" · ")}</span>
      </div>
      <h2 className="s-big s-packs-title">Cover art &amp; release packs</h2>
      <ul className="s-packs-grid">
        {featuredWork.map((w) => (
          <li key={w.title}>
            <Link to="/designs" className="s-packs-card">
              <img src={w.image} alt={`${w.title} cover art for ${w.client}`} loading="lazy" />
              <span className="s-mono">
                {w.client} · {w.date}
              </span>
              <span className="s-packs-name">{w.release}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="s-packs-foot">
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
