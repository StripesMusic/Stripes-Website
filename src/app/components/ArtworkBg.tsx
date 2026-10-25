// The Leidseplein panorama, faded into the panel behind Cover art and the top of the Designs page
import { artworkBg } from "../data/images";
import { FadePhoto } from "./FadePhoto";

export function ArtworkBg() {
  const src = typeof innerWidth !== "undefined" && innerWidth < 800 ? artworkBg.small : artworkBg.src;
  return (
    <div className="s-fadebox s-artbg" aria-hidden="true">
      <FadePhoto srcs={[src, artworkBg.fallback]} pos="40% 60%" />
    </div>
  );
}
