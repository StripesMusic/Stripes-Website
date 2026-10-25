// Artwork: every release as a pack (cover, animated cover, lyric video, process shots and
// mockups when there are any). The richest packs open as case studies at the top; the rest
// are a contact sheet of covers that opens each pack on click.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ImageSlot } from "../components/ImageSlot";
import { ArtworkBg } from "../components/ArtworkBg";
import { packs, piecesIn, otherWork, LABELS, ytId, type Kind, type Pack } from "../data/packs";

const KINDS: Kind[] = ["2D", "3D", "Motion", "Lyric video"];
const featured = [...packs].sort((a, b) => piecesIn(b) - piecesIn(a) || b.sort - a.sort).slice(0, 3);
const years = packs.map((p) => p.sort).filter(Boolean);
const span = `${Math.floor(Math.min(...years) / 12)}–${Math.floor(Math.max(...years) / 12)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// a Spotify Canvas loop that only plays while it's on screen
function Canvas({ video, poster, label }: { video: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="s-art-piece s-art-canvas">
      <span className="s-slot" style={{ aspectRatio: "9 / 16" }}>
        <video ref={ref} src={video} poster={poster} muted loop playsInline preload="none" aria-label={label} />
      </span>
      <figcaption className="s-mono">Animated cover · Spotify Canvas</figcaption>
    </figure>
  );
}

// a lyric video: its thumbnail until you press play, then the YouTube player in place
function Lyric({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="s-art-piece s-art-lyric">
      <span className="s-slot" style={{ aspectRatio: "16 / 9" }}>
        {on ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" className="s-art-play" onClick={() => setOn(true)} aria-label={`Play ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="on" />
            <span className="s-drums-play" aria-hidden="true">
              <span className="s-tri" />
            </span>
          </button>
        )}
      </span>
      <figcaption className="s-mono">Lyric video</figcaption>
    </figure>
  );
}

function CaseStudy({ p, n, headingId }: { p: Pack; n: number; headingId?: string }) {
  const pieces = [
    "Cover",
    ...p.versions.map((_, i) => `Version ${i + 2}`),
    p.canvas && "Animated cover",
    p.lyric && "Lyric video",
    p.process.length > 0 && "Process",
    p.mockups.length > 0 && "Mockups",
  ].filter(Boolean) as string[];
  return (
    <article className="s-art-case">
      <div className="s-art-meta">
        <span className="s-num s-art-n">{pad(n)}</span>
        <h3 className="s-art-name" id={headingId}>
          {p.name}
        </h3>
        {p.release && p.release !== p.name && <p className="s-art-release">{p.release}</p>}
        <dl className="s-art-dl">
          <div>
            <dt>Client</dt>
            <dd>{p.client}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{p.date}</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>{p.tools.join(", ")}</dd>
          </div>
          <div>
            <dt>In the pack</dt>
            <dd>{pieces.join(" · ")}</dd>
          </div>
        </dl>
        {p.details && (
          <p className="s-art-details">
            {p.details}
            {p.credit && (
              <>
                , with{" "}
                <a href={p.credit.href} target="_blank" rel="noopener noreferrer">
                  {p.credit.name} ↗
                </a>
              </>
            )}
          </p>
        )}
      </div>
      <div className="s-art-media">
        <figure className="s-art-piece s-art-cover">
          <ImageSlot src={p.cover} alt={`${p.name} cover art for ${p.client}`} label={p.name} />
        </figure>
        {p.canvas && <Canvas video={p.canvas.video} poster={p.canvas.poster} label={`${p.name} animated cover`} />}
        {p.versions.map((v, i) => (
          <figure className="s-art-piece" key={v}>
            <ImageSlot src={v} alt={`${p.name}, version ${i + 2}`} label={`Version ${i + 2}`} />
            <figcaption className="s-mono">Version {i + 2}</figcaption>
          </figure>
        ))}
        {p.lyric && <Lyric id={p.lyric.id} title={p.lyric.title} />}
        {[...p.process.map((u) => ["Process", u]), ...p.mockups.map((u) => ["Mockup", u])].map(([kind, u]) => (
          <figure className="s-art-piece s-art-wide" key={u}>
            <img src={u} alt={`${p.name} ${kind.toLowerCase()}`} loading="lazy" />
            <figcaption className="s-mono">{kind}</figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}

export function Artwork() {
  const [label, setLabel] = useState("All");
  const [kind, setKind] = useState<Kind | "All">("All");
  const [open, setOpen] = useState<Pack | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);

  const shown = useMemo(
    () => packs.filter((p) => (label === "All" || p.label === label) && (kind === "All" || p.kinds.includes(kind))),
    [label, kind],
  );
  const labels = ["All", ...LABELS, "Artists"];

  useEffect(() => {
    const d = dlg.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <div className="s-art">
      <section className="s-panel s-pad s-art-head" data-scene="designs" aria-labelledby="art-title">
        <ArtworkBg />
        <div className="s-sec-head">
          <span className="s-mono">Artwork</span>
          <span className="s-mono">
            <span className="s-num">{packs.length}</span> releases · {span}
          </span>
        </div>
        <h1 className="s-art-title" id="art-title">
          <span>Release</span>
          <span>packs</span>
        </h1>
        <div className="s-art-intro">
          <p className="s-big">Cover art, animated covers and lyric videos for labels and artists, grouped by release.</p>
          <div className="s-ctas">
            <Link className="s-btn s-btn-solid" to="/contact">
              Commission a pack
            </Link>
          </div>
        </div>
      </section>

      <section className="s-panel s-pad s-art-featured" data-scene="releases" aria-label="Case studies">
        <div className="s-sec-head">
          <span className="s-mono">Case studies</span>
          <span className="s-mono">The fullest packs</span>
        </div>
        {featured.map((p, i) => (
          <CaseStudy p={p} n={i + 1} key={p.key} />
        ))}
      </section>

      <section className="s-panel s-pad s-art-index" data-scene="olive" aria-label="Every release">
        <div className="s-sec-head">
          <span className="s-mono">Every release</span>
          <span className="s-mono" aria-live="polite">
            <span className="s-num">{shown.length}</span> shown
          </span>
        </div>
        <div className="s-art-filters">
          <div role="group" aria-label="Client">
            {labels.map((l) => (
              <button type="button" key={l} className="s-btn" aria-pressed={label === l} onClick={() => setLabel(l)}>
                {l.replace(" Records", "")}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Kind">
            {(["All", ...KINDS] as const).map((k) => (
              <button type="button" key={k} className="s-btn" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <ul className="s-art-grid">
          {shown.map((p) => (
            <li key={p.key}>
              <button type="button" onClick={() => setOpen(p)} aria-label={`Open the ${p.name} pack`}>
                <ImageSlot src={p.cover} alt="" label={p.name} />
                <span className="s-art-cap">
                  <span>{p.name}</span>
                  <span className="s-mono">
                    {p.label === "Artists" ? p.client : p.label.replace(" Records", "")} · {p.date}
                  </span>
                </span>
                {piecesIn(p) > 1 && (
                  <span className="s-art-badge s-mono" aria-hidden="true">
                    +{piecesIn(p) - 1}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p className="s-muted">Nothing matches both filters yet.</p>}
      </section>

      <section className="s-panel s-pad s-art-other" data-scene="about" aria-label="Other work">
        <div className="s-sec-head">
          <span className="s-mono">Also</span>
          <span className="s-mono">Websites, set visuals and more</span>
        </div>
        <ul className="s-art-others">
          {otherWork.map((w) => {
            const yt = ytId(w.youtubeUrl);
            const href = yt ? w.youtubeUrl : w.category === "websites" ? w.youtubeUrl : undefined;
            const body = (
              <>
                <ImageSlot src={w.image} ratio={w.category === "misc" || w.category === "animations" ? "1 / 1" : "16 / 9"} alt="" label={w.title} />
                <span className="s-art-cap">
                  <span>{w.title}</span>
                  <span className="s-mono">
                    {w.type} · {w.date}
                  </span>
                </span>
              </>
            );
            return (
              <li key={w.id + w.title}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {body}
                  </a>
                ) : (
                  <div>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <dialog ref={dlg} className="s-art-dialog" aria-labelledby="pack-title" onClose={() => setOpen(null)} onClick={(e) => e.target === dlg.current && setOpen(null)}>
        {open && (
          <div className="s-art-dialog-in">
            <button type="button" className="s-btn s-art-close" onClick={() => setOpen(null)}>
              Close
            </button>
            <CaseStudy p={open} n={packs.indexOf(open) + 1} headingId="pack-title" />
          </div>
        )}
      </dialog>
    </div>
  );
}
