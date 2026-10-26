import { useState, useRef } from "react";
import {
  Play,
  Shuffle,
  Plus,
  ArrowDownToLine,
  MoreHorizontal,
  Clock,
  Check,
  Upload,
  X,
  Share2,
} from "lucide-react";

const GREEN = "#1DB954";
const DARK = "#121212";

const PLACEHOLDER_COLORS = [
  "#1a3a1e",
  "#1a2d5e",
  "#5a2e00",
  "#2d1260",
  "#0a3a4a",
  "#4a1515",
  "#3a4a00",
];

const PLAYLIST_SONGS = [
  {
    num: 16,
    title: "Espresso",
    artist: "Sabrina Carpenter",
    album: "Please Please Please",
    date: "Jun 23, 2026",
    bg: "#1f3e8e",
  },
  {
    num: 17,
    title: "Shiver",
    artist: "John Summit, HAYLA",
    album: "Comfort In Chaos",
    date: "Feb 27, 2026",
    bg: "#0c3aa1",
  },
  {
    num: 18,
    title: "2slimey Cypher Verse",
    artist: "2slimey, Underground Sound",
    album: "2slimey Cypher Verse",
    date: "Feb 12, 2026",
    bg: "#b0332c",
  },
  {
    num: 19,
    title: "Inside Our Hearts",
    artist: "Martin Garrix, Alesso, Shaun Farrugia",
    album: "Inside Our Hearts",
    date: "Apr 11, 2026",
    bg: "#5f2f27",
  },
  {
    num: 21,
    title: "Levels",
    artist: "Avici",
    album: "Levels",
    date: "Jan 16, 2026",
    bg: "#b29325",
  },
  {
    num: 22,
    title: "Candyland",
    artist: "Tobu",
    album: "Candyland",
    date: "Dec 11, 2025",
    bg: "#3a4a00",
  },
  {
    num: 23,
    title: "Cinema - Skrillex Remix",
    artist: "Benny Benassi, Gary Go, Skrillex",
    album: "Electroman",
    date: "Jun 7, 2026",
    bg: "#2f9ccd",
  },
];

type View = "desktop" | "mobileHero" | "mobile" | "playlist";

function PlaceholderThumb({
  bg,
  size = 40,
}: {
  bg: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
      }}
    />
  );
}

function GreenCheckBadge() {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: GREEN,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Check size={13} color="black" strokeWidth={3} />
    </div>
  );
}

function EqIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={GREEN}
    >
      <rect x="0" y="5" width="3" height="9" rx="1" />
      <rect x="5.5" y="1" width="3" height="13" rx="1" />
      <rect x="11" y="3" width="3" height="11" rx="1" />
    </svg>
  );
}

export function SpotifyArtTester() {
  const [uploadedImage, setUploadedImage] = useState<
    string | null
  >(null);
  const [songName, setSongName] = useState("Your Song");
  const [artistName, setArtistName] = useState("Your Artist");
  const [year, setYear] = useState("2026");
  const [dominantColor, setDominantColor] = useState("#1d0f4a");
  const [view, setView] = useState<View>("desktop");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColor = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 40, 40);
      const d = ctx.getImageData(0, 0, 40, 40).data;
      let r = 0,
        g = 0,
        b = 0;
      const count = d.length / 4;
      for (let i = 0; i < d.length; i += 4) {
        r += d[i];
        g += d[i + 1];
        b += d[i + 2];
      }
      const factor = 0.45;
      setDominantColor(
        `rgb(${Math.floor((r / count) * factor)},${Math.floor((g / count) * factor)},${Math.floor((b / count) * factor)})`,
      );
    };
    img.src = src;
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setUploadedImage(src);
      extractColor(src);
    };
    reader.readAsDataURL(file);
  };

  const ArtEl = ({
    size = 192,
    rounded = 4,
  }: {
    size?: number;
    rounded?: number;
  }) => (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: rounded,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt={songName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, #2d1269 0%, #6d28d9 55%, #a21caf 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={size * 0.38}
            height={size * 0.38}
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.2)"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      )}
    </div>
  );

  const views: { id: View; label: string }[] = [
    { id: "desktop", label: "Desktop" },
    { id: "mobileHero", label: "Canvas Area" },
    { id: "mobile", label: "Mobile" },
    { id: "playlist", label: "Playlist" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halftone background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${GREEN} 2px, transparent 2px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/6 via-transparent to-[#1DB954]/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page header */}
        <div className="mb-8 flex items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-[Barlow] text-[#1DB954] leading-none">
              SPOTIFY ART TESTER
            </h1>
            <p className="text-gray-400 font-[Barlow] mt-1">
              Upload your artwork and preview it across Spotify
              views
            </p>
            <p className="text-gray-500 text-sm font-[Barlow] mt-2">
              Your image stays in your browser and is never uploaded. Not affiliated with or endorsed by Spotify.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload zone */}
          <div
            className={`rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[220px] ${
              isDragging
                ? "border-[#1DB954] bg-[#1DB954]/10"
                : "border-white/20 bg-white/5 hover:border-white/35 hover:bg-white/8"
            } ${!uploadedImage ? "cursor-pointer" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => {
              if (!uploadedImage) fileInputRef.current?.click();
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload cover art"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {uploadedImage ? (
              <div className="p-5 flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Artwork preview"
                    className="w-36 h-36 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 hover:bg-red-500 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setDominantColor("#1d0f4a");
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  className="text-xs text-gray-400 hover:text-[#1DB954] transition-colors font-[Barlow]"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Click to replace
                </button>
              </div>
            ) : (
              <div className="text-center p-8">
                <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-white font-[Barlow] font-semibold mb-1">
                  Drop your artwork here
                </p>
                <p className="text-gray-500 text-sm font-[Barlow]">
                  or click to browse • PNG, JPG, WEBP
                </p>
              </div>
            )}
          </div>

          {/* Inputs + view selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-[Barlow] mb-1.5">
                Song Name
              </label>
              <input
                type="text"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Your Song"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-[Barlow] focus:outline-none focus:border-[#1DB954] transition-colors placeholder-white/20"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-[Barlow] mb-1.5">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Your Artist"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-[Barlow] focus:outline-none focus:border-[#1DB954] transition-colors placeholder-white/20"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-[Barlow] mb-1.5">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-[Barlow] focus:outline-none focus:border-[#1DB954] transition-colors placeholder-white/20"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-[Barlow] mb-2">
                Preview View
              </label>
              <div className="grid grid-cols-4 gap-2">
                {views.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={`py-2 px-1 rounded-lg font-[Barlow] text-xs font-semibold transition-all ${
                      view === v.id
                        ? "bg-[#1DB954] text-black"
                        : "bg-white/10 text-gray-400 hover:bg-white/18 hover:text-white"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SPOTIFY MOCK ─────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden shadow-2xl shadow-black/60"
          style={{
            fontFamily: '"Figtree", sans-serif',
          }}
        >
          {/* DESKTOP VIEW */}
          {view === "desktop" && (
            <div
              style={{
                background: DARK,
                minWidth: 0,
                fontFamily:
                  '"Figtree", sans-serif',
              }}
            >
              {/* Gradient header */}
              <div
                style={{
                  background: `linear-gradient(to bottom, ${dominantColor} 0%, ${DARK} 100%)`,
                  padding: "64px 28px 28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 28,
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <ArtEl size={192} />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.85)",
                        marginBottom: 8,
                      }}
                    >
                      Single
                    </p>
                    <h2
                      style={{
                        fontSize: "clamp(32px, 6vw, 80px)",
                        fontWeight: 900,
                        lineHeight: 1,
                        margin: "0 0 12px",
                        letterSpacing: "-0.02em",
                        fontFamily:
                          '"Figtree", sans-serif',
                      }}
                    >
                      {songName}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.65)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {artistName}
                      </span>
                      <span>•</span>
                      <span>{year}</span>
                      <span>•</span>
                      <span>1 song, 2 min 41 sec</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls bar */}
              <div
                style={{
                  background: "rgba(18,18,18,0.7)",
                  padding: "18px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    background: GREEN,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${GREEN}55`,
                  }}
                >
                  <Play
                    fill="black"
                    stroke="none"
                    size={22}
                    style={{ marginLeft: 4 }}
                  />
                </div>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    border:
                      "1.5px solid rgba(255,255,255,0.35)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="rgba(255,255,255,0.55)"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                  </svg>
                </div>
                <Shuffle
                  size={20}
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid rgba(255,255,255,0.45)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Plus
                    size={16}
                    color="rgba(255,255,255,0.55)"
                  />
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid rgba(255,255,255,0.45)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ArrowDownToLine
                    size={14}
                    color="rgba(255,255,255,0.55)"
                  />
                </div>
                <MoreHorizontal
                  size={20}
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                />
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <span>List</span>
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <rect
                      x="0"
                      y="2"
                      width="16"
                      height="1.5"
                      rx="0.75"
                    />
                    <rect
                      x="0"
                      y="7.25"
                      width="16"
                      height="1.5"
                      rx="0.75"
                    />
                    <rect
                      x="0"
                      y="12.5"
                      width="16"
                      height="1.5"
                      rx="0.75"
                    />
                  </svg>
                </div>
              </div>

              {/* Track list header */}
              <div
                style={{
                  padding: "0 28px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.1)",
                  display: "grid",
                  gridTemplateColumns:
                    "44px 1fr 110px 44px 60px",
                  alignItems: "center",
                  height: 36,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  #
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 13,
                  }}
                >
                  Title
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 13,
                  }}
                >
                  Plays
                </span>
                <div />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Clock
                    size={14}
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  />
                </div>
              </div>

              {/* Track row */}
              <div
                style={{
                  padding: "20px 28px 8px",
                  display: "grid",
                  gridTemplateColumns:
                    "44px 1fr 110px 44px 60px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: GREEN,
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  1
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <ArtEl size={40} />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        color: GREEN,
                        fontWeight: 600,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {songName}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {artistName}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                  }}
                >
                  6,767
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <GreenCheckBadge />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    textAlign: "right",
                  }}
                >
                  2:41
                </span>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "20px 28px 32px",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 12,
                  lineHeight: 1.8,
                }}
              >
                <p>April 22, {year}</p>
                <p>© {year} Record Label</p>
                <p>© {year} Record Label</p>
              </div>
            </div>
          )}

          {/* MOBILE HERO VIEW */}
          {view === "mobileHero" && (
            <div
              style={{
                background: DARK,
                maxWidth: 420,
                margin: "0 auto",
                fontFamily:
                  '"Figtree", sans-serif',
              }}
            >
              {/* Top bar */}
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 15 }}>
                  {songName}
                </p>
                <MoreHorizontal
                  size={20}
                  style={{ color: "rgba(255,255,255,0.6)" }}
                />
              </div>

              {/* Full-width artwork */}
              <div
                style={{ width: "100%", aspectRatio: "1/1" }}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt={songName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #2d1269 0%, #6d28d9 55%, #a21caf 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="90"
                      height="90"
                      viewBox="0 0 24 24"
                      fill="rgba(255,255,255,0.18)"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Song title row */}
              <div
                style={{
                  padding: "16px 16px 12px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {songName}
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    {artistName}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  <Share2
                    size={22}
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  />
                  <GreenCheckBadge />
                </div>
              </div>

              {/* About the artist */}
              <div style={{ margin: "8px 16px 24px" }}>
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    height: 200,
                    background:
                      "linear-gradient(135deg, #1e2a1e, #2a2a3a)",
                    marginBottom: 12,
                  }}
                >
                  {/* Artist photo placeholder */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="40"
                        height="40"
                        fill="rgba(255,255,255,0.2)"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "32px 14px 12px",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: 2,
                      }}
                    >
                      About the artist
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{ fontWeight: 700, fontSize: 16 }}
                    >
                      {artistName}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      1,716 monthly listeners
                    </p>
                  </div>
                  <button
                    style={{
                      border: "1px solid rgba(255,255,255,0.5)",
                      borderRadius: 20,
                      padding: "7px 22px",
                      background: "transparent",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Follow
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE (COMPACT) VIEW */}
          {view === "mobile" && (
            <div
              style={{
                background: DARK,
                maxWidth: 500,
                margin: "0 auto",
                fontFamily:
                  '"Figtree", sans-serif',
              }}
            >
              {/* Art + info row */}
              <div
                style={{
                  padding: "20px 18px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <ArtEl size={110} rounded={6} />
                <div style={{ paddingTop: 4 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 6px",
                    }}
                  >
                    {songName}
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 13,
                    }}
                  >
                    Single • {year} • 1 song
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div
                style={{
                  padding: "0 18px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    border: "2px solid rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Play
                    fill="white"
                    stroke="none"
                    size={20}
                    style={{ marginLeft: 3 }}
                  />
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus
                    size={15}
                    color="rgba(255,255,255,0.5)"
                  />
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowDownToLine
                    size={14}
                    color="rgba(255,255,255,0.5)"
                  />
                </div>
                <MoreHorizontal
                  size={22}
                  style={{ color: "rgba(255,255,255,0.5)" }}
                />
              </div>

              {/* Track list header */}
              <div
                style={{
                  padding: "0 18px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.1)",
                  display: "grid",
                  gridTemplateColumns:
                    "36px 1fr 80px 36px 52px",
                  alignItems: "center",
                  height: 36,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  #
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                  }}
                >
                  Title
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                  }}
                >
                  Plays
                </span>
                <div />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Clock
                    size={13}
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  />
                </div>
              </div>

              {/* Track row */}
              <div
                style={{
                  padding: "14px 18px 40px",
                  display: "grid",
                  gridTemplateColumns:
                    "36px 1fr 80px 36px 52px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <EqIcon />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      color: GREEN,
                      fontWeight: 600,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {songName}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {artistName}
                  </span>
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 12,
                  }}
                >
                  3,428
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <GreenCheckBadge />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 12,
                    textAlign: "right",
                  }}
                >
                  2:41
                </span>
              </div>
            </div>
          )}

          {/* PLAYLIST VIEW */}
          {view === "playlist" && (
            <div
              style={{
                background: DARK,
                fontFamily:
                  '"Figtree", sans-serif',
              }}
            >
              {/* Column headers */}
              <div
                style={{
                  padding: "10px 24px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.1)",
                  display: "grid",
                  gridTemplateColumns:
                    "52px 1fr 1fr 160px 52px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    textAlign: "right",
                    paddingRight: 8,
                  }}
                >
                  #
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                  }}
                >
                  Title
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                  }}
                >
                  Album
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                  }}
                >
                  Date added
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Clock
                    size={13}
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  />
                </div>
              </div>

              {/* Songs before user's (16–19) */}
              {PLAYLIST_SONGS.slice(0, 4).map((song) => (
                <div
                  key={song.num}
                  style={{
                    padding: "8px 24px",
                    display: "grid",
                    gridTemplateColumns:
                      "52px 1fr 1fr 160px 52px",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 14,
                      textAlign: "right",
                      paddingRight: 8,
                    }}
                  >
                    {song.num}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <PlaceholderThumb bg={song.bg} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {song.title}
                      </p>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                    }}
                  >
                    {song.album}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 13,
                    }}
                  >
                    {song.date}
                  </span>
                  <div />
                </div>
              ))}

              {/* User's song at #20 – highlighted */}
              <div
                style={{
                  padding: "8px 24px",
                  display: "grid",
                  gridTemplateColumns:
                    "52px 1fr 1fr 160px 52px",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.06)",
                  borderLeft: `3px solid ${GREEN}`,
                }}
              >
                <span
                  style={{
                    color: GREEN,
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "right",
                    paddingRight: 8,
                  }}
                >
                  20
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt={songName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #2d1269, #6d28d9)",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: GREEN,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {songName}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {artistName}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 13,
                  }}
                >
                  {songName}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 13,
                  }}
                >
                  Apr 29, {year}
                </span>
                <div />
              </div>

              {/* Songs after user's (21–23) */}
              {PLAYLIST_SONGS.slice(4).map((song) => (
                <div
                  key={song.num}
                  style={{
                    padding: "8px 24px",
                    display: "grid",
                    gridTemplateColumns:
                      "52px 1fr 1fr 160px 52px",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 14,
                      textAlign: "right",
                      paddingRight: 8,
                    }}
                  >
                    {song.num}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <PlaceholderThumb bg={song.bg} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {song.title}
                      </p>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                    }}
                  >
                    {song.album}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 13,
                    }}
                  >
                    {song.date}
                  </span>
                  <div />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}