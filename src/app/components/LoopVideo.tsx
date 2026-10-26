// A short silent loop (an animated cover, set visuals) that plays while it's on screen, with a
// button to pause it. Several clips play one after another. If the browser can't play the file,
// the still stays and says so.
import { useEffect, useRef, useState } from "react";

export function LoopVideo({ srcs, poster, label, ratio }: { srcs: string[]; poster: string; label: string; ratio: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(false);
  const userPaused = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const v = ref.current!;
    // React sets muted as a property only; some browsers check the attribute before autoplaying
    v.muted = true;
    v.setAttribute("muted", "");
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // the next clip in the set starts as soon as it's swapped in
  useEffect(() => {
    if (i > 0 && visible.current && !userPaused.current) ref.current?.play().catch(() => {});
  }, [i]);

  const toggle = () => {
    const v = ref.current!;
    userPaused.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <span className={"s-slot s-loop" + (failed ? " is-failed" : "")} style={{ aspectRatio: ratio }}>
      <img src={poster} alt="" loading="lazy" decoding="async" className={"s-loop-poster" + (shown ? "" : " on")} />
      <video
        ref={ref}
        src={srcs[i]}
        muted
        playsInline
        loop={srcs.length === 1}
        preload="none"
        aria-label={label}
        onPlaying={() => {
          setShown(true);
          setPaused(false);
        }}
        onPause={() => setPaused(true)}
        onEnded={() => setI((n) => (n + 1) % srcs.length)}
        onError={() => setFailed(true)}
      />
      {failed ? (
        <span className="s-loop-note s-mono">This clip won't play in this browser</span>
      ) : (
        <button type="button" className="s-loop-btn" onClick={toggle} aria-label={(paused ? "Play " : "Pause ") + label}>
          {paused ? <span className="s-tri s-tri-sm" aria-hidden="true" /> : <span className="s-pause" aria-hidden="true" />}
        </button>
      )}
      {srcs.length > 1 && (
        <span className="s-loop-count s-mono" aria-hidden="true">
          {i + 1}/{srcs.length}
        </span>
      )}
    </span>
  );
}
