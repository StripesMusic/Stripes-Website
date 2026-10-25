// Designs, in the Spring/Summer pattern: a huge headline stays pinned while covers
// wipe in beside it, one per stretch of scroll.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { featuredWork, packContents } from "../../data/featuredWork";
import { packImages } from "../../data/images";
import { onFrame } from "../../lib/ticker";
import { ImageSlot } from "../ImageSlot";

const SLOT_VH = 70; // scroll distance per cover
const WIPE = 0.4; // share of a slot the wipe takes, centred on the slot boundary
const clients = [...new Set(featuredWork.map((w) => w.client).filter((c) => c !== "Self-released"))];
// pieces of each pack shown beside the cover; files go in data/images.ts
const pieces = [
  { key: "canvas", name: "Canvas", ratio: "9 / 16" },
  { key: "flyer", name: "Flyer", ratio: "4 / 5" },
  { key: "thumbnail", name: "YouTube", ratio: "16 / 9" },
] as const;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
      const driftT = (0.5 - p) * 5;
      if (Math.abs(driftT - drift) > 0.005) {
        drift += (driftT - drift) * 0.05;
        media.style.transform = `translate3d(0, ${drift.toFixed(3)}vmin, 0)`;
      }
      if (Math.abs(p - last) < 1e-4) return;
      last = p;
      // cover i wipes in around f = i, and its details switch at the middle of the wipe
      const f = p * n;
      items.forEach((el, i) => {
        const e = i === 0 ? 1 : inOut(Math.min(1, Math.max(0, (f - i + WIPE / 2) / WIPE)));
        el.style.clipPath = `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0)`;
        const img = el.firstElementChild as HTMLElement;
        img.style.transform = `scale(${(1.14 - 0.14 * e).toFixed(4)})`;
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const k = Math.min(n - 1, Math.floor(f));
      if (k !== shown) {
        shown = k;
        setIdx(k);
      }
    });
  }, [n]);

  const w = featuredWork[idx];
  const pack = packImages[w.title] ?? {};
  const have = pieces.filter((pc) => pack[pc.key]);
  return (
    <section className="s-panel s-packs" data-scene="designs" id="designs" ref={secRef} style={{ height: `calc(var(--vh, 100vh) + ${(n - 1) * SLOT_VH}vh)` }} aria-label="Designs">
      <div className="s-packs-pin">
        <div className="s-sec-head">
          <span className="s-mono">Designs</span>
          <span className="s-mono s-packs-clients">Covers for {clients.join(" · ")}</span>
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
                <ImageSlot src={x.image} alt={`${x.title} cover art for ${x.client}`} label={x.title} hint="Cover · 3000×3000" eager={i < 2} />
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
            <div className="s-packs-side">
              <p>{w.details}</p>
              {have.length > 0 && (
                <div className="s-packs-pieces">
                  {have.map((pc) => (
                    <span className="s-piece" key={pc.key}>
                      <ImageSlot src={pack[pc.key]} ratio={pc.ratio} label={pc.name} alt={`${w.title} ${pc.name}`} />
                      <span className="s-mono">{pc.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
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
