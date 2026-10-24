// Latest releases as a quiet list. Hovering a row shows its cover by the cursor and,
// once previews are switched on, plays its clip.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { releases, previewUrl, type Release } from "../../data/releases";
import { audio, type Track } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { Eq } from "./Eq";

const credits = (r: Release) => (r.collaborators.length ? "with " + r.collaborators.map((c) => c.name).join(", ") : "Stripes");
export const trackFor = (r: Release): Track => ({ id: r.link, title: r.title, sub: credits(r), url: previewUrl(r) });

export function ReleaseList({ count = 8 }: { count?: number }) {
  const list = releases.slice(0, count);
  const state = useAudio();
  const [previews, setPreviews] = useState(false);
  const [hover, setHover] = useState(-1);
  const floatRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
  const fine = typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => () => cancelAnimationFrame(pos.current.raf), []);

  const follow = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.18;
    p.y += (p.ty - p.y) * 0.18;
    if (floatRef.current) floatRef.current.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
    p.raf = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.3 ? requestAnimationFrame(follow) : 0;
  };
  const onMove = (e: React.PointerEvent<HTMLOListElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), p = pos.current;
    p.tx = e.clientX - r.left + 28;
    p.ty = e.clientY - r.top - 90;
    if (!p.raf) p.raf = requestAnimationFrame(follow);
  };
  const enter = (i: number) => {
    setHover(i);
    if (previews && fine) audio.play(trackFor(list[i]));
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
        <span className="s-mono">(03) Releases</span>
        <div className="s-sec-actions">
          {fine && (
            <button type="button" className="s-btn s-btn-ghost" aria-pressed={previews} onClick={togglePreviews}>
              <span className={"s-dot" + (previews ? " on" : "")} aria-hidden="true" />
              Hover previews {previews ? "on" : "off"}
            </button>
          )}
          <Link className="s-btn" to="/music">
            All music ↗
          </Link>
        </div>
      </div>
      <ol className="s-rel-list" onPointerMove={fine ? onMove : undefined} onPointerLeave={leaveList}>
        {list.map((r, i) => {
          const playing = state.playing && state.track?.id === r.link;
          return (
            <li key={r.link} className={"s-rel-row" + (hover === i ? " is-hover" : "") + (playing ? " is-playing" : "")} onPointerEnter={() => enter(i)}>
              <span className="s-mono s-rel-n">{String(i + 1).padStart(2, "0")}</span>
              <img className="s-rel-thumb" src={r.image} alt="" loading="lazy" />
              <Link className="s-rel-main" to={r.link}>
                <span className="s-rel-title">{r.title}</span>
                <span className="s-rel-credit">{credits(r)}</span>
              </Link>
              <span className="s-mono s-rel-type">{r.type}</span>
              <span className="s-mono s-rel-date">{r.date}</span>
              <button
                type="button"
                className="s-icon-btn"
                aria-label={(playing ? "Stop " : "Preview ") + r.title}
                aria-pressed={playing}
                onClick={() => audio.toggle(trackFor(r))}
              >
                {playing ? <Eq on /> : <span className="s-tri" aria-hidden="true" />}
              </button>
            </li>
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
