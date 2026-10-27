// A small chip that appears while anything is playing, so there is always a way to stop it.
// If a clip can't load, it says so briefly and offers the release page instead. The slider sets
// the volume for every preview.
import type React from "react";
import { Link } from "react-router";
import { audio } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { Eq } from "./Eq";

export function NowPlaying() {
  const s = useAudio();
  const on = s.playing || s.unavailable;
  return (
    <div className={"s-np" + (on ? " on" : "")} aria-live="polite" aria-hidden={!on}>
      {s.playing && <Eq on />}
      <div className="s-np-meta">
        <b>{s.track?.title}</b>
        <span>{s.unavailable ? "Preview unavailable" : s.demo ? "Demo beat · preview builds only" : s.track?.sub}</span>
      </div>
      {!s.unavailable && (
        <label className="s-np-vol">
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={s.volume}
            onChange={(e) => audio.setVolume(+e.currentTarget.value)}
            tabIndex={on ? 0 : -1}
            style={{ "--v": `${s.volume * 100}%` } as React.CSSProperties}
          />
        </label>
      )}
      {s.unavailable && s.track?.href ? (
        <Link className="s-btn" to={s.track.href} tabIndex={on ? 0 : -1}>
          Listen ↗
        </Link>
      ) : (
        <button type="button" className="s-btn" onClick={() => audio.stop()} tabIndex={on ? 0 : -1}>
          Stop
        </button>
      )}
    </div>
  );
}
