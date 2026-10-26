// The top of an inner page: full-bleed under the nav like the Designs header, with a label row,
// the big thin title, a one-line lede and whatever links the page wants beside it. An optional
// photo sits faded behind it.
import type { ReactNode } from "react";
import { FadePhoto } from "./FadePhoto";

type Props = {
  id: string;
  label: string;
  aside?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  scene?: string;
  photo?: { srcs: string[]; pos?: string };
  children?: ReactNode;
  className?: string;
};

export function PageHead({ id, label, aside, title, lede, scene = "hero", photo, children, className = "" }: Props) {
  return (
    <section className={"s-panel s-pad s-phead " + className} data-scene={scene} aria-labelledby={id}>
      {photo && (
        <div className="s-fadebox s-phead-bg" aria-hidden="true">
          <FadePhoto srcs={photo.srcs} pos={photo.pos} />
        </div>
      )}
      <div className="s-sec-head">
        <span className="s-mono">{label}</span>
        {aside && <span className="s-mono">{aside}</span>}
      </div>
      <h1 className="s-ptitle" id={id}>
        {title}
      </h1>
      <div className="s-pintro">
        {lede && <p className="s-big">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
