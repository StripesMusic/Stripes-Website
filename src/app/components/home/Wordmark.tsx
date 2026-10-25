// STRIPES in a variable font: letters near the cursor get heavier, a fast swipe slices them,
// every kick bounces and glitches them, and the word tilts up in 3D as it scrolls into view.
import { useEffect, useRef } from "react";
import { audio } from "../../lib/audio";
import { onFrame } from "../../lib/ticker";

const WORD = "STRIPES".split("");
const SLICES = 9;

export function Wordmark() {
  const secRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const sec = secRef.current!, h2 = h2Ref.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = Array.from(h2.querySelectorAll<HTMLSpanElement>(".s-ltr")).map((el) => ({
      el,
      sl: Array.from(el.querySelectorAll<HTMLSpanElement>(".s-sl")),
      w: 200, wd: 85, cx: 0, y: 0, vy: 0, kick: 0, delay: 0,
      off: new Float32Array(SLICES),
      burst: new Float32Array(SLICES),
    }));
    const p = { x: 0, vx: 0, last: 0, active: false, lx: null as number | null };
    let snap = 0, beat = 0, glitch = 0, ph = 0, tilt = 0, measured = false;

    const centers = () => {
      L.forEach((l) => {
        const b = l.el.getBoundingClientRect();
        l.cx = b.left + b.width / 2;
      });
      measured = true;
    };
    const onMove = (e: PointerEvent) => {
      if (p.lx !== null) p.vx = p.vx * 0.5 + (e.clientX - p.lx) * 0.5;
      p.lx = e.clientX;
      p.x = e.clientX;
      p.active = true;
      p.last = performance.now();
    };
    const onLeave = () => {
      p.active = false;
      p.lx = null;
    };
    const onDown = () => {
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
    document.fonts?.ready.then(() => (measured = false));
    const offKick = audio.onKick((s) => {
      beat = 1;
      L.forEach((l, i) => {
        l.delay = i * 2;
        l.kick = 9 + s * 8;
        for (let k = 0; k < SLICES; k++) l.burst[k] = (Math.random() - 0.5) * (20 + s * 40) * (Math.random() < 0.45 ? 1 : 0);
      });
    });

    const offFrame = onFrame((now) => {
      const r = sec.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const q = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      tilt += (q - tilt) * 0.12;
      const e = 1 - Math.pow(1 - tilt, 3);
      h2.style.transform = `translateY(${((1 - e) * 140).toFixed(1)}px) rotateX(${((1 - e) * 72).toFixed(2)}deg) scale(${(0.9 + 0.1 * e).toFixed(4)})`;
      if (!measured) centers();
      const act = p.active && now - p.last < 400;
      if (!reduce) glitch = Math.min(1, Math.max(glitch * 0.88, (Math.abs(p.vx) - 14) / 40));
      p.vx *= 0.85;
      ph += 0.35;
      snap *= 0.92;
      beat *= 0.86;
      L.forEach((l, i) => {
        const dx = act ? (p.x - l.cx) / Math.max(innerWidth * 0.09, 60) : 99;
        const k = Math.max(Math.exp(-dx * dx), snap, beat * 0.75);
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
        l.el.style.transform = Math.abs(l.y) > 0.05 ? `translateY(${l.y.toFixed(2)}px)` : "";
        const near = act ? Math.exp(-Math.pow((p.x - l.cx) / 220, 2)) : 0;
        l.sl.forEach((el, s) => {
          l.burst[s] *= 0.82;
          const target = glitch * near * 70 * Math.sin(s * 1.7 + ph + i) + l.burst[s];
          l.off[s] += (target - l.off[s]) * 0.4;
          el.style.transform = Math.abs(l.off[s]) > 0.05 ? `translateX(${l.off[s].toFixed(1)}px)` : "";
        });
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
  }, []);

  return (
    <div className="s-wm" ref={secRef}>
      <div className="s-wm-head">
        <span className="s-mono">Stripes</span>
      </div>
      <div className="s-wm-stage">
        <h2 ref={h2Ref} aria-label="Stripes">
          {WORD.map((ch, i) => (
            <span className="s-ltr" aria-hidden="true" key={i}>
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
        </h2>
      </div>
    </div>
  );
}
