// Photos on the homepage. A few big ones rather than many small ones. Each lives in the assets
// bucket under web-photos/ at two widths (name-2400.webp and name-1200.webp), exported as WebP
// without location data. pos is the crop's focal point (CSS object-position).
const W = "https://assets.musicbystripes.com/web-photos/";

export type Photo = { src: string; small: string; w: number; h: number; alt: string; pos: string };
const photo = (name: string, w: number, h: number, alt: string, pos = "50% 50%"): Photo => ({
  src: `${W}${name}-2400.webp`,
  small: `${W}${name}-1200.webp`,
  w,
  h,
  alt,
  pos,
});

export const photos = {
  amsterdamStreet: photo("amsterdam-street", 1452, 2029, "Stripes and two friends on a busy Amsterdam street during ADE 2025", "45% 18%"),
  // only 602×900 for now, so it stays the smaller of the pair
  amsterdamDoor: photo("amsterdam-laptop", 602, 900, "Two people with a laptop at a brick theatre doorway in Amsterdam", "50% 30%"),
  drums: photo("drums-shop", 1477, 1969, "A blue drum kit in a drum shop, a wall of cymbals behind it", "50% 60%"),
  portrait: photo("about-sky", 2400, 2215, "Stripes smiling up at a clear blue sky", "40% 40%"),
  portraitAlt: photo("about-park", 2400, 1733, "Stripes in profile in a park", "50% 30%"),
};

// Pack pieces for the covers on the homepage, keyed by the cover's title in featuredWork.
// canvas 9:16 (a still from the Spotify Canvas), flyer 4:5, thumbnail 16:9 (YouTube).
// Only the pieces listed here are shown.
export const packImages: Record<string, { canvas?: string; flyer?: string; thumbnail?: string }> = {};
