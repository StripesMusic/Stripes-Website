// Photos on the homepage. A few big ones rather than many small ones. Each lives in the assets
// bucket under web-photos/ at two widths (name-2400.webp and name-1200.webp), exported as WebP
// without location data. pos is the crop's focal point (CSS object-position).
const W = "https://assets.musicbystripes.com/web-photos/";

export type Photo = { src: string; small: string; w: number; h: number; alt: string; pos: string; orig?: string };
const photo = (name: string, w: number, h: number, alt: string, pos = "50% 50%"): Photo => ({
  src: `${W}${name}-2400.webp`,
  small: `${W}${name}-1200.webp`,
  w,
  h,
  alt,
  pos,
});

export const photos = {
  // ADE 2025, Amsterdam
  amsterdamStreet: photo("amsterdam-street", 1452, 2029, "Stripes and two friends on a busy Amsterdam street during ADE 2025", "45% 18%"),
  // only 602×900 for now, so it stays the smaller of the pair
  amsterdamDoor: photo("amsterdam-laptop", 602, 900, "Two people with a laptop at a brick theatre doorway in Amsterdam", "50% 30%"),
  drums: photo("drums-shop", 1477, 1969, "Stripes standing by a blue drum kit in a drum shop, a wall of cymbals behind", "44% 28%"),
  portrait: photo("about-sky", 2400, 2215, "Stripes smiling up at a clear blue sky", "40% 40%"),
  // the official press photo (5539×4000), beside the bio on the homepage and the About page: the
  // web copies first, the original until they're uploaded
  press: { ...photo("press-pic", 2400, 1733, "Stripes outdoors in a black tee", "48% 28%"), orig: `${W}stripes_official_press_pic.jpg` },
  // ADE 2025 (CCd-0121, CCd-0024): web copies first, the originals until they're uploaded
  tools: { ...photo("ade-tools", 2400, 1600, "Stripes at ADE 2025", "50% 40%"), orig: `${W}add_ADE%202025%20Favorites%20CCd-0121.jpg` },
  music: { ...photo("ade-music", 2400, 1600, "Stripes at ADE 2025", "50% 40%"), orig: `${W}add_ADE%202025%20Favorites%20CCd-0024.jpg` },
  portraitAlt: photo("about-park", 2400, 1733, "Stripes in profile in a park", "50% 30%"),
};

// More from ADE 2025, used faded: only the 1200px copy (ade-<name>-1200.webp)
const ade = (name: string, w: number, h: number, pos: string): Photo => ({ ...photo(`ade-${name}`, w, h, "", pos), src: `${W}ade-${name}-1200.webp` });
export const adePhotos = {
  flagDuo: ade("flag-duo", 800, 1200, "50% 40%"),
  bridge: ade("bridge", 900, 1200, "35% 50%"),
  houseboats: ade("canal-houseboats", 1200, 800, "50% 70%"),
  lido: ade("lido-canal", 1200, 800, "35% 50%"),
  leidseplein: ade("leidseplein", 1200, 800, "60% 50%"),
  theatreTram: ade("theatre-tram", 1200, 800, "45% 35%"),
};

// The hero's faded photo layers (HeroMontage): each inner list is one layer, crossfading in turn
export const montage: Photo[][] = [
  [photos.amsterdamStreet, adePhotos.flagDuo],
  [photos.amsterdamDoor, adePhotos.bridge],
  [photos.portrait, adePhotos.houseboats, adePhotos.lido],
];

// Behind the Cover art section and the top of the Designs page, very faded: Jake's wall of covers
// (artwork_collage.jpeg at the bucket root, 5092x3240). The web-sized copies are tried first and
// the original is the fallback until they're uploaded.
export const artworkBg = {
  src: `${W}artwork-collage-2400.webp`,
  small: `${W}artwork-collage-1200.webp`,
  fallback: "https://assets.musicbystripes.com/artwork_collage.jpeg",
};

// Pack pieces for the covers on the homepage, keyed by the cover's title in featuredWork.
// canvas 9:16 (a still from the Spotify Canvas), flyer 4:5, thumbnail 16:9 (YouTube).
// Only the pieces listed here are shown. process and mockups (any ratio) go on the Artwork page;
// upload them to packs/<catalogue number>/ in the assets bucket and list the URLs here.
export const packImages: Record<string, { canvas?: string; flyer?: string; thumbnail?: string; process?: string[]; mockups?: string[] }> = {};
