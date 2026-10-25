import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { PageTransition } from "./PageTransition";
import { StripesMark } from "./StripesMark";

const navLinks = [
  { name: "Music", path: "/music" },
  { name: "Designs", path: "/designs" },
  { name: "Drums", path: "/drums" },
  { name: "About", path: "/about" },
];

const toolsLinks = [
  { name: "GD Auto Export", path: "/tools/gd-auto-export" },
  { name: "Audio Silence Padder", path: "/tools/audio-silence-padder" },
  { name: "Spotify Art Tester", path: "/tools/spotify-art-tester" },
];

const socials = [
  { name: "Spotify", href: "https://open.spotify.com/artist/02OMUOGNd6EwfnSEWgtwEf" },
  { name: "Apple Music", href: "https://music.apple.com/us/artist/stripes/1380328226" },
  { name: "SoundCloud", href: "https://soundcloud.com/musicbystripes" },
  { name: "YouTube", href: "https://www.youtube.com/@musicbystripes" },
  { name: "Instagram", href: "https://instagram.com/musicbystripes" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    setToolsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("s-locked", menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path;
  const isToolsActive = location.pathname.startsWith("/tools");
  // Fangate (/link) pages stand alone, without the nav and footer
  const isLinkPage = location.pathname.startsWith("/link");
  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="s-site">
      {!isLinkPage && (
        <header className={"s-nav s-pad" + (scrolled ? " is-scrolled" : "")}>
          <Link to="/" className="s-brand" aria-label="Stripes, home">
            <StripesMark className="s-brand-mark" />
            <span>STRIPES</span>
          </Link>
          <nav className="s-nav-links" aria-label="Main">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} aria-current={isActive(l.path) ? "page" : undefined}>
                {l.name}
              </Link>
            ))}
            <div className="s-tools-menu" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button
                type="button"
                aria-expanded={toolsOpen}
                aria-current={isToolsActive ? "page" : undefined}
                onClick={() => setToolsOpen((v) => !v)}
              >
                Tools <span aria-hidden="true">{toolsOpen ? "−" : "+"}</span>
              </button>
              <div className={"s-tools-pop" + (toolsOpen ? " open" : "")}>
                {toolsLinks.map((l) => (
                  <Link key={l.path} to={l.path} aria-current={isActive(l.path) ? "page" : undefined} tabIndex={toolsOpen ? 0 : -1}>
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <Link to="/contact" className="s-btn s-nav-cta" aria-current={isActive("/contact") ? "page" : undefined}>
            Contact
          </Link>
          <button type="button" className="s-btn s-nav-menu" aria-expanded={menuOpen} aria-controls="s-menu" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </header>
      )}

      {!isLinkPage && (
        <div id="s-menu" className={"s-menu" + (menuOpen ? " open" : "")} aria-hidden={!menuOpen}>
          <nav className="s-pad" aria-label="Mobile">
            {[{ name: "Home", path: "/" }, ...navLinks, { name: "Contact", path: "/contact" }].map((l) => (
              <Link key={l.path} to={l.path} tabIndex={menuOpen ? 0 : -1} aria-current={isActive(l.path) ? "page" : undefined}>
                {l.name}
              </Link>
            ))}
            <p className="s-mono">Tools</p>
            {toolsLinks.map((l) => (
              <Link key={l.path} to={l.path} className="s-menu-small" tabIndex={menuOpen ? 0 : -1}>
                {l.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className={isLinkPage || isHome ? "" : "s-main"}>
        <PageTransition>{children}</PageTransition>
      </main>

      {!isLinkPage && (
        <footer className="s-footer">
          <div className="s-panel s-pad s-footer-inner">
            <div className="s-footer-top">
              <p className="s-big">Have a release coming up? Let's make its pack.</p>
              <Link className="s-btn s-btn-solid" to="/contact">
                Commission art
              </Link>
            </div>
            <div className="s-footer-cols">
              <div>
                <p className="s-mono">Pages</p>
                <ul>
                  {[{ name: "Home", path: "/" }, ...navLinks, { name: "Contact", path: "/contact" }].map((l) => (
                    <li key={l.path}>
                      <Link to={l.path}>{l.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="s-mono">Tools</p>
                <ul>
                  {toolsLinks.map((l) => (
                    <li key={l.path}>
                      <Link to={l.path}>{l.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="s-mono">Listen</p>
                <ul>
                  {socials.map((l) => (
                    <li key={l.name}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.name} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="s-footer-word" aria-hidden="true">
              {"STRIPES".split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </p>
            <div className="s-footer-base">
              <span className="s-mono">© 2026 Stripes</span>
              <span className="s-mono">Music + cover art</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
