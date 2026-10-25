// Every photo slot on the site that isn't tied to a release or a cover. Upload the file to the
// assets bucket (assets.musicbystripes.com) and paste its full URL here. An empty string shows
// a striped placeholder with the label and the size to export at.
const A = "https://assets.musicbystripes.com/";

export const images = {
  about: {
    portrait: A + "about_section_pic.jpeg", // 4:5, 1200×1500
    studio: "", // 3:2, 1500×1000
    live: "", // 3:2, 1500×1000, on stage or at the kit
  },
  // 16:10 screenshots of each tool, 1600×1000
  tools: {
    gdAutoExport: "",
    audioSilencePadder: "",
    spotifyArtTester: "",
  },
  // 16:9, 1600×900: a mockup of a full release pack (cover, canvas, flyers on one board)
  footerPack: "",
};

// Pack pieces for the covers on the homepage, keyed by the cover's title in featuredWork.
// canvas 9:16 (a still from the Spotify Canvas), flyer 4:5, thumbnail 16:9 (YouTube).
export const packImages: Record<string, { canvas?: string; flyer?: string; thumbnail?: string }> = {
  TMLS047: {},
  TMLS044: {},
  TMLS046: {},
  "Through Hell": {},
  SR043: {},
  "Lost In You Remix": {},
};
