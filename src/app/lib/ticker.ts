// One shared animation loop, so every animated piece on a page runs on the same frame.
type Fn = (now: number) => void;

const fns = new Set<Fn>();
let raf = 0;

function loop(now: number) {
  // the next frame is booked first, so one piece throwing can't stop all the others
  raf = fns.size ? requestAnimationFrame(loop) : 0;
  fns.forEach((f) => {
    try {
      f(now);
    } catch (err) {
      fns.delete(f);
      console.warn("Animation stopped", err);
    }
  });
}

export function onFrame(f: Fn) {
  fns.add(f);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    fns.delete(f);
  };
}
