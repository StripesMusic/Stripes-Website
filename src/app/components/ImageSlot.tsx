// An image, or a labelled placeholder while the file doesn't exist yet (or fails to load).
// The empty slots and their paths are listed in data/images.ts.
import { useEffect, useState } from "react";

type Props = {
  src?: string;
  alt?: string;
  ratio?: string;
  label: string;
  hint?: string;
  eager?: boolean;
  className?: string;
};

export function ImageSlot({ src, alt = "", ratio = "1 / 1", label, hint, eager, className = "" }: Props) {
  const [state, setState] = useState<"wait" | "ok" | "empty">(src ? "wait" : "empty");
  useEffect(() => setState(src ? "wait" : "empty"), [src]);

  return (
    <span className={`s-slot ${state === "empty" ? "is-empty" : ""} ${className}`} style={{ aspectRatio: ratio }}>
      {src && state !== "empty" && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={state === "ok" ? "on" : ""}
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0 && state === "wait") setState("ok");
          }}
          onLoad={() => setState("ok")}
          onError={() => setState("empty")}
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
