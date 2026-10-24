import { Music, Headphones, Zap, Globe } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://assets.musicbystripes.com/b2c486953058c57367796745ebe3803df489fdc9.webp"
            alt="Jake Profile"
            className="w-full h-full object-cover opacity-20"
            style={{ objectPosition: "70% center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            ABOUT{" "}
            <span style={{ color: "var(--lime-green)" }}>
              STRIPES
            </span>
          </h1>
          <p
            className="text-2xl font-semibold"
            style={{ color: "var(--golden-yellow)" }}
          >
            <span className="italic">hey! :)</span>
          </p>
        </div>
      </section>

      {/* Press Release Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2
                className="text-4xl md:text-5xl font-black mb-8"
                style={{ color: "var(--lime-green)" }}
              >
                PRESS RELEASE
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="font-[Barlow] text-[20px]">
                  In 2025, Stripes won{" "}
                  <a
                    href="https://open.spotify.com/artist/5SOSqzQyhsHTTuxAMGPkaO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    BUTTER
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://open.spotify.com/artist/01BNEFdzawMyAXoHVdtyPx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    Andrew A
                  </a>
                  's Ghost Of You remix contest with a DnB spin
                  alongside{" "}
                  <a
                    href="https://open.spotify.com/artist/4pYWodVn2BToKzPRDXPxPX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    E2D2
                  </a>
                  , earning Tomorrowland support from Andrew A,
                  with additional DJ support from well-known
                  names like{" "}
                  <a
                    href="https://open.spotify.com/artist/7IzlaNBh2EWdsR6xIOp9Bb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    Toxic Wraith
                  </a>
                  .
                </p>

                <p className="font-[Barlow] text-[20px]">
                  Stripes is a US-based electronic music
                  producer who draws on his background as an
                  intense drummer since the age of four. Having
                  honed his production skills through classes at
                  Berklee College of Music and drawing
                  inspiration from influential artists such as{" "}
                  <a
                    href="https://open.spotify.com/artist/4mHAu7NX2UNsnGXjviBD9e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    Brooks
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://open.spotify.com/artist/7hf6L4LN1RTVN66IdBVpPr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    style={{ color: "#87ceeb" }}
                  >
                    RudeLies
                  </a>
                  , he has been forging an unmistakable creative
                  identity.
                </p>

                <p className="font-[Barlow] text-[20px]">
                  On the side, Stripes works for three record
                  labels, managing releases, overseeing A&R, and
                  designing cover artwork. He has another
                  release coming soon and is a promising talent
                  to watch!
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center lg:justify-end m-[0px] p-[0px]">
              <img
                src="https://assets.musicbystripes.com/about_section_pic.jpeg"
                alt="Stripes with his dog"
                className="max-w-md w-full shadow-2xl mx-[80px] my-[0px] rounded-[46px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}

      {/* Achievements Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-black mb-16 text-center"
            style={{ color: "var(--lime-green)" }}
          >
            ACHIEVEMENTS
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* ADE 2025 */}
            <div className="text-center">
              <div
                className="text-6xl font-black mb-4 font-[Barlow]"
                style={{ color: "var(--golden-yellow)" }}
              >
                2025
              </div>
              <h3 className="text-2xl font-black mb-4">
                ADE 2025
              </h3>
              <p className="text-gray-400 leading-relaxed font-[Barlow]">
                Joined my close friend{" "}
                <a
                  href="https://open.spotify.com/artist/7IzlaNBh2EWdsR6xIOp9Bb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#87ceeb]"
                >
                  Toxic Wraith{" "}
                </a>
                on stage at{" "}
                <a
                  href="https://fallbackrecords.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#87ceeb]"
                >
                  Fallback Records'
                </a>{" "}
                ADE Event
              </p>
            </div>

            {/* Tomorrowland 2025 */}
            <div className="text-center">
              <div
                className="text-6xl font-black mb-4 font-[Barlow]"
                style={{ color: "var(--golden-yellow)" }}
              >
                2025
              </div>
              <h3 className="text-2xl font-black mb-4">
                Played at Tomorrowland
              </h3>
              <p className="text-gray-400 leading-relaxed font-[Barlow]">
                My Ghost Of You Remix with{" "}
                <a
                  href="https://open.spotify.com/artist/4pYWodVn2BToKzPRDXPxPX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#87ceeb]"
                >
                  E2D2
                </a>{" "}
                was played live at Tomorrowland by talented DJ
                and producer{" "}
                <a
                  href="https://open.spotify.com/artist/01BNEFdzawMyAXoHVdtyPx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#87ceeb]"
                >
                  Andrew A
                </a>
              </p>
            </div>

            {/* Beatport #1 */}
            <div className="text-center">
              <div
                className="text-6xl font-black mb-4 font-[Barlow]"
                style={{ color: "var(--golden-yellow)" }}
              >
                2024
              </div>
              <h3 className="text-2xl font-black mb-4">
                50,000 Streams
              </h3>
              <p className="text-gray-400 leading-relaxed font-[Barlow]">
                My second ever track released, "
                <a
                  href="https://open.spotify.com/track/3TjhWlVc8NSWZRPQAOlst8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-[#87ceeb]"
                >
                  Send Me An Angel
                </a>
                ", hit 50,000 streams on Spotify
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Logo */}
    </div>
  );
}