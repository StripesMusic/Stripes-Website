// One of the big homepage photos, cropped to a ratio around its focal point. Loads the 1200px
// copy on small screens and the 2400px one on large or dense ones. The sizes are long edges,
// and a photo smaller than 1200px has just the one file.
import type { Photo as P } from "../data/images";
import { ImageSlot } from "./ImageSlot";

export function Photo({ p, ratio, sizes, label, className = "", eager }: { p: P; ratio?: string; sizes: string; label: string; className?: string; eager?: boolean }) {
  const smallW = Math.round((p.w * 1200) / Math.max(p.w, p.h));
  return (
    <ImageSlot
      src={p.small}
      srcSet={smallW < p.w ? `${p.small} ${smallW}w, ${p.src} ${p.w}w` : undefined}
      sizes={sizes}
      alt={p.alt}
      ratio={ratio ?? `${p.w} / ${p.h}`}
      pos={p.pos}
      label={label}
      className={className}
      eager={eager}
    />
  );
}
