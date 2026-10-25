// Drum covers, newest first. Shared by the Drums page and the homepage.
export type DrumCover = { title: string; artist: string; date: string; youtubeId: string };

export const drumCovers: DrumCover[] = [
  { title: "Misery Business", artist: "Paramore", date: "May 2026", youtubeId: "Ob_QOy7iFeQ" },
  { title: "Ruin", artist: "Lamb of God", date: "May 2026", youtubeId: "ISmoJL4XWQw" },
  { title: "Struck Dead", artist: "Trivium", date: "Apr 2026", youtubeId: "tvb6E6NfFW8" },
];

// YouTube's privacy-enhanced player, which doesn't store anything until the video is played
export const embedUrl = (c: DrumCover) => `https://www.youtube-nocookie.com/embed/${c.youtubeId}`;
// hqdefault always exists; it's 4:3 with bars, which object-fit: cover crops away at 16:9
export const thumbUrl = (c: DrumCover) => `https://i.ytimg.com/vi/${c.youtubeId}/hqdefault.jpg`;
