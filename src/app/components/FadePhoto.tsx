// A decorative photo faded into the colours of the section behind it (see .s-fade in stripes.css).
// It stays invisible until it loads, tries each source in turn, and shows nothing if none load.
import { useState } from "react";

type Props = { srcs: string[]; pos?: string; className?: string; on?: boolean; onFail?: () => void };

export function FadePhoto({ srcs, pos, className = "", on = true, onFail }: Props) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  if (i >= srcs.length) return null;
  return (
    <img
      src={srcs[i]}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="low"
      className={`s-fade ${loaded && on ? "on" : ""} ${className}`}
      style={pos ? { objectPosition: pos } : undefined}
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setLoaded(false);
        if (i + 1 >= srcs.length) onFail?.();
        setI(i + 1);
      }}
    />
  );
}
