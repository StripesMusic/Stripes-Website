// Jake's artwork page background, faded into the panel behind Cover art and the top of the Designs page
import { artworkBg } from "../data/images";
import { FadePhoto } from "./FadePhoto";

export function ArtworkBg() {
  return (
    <div className="s-fadebox s-artbg" aria-hidden="true">
      <FadePhoto srcs={[artworkBg]} />
    </div>
  );
}
