import data from "../../content/drums.json";

// Drum covers in src/content/drums.json, stored oldest first. Shared by the Drums page and the homepage.
export type DrumCover = { title: string; artist: string; date: string; youtubeId: string };

// newest first; within a month, the one added to the list later
const list = data.items as DrumCover[];
export const drumCovers = [...list].sort((a, b) => Date.parse(`1 ${b.date}`) - Date.parse(`1 ${a.date}`) || list.indexOf(b) - list.indexOf(a));

// YouTube's privacy-enhanced player, which doesn't store anything until the video is played
export const embedUrl = (c: DrumCover) => `https://www.youtube-nocookie.com/embed/${c.youtubeId}`;
// hqdefault always exists; it's 4:3 with bars, which object-fit: cover crops away at 16:9
export const thumbUrl = (c: DrumCover) => `https://i.ytimg.com/vi/${c.youtubeId}/hqdefault.jpg`;
