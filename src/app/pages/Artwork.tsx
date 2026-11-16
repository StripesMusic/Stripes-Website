// Designs: cover art, motion and web work. Every release is a pack (cover, animated cover, lyric
// video, process shots and mockups when there are any): a hand-picked few are shown open at the
// top, then a contact sheet of every release and solo piece (lyric videos, misc) that opens each
// one on click, filtered by kind, label and artist. Websites, set visuals and clips come last.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { LoopVideo } from "../components/LoopVideo";
import { YouTube } from "../components/YouTube";
import { Link } from "react-router";
import { ImageSlot } from "../components/ImageSlot";
import { ArtworkBg } from "../components/ArtworkBg";
import { MultiSelect } from "../components/MultiSelect";
import { packs, gallery, artistNames, piecesIn, otherWork, LABELS, ytId, type Kind, type Pack } from "../data/packs";

const KINDS: Kind[] = ["2D", "3D", "Motion", "Lyric video", "Misc"];
// the packs shown open at the top, newest first: the covers ticked "Feature at the top" in the
// content panel. With none ticked, the four fullest packs stand in.
const fullest = [...packs].sort((a, b) => piecesIn(b) - piecesIn(a) || b.sort - a.sort);
const ticked = packs.filter((p) => p.featured);
const featured = ticked.length ? ticked : fullest.slice(0, 4);
const years = packs.map((p) => p.sort).filter(Boolean);
const span = `${Math.floor(Math.min(...years) / 12)}–${Math.floor(Math.max(...years) / 12)}`;
const pad = (n: number) => String(n).padStart(2, "0");

// an animated cover: the Spotify Canvas loop, playing while it's on screen
function Canvas({ video, poster, label }: { video: string; poster: string; label: string }) {
  return (
    <figure className="s-art-piece s-art-canvas">
      <LoopVideo srcs={[video]} poster={poster} label={label} ratio="9 / 16" />
      <figcaption className="s-mono">Animated cover · Spotify Canvas</figcaption>
    </figure>
  );
}

function Lyric({ id, title }: { id: string; title: string }) {
  return (
    <figure className="s-art-piece s-art-lyric">
      <YouTube id={id} title={title} label="Play lyric video" />
      <figcaption className="s-mono">Lyric video</figcaption>
    </figure>
  );
}

// while a pop-up is open, the wheel and touch scroll it, not the page behind
const locks = new Set<object>();
function useScrollLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const key = {};
    locks.add(key);
    document.documentElement.style.overflow = "hidden";
    return () => {
      locks.delete(key);
      if (!locks.size) document.documentElement.style.overflow = "";
    };
  }, [on]);
}

// each image's real shape, once known, so a reopened pack lays out straight away
const shapes = new Map<string, number>();

// one still (a cover, a version, a process shot): shown whole at its own shape, never cropped,
// and enlarged on click
function Still({ src, alt, label, caption, className = "", onOpen, onShape }: { src: string; alt: string; label: string; caption?: string; className?: string; onOpen: () => void; onShape?: () => void }) {
  const [r, setR] = useState(() => shapes.get(src) ?? 1);
  return (
    <figure className={"s-art-piece " + className} data-wide={r > WIDE || undefined} style={{ "--r": r } as CSSProperties}>
      <button type="button" className="s-art-zoom" onClick={onOpen} aria-label={`Enlarge ${alt}`}>
        <ImageSlot
          src={src}
          alt={alt}
          label={label}
          ratio={String(r)}
          onLoad={(img) => {
            const n = img.naturalWidth / img.naturalHeight;
            if (shapes.get(src) !== n) {
              shapes.set(src, n);
              onShape?.();
            }
            setR(n);
          }}
        />
      </button>
      {caption && <figcaption className="s-mono">{caption}</figcaption>}
    </figure>
  );
}

// the enlarged view: one still at full resolution, as big as the screen allows (never blown up
// past its real size), with the pack's other stills a click or an arrow key away
function Lightbox({ title, srcs, at, onAt }: { title: string; srcs: string[]; at: number | null; onAt: (i: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useScrollLock(at !== null);
  useEffect(() => {
    const d = ref.current!;
    if (at !== null && !d.open) d.showModal();
    if (at === null && d.open) d.close();
  }, [at]);
  const many = srcs.length > 1;
  const go = (step: number) => at !== null && onAt((at + step + srcs.length) % srcs.length);
  const src = at !== null ? srcs[at] : undefined;
  return (
    <dialog
      ref={ref}
      className="s-zoom"
      aria-label={`${title}, enlarged`}
      onClose={() => onAt(null)}
      onClick={(e) => (e.target === ref.current || (e.target as HTMLElement).classList.contains("s-zoom-stage")) && onAt(null)}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {src && (
        <>
          <div className="s-zoom-stage">
            <img key={src} src={src} alt={`${title}${many ? `, ${at! + 1} of ${srcs.length}` : ""}`} decoding="async" />
          </div>
          <div className="s-zoom-bar">
            <span className="s-mono">{many ? `${pad(at! + 1)} / ${pad(srcs.length)}` : ""}</span>
            <div className="s-zoom-btns">
              {many && (
                <>
                  <button type="button" className="s-btn" onClick={() => go(-1)} aria-label="Previous image">
                    ←
                  </button>
                  <button type="button" className="s-btn" onClick={() => go(1)} aria-label="Next image">
                    →
                  </button>
                </>
              )}
              <a className="s-btn" href={src} target="_blank" rel="noopener noreferrer">
                Original ↗
              </a>
              <button type="button" className="s-btn" onClick={() => onAt(null)} autoFocus>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

const WIDE = 1.2; // wider than this, a still is cropped to fill the row instead of shown whole
const MIN_WIDE = 240; // the least room a cropped wide still gets

// In a pop-up, the pieces fill the card from top to bottom: one row, as tall as the card allows,
// with portrait and square pieces (stills, the animated cover) whole and wide stills cropped beside
// them. The row height shrinks only when the whole pieces wouldn't fit across. Returns the media
// box's ref and the height to use, or null for the plain layout (on the page, on a phone).
function useFill(on: boolean, pieces: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!on) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, [on]);
  if (!on || w < 560 || !pieces.length) return { ref, fit: null };
  const gap = 12;
  const tall = pieces.filter((r) => r <= WIDE), wide = pieces.length - tall.length;
  const sum = tall.reduce((a, r) => a + r, 0);
  const fit = sum ? (w - gap * (pieces.length - 1) - wide * MIN_WIDE) / sum : w / Math.max(...pieces);
  return { ref, fit: Math.max(200, fit) };
}

function CaseStudy({ p, n, headingId, fill = false }: { p: Pack; n: number; headingId?: string; fill?: boolean }) {
  const pieces = [
    !p.lyric || !p.solo ? (p.solo ? "Artwork" : "Cover") : "",
    ...p.versions.map((_, i) => `Version ${i + 2}`),
    p.canvas && "Animated cover",
    p.lyric && "Lyric video",
    p.process.length > 0 && "Process",
    p.mockups.length > 0 && "Mockups",
  ].filter(Boolean) as string[];
  // every still in the pack, in page order, for the enlarged view
  const stills = [...(!(p.solo && p.lyric) ? [p.cover] : []), ...p.versions, ...p.process, ...p.mockups];
  const [zoom, setZoom] = useState<number | null>(null);
  const [, reshape] = useState(0);
  const onShape = () => reshape((t) => t + 1);
  const shape = (u: string) => shapes.get(u) ?? 1;
  const row = [...(!(p.solo && p.lyric) ? [shape(p.cover)] : []), ...(p.canvas ? [9 / 16] : []), ...[...p.versions, ...p.process, ...p.mockups].map(shape)];
  const { ref: mediaRef, fit } = useFill(fill, row);
  return (
    <article className="s-art-case">
      <div className="s-art-meta">
        <span className="s-num s-art-n">{pad(n)}</span>
        <h3 className="s-art-name" id={headingId}>
          {p.name}
        </h3>
        {p.release && p.release !== p.name && <p className="s-art-release">{p.release}</p>}
        <dl className="s-art-dl">
          {p.client && (
            <div>
              <dt>Client</dt>
              <dd>{p.client}</dd>
            </div>
          )}
          <div>
            <dt>Date</dt>
            <dd>{p.date}</dd>
          </div>
          {p.tools.length > 0 && (
            <div>
              <dt>Tools</dt>
              <dd>{p.tools.join(", ")}</dd>
            </div>
          )}
          {!p.solo && (
            <div>
              <dt>In the pack</dt>
              <dd>{pieces.join(" · ")}</dd>
            </div>
          )}
        </dl>
        {p.details && (
          <p className="s-art-details">
            {p.details}
            {p.credit?.name && (
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
      <div ref={mediaRef} className={"s-art-media" + (fit ? " is-fill" : "")} style={fit ? ({ "--fit": `${fit}px` } as CSSProperties) : undefined}>
        {!(p.solo && p.lyric) && (
          <Still src={p.cover} alt={p.solo ? p.name : `${p.name} cover art for ${p.client}`} label={p.name} className="s-art-cover" onOpen={() => setZoom(0)} onShape={onShape} />
        )}
        {p.canvas && <Canvas video={p.canvas.video} poster={p.canvas.poster} label={`${p.name} animated cover`} />}
        {p.versions.map((v, i) => (
          <Still key={v} src={v} alt={`${p.name}, version ${i + 2}`} label={`Version ${i + 2}`} caption={`Version ${i + 2}`} onOpen={() => setZoom(stills.indexOf(v))} onShape={onShape} />
        ))}
        {p.lyric && <Lyric id={p.lyric.id} title={p.lyric.title} />}
        {[...p.process.map((u) => ["Process", u]), ...p.mockups.map((u) => ["Mockup", u])].map(([kind, u]) => (
          <Still key={u} src={u} alt={`${p.name} ${kind.toLowerCase()}`} label={kind} caption={kind} className="s-art-wide" onOpen={() => setZoom(stills.indexOf(u))} onShape={onShape} />
        ))}
      </div>
      <Lightbox title={p.name} srcs={stills} at={zoom} onAt={setZoom} />
    </article>
  );
}

type Clip = { title: string; srcs: string[]; ratio: string };

// a clip that isn't part of a release (visuals, an animation): it plays silently while hovered
// (on a phone, while it's on screen) and opens in a full player on click
function ClipTile({ w, clip, onOpen }: { w: (typeof otherWork)[number]; clip: Clip; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    const v = ref.current!;
    v.muted = true;
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  const play = () => ref.current?.play().catch(() => {});
  const stop = () => ref.current?.pause();
  return (
    <button type="button" className="s-art-clip" onClick={onOpen} onPointerEnter={play} onPointerLeave={stop} onFocus={play} onBlur={stop} aria-label={`Play ${w.title}`}>
      <span className={"s-slot s-yt s-yt-sm" + (moving ? " is-moving" : "")} style={{ aspectRatio: clip.ratio }}>
        <img src={w.image} alt="" loading="lazy" decoding="async" className="on" />
        <video ref={ref} src={clip.srcs[0]} muted loop playsInline preload="none" onPlaying={() => setMoving(true)} onPause={() => setMoving(false)} />
        <span className="s-yt-play" aria-hidden="true">
          <span className="s-yt-tri" />
        </span>
        <span className="s-yt-tag" aria-hidden="true">
          {clip.srcs.length > 1 ? `${clip.srcs.length} clips` : "Video"}
        </span>
      </span>
      <Cap w={w} />
    </button>
  );
}

function Cap({ w }: { w: (typeof otherWork)[number] }) {
  return (
    <span className="s-art-cap">
      <span>{w.title}</span>
      <span className="s-mono">
        {w.type} · {w.date}
      </span>
    </span>
  );
}

const clipOf = (w: (typeof otherWork)[number]): Clip | null => {
  const srcs = [w.videoUrl, ...(w.images ?? [])].filter((u, i, all): u is string => !!u && /\.mp4$/i.test(u) && all.indexOf(u) === i);
  return srcs.length ? { title: w.title, srcs, ratio: w.category === "set-visuals" ? "16 / 9" : "1 / 1" } : null;
};

// one piece that isn't part of a release: played in place when it moves, a link when it's a site
function Other({ w, onClip }: { w: (typeof otherWork)[number]; onClip: (c: Clip) => void }) {
  const yt = ytId(w.youtubeUrl);
  const clip = clipOf(w);
  if (yt) {
    return (
      <div>
        <YouTube id={yt} title={w.title} label="Play lyric video" className="s-yt-sm" />
        <Cap w={w} />
      </div>
    );
  }
  if (clip) return <ClipTile w={w} clip={clip} onOpen={() => onClip(clip)} />;
  if (w.category === "websites" && w.youtubeUrl) {
    return (
      <a href={w.youtubeUrl} target="_blank" rel="noopener noreferrer" className="s-art-site">
        <ImageSlot src={w.image} ratio="16 / 9" alt="" label={w.title} />
        <span className="s-art-site-go s-mono" aria-hidden="true">
          Visit site ↗
        </span>
        <Cap w={w} />
      </a>
    );
  }
  return (
    <div>
      <ImageSlot src={w.image} ratio="1 / 1" alt={w.title} label={w.title} />
      <Cap w={w} />
    </div>
  );
}

// the full player for a clip, with its other clips as a strip below
function ClipPlayer({ clip }: { clip: Clip }) {
  const [i, setI] = useState(0);
  return (
    <div className="s-clip">
      <h2 className="s-art-name" id="clip-title">
        {clip.title}
      </h2>
      <video key={clip.srcs[i]} src={clip.srcs[i]} controls autoPlay playsInline loop={clip.srcs.length === 1} onEnded={() => setI((n) => (n + 1) % clip.srcs.length)} style={{ aspectRatio: clip.ratio }} />
      {clip.srcs.length > 1 && (
        <ol className="s-clip-strip" aria-label="Clips">
          {clip.srcs.map((u, n) => (
            <li key={u}>
              <button type="button" aria-pressed={n === i} aria-label={`Clip ${n + 1}`} onClick={() => setI(n)}>
                <video src={`${u}#t=0.5`} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
                <span className="s-mono">{String(n + 1).padStart(2, "0")}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function Artwork() {
  const [labels, setLabels] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [kind, setKind] = useState<Kind | "All">("All");
  const [open, setOpen] = useState<Pack | null>(null);
  const [clip, setClip] = useState<Clip | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const clipDlg = useRef<HTMLDialogElement>(null);
  useScrollLock(!!open || !!clip);

  // kind, and then any of the ticked labels or artists (nothing ticked shows everyone)
  const shown = useMemo(
    () =>
      gallery.filter(
        (p) =>
          (kind === "All" || p.kinds.includes(kind)) &&
          ((!labels.length && !artists.length) || labels.includes(p.label) || p.artists.some((a) => artists.includes(a))),
      ),
    [labels, artists, kind],
  );

  useEffect(() => {
    const d = dlg.current!;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = clipDlg.current!;
    if (clip && !d.open) d.showModal();
    if (!clip && d.open) d.close();
  }, [clip]);

  return (
    <div className="s-art">
      <section className="s-panel s-pad s-art-head" data-scene="designs" aria-labelledby="art-title">
        <ArtworkBg />
        <div className="s-sec-head">
          <span className="s-mono">Cover art · Motion · Set visuals</span>
          <span className="s-mono">
            <span className="s-num">{packs.length}</span> releases · {span}
          </span>
        </div>
        <h1 className="s-art-title" id="art-title">
          Designs
        </h1>
        <div className="s-art-intro">
          <p className="s-big">Cover art, animated covers, social media assets, lyric videos and set visuals for labels and artists.</p>
          <div className="s-ctas">
            <a className="s-btn" href="#packs">
              See my work ↓
            </a>
            <Link className="s-btn s-btn-solid" to="/contact">
              Commission art
            </Link>
          </div>
        </div>
      </section>

      <section className="s-panel s-pad s-art-featured" data-scene="releases" id="packs" aria-labelledby="packs-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="packs-h">
            Release packs
          </h2>
        </div>
        {featured.map((p, i) => (
          <CaseStudy p={p} n={i + 1} key={p.key} />
        ))}
      </section>

      <section className="s-panel s-pad s-art-index" data-scene="olive" aria-labelledby="index-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="index-h">
            Every release
          </h2>
          <span className="s-mono" aria-live="polite">
            <span className="s-num">{shown.length}</span> shown
          </span>
        </div>
        <div className="s-art-filters">
          <div role="group" aria-label="Kind">
            {(["All", ...KINDS] as const).map((k) => (
              <button type="button" key={k} className="s-btn" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k}
              </button>
            ))}
          </div>
          <div className="s-art-who">
            <MultiSelect label="Labels" options={LABELS} selected={labels} onChange={setLabels} show={(l) => l.replace(" Records", "")} />
            <MultiSelect label="Artists / other" options={artistNames} selected={artists} onChange={setArtists} />
            {(labels.length > 0 || artists.length > 0) && (
              <button
                type="button"
                className="s-btn s-btn-ghost"
                onClick={() => {
                  setLabels([]);
                  setArtists([]);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <ul className="s-art-grid">
          {shown.map((p) => (
            <li key={p.key}>
              <button type="button" onClick={() => setOpen(p)} aria-label={p.solo ? `Open ${p.name}` : `Open the ${p.name} pack`}>
                <span className="s-art-thumb">
                  <ImageSlot src={p.cover} alt="" label={p.name} />
                  {p.lyric && p.solo && (
                    <span className="s-art-badge s-art-badge-play s-mono" aria-hidden="true">
                      ▶ Lyric video
                    </span>
                  )}
                  {!p.solo && piecesIn(p) > 1 && (
                    <span className="s-art-badge s-mono" aria-hidden="true">
                      +{piecesIn(p) - 1}
                    </span>
                  )}
                </span>
                <span className="s-art-cap">
                  <span>{p.name}</span>
                  <span className="s-mono">
                    {LABELS.includes(p.label) ? p.label.replace(" Records", "") : p.client || p.kinds[0]} · {p.date}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <p className="s-muted">Nothing matches those filters yet.</p>}
      </section>

      <section className="s-panel s-pad s-art-other" data-scene="about" aria-labelledby="other-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="other-h">
            More
          </h2>
          <span className="s-mono">Lyric videos, visuals, websites and more</span>
        </div>
        <ul className="s-art-others">
          {otherWork.map((w) => (
            <li key={`${w.id}${w.title}`} className={"s-art-other-" + w.category}>
              <Other w={w} onClip={setClip} />
            </li>
          ))}
        </ul>
      </section>

      <dialog ref={dlg} className="s-art-dialog" aria-labelledby="pack-title" onClose={(e) => e.target === e.currentTarget && setOpen(null)} onClick={(e) => e.target === dlg.current && setOpen(null)}>
        {open && (
          <div className="s-art-dialog-in">
            <button type="button" className="s-btn s-art-close" onClick={() => setOpen(null)}>
              Close
            </button>
            <CaseStudy p={open} n={gallery.indexOf(open) + 1} headingId="pack-title" fill />
          </div>
        )}
      </dialog>

      <dialog ref={clipDlg} className="s-art-dialog s-clip-dialog" aria-labelledby="clip-title" onClose={() => setClip(null)} onClick={(e) => e.target === clipDlg.current && setClip(null)}>
        {clip && (
          <div className="s-art-dialog-in">
            <button type="button" className="s-btn s-art-close" onClick={() => setClip(null)}>
              Close
            </button>
            <ClipPlayer clip={clip} />
          </div>
        )}
      </dialog>
    </div>
  );
}
