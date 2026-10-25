// "Meter into the red", for the Out of Control EP: a stereo level meter climbs on each beat at
// 128 BPM until it clips, the title shakes apart, then the screen lifts off the site.
// Silent, about 2.5 seconds, once per session; any click, key or scroll skips it.
import { useEffect, useRef } from "react";
import { ep } from "../data/releases";
import { markReady } from "../lib/intro";
import { onFrame } from "../lib/ticker";

const SEG = 30; // segments per channel
const RED = 4; // the last few are the clip zone, 0 to +3 dB
const DB_MIN = -48;
const BEAT = 60000 / 128;
const START = 220;
const PEAKS = [-27, -17, -9.5, -3.5, 3.4];
const CLIP = START + BEAT * (PEAKS.length - 1);
const HOLD = 420; // how long it sits in the red before cutting
const scale = ["-48", "-36", "-24", "-12", "-6", "0", "+3"];

// dB -> lit segments: -48..0 across the lime ones, 0..+3 across the red
const segsFor = (db: number) =>
  db <= DB_MIN ? 0 : db <= 0 ? ((db - DB_MIN) / -DB_MIN) * (SEG - RED) : SEG - RED + Math.min(1, db / 3) * RED;
const scalePos = (label: string) => (segsFor(parseFloat(label)) / SEG) * 100;

export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const root = rootRef.current!, read = readRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chans = Array.from(root.querySelectorAll<HTMLElement>(".s-pre-segs")).map((el, c) => ({
      segs: Array.from(el.children) as HTMLElement[],
      lit: -1,
      peak: 0,
      peakAt: 0,
      off: c ? -0.7 : 0.4,
    }));
    const html = document.documentElement;
    html.classList.add("s-preloading");
    scrollTo(0, 0);
    let t0 = 0, phase: "wait" | "run" | "clip" | "out" = "wait", lastRead = "";
    let doneT = 0;

    const out = () => {
      if (phase === "out") return;
      phase = "out";
      root.classList.add("is-out");
      html.classList.remove("s-preloading");
      markReady();
      doneT = window.setTimeout(() => done.current(), reduce ? 320 : 640);
    };
    // start once the title's font is in (or soon anyway), so it never swaps mid-animation
    const fontIn = document.fonts?.load('200 100px "Bricolage Grotesque Variable"').catch(() => {}) ?? Promise.resolve();
    const go = () => {
      if (phase === "wait") {
        phase = "run";
        t0 = performance.now();
        root.classList.add("is-on");
      }
    };
    fontIn.then(go);
    const late = window.setTimeout(go, 700);
    const skip = () => out();
    addEventListener("pointerdown", skip);
    addEventListener("keydown", skip);
    addEventListener("wheel", skip, { passive: true });
    addEventListener("touchmove", skip, { passive: true });

    const off = onFrame((now) => {
      if (phase === "wait" || phase === "out") return;
      const t = now - t0;
      // the level jumps on each beat and falls away between them; after the last it stays pinned
      const b = Math.floor((t - START) / BEAT);
      let db = -Infinity;
      if (b >= 0) {
        const i = Math.min(b, PEAKS.length - 1), since = t - START - i * BEAT;
        db = i === PEAKS.length - 1 ? PEAKS[i] - Math.random() * 0.6 : PEAKS[i] - since * 0.036 + (Math.random() - 0.5) * 1.6;
      }
      if (t >= CLIP && phase === "run") {
        phase = "clip";
        root.classList.add("is-clip");
      }
      chans.forEach((ch) => {
        const lit = Math.round(segsFor(db + ch.off));
        // the peak marker holds for a moment, then falls a segment at a time
        if (lit >= ch.peak) {
          ch.peak = lit;
          ch.peakAt = now;
        } else if (now - ch.peakAt > 600) {
          ch.peak--;
          ch.peakAt = now - 560;
        }
        const key = lit * 100 + ch.peak;
        if (key === ch.lit) return;
        ch.lit = key;
        ch.segs.forEach((el, i) => {
          el.classList.toggle("on", i < lit);
          el.classList.toggle("pk", i === ch.peak - 1 && i >= lit);
        });
      });
      const txt = !isFinite(db) ? "-∞" : (db > 0 ? "+" : "") + db.toFixed(1);
      if (txt !== lastRead) read.textContent = lastRead = txt;
      if (t >= CLIP + HOLD) out();
    });

    return () => {
      off();
      clearTimeout(late);
      clearTimeout(doneT);
      removeEventListener("pointerdown", skip);
      removeEventListener("keydown", skip);
      removeEventListener("wheel", skip);
      removeEventListener("touchmove", skip);
      html.classList.remove("s-preloading");
    };
  }, []);

  const words = ep.title.split(" ");
  const others = [...new Set(ep.tracks.flatMap((t) => t.artists.split(", ")).filter((a) => a !== "Stripes"))];
  return (
    <div className="s-pre" ref={rootRef} aria-hidden="true">
      <div className="s-pre-grain" />
      <div className="s-pre-row s-pad">
        <span className="s-mono">Stripes</span>
        <span className="s-mono">
          New {ep.type} · {ep.date}
        </span>
      </div>
      <div className="s-pre-mid s-pad">
        <p className="s-pre-title">
          {/* the title plus two copies that tear off in lime and red when it clips */}
          {["", " g1", " g2"].map((g) => (
            <span className={"s-pre-tl" + g} key={g}>
              <span>{words.slice(0, -1).join(" ")}</span>
              <span>{words[words.length - 1]}</span>
            </span>
          ))}
        </p>
        <div className="s-pre-meter">
          {["L", "R"].map((c) => (
            <div className="s-pre-ch" key={c}>
              <span className="s-mono">{c}</span>
              <div className="s-pre-segs">
                {Array.from({ length: SEG }, (_, i) => (
                  <i key={i} className={i >= SEG - RED ? "red" : ""} />
                ))}
              </div>
            </div>
          ))}
          <div className="s-pre-scale">
            {scale.map((l) => (
              <span className="s-num" key={l} style={{ left: `${scalePos(l)}%` }}>
                {l}
              </span>
            ))}
          </div>
        </div>
        <p className="s-pre-read">
          <span className="s-num" ref={readRef}>
            -∞
          </span>
          <span className="s-mono">dB</span>
          <span className="s-mono s-pre-clip">Clip</span>
        </p>
      </div>
      <div className="s-pre-row s-pad">
        <span className="s-mono">
          {ep.tracks.length} tracks · with {others.join(" and ")}
        </span>
        <span className="s-mono s-pre-skip">Click to skip</span>
      </div>
    </div>
  );
}
