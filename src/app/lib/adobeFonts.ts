// Degular and Please Variable come from Jake's Adobe Fonts project (the stylesheet linked in
// index.html). Adobe picks the CSS names of its families, so rather than guess them, read them
// from the fonts that stylesheet declares and hand them to the CSS (--s-please-fam, --s-degular-fam
// in stripes.css). Until then, or if Adobe can't be reached, the pages fall back to Bricolage.
const KIT = "use.typekit.net";
let please = "";
let degular = "";

const clean = (f: string) => f.replace(/["']/g, "").trim();

function detect() {
  const fams = new Set<string>();
  document.fonts?.forEach((f) => fams.add(clean(f.family)));
  const all = [...fams];
  const pick = (...tests: RegExp[]) => {
    for (const t of tests) {
      const hit = all.find((f) => t.test(f));
      if (hit) return hit;
    }
    return "";
  };
  const p = pick(/^please.*variable/i, /please/i);
  const d = pick(/^degular$/i, /^degular.*variable/i, /^degular(?!.*(display|text|mono))/i, /degular/i);
  const root = document.documentElement.style;
  if (p && p !== please) root.setProperty("--s-please-fam", `"${(please = p)}"`);
  if (d && d !== degular) root.setProperty("--s-degular-fam", `"${(degular = d)}"`);
  return !!(p && d);
}

/** The CSS name of Please Variable in the Adobe project, or "" before it's known. */
export const pleaseFamily = () => please;

export function initAdobeFonts() {
  if (detect()) return;
  const link = document.querySelector<HTMLLinkElement>(`link[href*="${KIT}"]`);
  link?.addEventListener("load", detect, { once: true });
  document.fonts?.addEventListener?.("loading", detect);
  document.fonts?.ready.then(detect);
}
