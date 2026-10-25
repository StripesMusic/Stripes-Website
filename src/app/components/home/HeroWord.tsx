// STRIPES across the bottom of the hero, standing on the edge of the first panel. Letters near
// the cursor get heavier, a fast swipe slices them, kicks bounce them, and as you scroll they
// sink behind the panel one by one, nearest the S first, while the S rises in their place.
import { useEffect, useRef, type RefObject } from "react";
import { audio } from "../../lib/audio";
import { onFrame } from "../../lib/ticker";
import { markLayout, type HeroScroll } from "./heroEngine";

const WORD = "STRIPES".split("");
const SLICES = 9;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function HeroWord({ area, getScroll }: { area: RefObject<HTMLElement | null>; getScroll: () => HeroScroll }) {
  const wordRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sec = area.current!, word = wordRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = Array.from(word.querySelectorAll<HTMLSpanElement>(".s-ltr")).map((el) => ({
      el,
      sl: Array.from(el.querySelectorAll<HTMLSpanElement>(".s-sl")),
      w: 200, wd: 75, cx: 0, rank: 0, y: 0, vy: 0, kick: 0, delay: 0, t: "", cut: false,
      off: new Float32Array(SLICES),
      burst: new Float32Array(SLICES),
    }));
    const p = { x: 0, y: 0, vx: 0, last: 0, active: false, lx: null as number | null };
    const box = { top: 0, bottom: 0, h: 1 };
    let snap = 0, beat = 0, glitch = 0, ph = 0, rv = 0, measured = false, born = 0;

    const measure = () => {
      const s = sec.getBoundingClientRect(), b = word.getBoundingClientRect();
      box.top = b.top;
      box.bottom = b.bottom;
      box.h = Math.max(1, b.height);
      const sx = s.left + s.width / 2 + markLayout(s.width, s.height).cx;
      L.forEach((l) => {
        const r = l.el.getBoundingClientRect();
        l.cx = r.left + r.width / 2;
      });
      [...L].sort((a, b) => Math.abs(a.cx - sx) - Math.abs(b.cx - sx)).forEach((l, i) => (l.rank = i));
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
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    sec.addEventListener("pointerdown", onDown);
    const onResize = () => (measured = false);
    addEventListener("resize", onResize);
    // the letters rise into place once the font is in, so they never jump from the fallback
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      measured = false;
      born = performance.now();
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
      if (!born) {
        word.style.visibility = "hidden";
        return;
      }
      word.style.visibility = "";
      if (!measured) measure();
      rv += (sc.reveal - rv) * 0.18;
      const act = p.active && now - p.last < 400;
      if (!reduce) glitch = Math.min(1, Math.max(glitch * 0.88, (Math.abs(p.vx) - 14) / 40));
      p.vx *= 0.85;
      ph += 0.35;
      snap *= 0.92;
      beat *= 0.86;
      // the cursor counts fully over the word and fades out above it
      const above = act ? Math.max(0, box.top - p.y, p.y - box.bottom) / (innerHeight * 0.22) : 9;
      const near = Math.exp(-above * above);
      L.forEach((l, i) => {
        const dx = act ? (p.x - l.cx) / Math.max(innerWidth * 0.12, 60) : 99;
        const k = Math.max(Math.exp(-dx * dx) * near, snap, beat * 0.75);
        l.w += (200 + 600 * k - l.w) * 0.16;
        l.wd += (75 + 25 * k - l.wd) * 0.16;
        l.el.style.fontVariationSettings = `'wght' ${l.w.toFixed(1)}, 'wdth' ${l.wd.toFixed(1)}, 'opsz' 96`;
        l.el.style.color = beat > 0.35 && k > 0.6 ? "var(--s-lime)" : "";
        if (l.delay > 0) l.delay--;
        else if (l.kick) {
          l.vy -= l.kick;
          l.kick = 0;
        }
        l.vy += -0.22 * l.y;
        l.vy *= 0.8;
        l.y += l.vy;
        // sunk: 0 standing, 1 fully behind the panel. Rising in on load, sinking on scroll.
        const rise = reduce ? 1 : clamp01((now - born - i * 70) / 900);
        const sunk = Math.max(smooth(clamp01((rv - l.rank * 0.07) / 0.45)), Math.pow(1 - rise, 3));
        const t = sunk > 0.001 || Math.abs(l.y) > 0.05
          ? `perspective(700px) translate3d(0, ${(l.y + sunk * box.h * 1.08).toFixed(2)}px, 0) rotateX(${(sunk * 55).toFixed(2)}deg)`
          : "";
        if (t !== l.t) l.el.style.transform = l.t = t;
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
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
      sec.removeEventListener("pointerdown", onDown);
      removeEventListener("resize", onResize);
    };
  }, [area, getScroll]);

  return (
    <div className="s-word" aria-hidden="true">
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
