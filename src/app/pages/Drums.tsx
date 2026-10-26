// Drums: the newest cover big, the rest beside it, each playing in place.
import { PageHead } from "../components/PageHead";
import { YouTube } from "../components/YouTube";
import { YouTubeIcon } from "../components/icons/Platforms";
import { drumCovers } from "../data/drums";
import { photos } from "../data/images";

const CHANNEL = "https://www.youtube.com/@musicbystripes";

export function Drums() {
  const [latest, ...rest] = drumCovers;
  return (
    <div className="s-page s-dpage">
      <PageHead
        id="drums-title"
        label="Drums"
        aside={
          <>
            <span className="s-num">{drumCovers.length}</span> covers on YouTube
          </>
        }
        title="Drums"
        lede="Drum covers of songs I enjoy, recorded for fun :)"
        scene="drums"
        photo={{ srcs: [photos.drums.small], pos: photos.drums.pos }}
        className="s-dhead"
      >
        <a className="s-btn" href={CHANNEL} target="_blank" rel="noopener noreferrer">
          <YouTubeIcon className="s-gate-ico" />
          Subscribe ↗
        </a>
      </PageHead>

      <section className="s-panel s-pad s-pbody" data-scene="drums" aria-labelledby="covers-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="covers-h">
            Covers
          </h2>
          <span className="s-mono">Newest first</span>
        </div>
        <div className="s-dcovers">
          {[latest, ...rest].map((c, i) => (
            <figure key={c.youtubeId} className={"s-dcover" + (i === 0 ? " is-latest" : "")}>
              <YouTube id={c.youtubeId} title={`${c.title} drum cover`} label="Play cover" className={i === 0 ? "" : "s-yt-sm"} />
              <figcaption>
                <span className="s-dcover-title">{c.title}</span>
                <span className="s-mono">
                  {c.artist} · {c.date}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="s-ctas s-dmore">
          <a className="s-btn" href={CHANNEL} target="_blank" rel="noopener noreferrer">
            More on YouTube ↗
          </a>
        </div>
      </section>
    </div>
  );
}
