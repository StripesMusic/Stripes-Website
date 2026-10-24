import { Link, useLocation } from "react-router";
import {
  Menu,
  X,
  Youtube,
  Music,
  Play,
  ChevronDown,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}
import { useState, useEffect } from "react";
import { PageTransition } from "./PageTransition";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] =
    useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Music", path: "/music" },
    { name: "Designs", path: "/designs" },
    { name: "Drums", path: "/drums" },
  ];

  const toolsLinks = [
    { name: "GD Auto Export", path: "/tools/gd-auto-export" },
    { name: "Audio Silence Padder", path: "/tools/audio-silence-padder" },
    { name: "Spotify Art Tester", path: "/tools/spotify-art-tester" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isToolsActive = () => {
    return location.pathname.startsWith("/tools");
  };

  // Check if we're on a link/fangate page
  const isLinkPage = location.pathname.startsWith("/link");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation - Hidden on link pages */}
      {!isLinkPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2 group"
              >
                <img
                  src="https://assets.musicbystripes.com/stripes_logo.webp"
                  alt="Stripes Logo"
                  className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity mx-[6px] my-[0px]"
                />
                <span className="text-2xl font-black tracking-tight group-hover:opacity-80 transition-opacity font-[Barlow]">
                  STRIPES
                </span>
              </Link>

              {/* Separator */}
              <div className="hidden md:block flex-1 h-px ml-14 mr-8 bg-gradient-to-r from-[var(--lime-green)]/80 via-[var(--lime-green)]/20 to-transparent"></div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm uppercase tracking-wider font-semibold transition-all font-[Barlow] ${
                      isActive(link.path)
                        ? "text-[var(--lime-green)]"
                        : "text-white hover:text-[var(--golden-yellow)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Tools Dropdown */}
                <div className="relative">
                  <button
                    className={`text-sm uppercase tracking-wider font-semibold transition-all font-[Barlow] flex items-center gap-1 ${
                      isToolsActive()
                        ? "text-[var(--lime-green)]"
                        : "text-white hover:text-[var(--golden-yellow)]"
                    }`}
                    onClick={() =>
                      setToolsDropdownOpen(!toolsDropdownOpen)
                    }
                  >
                    Tools
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {toolsDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-56 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-[0_18px_55px_rgba(0,0,0,0.55)] overflow-hidden">
                      {toolsLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() =>
                            setToolsDropdownOpen(false)
                          }
                          className="block px-4 py-3 text-sm text-white hover:bg-[var(--lime-green)]/20 hover:text-[var(--lime-green)] transition-colors font-[Barlow]"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/contact"
                  className={`text-sm uppercase tracking-wider font-semibold transition-all font-[Barlow] ${
                    isActive("/contact")
                      ? "text-[var(--lime-green)]"
                      : "text-white hover:text-[var(--golden-yellow)]"
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white"
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]">
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm uppercase tracking-wider font-semibold py-2 transition-all ${
                      isActive(link.path)
                        ? "text-[var(--lime-green)]"
                        : "text-white hover:text-[var(--golden-yellow)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Tools Section */}
                <div>
                  <button
                    className={`w-full text-left text-sm uppercase tracking-wider font-semibold py-2 transition-all flex items-center justify-between ${
                      isToolsActive()
                        ? "text-[var(--lime-green)]"
                        : "text-white hover:text-[var(--golden-yellow)]"
                    }`}
                    onClick={() =>
                      setToolsDropdownOpen(!toolsDropdownOpen)
                    }
                  >
                    Tools
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {toolsDropdownOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      {toolsLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className="block text-sm py-2 text-gray-400 hover:text-[var(--lime-green)] transition-colors font-[Barlow]"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm uppercase tracking-wider font-semibold py-2 transition-all ${
                    isActive("/contact")
                      ? "text-[var(--lime-green)]"
                      : "text-white hover:text-[var(--golden-yellow)]"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className={isLinkPage ? "" : "pt-20"}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer - Hidden on link pages */}
      {!isLinkPage && (
        <footer className="bg-black border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="https://assets.musicbystripes.com/stripes_logo.webp"
                  alt="Stripes Logo"
                  className="h-10 w-auto object-contain mx-[6px] my-[0px]"
                />
                <span className="text-xl font-black font-[Barlow]">
                  STRIPES
                </span>
              </div>
              <div className="text-gray-400 text-sm font-[Barlow]">
                © 2026 Stripes. All rights reserved.
              </div>
              <div className="flex gap-6 items-center">
                <a
                  href="https://open.spotify.com/artist/02OMUOGNd6EwfnSEWgtwEf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--lime-green)] transition-colors"
                  aria-label="Spotify"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
                <a
                  href="https://music.apple.com/us/artist/stripes/1380328226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--lime-green)] transition-colors"
                  aria-label="Apple Music"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 387.34 387.33"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Apple Music"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M193.67,0C86.71,0,0,86.71,0,193.66s86.71,193.67,193.67,193.67,193.67-86.71,193.67-193.67S300.63,0,193.67,0ZM278.52,250.52c0,4.56-.04,8.69-1,13.26-.93,4.43-2.62,8.6-5.24,12.35-2.61,3.74-5.95,6.81-9.85,9.11-3.94,2.33-8.08,3.66-12.5,4.55-8.3,1.67-13.98,2.05-19.31.98-5.14-1.04-9.5-3.4-12.99-6.6-5.17-4.73-8.39-11.13-9.09-17.82-.82-7.84,1.78-16.21,7.67-22.38,2.97-3.12,6.7-5.58,11.68-7.51,5.21-2.02,10.96-3.23,19.8-5.01,2.33-.47,4.66-.94,6.99-1.41,3.07-.62,5.69-1.4,7.81-3.99,2.14-2.6,2.17-5.78,2.17-8.92v-79.29c0-6.07-2.73-7.72-8.52-6.61-4.15.81-93.09,18.75-93.09,18.75-5.02,1.22-6.78,2.86-6.78,9.08v116.15c0,4.56-.23,8.69-1.19,13.26-.93,4.43-2.62,8.6-5.24,12.35-2.61,3.74-5.95,6.81-9.85,9.11-3.94,2.33-8.08,3.72-12.5,4.61-8.3,1.68-13.98,2.05-19.31.98-5.14-1.03-9.5-3.46-12.99-6.66-5.17-4.73-8.18-11.13-8.88-17.82-.82-7.84,1.57-16.21,7.46-22.38,2.97-3.12,6.7-5.58,11.68-7.51,5.21-2.02,10.96-3.23,19.8-5.01,2.33-.47,4.66-.94,6.99-1.41,3.07-.62,5.69-1.4,7.81-3.99,2.12-2.59,2.37-5.63,2.37-8.76V108.06c0-1.8.15-3.02.24-3.62.43-2.82,1.56-5.24,3.6-6.95,1.69-1.42,3.88-2.41,6.67-3h.04s107-21.6,107-21.6c.93-.19,8.66-1.56,9.53-1.64,5.79-.5,9.04,3.3,9.02,9.46v169.81Z"
                    />
                  </svg>
                </a>
                <a
                  href="https://soundcloud.com/musicbystripes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--lime-green)] transition-colors"
                  aria-label="SoundCloud"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 300 300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.492,208.896c0.619,0,1.143-0.509,1.232-1.226l3.365-26.671l-3.355-27.278c-0.1-0.717-0.623-1.23-1.242-1.23c-0.635,0-1.176,0.524-1.26,1.23l-2.941,27.278l2.941,26.662C13.316,208.377,13.857,208.896,14.492,208.896z"/>
                    <path d="M3.397,198.752c0.608,0,1.101-0.473,1.19-1.18l2.608-16.574l-2.608-16.884c-0.09-0.685-0.582-1.18-1.19-1.18c-0.635,0-1.127,0.495-1.217,1.19L0,180.999l2.18,16.569C2.27,198.269,2.762,198.752,3.397,198.752z"/>
                    <path d="M27.762,148.644c-0.08-0.867-0.715-1.5-1.503-1.5c-0.782,0-1.418,0.633-1.491,1.5l-2.811,32.355l2.811,31.174c0.073,0.862,0.709,1.487,1.491,1.487c0.788,0,1.423-0.625,1.503-1.487l3.18-31.174L27.762,148.644z"/>
                    <path d="M38.152,214.916c0.922,0,1.668-0.759,1.758-1.751l3.005-32.156l-3.005-33.258c-0.09-0.999-0.836-1.749-1.758-1.749c-0.935,0-1.692,0.751-1.756,1.754l-2.656,33.253l2.656,32.156C36.46,214.158,37.217,214.916,38.152,214.916z"/>
                    <path d="M50.127,215.438c1.074,0,1.936-0.86,2.025-2.011l-0.01,0.008l2.83-32.426l-2.83-30.857c-0.08-1.132-0.941-2.005-2.016-2.005c-1.09,0-1.947,0.873-2.012,2.014l-2.502,30.849l2.502,32.418C48.18,214.578,49.037,215.438,50.127,215.438z"/>
                    <path d="M67.132,181.017l-2.655-50.172c-0.074-1.272-1.065-2.286-2.281-2.286c-1.207,0-2.195,1.013-2.269,2.286l-2.35,50.172l2.35,32.418c0.074,1.278,1.063,2.278,2.269,2.278c1.217,0,2.207-1,2.281-2.278v0.009L67.132,181.017z"/>
                    <path d="M74.386,215.766c1.339,0,2.45-1.111,2.513-2.529v0.021l2.482-32.233l-2.482-61.656c-0.063-1.418-1.174-2.529-2.513-2.529c-1.37,0-2.471,1.111-2.545,2.529l-2.185,61.656l2.195,32.222C71.915,214.655,73.016,215.766,74.386,215.766z"/>
                    <path d="M86.645,111.435c-1.508,0-2.725,1.238-2.787,2.799l-2.033,66.801l2.033,31.884c0.063,1.553,1.279,2.783,2.787,2.783c1.504,0,2.73-1.22,2.783-2.788v0.016l2.307-31.895l-2.307-66.801C89.375,112.663,88.148,111.435,86.645,111.435z"/>
                    <path d="M99.01,215.766c1.656,0,2.975-1.336,3.037-3.056v0.019l2.133-31.693l-2.133-69.045c-0.063-1.714-1.381-3.056-3.037-3.056c-1.666,0-3.005,1.342-3.031,3.056l-1.916,69.045l1.916,31.693C96.005,214.43,97.344,215.766,99.01,215.766z"/>
                    <path d="M111.477,215.734c1.787,0,3.237-1.463,3.291-3.318v0.029l1.963-31.404l-1.963-67.289c-0.054-1.854-1.504-3.311-3.291-3.311c-1.8,0-3.25,1.456-3.303,3.311l-1.725,67.289l1.736,31.389C108.227,214.271,109.677,215.734,111.477,215.734z"/>
                    <path d="M129.359,181.041l-1.777-64.836c-0.043-2-1.609-3.571-3.551-3.571c-1.947,0-3.514,1.571-3.555,3.584l-1.594,64.823l1.594,31.198c0.041,1.984,1.607,3.556,3.555,3.556c1.941,0,3.508-1.572,3.551-3.585v0.029L129.359,181.041z"/>
                    <path d="M136.682,215.853c2.064,0,3.773-1.717,3.805-3.828v0.017l1.613-30.984l-1.613-77.153c-0.031-2.119-1.74-3.833-3.805-3.833c-2.063,0-3.767,1.722-3.809,3.844l-1.434,77.111l1.434,31.016C132.915,214.136,134.619,215.853,136.682,215.853z"/>
                    <path d="M149.291,92.814c-2.229,0-4.037,1.849-4.074,4.103l-1.667,84.151l1.677,30.526c0.027,2.225,1.836,4.068,4.064,4.068c2.195,0,4.037-1.844,4.047-4.105v0.037l1.82-30.526l-1.82-84.151C153.328,94.655,151.486,92.814,149.291,92.814z"/>
                    <path d="M160.82,215.882c0.09,0.008,101.623,0.056,102.275,0.056c20.385,0,36.904-16.722,36.904-37.357c0-20.624-16.52-37.349-36.904-37.349c-5.059,0-9.879,1.034-14.275,2.907c-2.922-33.671-30.815-60.077-64.842-60.077c-8.318,0-16.429,1.662-23.593,4.469c-2.788,1.09-3.534,2.214-3.556,4.392v118.539C156.861,213.752,158.607,215.655,160.82,215.882z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@musicbystripes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--lime-green)] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/musicbystripes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[var(--lime-green)] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}