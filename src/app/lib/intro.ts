// The preloader holds the page's entrance animations until it lifts. It plays on the first
// visit to the homepage in a session (or with ?intro in the address); everywhere else the
// entrances start right away.
const KEY = "s-intro-seen";

function wantsPreloader() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(location.search).has("intro")) return true;
  if (location.pathname !== "/" && location.pathname !== "/home") return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export const showPreloader = wantsPreloader();
let ready = !showPreloader;
const waiting = new Set<() => void>();

export function markReady() {
  if (ready) return;
  ready = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // private mode: it just plays again next time
  }
  waiting.forEach((f) => f());
  waiting.clear();
}

// runs cb once the page is revealed; returns a cancel function
export function whenReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => {
    waiting.delete(cb);
  };
}
