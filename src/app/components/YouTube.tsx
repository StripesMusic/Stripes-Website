// A YouTube video that costs nothing until it's played: its thumbnail with a play button,
// swapped for YouTube's privacy-enhanced player (youtube-nocookie) on click.
import { useEffect, useRef, useState } from "react";

export const ytThumb = (id: string, size: "maxresdefault" | "hqdefault" = "maxresdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

export function YouTube({ id, title, label = "Play video", className = "" }: { id: string; title: string; label?: string; className?: string }) {
  const [on, setOn] = useState(false);
  // not every video has a full-size thumbnail; YouTube answers those with a 120px grey placeholder
  const [src, setSrc] = useState(ytThumb(id));
  const [ready, setReady] = useState(false);
  // the button's ring ripples once, the first time it comes into view
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.6 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={"s-slot s-yt " + (seen ? "is-seen " : "") + className} style={{ aspectRatio: "16 / 9" }}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="s-yt-btn" onClick={() => setOn(true)} aria-label={`Play ${title}`}>
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className={ready ? "on" : ""}
            onLoad={(e) => {
              if (e.currentTarget.naturalWidth <= 120 && src !== ytThumb(id, "hqdefault")) setSrc(ytThumb(id, "hqdefault"));
              else setReady(true);
            }}
            onError={() => setSrc(ytThumb(id, "hqdefault"))}
          />
          <span className="s-yt-tag" aria-hidden="true">
            YouTube
          </span>
          <span className="s-yt-play" aria-hidden="true">
            <span className="s-yt-tri" />
            <span className="s-yt-label">{label}</span>
          </span>
        </button>
      )}
    </span>
  );
}

export const ytId = (u = "") => u.match(/(?:[?&]v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
