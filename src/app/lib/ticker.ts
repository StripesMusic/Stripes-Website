// One shared animation loop, so every animated piece on a page runs on the same frame.
type Fn = (now: number) => void;

const fns = new Set<Fn>();
let raf = 0;

function loop(now: number) {
  fns.forEach((f) => f(now));
  raf = fns.size ? requestAnimationFrame(loop) : 0;
}

export function onFrame(f: Fn) {
  fns.add(f);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    fns.delete(f);
  };
}
