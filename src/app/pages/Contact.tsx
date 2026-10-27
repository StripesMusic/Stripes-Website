// Contact: email and Discord, each with a copy button, what to send for cover art, and socials.
import { useState } from "react";
import { PageHead } from "../components/PageHead";
import { PLATFORMS } from "../components/icons/Platforms";
import { socials } from "../data/socials";
import { adePhotos, photos } from "../data/images";

const EMAIL = "jake@musicbystripes.com";
const DISCORD = "@musicbystripes";
const BRIEF = encodeURIComponent("Release title and date:\nArtist / label:\nGenre:\nWhat you need (cover, animated cover, lyric video, flyers…):\nReferences:\n");
const icons: Record<string, (typeof PLATFORMS)[keyof typeof PLATFORMS]> = {
  Instagram: PLATFORMS.instagram,
  Spotify: PLATFORMS.spotify,
  "Apple Music": PLATFORMS.apple,
  SoundCloud: PLATFORMS.soundcloud,
  YouTube: PLATFORMS.youtube,
};

function Copy({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  return (
    <button type="button" className={"s-btn s-copy" + (done ? " is-done" : "")} onClick={copy} aria-label={done ? `${label} copied` : `Copy ${label}`}>
      {done ? "Copied ✓" : "Copy"}
    </button>
  );
}

export function Contact() {
  return (
    <div className="s-page s-cpage">
      <PageHead
        id="contact-title"
        label="Contact"
        aside="Virginia, US"
        title="Contact"
        lede="Email or Discord is best :)"
        photo={{ srcs: [adePhotos.theatreTram.src, photos.amsterdamDoor.small], pos: adePhotos.theatreTram.pos }}
      />

      <section className="s-panel s-pad s-pbody" data-scene="about" aria-label="Ways to reach me">
        <ul className="s-rules s-reach">
          <li>
            <span className="s-mono">Email</span>
            <a className="s-reach-big" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <Copy text={EMAIL} label="email address" />
          </li>
          <li>
            <span className="s-mono">Discord</span>
            <span className="s-reach-big">{DISCORD}</span>
            <Copy text={DISCORD} label="Discord name" />
          </li>
        </ul>

        <div className="s-brief">
          <div>
            <h2 className="s-mono">Commissioning cover art?</h2>
            <p className="s-big">Send the release date, the genre and two or three references you like.</p>
          </div>
          <a className="s-btn s-btn-solid" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Cover art commission")}&body=${BRIEF}`}>
            Start an email ↗
          </a>
        </div>
      </section>

      <section className="s-panel s-pad s-pbody" data-scene="hero" aria-labelledby="follow-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="follow-h">
            Follow
          </h2>
          <span className="s-mono">{DISCORD}</span>
        </div>
        <ul className="s-pills">
          {socials.map((l) => {
            const Icon = icons[l.name]?.Icon;
            return (
              <li key={l.name}>
                <a className="s-btn" href={l.href} target="_blank" rel="noopener noreferrer">
                  {Icon && <Icon />}
                  {l.name} ↗
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
