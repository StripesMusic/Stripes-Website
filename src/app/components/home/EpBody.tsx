// The Out Of Control EP: its cover, then the tracklist with a preview on each track. On the
// homepage and the Music page; the Music page links to its free downloads instead of back to itself.
import { Link } from "react-router";
import { ep, clipUrl } from "../../data/releases";
import { audio, type Track } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { ImageSlot } from "../ImageSlot";
import { Eq } from "./Eq";
import { isPreview } from "../../lib/drafts";

export const epTracks: Track[] = ep.tracks.map((t) => ({ id: `${ep.link}#${t.n}`, title: t.title, sub: t.artists, url: clipUrl(t.preview), href: ep.link }));

// draft: a track plays on through the rest of the EP in the player bar
const playFrom = (i: number, on: boolean) => {
  if (!isPreview()) return audio.toggle(epTracks[i]);
  if (on) audio.pause();
  else audio.playQueue(epTracks, i);
};

export function EpBody({ onMusic = false }: { onMusic?: boolean }) {
  const s = useAudio();
  const playing = (t: Track) => s.playing && s.track?.id === t.id;
  return (
    <div className="s-ep-body s-pad">
      <Link to={ep.link} className="s-ep-cover">
        <ImageSlot src={ep.image} alt={`${ep.title} ${ep.type} cover`} label="Cover" />
      </Link>
      <div className="s-ep-info">
        <p className="s-mono">
          New {ep.type} · {ep.date}
        </p>
        <h2 className="s-ep-title">{ep.title}</h2>
        <ol className="s-ep-tracks">
          {ep.tracks.map((t, i) => {
            const tr = epTracks[i], on = playing(tr);
            return (
              <li key={t.n} className={on ? "is-playing" : ""}>
                <button type="button" aria-pressed={on} aria-label={on ? `Stop ${t.title}` : `Preview ${t.title}`} onClick={() => playFrom(i, on)}>
                  <span className="s-num">{t.n}</span>
                  <span className="s-ep-track">
                    <span>{t.title}</span>
                    <span className="s-muted">{t.artists}</span>
                  </span>
                  <span className="s-ep-tplay" aria-hidden="true">
                    {on ? <Eq on /> : <span className="s-tri s-tri-sm" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="s-ctas">
          {onMusic ? (
            <>
              <button type="button" className="s-btn" aria-pressed={playing(epTracks[0])} onClick={() => audio.toggle(epTracks[0], { loop: true })}>
                {playing(epTracks[0]) ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
                {playing(epTracks[0]) ? "Stop" : "Play"}
              </button>
              <Link className="s-btn s-btn-solid" to={ep.link}>
                Stream and free download ↗
              </Link>
            </>
          ) : (
            <>
              <Link className="s-btn s-btn-solid" to={ep.link}>
                Listen to the {ep.type} ↗
              </Link>
              <Link className="s-btn" to="/music">
                All music
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
