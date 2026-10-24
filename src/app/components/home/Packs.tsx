// Designs, in the Spring/Summer pattern: a huge headline stays pinned while covers
// wipe in beside it, one per stretch of scroll.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { featuredWork, packContents } from "../../data/featuredWork";
import { onFrame } from "../../lib/ticker";

const SLOT_VH = 70; // scroll distance per cover

export function Packs() {
  const secRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [idx, setIdx] = useState(0);
  const n = featuredWork.length;

  useEffect(() => {
    const sec = secRef.current!, media = mediaRef.current!;
    const items = Array.from(media.querySelectorAll<HTMLElement>(".s-packs-item"));
    let last = -1, shown = 0, drift = 0;
    return onFrame(() => {
      const r = sec.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      // Spring/Summer's media drift: a slow, smoothed float against the pinned headline
      const driftT = (0.5 - p) * 7;
      if (Math.abs(driftT - drift) > 0.005) {
        drift += (driftT - drift) * 0.05;
        media.style.transform = `translate3d(0, ${drift.toFixed(3)}vmin, 0)`;
      }
      if (Math.abs(p - last) < 1e-4) return;
      last = p;
      const f = p * (n - 0.001);
      items.forEach((el, i) => {
        const t = i === 0 ? 1 : Math.min(1, Math.max(0, (f - i + 0.35) / 0.35));
        const e = 1 - Math.pow(1 - t, 3);
        el.style.clipPath = `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0)`;
        const img = el.firstElementChild as HTMLElement;
        img.style.transform = `scale(${(1.14 - 0.14 * e).toFixed(4)})`;
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const k = Math.min(n - 1, Math.floor(f + 0.1));
      if (k !== shown) {
        shown = k;
        setIdx(k);
      }
    });
  }, [n]);

  const w = featuredWork[idx];
  return (
    <section className="s-panel s-packs" ref={secRef} style={{ height: `calc(100vh + ${(n - 1) * SLOT_VH}vh)` }} aria-label="Designs">
      <div className="s-packs-pin">
        <div className="s-sec-head">
          <span className="s-mono">(04) Designs</span>
          <span className="s-mono s-packs-count">
            {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            <span className="s-packs-bar" aria-hidden="true">
              <span ref={barRef} />
            </span>
          </span>
        </div>
        <div className="s-packs-grid">
          <h2 className="s-packs-title">
            <span>Cover</span>
            <span>art</span>
          </h2>
          <div className="s-packs-media" ref={mediaRef}>
            {featuredWork.map((x, i) => (
              <div className="s-packs-item" key={x.title} style={{ zIndex: i }}>
                <img src={x.image} alt={`${x.title} cover art for ${x.client}`} loading={i < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
          <div className="s-packs-info" key={idx}>
            <dl>
              <div>
                <dt>Release</dt>
                <dd>{w.release}</dd>
              </div>
              <div>
                <dt>Client</dt>
                <dd>{w.client}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{w.date}</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>{w.tools.join(", ")}</dd>
              </div>
            </dl>
            <p>{w.details}</p>
          </div>
          <div className="s-packs-foot">
            <p className="s-mono">Every single can get a full pack</p>
            <ul>
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
        </div>
      </div>
    </section>
  );
}
