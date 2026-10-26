// Photos from ADE 2025 faded into the hero behind the S, on three layers at different depths.
// Each layer crossfades through its photos in turn; the pointer and the scroll move the layers
// at different speeds, so they part around the S like the planes in a Firewatch scene.
import { useEffect, useRef, useState } from "react";
import { montage } from "../../data/images";
import { whenReady } from "../../lib/intro";
import { onFrame } from "../../lib/ticker";
import type { HeroScroll } from "./heroEngine";
import { FadePhoto } from "../FadePhoto";

const DEPTH = [0.45, 0.75, 1];
const HOLD = 7000; // each layer changes photo this often, one layer at a time

export function HeroMontage({ getScroll }: { getScroll: () => HeroScroll }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => montage.map(() => 0));
  const [ready, setReady] = useState(false);
  const missing = useRef(new Set<string>());

  useEffect(() => whenReady(() => setReady(true)), []);

  // crossfade one layer at a time, only while the hero is on screen and the tab is visible
  useEffect(() => {
    if (!ready || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0, t = 0;
    const step = () => {
      if (document.hidden || getScroll().cover >= 1) return;
      const k = n++ % montage.length, set = montage[k];
      setShown((s) =>
        s.map((v, i) => {
          if (i !== k) return v;
          // the next photo in this layer that has loaded, or stay put
          for (let d = 1; d < set.length; d++) {
            const j = (v + d) % set.length;
            if (!missing.current.has(set[j].small)) return j;
          }
          return v;
        }),
      );
    };
    // every layer holds its first photo for a full HOLD before the turns start
    const first = window.setTimeout(() => {
      step();
      t = window.setInterval(step, HOLD / montage.length);
    }, HOLD);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [ready, getScroll]);

  useEffect(() => {
    const root = rootRef.current!;
    const layers = Array.from(root.children) as HTMLElement[];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    const ptr = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    let last = "";
    const move = (e: PointerEvent) => {
      ptr.x = (e.clientX / innerWidth) * 2 - 1;
      ptr.y = (e.clientY / innerHeight) * 2 - 1;
    };
    if (fine && !reduce) addEventListener("pointermove", move, { passive: true });
    const off = onFrame(() => {
      const cv = getScroll().cover;
      if (cv >= 1 && last) return;
      cur.x += (ptr.x - cur.x) * 0.05;
      cur.y += (ptr.y - cur.y) * 0.05;
      const key = `${cur.x.toFixed(3)},${cur.y.toFixed(3)},${cv.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const lift = reduce ? 0 : cv * innerHeight * 0.18;
      layers.forEach((el, i) => {
        const d = DEPTH[i] ?? 1;
        el.style.transform = `translate3d(${(-cur.x * 18 * d).toFixed(2)}px, ${(-cur.y * 12 * d - lift * d).toFixed(2)}px, 0)`;
      });
    });
    return () => {
      off();
      removeEventListener("pointermove", move);
    };
  }, [getScroll]);

  return (
    <div className={"s-montage" + (ready ? " is-in" : "")} ref={rootRef} aria-hidden="true">
      {montage.map((set, i) => (
        <div className={`s-mt s-mt-${i + 1}`} key={i}>
          {/* the later photos in a layer only start loading once the intro is done */}
          {set.map((p, j) => (j === 0 || ready) && <FadePhoto key={p.small} srcs={[p.small]} pos={p.pos} on={shown[i] === j} onFail={() => missing.current.add(p.small)} />)}
        </div>
      ))}
    </div>
  );
}
