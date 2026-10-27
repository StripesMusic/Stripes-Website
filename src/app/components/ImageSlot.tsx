// An image, or a labelled placeholder while the file doesn't exist yet (or fails to load). With a
// fallback, a failed image tries that file before giving up.
// The empty slots and their paths are listed in data/images.ts.
import { useEffect, useState } from "react";

type Props = {
  src?: string;
  srcSet?: string;
  sizes?: string;
  pos?: string;
  alt?: string;
  ratio?: string;
  label: string;
  hint?: string;
  eager?: boolean;
  className?: string;
  fallback?: string;
};

export function ImageSlot({ src, srcSet, sizes, pos, alt = "", ratio = "1 / 1", label, hint, eager, className = "", fallback }: Props) {
  const [state, setState] = useState<"wait" | "ok" | "empty">(src ? "wait" : "empty");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setState(src ? "wait" : "empty");
    setFailed(false);
  }, [src]);
  const useFallback = failed && !!fallback;

  return (
    <span className={`s-slot ${state === "empty" ? "is-empty" : ""} ${className}`} style={{ aspectRatio: ratio }}>
      {src && state !== "empty" && (
        <img
          src={useFallback ? fallback : src}
          srcSet={useFallback ? undefined : srcSet}
          sizes={srcSet && !useFallback ? sizes : undefined}
          alt={alt}
          style={pos ? { objectPosition: pos } : undefined}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={state === "ok" ? "on" : ""}
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0 && state === "wait") setState("ok");
          }}
          onLoad={() => setState("ok")}
          onError={() => (fallback && !failed ? setFailed(true) : setState("empty"))}
        />
      )}
      {state === "empty" && (
        <span className="s-slot-label" role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
          <span>{label}</span>
          {hint && <span>{hint}</span>}
        </span>
      )}
    </span>
  );
}
