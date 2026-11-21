import data from "../../content/artwork.json";

// Every piece on the Designs page. The list itself lives in src/content/artwork.json so it can be
// edited in the content panel (.pages.yml); data/packs.ts groups it into one pack per release.
export type ArtworkItem = {
  id?: number;
  title: string;
  type: string;
  category: "2d" | "3d" | "animations" | "lyric-videos" | "websites" | "set-visuals" | "misc";
  date: string;
  image: string;
  images?: string[]; // extra versions or clips
  release?: string; // "Artist - Title" of the release it was made for
  details?: string;
  credit?: { name: string; href: string }; // a collaborator on the piece
  videoUrl?: string;
  youtubeUrl?: string; // a YouTube video, or the site itself for websites
  software?: string[];
  client?: string;
  featured?: boolean; // shown open as a release pack at the top of Designs (covers only)
  animatedCover?: string; // covers only: the .mp4 Spotify Canvas loop
  lyricVideo?: string; // covers only: the lyric video on YouTube
  extras?: Extra[]; // supplementary visuals made for the release: flyers, banners, reels, process shots
  visuals?: Visual[]; // what the content panel stores; read into the fields above when the list loads
};

export type Extra = { src: string; label?: string };

// One entry in an item's "Visuals" list in the content panel: what kind it is, its link, and an
// optional name (needed for "other", the kinds not on the list yet).
export type Visual = { kind?: string; link?: string; name?: string };
export const VISUAL_KINDS: Record<string, string> = {
  version: "Alternate version",
  "animated-cover": "Animated cover",
  "lyric-video": "Lyric video",
  clip: "Video clip",
  flyer: "Flyer",
  post: "Social post",
  reel: "Reel / story video",
  banner: "Banner",
  thumbnail: "YouTube thumbnail",
  background: "Textless background",
  wallpaper: "Wallpaper",
  process: "Process shot",
  mockup: "Mockup",
  other: "Other",
};

// The panel keeps everything in one Visuals list; the site reads the alternate versions, clips,
// animated cover and lyric video out of it, and shows the rest as extra visuals with their name.
function read(it: ArtworkItem): ArtworkItem {
  if (!it.visuals?.length) return it;
  const out: ArtworkItem = { ...it, images: [...(it.images ?? [])], extras: [...(it.extras ?? [])] };
  for (const v of it.visuals) {
    const link = v?.link?.trim();
    if (!link) continue;
    const kind = v.kind || "other";
    if (kind === "version" || kind === "clip") out.images!.push(link);
    else if (kind === "animated-cover") out.animatedCover ??= link;
    else if (kind === "lyric-video") out.lyricVideo ??= link;
    else out.extras!.push({ src: link, label: v.name?.trim() || (kind === "other" ? "" : VISUAL_KINDS[kind] ?? kind) });
  }
  return out;
}

export const artworkItems = (data.items as ArtworkItem[]).map(read);
