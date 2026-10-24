import { Play, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { releases } from "../data/releases";
import { SpotifyLogo } from "../components/icons/SpotifyLogo";
import { AppleMusicLogo } from "../components/icons/AppleMusicLogo";
import { SoundCloudLogo } from "../components/icons/SoundCloudLogo";

export function Music() {
  // Latest releases from home page
  const latestReleases = releases;

  const playlists = [
    {
      name: "Spotify",
      followers: "300+",
      color: "var(--lime-green)",
    },
    {
      name: "Apple Music",
      followers: "idk",
      color: "var(--golden-yellow)",
    },
    {
      name: "SoundCloud",
      followers: "400+",
      color: "var(--sky-blue)",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://assets.musicbystripes.com/music_page_background.png"
            alt="Music Background"
            className="w-full h-full object-cover opacity-30"
            style={{ objectPosition: "center center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            MY{" "}
            <span style={{ color: "var(--lime-green)" }}>
              MUSIC
            </span>
          </h1>
          <p
            className="max-w-3xl text-[24px] font-[Barlow]"
            style={{ color: "var(--golden-yellow)" }}
          >
            My complete discography
          </p>
        </div>
      </section>

      {/* Streaming Platforms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-black mb-12 text-center"
            style={{ color: "var(--lime-green)" }}
          >
            LISTEN ON
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {playlists.map((platform, index) => (
              <a
                key={index}
                href={
                  platform.name === "Spotify"
                    ? "https://open.spotify.com/artist/02OMUOGNd6EwfnSEWgtwEf?si=F7uY3bj6RRKvdzRk-ZyF8g"
                    : platform.name === "Apple Music"
                      ? "https://music.apple.com/artist/stripes/1380328226"
                      : platform.name === "SoundCloud"
                        ? "https://soundcloud.com/musicbystripes"
                        : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-8 rounded-xl border border-white/10 bg-zinc-900 hover:border-[var(--lime-green)] transition-all group cursor-pointer"
              >
                {platform.name === "Spotify" && (
                  <SpotifyLogo
                    className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform"
                    style={{ color: platform.color }}
                  />
                )}
                {platform.name === "Apple Music" && (
                  <AppleMusicLogo
                    className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform"
                    style={{ color: platform.color }}
                  />
                )}
                {platform.name === "SoundCloud" && (
                  <SoundCloudLogo
                    className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform"
                    style={{ color: platform.color }}
                  />
                )}
                <h3 className="text-2xl font-black mb-2">
                  {platform.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {platform.followers} Followers
                </p>
                <div
                  className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                  style={{ color: "var(--lime-green)" }}
                >
                  <span>Follow</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Discography Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-black mb-12 text-center"
            style={{ color: "var(--lime-green)" }}
          >
            DISCOGRAPHY
          </h2>

          {/* EP Card — full-width, reference-style tracklist */}
          <Link
            to="/link/outofcontrolep"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 hover:border-[var(--lime-green)] transition-all block mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[280px]">
              {/* Left: EP art with right-fade */}
              <div className="relative min-h-[220px] sm:min-h-0 overflow-hidden">
                {/* Artwork — objectPosition controls framing: X% = left/right, Y% = up/down */}
                <img
                  src="https://assets.musicbystripes.com/releases%20cover%20arts/Out_Of_Control_Artwork.jpg"
                  alt="EP Artwork"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "30% 73%" }}
                />
                {/* Gradient overlays on top of artwork */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(to right, transparent 30%, rgba(24,24,27,0.6) 55%, rgba(24,24,27,0.95) 70%, #18181b 82%),
                      linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)
                    `,
                  }}
                />

                {/* Bottom label */}
                <div className="absolute bottom-6 left-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-[Barlow]"
                      style={{
                        backgroundColor: "var(--sky-blue)",
                        color: "#000",
                        textShadow: "none",
                        filter:
                          "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
                      }}
                    >
                      EP
                    </span>
                    <p
                      className="text-xs font-[Barlow] text-gray-300"
                      style={{
                        textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                      }}
                    >
                      16 Oct 2026
                    </p>
                  </div>
                  <h3
                    className="text-2xl font-black leading-tight"
                    style={{
                      textShadow:
                        "0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)",
                    }}
                  >
                    OUT OF CONTROL EP
                  </h3>
                </div>
              </div>

              {/* Right: Tracklist */}
              <div className="flex flex-col justify-center px-8 py-8 bg-zinc-900 sm:bg-transparent">
                <p className="text-xs font-[Barlow] text-gray-500 uppercase tracking-widest mb-5">
                  Tracklist
                </p>
                <div className="space-y-3">
                  {[
                    {
                      n: "01",
                      title: "Out Of Control",
                      released: true,
                      collaborators: [
                        {
                          name: "7sunami",
                          image:
                            "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
                          link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
                        },
                      ],
                    },
                    {
                      n: "02",
                      title: "Forget You",
                      released: true,
                      collaborators: [
                        {
                          name: "7sunami",
                          image:
                            "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
                          link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
                        },
                        {
                          name: "Thome",
                          image:
                            "https://assets.musicbystripes.com/releases%20collaborators/Thome.jpg",
                          link: "https://open.spotify.com/artist/46zB3pu5W8PMqhW6Nchb7i",
                        },
                      ],
                    },
                    {
                      n: "03",
                      title: "Under The Moonlight",
                      released: true,
                      collaborators: [
                        {
                          name: "7sunami",
                          image:
                            "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
                          link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
                        },
                      ],
                    },
                    {
                      n: "04",
                      title: "Won't Give Up",
                      released: true,
                      collaborators: [
                        {
                          name: "7sunami",
                          image:
                            "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
                          link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
                        },
                      ],
                    },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4"
                      style={{ opacity: t.released ? 1 : 0.35 }}
                    >
                      <span
                        className="text-xs font-[Barlow] w-6 flex-shrink-0 text-right"
                        style={{
                          color: t.released
                            ? "var(--lime-green)"
                            : "inherit",
                        }}
                      >
                        {t.n}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">
                          {t.title}
                        </span>
                        {t.collaborators &&
                          t.collaborators.length > 0 && (
                            <>
                              <span className="text-xs text-gray-500 font-[Barlow]">
                                with
                              </span>
                              <div className="flex -space-x-2">
                                {t.collaborators.map(
                                  (c, ci) => (
                                    <button
                                      key={ci}
                                      title={c.name}
                                      className="w-7 h-7 rounded-full border-2 border-zinc-900 overflow-hidden hover:scale-110 hover:z-10 transition-transform relative block p-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(
                                          c.link,
                                          "_blank",
                                          "noopener,noreferrer",
                                        );
                                      }}
                                    >
                                      <img
                                        src={c.image}
                                        alt={c.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  ),
                                )}
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center gap-2 mt-8 text-sm font-bold group-hover:gap-3 transition-all font-[Barlow]"
                  style={{ color: "var(--lime-green)" }}
                >
                  <span>View EP</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Latest Releases */}
            {latestReleases.map((release, index) => (
              <Link
                key={`release-${index}`}
                to={release.link}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 hover:border-[var(--lime-green)] transition-all cursor-pointer block"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={release.image}
                    alt={release.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-[Barlow]"
                      style={{
                        backgroundColor: "var(--sky-blue)",
                        color: "#000",
                      }}
                    >
                      {release.type}
                    </span>
                    <span className="text-xs text-gray-400 font-[Barlow]">
                      {release.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-2">
                    {release.title}
                  </h3>

                  {/* Collaborators */}
                  {release.collaborators &&
                    release.collaborators.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-400 font-[Barlow]">
                          with
                        </span>
                        <div className="flex -space-x-2">
                          {release.collaborators.map(
                            (collab, collabIndex) => (
                              <div
                                key={collabIndex}
                                title={collab.name}
                                className="relative w-8 h-8 rounded-full border-2 border-zinc-900 overflow-hidden hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(
                                    collab.link,
                                    "_blank",
                                  );
                                }}
                              >
                                <ImageWithFallback
                                  src={collab.image}
                                  alt={collab.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  <button
                    className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all font-[Barlow]"
                    style={{ color: "var(--lime-green)" }}
                  >
                    <Play className="w-4 h-4" />
                    Play/Download Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
    </div>
  );
}