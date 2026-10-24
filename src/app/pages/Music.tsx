import { Play, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { SpotifyLogo } from "../components/icons/SpotifyLogo";
import { AppleMusicLogo } from "../components/icons/AppleMusicLogo";
import { SoundCloudLogo } from "../components/icons/SoundCloudLogo";

export function Music() {
  // Latest releases from home page
  const latestReleases = [
    {
      title: "Forget You",
      type: "Single",
      date: "09 Oct 2026",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Forget_You_Artwork.jpg",
      link: "/link/forgetyou",
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
      title: "Tell Me",
      type: "Single",
      date: "22 Apr 2026",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Tell_Me_Artwork.jpg",
      link: "/link/tellme",
      collaborators: [
        {
          name: "ANAHĀTA",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/ANAHATA.jpg",
          link: "https://open.spotify.com/artist/53JGhjcwoSdXy14kOAE3vu",
        },
      ],
    },
    {
      title: "Catharina Remix",
      type: "Unofficial Remix",
      date: "18 Apr 2026",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Catharina_Artwork.jpg",
      link: "/link/catharinaremix",
      collaborators: [
        {
          name: "Thome",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/Thome.jpg",
          link: "https://open.spotify.com/artist/46zB3pu5W8PMqhW6Nchb7i",
        },
      ],
    },
    {
      title: "I Just Flow",
      type: "Single",
      date: "23 Jan 2026",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/I_Just_Flow_Artwork.jpg",
      link: "/link/ijustflow",
      collaborators: [
        {
          name: "Hilefex",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/Hilefex.jpg",
          link: "https://open.spotify.com/artist/2MOJXg84M4LKx0ovvHvMmf",
        },
      ],
    },
    {
      title: "Back To Me Edit",
      type: "Unofficial Edit",
      date: "9 Jan 2026",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Back_To_Me_Artwork.jpg",
      link: "/link/backtome",
      collaborators: [
        {
          name: "CHILLBIRD",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/CHILLBIRD.jpg",
          link: "https://open.spotify.com/artist/7g0aPxm6CS5k6jCAZSFmbW",
        },
      ],
    },
    {
      title: "Lost In You Remix",
      type: "Unofficial Remix",
      date: "28 Nov 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Lost_In_You_Artwork.jpg",
      link: "/link/lostinyou",
      collaborators: [
        {
          name: "Toxic Wraith",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/ToxicWraith.jpg",
          link: "https://open.spotify.com/artist/7IzlaNBh2EWdsR6xIOp9Bb",
        },
      ],
    },
    {
      title: "Run With You",
      type: "Single",
      date: "14 Nov 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Run_With_You_Artwork.jpg",
      link: "/link/runwithyou",
      collaborators: [
        {
          name: "Alvin Mo",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/AlvinMo.jpg",
          link: "https://open.spotify.com/artist/25CAEDl6yMGwwl31Mu3N2H",
        },
        {
          name: "paulø",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/paulo.jpg",
          link: "https://open.spotify.com/artist/2Wzd6JY9NxUJcuJFFZQbSU",
        },
      ],
    },
    {
      title: "Don't Kill My Vibe Remix",
      type: "Official Remix",
      date: "3 Oct 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Dont_Kill_My_Vibe_Remix_Artwork.jpg",
      link: "/link/dontkillmyviberemix",
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
      title: "Ghost Of You Remix",
      type: "Official Remix",
      date: "11 Jul 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Ghost_Of_You_Artwork.jpg",
      link: "/link/ghostofyouremix",
      collaborators: [
        {
          name: "E2D2",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/E2D2.jpg",
          link: "https://open.spotify.com/artist/4pYWodVn2BToKzPRDXPxPX",
        },
      ],
    },
    {
      title: "Never Looking Back",
      type: "Single",
      date: "20 Jun 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Never_Looking_Back_Artwork.jpg",
      link: "/link/neverlookingback",
      collaborators: [],
    },
    {
      title: "Clarity Remix",
      type: "Unofficial Remix",
      date: "31 May 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Clarity_Artwork.jpg",
      link: "/link/clarityremix",
      collaborators: [
        {
          name: "Alvin Mo",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/AlvinMo.jpg",
          link: "https://open.spotify.com/artist/25CAEDl6yMGwwl31Mu3N2H",
        },
      ],
    },
    {
      title: "Love Me Too",
      type: "Single",
      date: "30 May 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Love_Me_Too_Artwork.jpg",
      link: "/link/lovemetoo",
      collaborators: [
        {
          name: "Firee",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/Firee.jpg",
          link: "https://open.spotify.com/artist/0Wbg8xMFsAWu5lwCV5QYXD",
        },
      ],
    },
    {
      title: "Infinity Remix",
      type: "Unofficial Remix",
      date: "23 May 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Infinity_Remix_Artwork.jpg",
      link: "/link/infinityremix",
      collaborators: [],
    },
    {
      title: "You & I",
      type: "Single",
      date: "8 Jan 2025",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/You%26I_Artwork.jpg",
      link: "/link/youandi",
      collaborators: [
        {
          name: "Jay Hertz",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/JayHertz.jpg",
          link: "https://open.spotify.com/artist/5Z1BF0oYInmQqzC892tP1i",
        },
      ],
    },
    {
      title: "More Than Yesterday Remix",
      type: "Unofficial Remix",
      date: "12 Oct 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/More_Than_Yesterday_Remix_Artwork.jpg",
      link: "/link/morethanyesterdayremix",
      collaborators: [
        {
          name: "Jay Hertz",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/JayHertz.jpg",
          link: "https://open.spotify.com/artist/5Z1BF0oYInmQqzC892tP1i",
        },
      ],
    },
    {
      title: "Always",
      type: "Single",
      date: "5 Jul 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Always_Artwork.jpg",
      link: "/link/always",
      collaborators: [
        {
          name: "paulø",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/paulo.jpg",
          link: "https://open.spotify.com/artist/2Wzd6JY9NxUJcuJFFZQbSU",
        },
        {
          name: "blo0my",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/blo0my.jpg",
          link: "https://open.spotify.com/artist/1j6cfWLS5Tks2ZFJzLugvq",
        },
      ],
    },
    {
      title: "Back In Time",
      type: "Single",
      date: "7 Jun 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Back_In_Time_Artwork.jpg",
      link: "/link/backintime",
      collaborators: [
        {
          name: "NSJ",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
          link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
        },
        {
          name: "Aprox",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/Aprox.jpg",
          link: "https://open.spotify.com/artist/4I7z1x8bnDwjy9hDpvpUjv",
        },
        {
          name: "Lonely Heaven",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/LonelyHeaven.jpg",
          link: "https://open.spotify.com/artist/6S1RSNqYr0l7sfvFDnep8l",
        },
      ],
    },
    {
      title: "Lucky",
      type: "Single",
      date: "17 May 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Lucky_Artwork.jpg",
      link: "/link/lucky",
      collaborators: [
        {
          name: "7sunami",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
          link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
        },
        {
          name: "Cl04k",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/Cl04k.jpg",
          link: "https://open.spotify.com/artist/3gHUsouQKQ3JoH1N7kNjQu",
        },
      ],
    },
    {
      title: "A Sky Full Of Stars Remix",
      type: "Unofficial Remix",
      date: "23 Mar 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/A_Sky_Full_Of_Stars_Remix_Artwork.jpg",
      link: "/link/askyfullofstarsremix",
      collaborators: [
        {
          name: "NSJ",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
          link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
        },
        {
          name: "Lonely Heaven",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/LonelyHeaven.jpg",
          link: "https://open.spotify.com/artist/6S1RSNqYr0l7sfvFDnep8l",
        },
      ],
    },
    {
      title: "Sike Flip",
      type: "Unofficial Flip",
      date: "5 Mar 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Sike_Artwork.jpg",
      link: "/link/sikeflip",
      collaborators: [
        {
          name: "blo0my",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/blo0my.jpg",
          link: "https://open.spotify.com/artist/1j6cfWLS5Tks2ZFJzLugvq",
        },
      ],
    },
    {
      title: "The End Edit",
      type: "Unofficial Edit",
      date: "21 Jan 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/The_End_Artwork.jpg",
      link: "/link/theendedit",
      collaborators: [
        {
          name: "NSJ",
          image:
            "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
          link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
        },
      ],
    },
    {
      title: "Send Me An Angel",
      type: "Single",
      date: "5 Jan 2024",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Send_Me_An_Angel_Artwork.jpg",
      link: "/link/sendmeanangel",
      collaborators: [],
    },
    {
      title: "Boom",
      type: "Single",
      date: "4 Aug 2023",
      image:
        "https://assets.musicbystripes.com/releases%20cover%20arts/Boom_Artwork.jpg",
      link: "/link/boom",
      collaborators: [],
    },
  ];

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