import data from "../../content/releases.json";

export type Collaborator = { name: string; image: string; link: string };

export type Release = {
  title: string;
  type: string;
  date: string;
  image: string;
  link: string;
  collaborators: Collaborator[];
  // the clip's file name in previews/ when it isn't the link slug; "none" while there's no clip
  preview?: string;
};

// Newest first, in src/content/releases.json. The homepage and the Music page both read from here.
export const releases = data.items as Release[];

// Preview clips live on R2 at previews/<name>.mp3. The name is the fangate slug
// ("/link/forgetyou" -> "forgetyou") unless the release says otherwise.
export const clipUrl = (name: string) => `https://assets.musicbystripes.com/previews/${name}.mp3`;
export const previewUrl = (r: Release) =>
  r.preview === "none" ? null : clipUrl(r.preview || r.link.split("/").pop()!);

// The newest release, featured at the top of the homepage.
export const ep = {
  title: "Out Of Control",
  type: "EP",
  date: "16 Oct 2026",
  image: "https://assets.musicbystripes.com/releases%20cover%20arts/Out_Of_Control_Artwork.jpg",
  link: "/link/outofcontrolep",
  tracks: [
    { n: "01", title: "Out Of Control", artists: "Stripes, 7sunami", preview: "outofcontrol" },
    { n: "02", title: "Forget You", artists: "7sunami, Thome, Stripes", preview: "forgetyou" },
    { n: "03", title: "Under The Moonlight", artists: "Stripes, 7sunami", preview: "underthemoonlight" },
    { n: "04", title: "Won't Give Up", artists: "Stripes, 7sunami", preview: "wontgiveup" },
  ],
};
