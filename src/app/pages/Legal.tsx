// The legal pages: privacy policy, terms of use and accessibility. Written to match what the site
// actually does (see the notes beside each section), so update them together with the code.
import type { ReactNode } from "react";
import { Link } from "react-router";

const UPDATED = "October 25, 2026";

type Section = { id: string; title: string; body: ReactNode };

function LegalPage({ label, title, intro, sections }: { label: string; title: string; intro: ReactNode; sections: Section[] }) {
  return (
    <div className="s-legal s-page">
      <section className="s-panel s-pad s-phead s-legal-head" data-scene="hero" aria-labelledby="legal-title">
        <div className="s-sec-head">
          <span className="s-mono">{label}</span>
          <span className="s-mono">Last updated {UPDATED}</span>
        </div>
        <h1 className="s-legal-title" id="legal-title">
          {title}
        </h1>
        <div className="s-legal-intro">{intro}</div>
      </section>
      <section className="s-panel s-pad s-legal-body" data-scene="about">
        <nav className="s-legal-toc" aria-label="On this page">
          <p className="s-mono">On this page</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="s-legal-text">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>
                <span className="s-num">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

const contact = (
  <>
    the email address on the <Link to="/contact">Contact page</Link>
  </>
);

export function Privacy() {
  return (
    <LegalPage
      label="Privacy policy"
      title="Privacy"
      intro={
        <p className="s-big">
          This site has no accounts, no ads, no analytics and no tracking cookies, and it never sells or shares your personal information. Here is exactly what
          happens when you use it.
        </p>
      }
      sections={[
        {
          id: "who",
          title: "Who runs this site",
          body: (
            <p>
              musicbystripes.com is my site. I'm Stripes, an independent electronic music producer and cover artist based in Virginia, United States. For anything
              about your privacy, write to me at {contact}.
            </p>
          ),
        },
        {
          id: "hosting",
          title: "Visiting the site",
          body: (
            <p>
              The site, its photos and its audio previews are hosted by{" "}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                Cloudflare
              </a>
              . To deliver pages and protect them from abuse, Cloudflare processes technical details of each request, such as your IP address, browser type and the
              page you asked for. I don't use those details to identify or profile you, and the fonts are served from this site, so loading a page doesn't contact
              Google or any other font service.
            </p>
          ),
        },
        {
          id: "device",
          title: "What's stored on your device",
          body: (
            <>
              <p>The site sets no cookies. It keeps a few small settings in your browser's storage, which never leave your device:</p>
              <ul>
                <li>which colour scheme you picked</li>
                <li>whether the intro has already played in this visit</li>
                <li>which steps of a download page you've completed</li>
                <li>a one-time code used while you connect SoundCloud, removed when you come back</li>
              </ul>
              <p>You can clear them at any time in your browser's settings.</p>
            </>
          ),
        },
        {
          id: "downloads",
          title: "Free download pages",
          body: (
            <>
              <p>
                Some free downloads ask you to follow Stripes first. If you choose to connect SoundCloud, you sign in on SoundCloud's own page, and SoundCloud gives
                this site a one-time permission that it uses to follow the Stripes account from yours. That exchange runs on this site's own server, hosted by{" "}
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                  Cloudflare
                </a>
                . I never see your SoundCloud password, and the permission isn't kept afterwards; the server's logs may record that a request happened and whether
                the follow worked. You can unfollow, or remove the app's access, in your SoundCloud settings at any time.
              </p>
              <p>The Instagram step only opens Instagram in a new tab. This site receives nothing from Instagram.</p>
            </>
          ),
        },
        {
          id: "tools",
          title: "The free tools",
          body: (
            <p>
              Files you use in the Audio Silence Padder and the Spotify Art Tester are processed in your browser and are never uploaded. GD Auto Export rewrites the
              link you paste, in your browser, and doesn't send it anywhere.
            </p>
          ),
        },
        {
          id: "third-parties",
          title: "Other services",
          body: (
            <>
              <p>
                Some pages show artwork, thumbnails or videos from other services: cover art from SoundCloud, video thumbnails from YouTube, and YouTube videos on
                the Drums and Designs pages (in YouTube's privacy-enhanced mode). Your browser fetches those directly from those services, which can see your IP
                address, and a YouTube video may store data on your device once you play it.
              </p>
              <p>
                Links to Spotify, Apple Music, SoundCloud, YouTube, Instagram, Deezer, Google Drive and other sites take you to services with their own privacy
                policies.
              </p>
            </>
          ),
        },
        {
          id: "email",
          title: "Emails",
          body: (
            <p>
              If you email me, I get your message and your email address and use them only to reply and to handle what you asked about, such as a commission. I
              keep emails only as long as they're needed for that.
            </p>
          ),
        },
        {
          id: "rights",
          title: "Your rights",
          body: (
            <>
              <p>
                Depending on where you live, including the EU and UK (GDPR) and California, Virginia and other US states, you can ask what personal information I have
                about you, and ask me to correct or delete it. In practice that's usually just emails you've sent. Write to me at {contact} and I'll answer within 30
                days.
              </p>
              <p>
                Where the GDPR applies, I rely on my legitimate interest in running and protecting the site, on your consent when you connect SoundCloud, and on your
                request when I reply to you. You can also complain to your local data protection authority. I don't sell or share personal information, so there's
                nothing to opt out of.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          body: <p>This site isn't directed at children under 13, and I don't knowingly collect their personal information.</p>,
        },
        {
          id: "changes",
          title: "Changes",
          body: <p>If this policy changes, the date at the top changes with it.</p>,
        },
      ]}
    />
  );
}

export function Terms() {
  return (
    <LegalPage
      label="Terms of use"
      title="Terms"
      intro={<p className="s-big">By using this site you agree to these terms. They're short, so please read them.</p>}
      sections={[
        {
          id: "ownership",
          title: "Who owns what",
          body: (
            <p>
              Unless it says otherwise, the music, artwork, photos, videos, the Stripes name and logo, and the design of this site are © Stripes, all rights reserved.
              Please don't copy, re-upload, sell or edit them, or use them to train AI models, without my written permission. Sharing links to the site is always
              fine.
            </p>
          ),
        },
        {
          id: "client-work",
          title: "Client work",
          body: (
            <p>
              Cover art made for record labels and artists is shown here as portfolio work. The releases, their music, titles and logos belong to their artists and
              labels, and collaborators are credited where they worked on a piece.
            </p>
          ),
        },
        {
          id: "downloads",
          title: "Free downloads",
          body: (
            <p>
              Free downloads are for your personal, non-commercial use. Unofficial remixes and edits are shared for free and are never for sale; the original songs
              belong to their owners.
            </p>
          ),
        },
        {
          id: "tools",
          title: "The free tools",
          body: (
            <>
              <p>
                The tools are free and provided "as is", without warranties of any kind. You're responsible for the files you use with them and for having the
                rights to them, and for keeping your own copies.
              </p>
              <p>
                This site isn't affiliated with or endorsed by Spotify or Google. Spotify is a trademark of Spotify AB, and Google Drive is a trademark of Google
                LLC; their names are used only to describe what the tools work with.
              </p>
            </>
          ),
        },
        {
          id: "commissions",
          title: "Commissions",
          body: <p>Commissioned artwork is covered by the quote or agreement for that job. These terms don't replace it.</p>,
        },
        {
          id: "copyright",
          title: "Copyright complaints",
          body: (
            <p>
              If you believe something on this site uses your work without permission, write to me at {contact} with a description of the work, the page it's on,
              and how to reach you. I'll look into it promptly and take it down where that's appropriate.
            </p>
          ),
        },
        {
          id: "links",
          title: "Other sites",
          body: <p>Links to other sites are there for convenience. I don't control those sites and I'm not responsible for them.</p>,
        },
        {
          id: "liability",
          title: "Liability",
          body: (
            <p>
              The site is provided "as is". To the extent the law allows, Stripes isn't liable for indirect or consequential losses arising from your use of the site,
              its downloads or its tools. Nothing here limits rights you have under the law where you live.
            </p>
          ),
        },
        {
          id: "law",
          title: "Governing law",
          body: (
            <p>
              These terms are governed by the laws of the Commonwealth of Virginia, United States, without regard to its conflict-of-law rules. Any dispute about
              them or about the site will be handled by the state or federal courts in Virginia, unless the law where you live gives you the right to bring it
              somewhere else.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes",
          body: <p>These terms may change from time to time; the date at the top shows the latest version.</p>,
        },
      ]}
    />
  );
}

export function Accessibility() {
  return (
    <LegalPage
      label="Accessibility statement"
      title="Accessibility"
      intro={<p className="s-big">This site is meant to work for everyone, whatever device or assistive technology you use.</p>}
      sections={[
        {
          id: "standard",
          title: "Standard",
          body: (
            <>
              <p>This site is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. That includes:</p>
              <ul>
                <li>keyboard navigation with a visible focus outline</li>
                <li>text alternatives for images</li>
                <li>text contrast checked in both colour schemes</li>
                <li>calmer or stopped animation when your device's reduce-motion setting is on</li>
                <li>decorative animation hidden from screen readers</li>
              </ul>
            </>
          ),
        },
        {
          id: "limits",
          title: "Known limitations",
          body: (
            <p>
              Some older pages, including Music, Drums, About, Contact, the tools and the download pages, are still being redesigned and may not meet every guideline
              yet. Embedded players and videos from YouTube and other services come from those services.
            </p>
          ),
        },
        {
          id: "feedback",
          title: "Feedback",
          body: (
            <p>
              If something on the site doesn't work for you, write to me at {contact} with the page and what happened. I'll fix it, or get you the content another
              way.
            </p>
          ),
        },
      ]}
    />
  );
}
