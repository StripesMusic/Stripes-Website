// Slides a page's on-screen elements in, one after another: on the first load (as the preloader
// lifts) they rise from the bottom and the nav drops in from the top; on later page changes they
// come in from the right, or from the left when going back along the nav. Panels whose top is
// low on the screen slide up from below the page as one block. Only CSS animations with a
// backwards fill are used, so nothing keeps a transform afterwards (pinned and fixed parts of
// the pages need that). It runs with reduced motion too, as the other reveals do (see stripes.css).

const ORDER = ["/", "/music", "/designs", "/drums", "/about", "/contact"];
const PICK = "h1, h2, h3, p, img, .s-btn, .s-slot, .s-sec-head, .s-hero-links li, .s-art-filters, .s-rel";
// already animated by their own code, or decorative
const SKIP = ".s-plane, .s-stage-inner > canvas, .s-pre, .s-fade, .s-montage, [aria-hidden='true']";

let last: string | null = null;

const rank = (path: string) => {
  const i = ORDER.findIndex((p) => p !== "/" && path.startsWith(p));
  return i < 0 ? (path === "/" || path === "/home" ? 0 : ORDER.length) : i;
};

function play(el: HTMLElement, i: number, from: string, opacity = 0) {
  el.style.setProperty("--slide-from", from);
  el.style.setProperty("--slide-o", String(opacity));
  el.style.setProperty("--slide-d", `${Math.min(i, 9) * 85}ms`);
  el.classList.add("s-slide");
  const done = (e: AnimationEvent) => {
    if (e.target !== el) return;
    el.classList.remove("s-slide");
    el.style.removeProperty("--slide-from");
    el.style.removeProperty("--slide-o");
    el.style.removeProperty("--slide-d");
    el.removeEventListener("animationend", done);
  };
  el.addEventListener("animationend", done);
}

export function slideIn(root: HTMLElement, path: string) {
  const first = last === null;
  const back = !first && rank(path) < rank(last!);
  last = path;
  const vh = innerHeight;
  // text comes in from below on the first load, from the side on page changes
  const dx = Math.round(Math.min(innerWidth * 0.6, 520)) * (back ? -1 : 1);
  const textFrom = first ? "translate3d(0, 120px, 0)" : `translate3d(${dx}px, 0, 0)`;

  const picked: HTMLElement[] = [];
  const blocks: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>(".s-panel").forEach((p) => {
    const top = p.getBoundingClientRect().top;
    if (top < vh && top > vh * 0.35) blocks.push(p);
  });
  root.querySelectorAll<HTMLElement>(PICK).forEach((el) => {
    if (el.closest(SKIP) || blocks.some((b) => b.contains(el)) || picked.some((p) => p.contains(el))) return;
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= vh || r.width === 0) return;
    picked.push(el);
  });
  // in reading order: top to bottom, then left to right
  picked.sort((a, b) => {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return Math.abs(ra.top - rb.top) > 24 ? ra.top - rb.top : ra.left - rb.left;
  });
  picked.forEach((el, i) => play(el, i + (first ? 2 : 0), textFrom));
  blocks.forEach((el, i) => play(el, picked.length + i + 1, `translate3d(0, ${(vh - el.getBoundingClientRect().top + 24).toFixed(0)}px, 0)`, 1));

  if (first) {
    const nav = Array.from(document.querySelectorAll<HTMLElement>(".s-nav .s-brand, .s-nav-links > *, .s-nav-end > *"));
    // hidden ones (the phone menu button on a desktop) never finish an animation, so leave them out
    nav.filter((el) => el.offsetWidth > 0).forEach((el, i) => play(el, i * 0.5, "translate3d(0, -64px, 0)"));
  }
}
