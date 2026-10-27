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
};

export const artworkItems = data as ArtworkItem[];
