// A release's own page (/link/<slug>): where to stream it, and its free download, which unlocks
// once the visitor follows on SoundCloud and Instagram. Every release uses this one page; what
// each shows comes from data/fangates.ts. It stands alone, without the site's nav.
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { Gate, GateTrack } from "../data/fangates";
import { releases, clipUrl } from "../data/releases";
import { trackFor } from "../components/home/ReleaseList";
import { ImageSlot } from "../components/ImageSlot";
import { StripesMark } from "../components/StripesMark";
import { Eq } from "../components/home/Eq";
import { PLATFORMS, SoundCloudIcon, InstagramIcon } from "../components/icons/Platforms";
import { audio, type Track } from "../lib/audio";
import { useAudio } from "../lib/useAudio";
import { startSoundCloudFollow } from "../lib/soundcloud";

const STRIPES_IG = "https://www.instagram.com/musicbystripes/";

// progress is kept per page, under the keys the old pages used, so nobody has to follow twice
const read = (k: string) => {
  try {
    return localStorage.getItem(k) === "true";
  } catch {
    return false;
  }
};
const save = (k: string) => {
  try {
    localStorage.setItem(k, "true");
  } catch {
    /* private mode: it just won't be remembered */
  }
};

type Step = { key: string; label: string; icon: "sc" | "ig"; done: boolean; busy?: boolean; act: () => void };

export function Fangate({ g }: { g: Gate }) {
  const path = `/link/${g.slug}`;
  const [params, setParams] = useSearchParams();
  const [sc, setSc] = useState(() => read(`sc_followed_${path}`));
  const [busy, setBusy] = useState(false);
  const igKeys = [`ig_followed_${path}`, ...(g.follows ?? []).map((f) => `ig_${f.name.toLowerCase()}_followed_${path}`)];
  const [ig, setIg] = useState(() => igKeys.map(read));
  const [nudge, setNudge] = useState(0);
  const stepsRef = useRef<HTMLOListElement>(null);
  const s = useAudio();

  // back from SoundCloud
  useEffect(() => {
    if (params.get("sc_success") !== "true") return;
    setSc(true);
    save(`sc_followed_${path}`);
    const next = new URLSearchParams(params);
    next.delete("sc_success");
    setParams(next, { replace: true });
  }, [params, setParams, path]);

  const followSc = async () => {
    if (sc || busy) return;
    setBusy(true);
    // if SoundCloud can't be opened, the step counts as done: the download shouldn't depend on it
    if (!(await startSoundCloudFollow(location.pathname + location.search))) {
      setBusy(false);
      setSc(true);
      save(`sc_followed_${path}`);
    }
  };
  const followIg = (i: number, href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
    if (ig[i]) return;
    save(igKeys[i]);
    setIg((v) => v.map((x, j) => (j === i ? true : x)));
  };

  const hasDownload = !!(g.download || g.tracks);
  const gated = hasDownload && g.gate !== false;
  const steps: Step[] = gated
    ? [
        { key: "sc", label: "Follow Stripes on SoundCloud", icon: "sc", done: sc, busy, act: followSc },
        { key: "ig", label: "Follow Stripes on Instagram", icon: "ig", done: ig[0], act: () => followIg(0, STRIPES_IG) },
        ...(g.follows ?? []).map((f, i): Step => ({ key: f.name, label: `Follow ${f.name} on Instagram`, icon: "ig", done: ig[i + 1], act: () => followIg(i + 1, f.href) })),
      ]
    : [];
  const done = steps.filter((x) => x.done).length;
  const unlocked = done === steps.length;

  const download = (url: string) => {
    if (unlocked) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setNudge((n) => n + 1);
  };
  // a locked download points at what's left to do (after the steps re-render, so their flash replays)
  useEffect(() => {
    if (!nudge) return;
    stepsRef.current?.querySelector<HTMLButtonElement>("button:not(.is-done)")?.focus({ preventScroll: true });
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [nudge]);

  const release = releases.find((r) => r.link === path);
  const single = release && !g.tracks ? trackFor(release) : null;
  const playing = (t: Track | null) => !!t && s.playing && s.track?.id === t.id;
  const tracks: (GateTrack & { t: Track })[] = (g.tracks ?? []).map((t) => ({
    ...t,
    t: { id: `${path}#${t.n}`, title: t.title, sub: t.artists, url: clipUrl(t.preview), href: path },
  }));
  const lead = single ?? tracks[0]?.t ?? null;

  const blurb =
    g.blurb ??
    (g.tracks
      ? "Stream the EP anywhere, or download every track's masters free."
      : hasDownload
        ? "Stream it anywhere, or download the masters free, extended mix included."
        : `Stream it on ${PLATFORMS[g.links[0][0]].name}.`);

  return (
    <div className="s-gate" data-scene="ep">
      <div className="s-gate-bg" aria-hidden="true">
        <img src={g.cover} alt="" decoding="async" />
      </div>
      <div className="s-gate-top s-pad">
        <Link to="/" className="s-brand" aria-label="Stripes, home">
          <StripesMark className="s-brand-mark" />
          <span>STRIPES</span>
        </Link>
        <Link to="/music" className="s-btn">
          All music
        </Link>
      </div>

      <div className="s-gate-in s-pad">
        <div className="s-gate-art">
          <ImageSlot src={g.cover} alt={`${g.title} cover`} label="Cover" eager />
          {lead && (
            <button type="button" className="s-btn s-gate-preview" aria-pressed={playing(lead)} onClick={() => audio.toggle(lead)}>
              {playing(lead) ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
              {playing(lead) ? "Stop" : g.tracks ? `Preview "${lead.title}"` : "Preview"}
            </button>
          )}
        </div>

        <div className="s-gate-info">
          <p className="s-mono">
            {g.type} · {g.date}
          </p>
          <h1 className="s-gate-title">{g.title}</h1>
          <p className="s-gate-artists">{g.artists}</p>
          <p className="s-gate-blurb">{blurb}</p>

          {hasDownload && (
            <section className="s-gate-block" aria-labelledby="gate-dl">
              <div className="s-gate-head">
                <h2 className="s-mono" id="gate-dl">
                  Free download
                </h2>
                {gated && (
                  <span className={"s-mono s-gate-count" + (unlocked ? " is-on" : "")} aria-live="polite">
                    {unlocked ? "Unlocked" : `${done} of ${steps.length} done`}
                  </span>
                )}
              </div>

              {gated && (
                <ol className={"s-gate-steps" + (nudge ? " is-nudged" : "")} ref={stepsRef} key={nudge}>
                  {steps.map((st, i) => (
                    <li key={st.key}>
                      <button type="button" className={"s-gate-step" + (st.done ? " is-done" : "")} onClick={st.act} disabled={st.busy}>
                        <span className="s-num">{String(i + 1).padStart(2, "0")}</span>
                        {st.icon === "sc" ? <SoundCloudIcon className="s-gate-ico" /> : <InstagramIcon className="s-gate-ico" />}
                        <span className="s-gate-step-label">{st.label}</span>
                        <span className="s-gate-state">{st.done ? "✓" : st.busy ? "Opening…" : "Follow ↗"}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              {g.tracks ? (
                <ol className="s-gate-tracks">
                  {tracks.map((t) => (
                    <li key={t.n} className={playing(t.t) ? "is-playing" : ""}>
                      <button type="button" className="s-icon-btn" aria-pressed={playing(t.t)} aria-label={(playing(t.t) ? "Stop " : "Preview ") + t.title} onClick={() => audio.toggle(t.t)}>
                        {playing(t.t) ? <Eq on /> : <span className="s-tri" aria-hidden="true" />}
                      </button>
                      <span className="s-num">{t.n}</span>
                      <span className="s-gate-track">
                        <span>{t.title}</span>
                        <span className="s-muted">{t.artists}</span>
                      </span>
                      <button type="button" className={"s-btn" + (unlocked ? " s-btn-solid" : "")} onClick={() => download(t.download)} aria-label={`${unlocked ? "Download" : "Unlock"} ${t.title}`}>
                        {unlocked ? "Download" : "Unlock"}
                      </button>
                    </li>
                  ))}
                </ol>
              ) : gated ? (
                <button type="button" className={"s-btn s-gate-go" + (unlocked ? " s-btn-solid" : "")} onClick={() => download(g.download!)}>
                  {unlocked ? (g.what === "pack" ? "Download the pack" : "Download") : steps.length === 2 ? "Follow both to unlock" : "Follow to unlock"}
                </button>
              ) : (
                <a className="s-btn s-btn-solid s-gate-go" href={g.download} target="_blank" rel="noopener noreferrer">
                  Get it on Hypeddit ↗
                </a>
              )}
            </section>
          )}

          <section className="s-gate-block" aria-labelledby="gate-listen">
            <div className="s-gate-head">
              <h2 className="s-mono" id="gate-listen">
                {g.what === "pack" ? "Hear the mix" : "Stream"}
              </h2>
            </div>
            <ul className="s-gate-links">
              {g.links.map(([p, url]) => {
                const { name, Icon } = PLATFORMS[p];
                return (
                  <li key={p}>
                    <a className="s-btn" href={url} target="_blank" rel="noopener noreferrer">
                      <Icon className="s-gate-ico" />
                      {name} ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
