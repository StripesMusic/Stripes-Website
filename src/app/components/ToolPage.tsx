// The frame every tool page shares: the page head, the tool itself in one hairline panel, then
// how to use it and why.
import type { ReactNode } from "react";
import { Link } from "react-router";
import { PageHead } from "./PageHead";

export const tools = [
  { name: "GD Auto Export", path: "/tools/gd-auto-export", text: "Turn Google Drive links into direct downloads" },
  { name: "Audio Silence Padder", path: "/tools/audio-silence-padder", text: "Add silence to the start or end of a track" },
  { name: "Spotify Art Tester", path: "/tools/spotify-art-tester", text: "Preview your cover across Spotify views" },
];

type Props = { path: string; title: ReactNode; lede: string; note: string; children: ReactNode; how?: ReactNode; why?: ReactNode; wide?: boolean };

export function ToolPage({ path, title, lede, note, children, how, why, wide }: Props) {
  const n = tools.findIndex((t) => t.path === path) + 1;
  return (
    <div className="s-page s-tpage">
      <PageHead id="tool-title" label={`Tool ${String(n).padStart(2, "0")} · Free`} aside={<Link to="/tools">All tools</Link>} title={title} lede={lede}>
        <p className="s-mono s-tool-note">{note}</p>
      </PageHead>
      <section className="s-panel s-pad s-pbody" data-scene="olive" aria-label="Tool">
        <div className={"s-tool" + (wide ? " is-wide" : "")}>{children}</div>
        {(how || why) && (
          <div className="s-tool-info s-prose">
            {how && (
              <div>
                <h2 className="s-mono">How to use it</h2>
                {how}
              </div>
            )}
            {why && (
              <div>
                <h2 className="s-mono">Why</h2>
                {why}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
