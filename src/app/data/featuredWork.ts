// Covers featured in the homepage Designs section. Copied from the Designs page until
// that page moves to per-song packs.
export type Work = {
  title: string;
  release: string;
  client: string;
  date: string;
  image: string;
  details: string;
  tools: string[];
};

const base = "https://assets.musicbystripes.com/client%20cover%20arts/2d/";

export const featuredWork: Work[] = [
  {
    title: "TMLS047",
    release: "NANDAN - Say You're Sorry",
    client: "Timeless",
    date: "Oct 2026",
    image: base + "TMLS047.jpg",
    details: "Textured, dithered, wavy and abstract.",
    tools: ["Photoshop"],
  },
  {
    title: "TMLS044",
    release: "Maulik - She Wants To Party",
    client: "Timeless",
    date: "Aug 2026",
    image: base + "TMLS044.jpg",
    details: "Dark and club themed, with grimy textures and details.",
    tools: ["Photoshop"],
  },
  {
    title: "TMLS046",
    release: "CHRSTN, Auryn - Tonight",
    client: "Timeless",
    date: "Sep 2026",
    image: base + "TMLS046.jpg",
    details: "Dark and sparkly, with an aurora-lights theme.",
    tools: ["Photoshop"],
  },
  {
    title: "Through Hell",
    release: "M1CK3Y, Illusionz, M4R1US BP - Through Hell",
    client: "Stardust Records",
    date: "Jun 2026",
    image: base + "ThroughHell.jpeg",
    details: "Vector, cartoon-styled artwork with a hell theme.",
    tools: ["Photoshop"],
  },
  {
    title: "SR043",
    release: "Guy Coolid, paulø - BADMAN!",
    client: "Solvana Records",
    date: "Mar 2026",
    image: base + "SR043.png",
    details: "Dark, mysterious night city.",
    tools: ["Photoshop"],
  },
  {
    title: "Lost In You Remix",
    release: "Quintino, NERVO - Lost In You (Toxic Wraith, Stripes Remix)",
    client: "Self-released",
    date: "Nov 2025",
    image: base + "Lost_In_You_Remix_Artwork.jpeg",
    details: "Collage style with vibrant colours.",
    tools: ["Photoshop"],
  },
];

// The headline items of a full single pack, from the deliverables list Stripes sends clients.
export const packContents = ["Cover 3000²", "Spotify Canvas", "YouTube thumbnail", "Flyers", "Reels", "Lyric video"];
