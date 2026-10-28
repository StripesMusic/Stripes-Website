// Draft: a player bar along the bottom that stays while you move between pages. It shows the
// track that was played on purpose (hover previews leave it alone), its waveform with the played
// part in lime (click or drag to skip), previous and next through the list it came from, the time,
// the volume and a link to the release. Preview addresses only (lib/drafts.ts).
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { audio } from "../lib/audio";
import { useAudio } from "../lib/useAudio";
import { onFrame } from "../lib/ticker";
import { waveform } from "../lib/waveform";
import { Eq } from "./home/Eq";

const BARS = 120;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// until the real shape loads: a calm, made-up one, so the bar never jumps in height
const placeholder = Array.from({ length: BARS }, (_, i) => 0.25 + 0.15 * Math.sin(i * 0.37) * Math.sin(i * 0.11));

export function PlayerBar() {
  const s = useAudio();
  const track = s.queue[s.qi] ?? null;
  const mine = !!track && s.track?.id === track.id;
  const playing = mine && s.playing;
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const played = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const wave = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPeaks(null);
    if (!track) return;
    let live = true;
    waveform(track.url, BARS).then((p) => live && setPeaks(p));
    return () => {
      live = false;
    };
  }, [track?.url]);

  // progress: written straight to the DOM every frame, so React doesn't re-render 60 times a second
  useEffect(() => {
    if (!track) return;
    return onFrame(() => {
      const { t, d } = mine ? audio.position() : { t: 0, d: 0 };
      const f = d ? t / d : 0;
      if (played.current) played.current.style.clipPath = `inset(0 ${(1 - f) * 100}% 0 0)`;
      if (time.current) time.current.textContent = d ? `${clock(t)} / ${clock(d)}` : "0:00";
      if (wave.current) wave.current.setAttribute("aria-valuenow", String(Math.round(f * 100)));
    });
  }, [track?.id, mine]);

  if (!s.bar || !track) return null;

  const playPause = () => {
    if (playing) audio.pause();
    else if (mine && s.paused) audio.resume();
    else audio.playQueue(s.queue, s.qi);
  };
  const seekAt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mine) return;
    const r = e.currentTarget.getBoundingClientRect();
    audio.seek((e.clientX - r.left) / r.width);
  };
  const bars = peaks ?? placeholder;
  const drawn = (
    <svg viewBox={`0 0 ${BARS * 3} 40`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={i * 3} y={20 - h * 19} width={2} height={Math.max(1, h * 38)} rx={1} />
      ))}
    </svg>
  );

  return (
    <div className="s-pb" role="region" aria-label="Player">
      <div className="s-pb-ctl">
        <button type="button" className="s-icon-btn s-pb-skip" aria-label="Previous" disabled={s.qi <= 0} onClick={() => audio.next(-1)}>
          <span className="s-pb-prev" aria-hidden="true" />
        </button>
        <button type="button" className="s-icon-btn s-pb-play" aria-label={playing ? "Pause" : "Play"} onClick={playPause}>
          {playing ? <span className="s-pb-pause" aria-hidden="true" /> : <span className="s-tri" aria-hidden="true" />}
        </button>
        <button type="button" className="s-icon-btn s-pb-skip" aria-label="Next" disabled={s.qi >= s.queue.length - 1} onClick={() => audio.next(1)}>
          <span className="s-pb-next" aria-hidden="true" />
        </button>
      </div>
      <div className="s-pb-meta">
        <b>
          {playing && <Eq on />}
          {track.title}
        </b>
        <span>{s.unavailable && s.track?.id === track.id ? "Preview unavailable" : track.sub}</span>
      </div>
      <div
        ref={wave}
        className={"s-pb-wave" + (peaks ? " is-real" : "")}
        role="slider"
        tabIndex={0}
        aria-label="Position"
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seekAt(e);
        }}
        onPointerMove={(e) => e.buttons && seekAt(e)}
        onKeyDown={(e) => {
          const { t, d } = audio.position();
          if (!d) return;
          if (e.key === "ArrowRight") audio.seek((t + 5) / d);
          if (e.key === "ArrowLeft") audio.seek((t - 5) / d);
        }}
      >
        <div className="s-pb-wave-base">{drawn}</div>
        <div className="s-pb-wave-played" ref={played}>
          {drawn}
        </div>
      </div>
      <span className="s-pb-time s-num" ref={time}>
        0:00
      </span>
      <label className="s-np-vol s-pb-vol">
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={s.volume}
          onChange={(e) => audio.setVolume(+e.currentTarget.value)}
          style={{ "--v": `${s.volume * 100}%` } as React.CSSProperties}
        />
      </label>
      {track.href && (
        <Link className="s-btn s-pb-go" to={track.href}>
          Release ↗
        </Link>
      )}
      <button type="button" className="s-icon-btn s-pb-close" aria-label="Close the player" onClick={() => audio.close()}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
