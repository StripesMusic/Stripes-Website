// Homepage. The hero is pinned while the S rises out from behind the first rounded panel,
// then the panels slide up over it like cards.
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { createHero, type HeroScroll } from "../components/home/heroEngine";
import { Wordmark } from "../components/home/Wordmark";
import { ReleaseList, trackFor } from "../components/home/ReleaseList";
import { Packs } from "../components/home/Packs";
import { NowPlaying } from "../components/home/NowPlaying";
import { Eq } from "../components/home/Eq";
import { releases } from "../data/releases";
import { audio } from "../lib/audio";
import { useAudio } from "../lib/useAudio";
import { onFrame } from "../lib/ticker";

const latest = releases[0];
const HERO = trackFor(latest);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scroll = useRef<HeroScroll>({ reveal: 0, cover: 0 });
  const dims = useRef({ vh: 800, peek: 190, reveal: 720 });
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

  useEffect(() => {
    return onFrame(() => {
      const { vh, peek, reveal: R } = dims.current;
      const y = -introRef.current!.getBoundingClientRect().top;
      const rv = clamp01(y / R), cv = clamp01((y - R) / (vh - peek));
      scroll.current = { reveal: rv, cover: cv };
      // the first panel holds its place while the S rises, then scrolls on normally
      const T = Math.min(Math.max(y, 0), R) - R;
      sheetRef.current!.style.transform = T < -0.5 ? `translate3d(0, ${T.toFixed(1)}px, 0)` : "";
      innerRef.current!.style.transform = cv > 0 ? `scale(${(1 - 0.06 * cv).toFixed(4)})` : "";
      dimRef.current!.style.opacity = (cv * 0.75).toFixed(3);
      uiRef.current!.style.transform = `translate3d(0, ${(-rv * 48).toFixed(1)}px, 0)`;
      hintRef.current!.style.opacity = String(1 - Math.min(1, rv * 3));
    });
  }, []);

  useEffect(() => {
    try {
      return createHero(stageRef.current!, canvasRef.current!, () => scroll.current);
    } catch (err) {
      console.warn("Hero animation unavailable", err);
    }
  }, []);

  return (
    <div className="s-home" ref={rootRef}>
      <section className="s-intro" ref={introRef}>
        <div className="s-stage" ref={stageRef}>
          <div className="s-stage-inner" ref={innerRef}>
            <canvas ref={canvasRef} className="s-gl" aria-hidden="true" />
            <div className="s-grain" aria-hidden="true" />
            <div className="s-hero-ui s-pad" ref={uiRef}>
              <div className="s-hero-lede">
                <p className="s-mono">Producer · Cover artist</p>
                <h1 className="s-lede">High-energy, melodic dance music, and the artwork that ships with it.</h1>
                <div className="s-ctas">
                  <button type="button" className="s-btn" aria-pressed={heroPlaying} onClick={playHero}>
                    {heroPlaying ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                    {heroPlaying ? "Stop" : "Play preview"}
                  </button>
                  <Link className="s-btn" to="/music">
                    Listen ↗
                  </Link>
                  <Link className="s-btn s-btn-solid" to="/contact">
                    Commission art
                  </Link>
                </div>
              </div>
              <span className="s-mono s-hint" ref={hintRef}>
                Move · click · scroll ↓
              </span>
            </div>
            <div className="s-dim" ref={dimRef} aria-hidden="true" />
          </div>
        </div>
      </section>

      <div className="s-sheet" ref={sheetRef}>
        <section className="s-panel s-first" aria-label="Latest">
          <div className="s-lip s-pad">
            <span className="s-mono s-lip-label">(01) Out now</span>
            <Link to={latest.link} className="s-lip-release">
              <img src={latest.image} alt="" />
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
              <Link className="s-btn s-btn-solid" to={latest.link}>
                Listen ↗
              </Link>
            </div>
          </div>
          <div className="s-pad">
            <Wordmark />
            <ReleaseList />
          </div>
        </section>

        <Packs />

        <section className="s-panel s-pad s-duo" aria-label="Drums and tools">
          <div>
            <div className="s-sec-head">
              <span className="s-mono">(05) Drums</span>
            </div>
            <p className="s-big">Drum covers of songs I enjoy, recorded for fun.</p>
            <Link className="s-btn" to="/drums">
              Watch covers ↗
            </Link>
          </div>
          <div>
            <div className="s-sec-head">
              <span className="s-mono">(06) Tools</span>
            </div>
            <ul className="s-tools">
              <li>
                <Link to="/tools/gd-auto-export">
                  <span>GD Auto Export</span>
                  <span className="s-muted">Turn Google Drive links into direct downloads</span>
                </Link>
              </li>
              <li>
                <Link to="/tools/audio-silence-padder">
                  <span>Audio Silence Padder</span>
                  <span className="s-muted">Add silence to the start or end of a track</span>
                </Link>
              </li>
              <li>
                <Link to="/tools/spotify-art-tester">
                  <span>Spotify Art Tester</span>
                  <span className="s-muted">Preview your cover across Spotify views</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="s-panel s-pad s-about" aria-label="About">
          <div className="s-sec-head">
            <span className="s-mono">(07) About</span>
          </div>
          <p className="s-big">
            Stripes is a US-based electronic music producer and a drummer since the age of four. He also works with record labels on releases, A&amp;R and cover art.
          </p>
          <div className="s-ctas">
            <Link className="s-btn" to="/about">
              Read more ↗
            </Link>
            <Link className="s-btn s-btn-solid" to="/contact">
              Get in touch
            </Link>
          </div>
        </section>
      </div>
      <NowPlaying />
    </div>
  );
}
