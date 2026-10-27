// About: who I am, a few highlights, who I've made art for, and the press bio to copy.
import { useState } from "react";
import { Link } from "react-router";
import { PageHead } from "../components/PageHead";
import { Photo } from "../components/Photo";
import { photos } from "../data/images";
import { LABELS } from "../data/packs";

const sp = (id: string) => `https://open.spotify.com/artist/${id}`;
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
const BUTTER = sp("5SOSqzQyhsHTTuxAMGPkaO");
const ANDREW = sp("01BNEFdzawMyAXoHVdtyPx");
const E2D2 = sp("4pYWodVn2BToKzPRDXPxPX");
const TOXIC = sp("7IzlaNBh2EWdsR6xIOp9Bb");

const highlights = [
  {
    year: "2025",
    title: "ADE 2025",
    text: (
      <>
        Joined my close friend <A href={TOXIC}>Toxic Wraith</A> on stage at <A href="https://fallbackrecords.com/">Fallback Records</A>' ADE event.
      </>
    ),
  },
  {
    year: "2025",
    title: "Played at Tomorrowland",
    text: (
      <>
        My Ghost Of You remix with <A href={E2D2}>E2D2</A> was played live at Tomorrowland by <A href={ANDREW}>Andrew A</A>.
      </>
    ),
  },
  {
    year: "2025",
    title: "Won the Ghost Of You remix contest",
    text: (
      <>
        <A href={BUTTER}>BUTTER</A> and <A href={ANDREW}>Andrew A</A> picked our DnB remix with <A href={E2D2}>E2D2</A>.
      </>
    ),
  },
];

// for promoters and blogs, in the third person, as it was written
const PRESS = [
  "In 2025, Stripes won BUTTER and Andrew A's Ghost Of You remix contest with a DnB spin alongside E2D2, earning Tomorrowland support from Andrew A, with additional DJ support from well-known names like Toxic Wraith.",
  "Stripes is a US-based electronic music producer who draws on his background as an intense drummer since the age of four. Having honed his production skills through classes at Berklee College of Music and drawing inspiration from influential artists such as Brooks and RudeLies, he has been forging an unmistakable creative identity.",
  "On the side, Stripes works for three record labels, managing releases, overseeing A&R, and designing cover artwork. His music has passed 220,000 streams combined, and he has worked with artists from 22 countries. He has another release coming soon and is a promising talent to watch!",
].join("\n\n");

export function About() {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText(PRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

  return (
    <div className="s-page s-apage">
      <PageHead
        id="about-title"
        label="About"
        aside="Virginia, US"
        title="About"
        lede="Hey! I'm Stripes :)"
        scene="about"
        photo={{ srcs: [photos.portraitAlt.small], pos: photos.portraitAlt.pos }}
      />

      <section className="s-panel s-pad s-pbody s-bio" data-scene="about" aria-labelledby="bio-h">
        <div className="s-bio-text s-prose">
          <h2 className="s-mono" id="bio-h">
            Bio
          </h2>
          <p className="s-big">I'm a US-based electronic music producer, and I've been drumming since I was four.</p>
          <p>
            In 2025 I won <A href={BUTTER}>BUTTER</A> and <A href={ANDREW}>Andrew A</A>'s Ghost Of You remix contest with a DnB spin, alongside <A href={E2D2}>E2D2</A>. Andrew A
            played it at Tomorrowland, and it got more DJ support from names like <A href={TOXIC}>Toxic Wraith</A>.
          </p>
          <p>
            I sharpened my production in classes at Berklee College of Music, and I take a lot from artists like <A href={sp("4mHAu7NX2UNsnGXjviBD9e")}>Brooks</A> and{" "}
            <A href={sp("7hf6L4LN1RTVN66IdBVpPr")}>RudeLies</A>.
          </p>
          <p>
            On the side I work for three record labels, managing releases, overseeing A&amp;R and designing cover art. You can see that work on the <Link to="/designs">Designs</Link>{" "}
            page.
          </p>
          <div className="s-ctas">
            <Link className="s-btn" to="/music">
              Listen ↗
            </Link>
            <Link className="s-btn" to="/contact">
              Get in touch
            </Link>
          </div>
        </div>
        <figure className="s-bio-photo">
          <Photo p={photos.portrait} ratio="4 / 5" sizes="(max-width: 860px) 92vw, 40vw" label="Portrait" />
        </figure>
      </section>

      <section className="s-panel s-pad s-pbody" data-scene="hero" aria-labelledby="hl-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="hl-h">
            Highlights
          </h2>
        </div>
        <dl className="s-stats">
          <div>
            <dd>220k+</dd>
            <dt>Streams across every release combined</dt>
          </div>
          <div>
            <dd>22</dd>
            <dt>Countries I've worked with artists from</dt>
          </div>
        </dl>
        <ol className="s-rules s-timeline s-prose">
          {highlights.map((h) => (
            <li key={h.title}>
              <span className="s-timeline-year">{h.year}</span>
              <span className="s-timeline-title">{h.title}</span>
              <span className="s-timeline-text">{h.text}</span>
            </li>
          ))}
        </ol>
        <p className="s-clients">
          <span className="s-mono">Cover art for</span>
          <span>{[...LABELS, "independent artists"].join(" · ")}</span>
        </p>
      </section>

      <section className="s-panel s-pad s-pbody s-press" data-scene="about" aria-labelledby="press-h">
        <div className="s-sec-head">
          <h2 className="s-mono" id="press-h">
            Press bio
          </h2>
          <button type="button" className="s-btn" onClick={copy} aria-live="polite">
            {copied ? "Copied ✓" : "Copy bio"}
          </button>
        </div>
        <div className="s-press-text">
          {PRESS.split("\n\n").map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
