// The Artwork page shows one pack per release: its cover plus whatever else was made for it
// (an animated cover for the Spotify Canvas, a lyric video, alternate versions). Pieces are
// matched by catalogue number (SR038, TON031…) or by the release's name.
import { artworkItems, type ArtworkItem } from "./artwork";
import { packImages } from "./images";

export type Kind = "2D" | "3D" | "Motion" | "Lyric video";
export type Pack = {
  key: string;
  code?: string;
  name: string; // what the cover is called, e.g. "SR038" or "I Just Flow"
  release?: string; // "Artist - Title", when the description names it
  client: string;
  label: string; // one of LABELS, or "Artists"
  date: string;
  sort: number; // months since year 0, for newest-first
  cover: string;
  versions: string[]; // alternate cover versions
  canvas?: { video: string; poster: string };
  lyric?: { id: string; title: string };
  process: string[];
  mockups: string[];
  details: string;
  credit?: ArtworkItem["credit"];
  tools: string[];
  kinds: Kind[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNum = (d: string) => {
  const [m, y] = d.split(" ");
  const i = MONTHS.indexOf(m);
  return i < 0 || !y ? 0 : +y * 12 + i;
};
const codeOf = (s: string) => s.match(/\b([A-Z]{2,5}\d{3})\b/)?.[1];
// "…for an official Timeless release: Maulik - She Wants To Party" -> "Maulik - She Wants To Party"
const releaseOf = (d = "") => d.match(/(?:release|remix|EP release|compilation|episode): "?([^"*]+?)"?\s*(?:\*|$)/)?.[1]?.trim();
const nameOf = (t: string) =>
  t
    .replace(/\s*-\s*Animated Cover$/i, "")
    .replace(/\s*\((?:OG|\d{4}) Version\)$/i, "")
    .replace(/\s+(?:Cover Art|Artwork|Art)$/i, "")
    .trim();
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const songOf = (release?: string) => (release ? norm(release.split(" - ").slice(1).join(" - ").replace(/\(.*?\)/g, "")) : "");
const ytId = (u = "") => u.match(/[?&]v=([\w-]{11})/)?.[1];
const clientName = (c = "") =>
  c
    .replace(/\s*\(Sub-label of [^)]+\)/, "")
    .split(/\s*[/,]\s*/)
    .filter((x) => x && x !== "Myself" && x !== "N/A")
    .join(" / ") || "Self-released";
// the labels get their own filter; everyone else is grouped as artists
export const LABELS = ["Timeless", "Solvana Records", "TON 618", "Quadron Records", "Stardust Records"];
const labelOf = (client: string) => (client.includes("Octadron") ? "Quadron Records" : LABELS.find((l) => client.includes(l)) ?? "Artists");

function build(): Pack[] {
  const packs = new Map<string, Pack>();
  const bySong = new Map<string, Pack>();
  const covers = artworkItems.filter((i) => i.category === "2d" || i.category === "3d");

  for (const it of covers) {
    const name = nameOf(it.title), code = codeOf(it.title), release = releaseOf(it.details);
    const key = code ?? norm(name);
    const p: Pack = {
      key,
      code,
      name,
      release,
      client: clientName(it.client),
      label: labelOf(clientName(it.client)),
      date: it.date,
      sort: monthNum(it.date),
      cover: it.image,
      versions: (it.images ?? []).filter((u) => u !== it.image),
      process: [],
      mockups: [],
      details: (it.details ?? "").replace(/\s*\*Not real quality.*$/, ""),
      credit: it.credit,
      tools: (it.software ?? []).map((s) => s.replace(/^Adobe /, "")),
      kinds: [it.category === "2d" ? "2D" : "3D"],
    };
    packs.set(key, p);
    const song = songOf(release);
    if (song) bySong.set(song, p);
  }

  for (const it of artworkItems) {
    if (it.category === "animations") {
      const code = codeOf(it.title), name = norm(nameOf(it.title));
      const p = (code && packs.get(code)) || packs.get(name);
      if (p && it.videoUrl) {
        p.canvas = { video: it.videoUrl, poster: it.image };
        p.kinds.push("Motion");
        (it.software ?? []).forEach((s) => {
          const t = s.replace(/^Adobe /, "");
          if (!p.tools.includes(t)) p.tools.push(t);
        });
      }
    } else if (it.category === "lyric-videos") {
      const song = songOf(it.title.replace(/\s*\((?:Official|Concept|Fan-Made) Lyric Video\)$/, ""));
      const p = bySong.get(song), id = ytId(it.youtubeUrl);
      if (p && id) {
        p.lyric = { id, title: it.title };
        p.kinds.push("Lyric video");
        if (!p.tools.includes("After Effects")) p.tools.push("After Effects");
      }
    }
  }

  // process shots and mockups, once they're uploaded (data/images.ts)
  packs.forEach((p) => {
    const extra = packImages[p.key] ?? packImages[p.name];
    if (extra) {
      p.process = extra.process ?? [];
      p.mockups = extra.mockups ?? [];
    }
  });

  return [...packs.values()].sort((a, b) => b.sort - a.sort);
}

export const packs = build();
// richest first: packs with more than a cover get the full case-study treatment
export const piecesIn = (p: Pack) => 1 + p.versions.length + (p.canvas ? 1 : 0) + (p.lyric ? 1 : 0) + p.process.length + p.mockups.length;

// Lyric videos with no cover in the archive, websites, set visuals and other pieces
const used = new Set(packs.flatMap((p) => [p.lyric?.id].filter(Boolean)));
export const otherWork = artworkItems.filter(
  (i) =>
    i.category === "websites" ||
    i.category === "set-visuals" ||
    i.category === "misc" ||
    (i.category === "lyric-videos" && !used.has(ytId(i.youtubeUrl))) ||
    (i.category === "animations" && !packs.some((p) => p.canvas?.video === i.videoUrl)),
);
export { ytId };
