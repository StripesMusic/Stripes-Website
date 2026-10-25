// Homepage. STRIPES stands on the edge of the first rounded panel; as you scroll, its letters
// sink behind the panel while the S rises out from behind it, then the panels slide up like cards.
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { createHero, type HeroScroll } from "../components/home/heroEngine";
import { HeroWord } from "../components/home/HeroWord";
import { ReleaseList, trackFor } from "../components/home/ReleaseList";
import { Packs } from "../components/home/Packs";
import { NowPlaying } from "../components/home/NowPlaying";
import { Eq } from "../components/home/Eq";
import { ImageSlot } from "../components/ImageSlot";
import { releases } from "../data/releases";
import { featuredWork } from "../data/featuredWork";
import { drumCovers, thumbUrl } from "../data/drums";
import { images } from "../data/images";
import { audio } from "../lib/audio";
import { useAudio } from "../lib/useAudio";
import { onFrame } from "../lib/ticker";

const latest = releases[0];
const HERO = trackFor(latest);
const recent = featuredWork.slice(0, 4);
const clients = [...new Set(featuredWork.map((w) => w.client).filter((c) => c !== "Self-released"))];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const tools = [
  { name: "GD Auto Export", path: "/tools/gd-auto-export", text: "Turn Google Drive links into direct downloads", shot: images.tools.gdAutoExport },
  { name: "Audio Silence Padder", path: "/tools/audio-silence-padder", text: "Add silence to the start or end of a track", shot: images.tools.audioSilencePadder },
  { name: "Spotify Art Tester", path: "/tools/spotify-art-tester", text: "Preview your cover across Spotify views", shot: images.tools.spotifyArtTester },
];

export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const coversRef = useRef<HTMLDivElement>(null);
  const scroll = useRef<HeroScroll>({ reveal: 0, cover: 0 });
  const dims = useRef({ vh: 800, peek: 190, reveal: 720 });
  const getScroll = useCallback(() => scroll.current, []);
  const [hoverCover, setHoverCover] = useState<number | null>(null);
  const s = useAudio();
  const heroPlaying = s.playing && s.track?.id === HERO.id;
  const playHero = () => audio.toggle(HERO, { loop: true, demoFallback: true });

  // Heights come from JS so the pinned stage, the peeking panel and the scroll maths agree.
  // Small height changes (a phone's address bar) are ignored to avoid jumps mid-scroll.
  useEffect(() => {
    const root = rootRef.current!;
    let lw = 0, lh = 0;
    const size = () => {
      const w = innerWidth, h = innerHeight;
      if (lh && w === lw && Math.abs(h - lh) < 160) return;
      lw = w;
      lh = h;
      const peek = Math.round(h * (w < 700 ? 0.2 : 0.24)), reveal = Math.round(h * 0.9);
      dims.current = { vh: h, peek, reveal };
      root.style.setProperty("--vh", h + "px");
      root.style.setProperty("--peek", peek + "px");
      root.style.setProperty("--reveal", reveal + "px");
    };
    size();
    addEventListener("resize", size);
    return () => removeEventListener("resize", size);
  }, []);

  // Scroll only drives the canvas and things inside the pinned stage. The panels themselves
  // are held by CSS sticky, so they move with native scrolling and never lag behind it.
  useEffect(() => {
    let lastC = -1;
    return onFrame(() => {
      const { vh, peek, reveal: R } = dims.current;
      const y = -introRef.current!.getBoundingClientRect().top;
      const rv = clamp01(y / R), cv = clamp01((y - R) / (vh - peek));
      scroll.current = { reveal: rv, cover: cv };
      innerRef.current!.style.transform = cv > 0 ? `scale(${(1 - 0.06 * cv).toFixed(4)})` : "";
      dimRef.current!.style.opacity = (cv * 0.75).toFixed(3);
      uiRef.current!.style.transform = `translate3d(0, ${(-rv * 24).toFixed(1)}px, 0)`;
      // the covers step aside for the rising S
      const c = 1 - clamp01(rv * 2.2);
      if (c !== lastC) {
        lastC = c;
        const el = coversRef.current!;
        el.style.opacity = c.toFixed(3);
        el.style.transform = c < 1 ? `translate3d(0, ${((1 - c) * -24).toFixed(1)}px, 0)` : "";
        el.style.visibility = c < 0.01 ? "hidden" : "";
      }
    });
  }, []);

  useEffect(() => {
    try {
      return createHero(stageRef.current!, canvasRef.current!, getScroll);
    } catch (err) {
      console.warn("Hero animation unavailable", err);
    }
  }, [getScroll]);

  const hc = hoverCover === null ? null : recent[hoverCover];
  return (
    <div className="s-home" ref={rootRef}>
      <section className="s-intro" ref={introRef}>
        <div className="s-stage" ref={stageRef}>
          <div className="s-stage-inner" ref={innerRef}>
            <canvas ref={canvasRef} className="s-gl" aria-hidden="true" />
            <div className="s-grain" aria-hidden="true" />
            <HeroWord area={stageRef} getScroll={getScroll} />
            <div className="s-hero-ui s-pad" ref={uiRef}>
              <div className="s-hero-lede">
                <p className="s-mono">Producer · Cover artist</p>
                <h1 className="s-lede">High-energy, melodic dance music, and the artwork that ships with it.</h1>
                <div className="s-ctas">
                  <button type="button" className="s-btn" aria-pressed={heroPlaying} onClick={playHero}>
                    {heroPlaying ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                    {heroPlaying ? "Stop" : `Play "${latest.title}"`}
                  </button>
                  <Link className="s-btn s-btn-solid" to="/contact">
                    Commission art
                  </Link>
                </div>
              </div>
              <div className="s-hero-covers" ref={coversRef}>
                <div className="s-hero-covers-head">
                  <span className="s-mono">Recent covers</span>
                  <Link to="/designs" className="s-mono">
                    All ↗
                  </Link>
                </div>
                <ul onMouseLeave={() => setHoverCover(null)}>
                  {recent.map((w, i) => (
                    <li key={w.title}>
                      <Link to="/designs" onMouseEnter={() => setHoverCover(i)} onFocus={() => setHoverCover(i)} onBlur={() => setHoverCover(null)}>
                        <ImageSlot src={w.image} alt={`${w.release}, cover for ${w.client}`} label={w.title} eager />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="s-mono s-hero-covers-cap" aria-live="polite">
                  {hc ? `${hc.client} · ${hc.release}` : `Covers for ${clients.join(" · ")}`}
                </p>
              </div>
            </div>
            <div className="s-dim" ref={dimRef} aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="s-sheet-wrap">
        <div className="s-sheet">
          <section className="s-panel s-first" aria-label="Latest">
            <div className="s-lip s-pad">
              <span className="s-mono s-lip-label">Out now</span>
              <Link to={latest.link} className="s-lip-release">
                <ImageSlot src={latest.image} alt="" label="Cover" eager />
                <span>
                  <span className="s-lip-title">{latest.title}</span>
                  <span className="s-lip-sub">
                    {HERO.sub} · {latest.type} · {latest.date}
                  </span>
                </span>
              </Link>
              <div className="s-ctas">
                <button type="button" className="s-btn" aria-pressed={heroPlaying} onClick={playHero}>
                  {heroPlaying ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                  {heroPlaying ? "Stop" : "Preview"}
                </button>
                <Link className="s-btn" to={latest.link}>
                  Listen ↗
                </Link>
              </div>
            </div>
            <div className="s-pad s-first-body">
              <ReleaseList />
            </div>
          </section>

          <Packs />

          <section className="s-panel s-pad s-drums" aria-label="Drums">
            <div className="s-drums-text">
              <div className="s-sec-head">
                <span className="s-mono">Drums</span>
                <span className="s-mono">{drumCovers.length} covers on YouTube</span>
              </div>
              <p className="s-big">Drum covers of songs I enjoy, recorded for fun.</p>
              <Link className="s-btn" to="/drums">
                Watch covers ↗
              </Link>
            </div>
            <ul className="s-drums-list">
              {drumCovers.map((c) => (
                <li key={c.youtubeId}>
                  <Link to="/drums">
                    <span className="s-drums-thumb">
                      <ImageSlot src={thumbUrl(c)} ratio="16 / 9" alt={`${c.title} drum cover`} label="Video thumbnail" hint="16:9 · 1280×720" />
                      <span className="s-drums-play" aria-hidden="true">
                        <span className="s-tri" />
                      </span>
                    </span>
                    <span className="s-drums-meta">
                      <span>{c.title}</span>
                      <span className="s-mono">
                        {c.artist} · {c.date}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="s-panel s-pad s-toolsp" aria-label="Tools">
            <div className="s-sec-head">
              <span className="s-mono">Tools</span>
              <span className="s-mono">For getting a release out the door</span>
            </div>
            <ul className="s-tools-grid">
              {tools.map((t) => (
                <li key={t.path}>
                  <Link to={t.path}>
                    <ImageSlot src={t.shot} ratio="16 / 10" label={t.name} hint="Screenshot · 1600×1000" alt={t.shot ? `${t.name} screenshot` : ""} />
                    <span className="s-tools-name">
                      {t.name} <span aria-hidden="true">↗</span>
                    </span>
                    <span className="s-muted">{t.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="s-panel s-pad s-about" aria-label="About">
            <div className="s-about-media">
              <ImageSlot src={images.about.portrait} ratio="4 / 5" alt="Stripes with his dog" label="Portrait" hint="4:5 · 1200×1500" />
              <div className="s-about-pair">
                <ImageSlot src={images.about.studio} ratio="3 / 2" label="Studio" hint="3:2 · 1500×1000" />
                <ImageSlot src={images.about.live} ratio="3 / 2" label="Live / drums" hint="3:2 · 1500×1000" />
              </div>
            </div>
            <div className="s-about-text">
              <div className="s-sec-head">
                <span className="s-mono">About</span>
              </div>
              <p className="s-big">Stripes is a US-based electronic music producer and a drummer since the age of four.</p>
              <dl className="s-facts">
                <div>
                  <dt>Labels</dt>
                  <dd>Releases, A&amp;R and cover art for three record labels</dd>
                </div>
                <div>
                  <dt>2025</dt>
                  <dd>Won BUTTER and Andrew A's Ghost Of You remix contest with E2D2, with Tomorrowland support from Andrew A</dd>
                </div>
                <div>
                  <dt>Studied</dt>
                  <dd>Production classes at Berklee College of Music</dd>
                </div>
                <div>
                  <dt>Inspired by</dt>
                  <dd>Brooks, RudeLies</dd>
                </div>
              </dl>
              <div className="s-ctas">
                <Link className="s-btn" to="/about">
                  Read more ↗
                </Link>
                <Link className="s-btn" to="/contact">
                  Get in touch
                </Link>
              </div>
            </div>
          </section>
        </div>
        <div className="s-sheet-hold" aria-hidden="true" />
      </div>
      <NowPlaying />
    </div>
  );
}

