// Releases as a quiet list. Hovering a row shows its cover by the cursor and, once previews are
// switched on, plays its clip. The homepage shows the latest few; the Music page shows them all,
// split by year, with filters.
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { releases, previewUrl, type Collaborator, type Release } from "../../data/releases";
import { audio, type Track } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { Eq } from "./Eq";
import { ImageSlot } from "../ImageSlot";

const credits = (r: Release) => (r.collaborators.length ? "with " + r.collaborators.map((c) => c.name).join(", ") : "Stripes");
export const trackFor = (r: Release): Track | null => {
  const url = previewUrl(r);
  return url ? { id: r.link, title: r.title, sub: credits(r), url, href: r.link } : null;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const when = (d: string) => {
  const [day, m, y] = d.split(" ");
  return +y * 400 + MONTHS.indexOf(m) * 32 + +day;
};
export const byDate = [...releases].sort((a, b) => when(b.date) - when(a.date));
const FILTERS = [
  { name: "All", test: () => true },
  { name: "Originals", test: (r: Release) => r.type === "Single" || r.type === "EP" },
  { name: "Remixes", test: (r: Release) => /remix/i.test(r.type) },
  { name: "Edits", test: (r: Release) => /edit|flip/i.test(r.type) },
];

export function ReleaseList({ count = 8, full = false }: { count?: number; full?: boolean }) {
  const [filter, setFilter] = useState(0);
  const list = full ? byDate.filter(FILTERS[filter].test) : byDate.slice(0, count);
  const state = useAudio();
  const [previews, setPreviews] = useState(false);
  const [hover, setHover] = useState(-1);
  const floatRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
  const fine = typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => () => cancelAnimationFrame(pos.current.raf), []);
  // Rows slide under a still cursor while scrolling, so the floating cover hides until the pointer moves.
  useEffect(() => {
    if (!fine) return;
    const onScroll = () => floatRef.current?.classList.add("off");
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [fine]);

  const follow = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.18;
    p.y += (p.ty - p.y) * 0.18;
    if (floatRef.current) floatRef.current.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
    p.raf = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.3 ? requestAnimationFrame(follow) : 0;
  };
  const aim = (x: number, y: number, list: Element, snap: boolean) => {
    const r = list.getBoundingClientRect(),
      p = pos.current;
    p.tx = x - r.left + 28;
    p.ty = y - r.top - 90;
    if (snap) {
      p.x = p.tx;
      p.y = p.ty;
    }
    floatRef.current?.classList.remove("off");
    if (!p.raf) p.raf = requestAnimationFrame(follow);
  };
  const onMove = (e: React.PointerEvent<HTMLOListElement>) => {
    aim(e.clientX, e.clientY, e.currentTarget, false);
    // the cover steps aside while a collaborator's face (and its name) is under the cursor
    if ((e.target as Element).closest(".s-collab")) floatRef.current?.classList.add("off");
  };
  const enter = (i: number, e: React.PointerEvent<HTMLLIElement>) => {
    const fresh = hover < 0;
    setHover(i);
    if (fine) aim(e.clientX, e.clientY, e.currentTarget.parentElement!, fresh);
    const t = trackFor(list[i]);
    if (previews && fine && t) audio.play(t, { quiet: true });
  };
  const leaveList = () => {
    setHover(-1);
    if (previews && list.some((r) => audio.isCurrent(r.link))) audio.stop();
  };
  const togglePreviews = () => {
    const on = !previews;
    setPreviews(on);
    if (on) audio.arm();
    else if (list.some((r) => audio.isCurrent(r.link))) audio.stop();
  };

  return (
    <div className="s-rel">
      <div className="s-sec-head">
        {full ? (
          <h2 className="s-mono" id="rel-h">
            Every release
          </h2>
        ) : (
          <span className="s-mono">Releases</span>
        )}
        <div className="s-sec-actions">
          {fine && (
            <button type="button" className="s-btn s-btn-ghost" aria-pressed={previews} onClick={togglePreviews}>
              <span className={"s-dot" + (previews ? " on" : "")} aria-hidden="true" />
              Hover previews {previews ? "on" : "off"}
            </button>
          )}
          {!full && (
            <Link className="s-btn" to="/music">
              All music ↗
            </Link>
          )}
        </div>
      </div>
      {full && (
        <div className="s-art-filters s-rel-filters" role="group" aria-label="Show">
          <div>
            {FILTERS.map((f, i) => (
              <button type="button" key={f.name} className="s-btn" aria-pressed={filter === i} onClick={() => setFilter(i)}>
                {f.name}
              </button>
            ))}
          </div>
          <span className="s-mono" aria-live="polite">
            <span className="s-num">{list.length}</span> {list.length === 1 ? "release" : "releases"}
          </span>
        </div>
      )}
      <ol className="s-rel-list" onPointerMove={fine ? onMove : undefined} onPointerLeave={leaveList}>
        {list.map((r, i) => {
          const playing = state.playing && state.track?.id === r.link;
          const track = trackFor(r);
          const year = r.date.slice(-4);
          const newYear = full && year !== list[i - 1]?.date.slice(-4);
          return (
            <Fragment key={r.link}>
              {newYear && (
                <li className="s-rel-year" aria-hidden="true">
                  <span className="s-num">{year}</span>
                </li>
              )}
              <li className={"s-rel-row" + (hover === i ? " is-hover" : "") + (playing ? " is-playing" : "")} onPointerEnter={(e) => enter(i, e)}>
                <span className="s-mono s-rel-n">{String(i + 1).padStart(2, "0")}</span>
                <ImageSlot className="s-rel-thumb" src={r.image} label="Cover" />
                <div className="s-rel-main">
                  <Link className="s-rel-title" to={r.link}>
                    {r.title}
                  </Link>
                  {r.collaborators.length > 0 && <Collabs list={r.collaborators} />}
                </div>
                <span className="s-mono s-rel-type">{r.type}</span>
                <span className="s-mono s-rel-date">{r.date}</span>
                {track ? (
                  <button type="button" className="s-icon-btn" aria-label={(playing ? "Stop " : "Preview ") + r.title} aria-pressed={playing} onClick={() => audio.toggle(track)}>
                    {playing ? <Eq on /> : <span className="s-tri" aria-hidden="true" />}
                  </button>
                ) : (
                  <span aria-hidden="true" />
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
      {fine && (
        <div className="s-rel-float" ref={floatRef} aria-hidden="true">
          {list.map((r, i) => (
            <img key={r.link} src={r.image} alt="" className={hover === i ? "on" : ""} loading="lazy" />
          ))}
        </div>
      )}
    </div>
  );
}

// The collaborators as a stack of small faces, each linking to their Spotify. The stack fans out
// when the row is hovered, and each face shows its name above it.
export function Collabs({ list }: { list: Collaborator[] }) {
  return (
    <span className="s-collabs">
      <span className="s-rel-credit">with</span>
      <span className="s-collab-stack">
        {list.map((c) => (
          <a key={c.name} className="s-collab" href={c.link} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} on Spotify`}>
            <Face c={c} />
            <span className="s-collab-name" aria-hidden="true">
              {c.name} ↗
            </span>
          </a>
        ))}
      </span>
    </span>
  );
}

function Face({ c }: { c: Collaborator }) {
  const [failed, setFailed] = useState(false);
  if (failed || !c.image) return <span className="s-collab-face s-collab-initial">{c.name.charAt(0)}</span>;
  return <img className="s-collab-face" src={c.image} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
