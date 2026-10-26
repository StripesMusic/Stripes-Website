// Homepage. The hero is a depth stack: the music-reactive spectrum at the back, the S and
// "Stripes" on one tilting 3D plane in front of it, and the text and links on top. As the first
// panel slides over, each layer rises at its own speed, and the page's colours change as each
// panel reaches the middle of the screen.
import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router";
import { createHero, type HeroScroll } from "../components/home/heroEngine";
import { HeroMontage } from "../components/home/HeroMontage";
import { HeroWord } from "../components/home/HeroWord";
import { SpectrumBg } from "../components/home/SpectrumBg";
import { ReleaseList } from "../components/home/ReleaseList";
import { Packs } from "../components/home/Packs";
import { NowPlaying } from "../components/home/NowPlaying";
import { Eq } from "../components/home/Eq";
import { ImageSlot } from "../components/ImageSlot";
import { Photo } from "../components/Photo";
import { ep, clipUrl } from "../data/releases";
import { drumCovers, thumbUrl } from "../data/drums";
import { photos } from "../data/images";
import { socials } from "../data/socials";
import { audio, type Track } from "../lib/audio";
import { useAudio } from "../lib/useAudio";
import { onFrame } from "../lib/ticker";

const epTracks: Track[] = ep.tracks.map((t) => ({ id: `${ep.link}#${t.n}`, title: t.title, sub: t.artists, url: clipUrl(t.preview), href: ep.link }));
const HERO = epTracks[0];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const tools = [
  { name: "GD Auto Export", path: "/tools/gd-auto-export", text: "Turn Google Drive links into direct downloads" },
  { name: "Audio Silence Padder", path: "/tools/audio-silence-padder", text: "Add silence to the start or end of a track" },
  { name: "Spotify Art Tester", path: "/tools/spotify-art-tester", text: "Preview your cover across Spotify views" },
];

export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const plxRef = useRef<HTMLElement>(null);
  const scroll = useRef<HeroScroll>({ cover: 0 });
  const dims = useRef({ vh: 800, peek: 96 });
  const getScroll = useCallback(() => scroll.current, []);
  const s = useAudio();
  const playing = (t: Track) => s.playing && s.track?.id === t.id;
  const heroPlaying = playing(HERO);
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
      const peek = Math.round(Math.max(88, h * 0.12));
      dims.current = { vh: h, peek };
      root.style.setProperty("--vh", h + "px");
      root.style.setProperty("--peek", peek + "px");
    };
    size();
    addEventListener("resize", size);
    return () => removeEventListener("resize", size);
  }, []);

  // The first panel scrolls natively over the pinned stage; scroll only drives what's inside it.
  useEffect(() => {
    return onFrame(() => {
      // the refs go before this loop does when the page unmounts
      if (!introRef.current || !innerRef.current) return;
      const { vh, peek } = dims.current;
      const y = -introRef.current.getBoundingClientRect().top;
      const cv = clamp01(y / (vh - peek));
      scroll.current = { cover: cv };
      if (cv >= 1) return;
      innerRef.current!.style.transform = cv > 0 ? `scale(${(1 - 0.06 * cv).toFixed(4)})` : "";
      dimRef.current!.style.opacity = (cv * 0.75).toFixed(3);
      // the text drifts up a little slower than the panel, so it sits on a layer of its own
      uiRef.current!.style.transform = cv > 0 ? `translate3d(0, ${(-cv * (vh - peek) * 0.22).toFixed(1)}px, 0)` : "";
    });
  }, []);

  // The About photo is a window: the frame scrolls with the page while the picture inside drifts
  // the other way, about 11% of the frame either side of centre as it crosses the screen.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fig = plxRef.current!;
    let last = "";
    return onFrame(() => {
      const img = fig.querySelector("img");
      if (!img) return;
      const r = fig.getBoundingClientRect(), ih = innerHeight;
      if (r.bottom < -100 || r.top > ih + 100) return;
      const n = Math.max(-1, Math.min(1, (r.top + r.height / 2 - ih / 2) / (ih / 2 + r.height / 2)));
      const t = `translate3d(0, ${(n * 11).toFixed(2)}%, 0)`;
      if (t !== last) img.style.transform = last = t;
    });
  }, []);

  useEffect(() => {
    const ui = uiRef.current!;
    const area = () => {
      const nav = parseFloat(getComputedStyle(ui).getPropertyValue("--s-nav-h")) || 56;
      return { top: nav + 12, bottom: ui.offsetTop - 20 };
    };
    try {
      return createHero(stageRef.current!, canvasRef.current!, getScroll, { plane: planeRef.current, area });
    } catch (err) {
      console.warn("Hero animation unavailable", err);
    }
  }, [getScroll]);

  return (
    <div className="s-home" ref={rootRef}>
      <section className="s-intro" ref={introRef} data-scene="spectrum">
        <div className="s-stage" ref={stageRef}>
          <div className="s-stage-inner" ref={innerRef}>
            <SpectrumBg getScroll={getScroll} />
            <HeroMontage getScroll={getScroll} />
            <div className="s-grain" aria-hidden="true" />
            <canvas ref={canvasRef} className="s-gl" aria-hidden="true" />
            <div className="s-plane" ref={planeRef} aria-hidden="true">
              <HeroWord area={stageRef} getScroll={getScroll} />
            </div>
            <div className="s-hero-ui s-pad" ref={uiRef}>
              <div className="s-hero-lede">
                <p className="s-mono">Producer · Cover artist · Metal drummer</p>
                <h1 className="s-lede">Hey! Thanks for stopping by :)</h1>
                <div className="s-ctas">
                  <button type="button" className="s-btn" aria-pressed={heroPlaying} onClick={playHero}>
                    {heroPlaying ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                    {heroPlaying ? "Stop" : `Play "${HERO.title}"`}
                  </button>
                  <Link className="s-btn s-btn-solid" to="/contact">
                    Commission art
                  </Link>
                </div>
              </div>
              <ul className="s-hero-links" aria-label="Listen and follow">
                {socials.map((l) => (
                  <li key={l.name}>
                    <a className="s-btn" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="s-dim" ref={dimRef} aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="s-sheet">
        <section className="s-panel s-ep" data-scene="ep" id="music" aria-label="Out now">
          <div className="s-lip s-pad">
            <Link to={ep.link} className="s-lip-release">
              <ImageSlot src={ep.image} alt="" label="Cover" eager />
              <span>
                <span className="s-mono s-lip-label">Out now</span>
                <span className="s-lip-title">
                  {ep.title} {ep.type}
                </span>
                <span className="s-lip-sub">
                  {ep.date} · {ep.tracks.length} tracks
                </span>
              </span>
            </Link>
            <div className="s-ctas">
              <button type="button" className="s-btn s-lip-play" aria-pressed={heroPlaying} aria-label={heroPlaying ? "Stop" : `Preview ${HERO.title}`} onClick={playHero}>
                {heroPlaying ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                <span>{heroPlaying ? "Stop" : "Preview"}</span>
              </button>
              <Link className="s-btn s-lip-listen" to={ep.link}>
                Listen ↗
              </Link>
            </div>
          </div>
          <div className="s-ep-body s-pad">
            <Link to={ep.link} className="s-ep-cover">
              <ImageSlot src={ep.image} alt={`${ep.title} ${ep.type} cover`} label="Cover" />
            </Link>
            <div className="s-ep-info">
              <p className="s-mono">
                New {ep.type} · {ep.date}
              </p>
              <h2 className="s-ep-title">{ep.title}</h2>
              <ol className="s-ep-tracks">
                {ep.tracks.map((t, i) => {
                  const tr = epTracks[i], on = playing(tr);
                  return (
                    <li key={t.n} className={on ? "is-playing" : ""}>
                      <button type="button" aria-pressed={on} aria-label={on ? `Stop ${t.title}` : `Preview ${t.title}`} onClick={() => audio.toggle(tr)}>
                        <span className="s-num">{t.n}</span>
                        <span className="s-ep-track">
                          <span>{t.title}</span>
                          <span className="s-muted">{t.artists}</span>
                        </span>
                        <span className="s-ep-tplay" aria-hidden="true">
                          {on ? <Eq on /> : <span className="s-tri s-tri-sm" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="s-ctas">
                <Link className="s-btn s-btn-solid" to={ep.link}>
                  Listen to the {ep.type} ↗
                </Link>
                <Link className="s-btn" to="/music">
                  All music
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="s-panel s-pad s-rels" data-scene="releases" aria-label="Releases">
          <ReleaseList />
        </section>

        <Packs />

        <section className="s-panel s-drums" data-scene="drums" id="drums" aria-label="Drums">
          <Photo p={photos.drums} ratio="auto" sizes="100vw" label="Drums" className="s-drums-bg" />
          <div className="s-drums-in s-pad">
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
                      <ImageSlot src={thumbUrl(c)} ratio="16 / 9" alt={`${c.title} drum cover`} label={c.title} />
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
          </div>
        </section>

        <section className="s-panel s-pad s-toolsp" data-scene="hero" aria-label="Tools">
          <div className="s-sec-head">
            <span className="s-mono">Tools</span>
            <span className="s-mono">For getting a release out the door</span>
          </div>
          <ul className="s-tools-list">
            {tools.map((t, i) => (
              <li key={t.path}>
                <Link to={t.path}>
                  <span className="s-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="s-tools-name">{t.name}</span>
                  <span className="s-muted">{t.text}</span>
                  <span aria-hidden="true" className="s-tools-go">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="s-panel s-pad s-about" data-scene="about" id="about" aria-label="About">
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
          <figure className="s-about-photo s-plx" ref={plxRef}>
            <Photo p={photos.portrait} ratio="4 / 5" sizes="(max-width: 860px) 92vw, 46vw" label="Portrait" />
          </figure>
        </section>
      </div>
      <NowPlaying />
    </div>
  );
}
