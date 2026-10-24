import { Link } from "react-router";
import { useState } from "react";
import {
  Play,
  Radio,
  Calendar,
  Users,
  Globe,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x =
      (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y =
      (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 transition-transform duration-300 ease-out scale-110"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.03)`,
          }}
        >
          <div className="w-full h-full scale-x-[-1] overflow-hidden translate-y-[25px]">
            <img
              src="https://assets.musicbystripes.com/5b476a474f9f969acdde1119b53772f2074cc9c8.webp"
              alt="Jake - Stripes"
              className="w-full h-full object-cover opacity-50 grayscale"
              style={{ transform: "translateX(-10%)" }}
            />
          </div>
          {/* Vignette overlays - heavy darkness on left, lighter on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black from-10% via-black/70 via-50% to-transparent to-70%"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
        </div>

        {/* Hero Content */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 80}px, ${mousePosition.y * 80}px)`,
          }}
        >
          <div className="max-w-2xl mr-auto">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter">
              <span style={{ color: "var(--lime-green)" }}>
                STRIPES
              </span>
            </h1>
            <p
              className="text-xl md:text-3xl mb-4 rounded-[1px] font-[Barlow]"
              style={{ color: "var(--golden-yellow)" }}
            >
              <span className="">
                <span className="">
                  {" "}
                  <span className="font-bold">
                    EDM Producer{" "}
                  </span>
                  //{" "}
                  <span className="font-bold">
                    Cover Artist
                  </span>
                </span>
              </span>
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl font-[Barlow]">
              Welcome to my site! :)
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/music"
                className="px-8 py-4 font-bold uppercase tracking-wider rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--lime-green)",
                  color: "#000",
                }}
              >
                Listen Now
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 font-bold uppercase tracking-wider border-2 rounded-lg transition-all hover:bg-white/10"
                style={{
                  borderColor: "var(--golden-yellow)",
                  color: "var(--golden-yellow)",
                }}
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center px-[8px] py-[-49px]">
            <div className="w-1.5 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-black mb-16 text-center"
            style={{ color: "var(--lime-green)" }}
          >
            LATEST RELEASES
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Forget You",
                type: "Single",
                date: "09 Oct 2026",
                image:
                  "https://assets.musicbystripes.com/releases%20cover%20arts/Forget_You_Artwork.jpg",
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
                collaborators: [
                  {
                    name: "Thome",
                    image:
                      "https://assets.musicbystripes.com/releases%20collaborators/Thome.jpg",
                    link: "https://open.spotify.com/artist/46zB3pu5W8PMqhW6Nchb7i",
                  },
                ],
              },
            ].map((release, index) => {
              let link = "#";
              if (release.title === "Forget You") {
                link = "/link/forgetyou";
              } else if (release.title === "Tell Me") {
                link = "/link/tellme";
              } else if (release.title === "Catharina Remix") {
                link = "/link/catharinaremix";
              }

              return (
                <Link
                  key={index}
                  to={link}
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
                      Play Now
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Play, number: "150K+", label: "Streams" },
              { icon: Radio, number: "10+", label: "Releases" },
              {
                icon: Users,
                number: "1500+",
                label: "Followers",
              },
              {
                icon: Globe,
                number: "PLAYED",
                label: "by DJs worldwide",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon
                  className="w-10 h-10 mx-auto mb-4"
                  style={{ color: "var(--golden-yellow)" }}
                />
                <div
                  className="text-4xl md:text-5xl font-black mb-2 font-[Barlow]"
                  style={{ color: "var(--lime-green)" }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold font-[Barlow]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}