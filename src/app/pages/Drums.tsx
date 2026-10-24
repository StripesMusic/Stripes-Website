import { Play } from "lucide-react";

export function Drums() {
  const drumCovers = [
    {
      title: "Misery Business",
      artist: "Paramore",
      date: "May 2026",
      embedUrl: "https://www.youtube.com/embed/Ob_QOy7iFeQ",
    },
    {
      title: "Ruin",
      artist: "Lamb of God",
      date: "May 2026",
      embedUrl: "https://www.youtube.com/embed/ISmoJL4XWQw",
    },
    {
      title: "Struck Dead",
      artist: "Trivium",
      date: "Apr 2026",
      embedUrl: "https://www.youtube.com/embed/tvb6E6NfFW8",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {/* Geometric Background Pattern */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Hero Section with Background Image */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://assets.musicbystripes.com/drums_page_background.jpeg"
            alt="Drums Background"
            className="w-full h-full object-contain opacity-30 grayscale scale-[6] translate-x-[200px] translate-y-[450px]"
            style={{ objectPosition: "center top" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1
              className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
              style={{ color: "var(--lime-green)" }}
            >
              DRUM COVERS
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-[Barlow] max-w-3xl mx-auto">
              Drum covers of songs I enjoy recorded for fun :)
            </p>
          </div>
        </div>
      </section>

      {/* Drum Cover Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drumCovers.map((cover, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 hover:border-[var(--lime-green)] transition-all"
              >
                {/* Video Embed */}
                <div className="aspect-video overflow-hidden bg-black">
                  <iframe
                    className="w-full h-full"
                    src={cover.embedUrl}
                    title={cover.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Cover Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-[Barlow]"
                      style={{
                        backgroundColor: "var(--sky-blue)",
                        color: "#000",
                      }}
                    >
                      Drum Cover
                    </span>
                    <span className="text-xs text-gray-400 font-[Barlow]">
                      {cover.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-1">
                    {cover.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-[Barlow] mb-4">
                    by {cover.artist}
                  </p>
                  <div
                    className="flex items-center gap-2 text-sm font-bold font-[Barlow]"
                    style={{ color: "var(--lime-green)" }}
                  >
                    <Play className="w-4 h-4" />
                    Watch Now
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}