// Music: where to listen, the new EP, then every release, newest first and split by year.
import { PageHead } from "../components/PageHead";
import { EpBody } from "../components/home/EpBody";
import { ReleaseList, byDate } from "../components/home/ReleaseList";
import { NowPlaying } from "../components/home/NowPlaying";
import { PLATFORMS } from "../components/icons/Platforms";
import { photos } from "../data/images";
import { ep } from "../data/releases";

const listen = [
  { p: PLATFORMS.spotify, href: "https://open.spotify.com/artist/02OMUOGNd6EwfnSEWgtwEf" },
  { p: PLATFORMS.apple, href: "https://music.apple.com/us/artist/stripes/1380328226" },
  { p: PLATFORMS.soundcloud, href: "https://soundcloud.com/musicbystripes" },
  { p: PLATFORMS.youtube, href: "https://www.youtube.com/@musicbystripes" },
];
const years = byDate.map((r) => +r.date.slice(-4));

export function Music() {
  return (
    <div className="s-page s-music">
      <PageHead
        id="music-title"
        label="Music"
        aside={
          <>
            <span className="s-num">{byDate.length}</span> releases · {Math.min(...years)}–{Math.max(...years)}
          </>
        }
        title="Music"
        lede="Everything I've released, newest first. Most of it is free to download."
        photo={{ srcs: [photos.music.small, photos.music.orig], pos: photos.music.pos }}
      >
        <ul className="s-pills" aria-label="Listen on">
          {listen.map(({ p, href }) => (
            <li key={p.name}>
              <a className="s-btn" href={href} target="_blank" rel="noopener noreferrer">
                <p.Icon />
                {p.name} ↗
              </a>
            </li>
          ))}
        </ul>
      </PageHead>

      <section className="s-panel s-ep" data-scene="ep" aria-label={`${ep.title} ${ep.type}`}>
        <EpBody onMusic />
      </section>

      <section className="s-panel s-pad s-rels s-pbody" data-scene="releases" aria-labelledby="rel-h">
        <ReleaseList full />
      </section>
      <NowPlaying />
    </div>
  );
}
