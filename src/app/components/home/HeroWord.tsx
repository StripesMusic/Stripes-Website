// STRIPES beside the S, on the same tilting plane (the engine places it and turns the plane).
// Letters near the cursor get heavier, a fast swipe slices them, kicks bounce them, they rise
// in once the page is revealed, and the whole word gets bolder as you scroll on.
import { useEffect, useRef, type RefObject } from "react";
import { audio } from "../../lib/audio";
import { onFrame } from "../../lib/ticker";
import { whenReady } from "../../lib/intro";
import type { HeroScroll } from "./heroEngine";

const WORD = "STRIPES".split("");
const SLICES = 9;
const REST = 300;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function HeroWord({ area, getScroll }: { area: RefObject<HTMLElement | null>; getScroll: () => HeroScroll }) {
  const wordRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sec = area.current!, word = wordRef.current!, plane = word.closest<HTMLElement>(".s-plane");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = Array.from(word.querySelectorAll<HTMLSpanElement>(".s-ltr")).map((el) => ({
      el,
      sl: Array.from(el.querySelectorAll<HTMLSpanElement>(".s-sl")),
      w: REST, wd: 75, cx: 0, y: 0, vy: 0, kick: 0, delay: 0, t: "", fv: "", hi: false, cut: false,
      off: new Float32Array(SLICES),
      burst: new Float32Array(SLICES),
    }));
    const p = { x: 0, y: 0, vx: 0, last: 0, active: false, lx: null as number | null };
    const box = { top: 0, bottom: 0 };
    let snap = 0, beat = 0, glitch = 0, ph = 0, cv = 0, measured = false, born = 0, fontsIn = false;

    const measure = () => {
      const b = word.getBoundingClientRect();
      box.top = b.top;
      box.bottom = b.bottom;
      L.forEach((l) => {
        const r = l.el.getBoundingClientRect();
        l.cx = r.left + r.width / 2;
      });
      measured = true;
    };
    const onMove = (e: PointerEvent) => {
      if (p.lx !== null) p.vx = p.vx * 0.5 + (e.clientX - p.lx) * 0.5;
      p.lx = e.clientX;
      p.x = e.clientX;
      p.y = e.clientY;
      p.active = true;
      p.last = performance.now();
    };
    const onLeave = () => {
      p.active = false;
      p.lx = null;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button")) return;
      snap = 1;
      L.forEach((l, i) => {
        l.delay = i * 2;
        l.kick = 6;
      });
    };
    const remeasure = () => (measured = false);
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    sec.addEventListener("pointerdown", onDown);
    addEventListener("resize", remeasure);
    addEventListener("scroll", remeasure, { passive: true });
    plane?.addEventListener("s-layout", remeasure);
    // the letters rise in once the font is in and the preloader has lifted
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let offReady = () => {};
    fontsReady.then(() => {
      fontsIn = true;
      measured = false;
      offReady = whenReady(() => (born = performance.now()));
    });
    const offKick = audio.onKick((s) => {
      beat = 1;
      L.forEach((l, i) => {
        l.delay = i * 2;
        l.kick = 9 + s * 8;
        for (let k = 0; k < SLICES; k++) l.burst[k] = (Math.random() - 0.5) * (20 + s * 40) * (Math.random() < 0.45 ? 1 : 0);
      });
    });

    const offFrame = onFrame((now) => {
      const sc = getScroll();
      if (sc.cover >= 0.999) return;
      if (!fontsIn) {
        word.style.visibility = "hidden";
        return;
      }
      word.style.visibility = "";
      if (!measured) measure();
      cv += (sc.cover - cv) * 0.18;
      const act = p.active && now - p.last < 400;
      if (!reduce) glitch = Math.min(1, Math.max(glitch * 0.88, (Math.abs(p.vx) - 14) / 40));
      p.vx *= 0.85;
      ph += 0.35;
      snap *= 0.92;
      beat *= 0.86;
      // the word gets bolder as the panel slides over the hero
      const base = REST + 350 * smooth(clamp01(cv * 1.4));
      // the cursor counts fully over the word and fades out above and below it
      const off = act ? Math.max(0, box.top - p.y, p.y - box.bottom) / (innerHeight * 0.22) : 9;
      const near = Math.exp(-off * off);
      L.forEach((l, i) => {
        const dx = act ? (p.x - l.cx) / Math.max(innerWidth * 0.07, 50) : 99;
        const k = Math.max(Math.exp(-dx * dx) * near, snap, beat * 0.75);
        l.w += (base + (800 - base) * k - l.w) * 0.16;
        l.wd += (75 + 12 * k - l.wd) * 0.16;
        const fv = `'wght' ${l.w.toFixed(0)}, 'wdth' ${l.wd.toFixed(1)}, 'opsz' 96`;
        if (fv !== l.fv) l.el.style.fontVariationSettings = l.fv = fv;
        const hi = beat > 0.35 && k > 0.6;
        if (hi !== l.hi) l.el.style.color = (l.hi = hi) ? "var(--s-hi)" : "";
        if (l.delay > 0) l.delay--;
        else if (l.kick) {
          l.vy -= l.kick;
          l.kick = 0;
        }
        l.vy += -0.22 * l.y;
        l.vy *= 0.8;
        l.y += l.vy;
        // rising in: each letter tips up from lying flat, a beat after the one before
        const r = !born ? 0 : reduce ? 1 : smooth(clamp01((now - born - 380 - i * 65) / 750));
        const lie = 1 - r;
        const t = lie > 0.001 || Math.abs(l.y) > 0.05
          ? `perspective(600px) translate3d(0, ${(l.y + lie * 40).toFixed(2)}px, 0) rotateX(${(lie * -75).toFixed(2)}deg)`
          : "";
        if (t !== l.t) l.el.style.transform = l.t = t;
        l.el.style.opacity = lie > 0.001 ? (1 - lie * lie).toFixed(3) : "";
        const nearX = act ? Math.exp(-Math.pow((p.x - l.cx) / 220, 2)) * near : 0;
        let cut = false;
        l.sl.forEach((el, s) => {
          l.burst[s] *= 0.82;
          const target = glitch * nearX * 70 * Math.sin(s * 1.7 + ph + i) + l.burst[s];
          l.off[s] += (target - l.off[s]) * 0.4;
          const on = Math.abs(l.off[s]) > 0.3;
          cut ||= on;
          el.style.transform = on ? `translateX(${l.off[s].toFixed(1)}px)` : "";
        });
        if (cut !== l.cut) l.el.classList.toggle("is-cut", (l.cut = cut));
      });
    });

    return () => {
      offFrame();
      offKick();
      offReady();
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
      sec.removeEventListener("pointerdown", onDown);
      removeEventListener("resize", remeasure);
      removeEventListener("scroll", remeasure);
      plane?.removeEventListener("s-layout", remeasure);
    };
  }, [area, getScroll]);

  return (
    <div className="s-word">
      <p ref={wordRef}>
        {WORD.map((ch, i) => (
          <span className="s-ltr" key={i}>
            <span className="s-ghost">{ch}</span>
            {Array.from({ length: SLICES }, (_, s) => (
              <span
                className="s-sl"
                key={s}
                style={{ clipPath: `inset(${((s / SLICES) * 100).toFixed(3)}% -30% ${(100 - ((s + 1) / SLICES) * 100).toFixed(3)}% -30%)` }}
              >
                {ch}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}
