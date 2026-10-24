// A small chip that appears while anything is playing, so there is always a way to stop it.
import { audio } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { Eq } from "./Eq";

export function NowPlaying() {
  const s = useAudio();
  return (
    <div className={"s-np" + (s.playing ? " on" : "")} aria-live="polite" aria-hidden={!s.playing}>
      <Eq on={s.playing} />
      <div className="s-np-meta">
        <b>{s.track?.title}</b>
        <span>{s.demo ? "Demo beat until the clip is uploaded" : s.track?.sub}</span>
      </div>
      <button type="button" className="s-btn" onClick={() => audio.stop()} tabIndex={s.playing ? 0 : -1}>
        Stop
      </button>
    </div>
  );
}
