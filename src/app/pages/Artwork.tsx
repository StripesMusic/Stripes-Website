import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Play,
  ExternalLink,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Masonry, {
  ResponsiveMasonry,
} from "react-responsive-masonry";
import { motion, AnimatePresence } from "motion/react";

interface ArtworkItem {
  id: number;
  title: string;
  type: string;
  category:
    | "2d"
    | "3d"
    | "animations"
    | "lyric-videos"
    | "websites"
    | "set-visuals"
    | "misc";
  date: string;
  image: string;
  images?: string[]; // Multiple images for slideshow
  details?: string | React.ReactNode;
  videoUrl?: string;
  youtubeUrl?: string;
  software?: string[];
  client?: string;
}

// Component for website card with browser mockup
function WebsiteCard({
  item,
}: {
  item: ArtworkItem;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={item.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-gradient-to-br from-zinc-900 to-zinc-950 hover:border-[var(--lime-green)] transition-all cursor-pointer hover:scale-[1.02] duration-300 shadow-xl block"
    >
      {/* Browser Chrome */}
      <div className="bg-zinc-800 p-3 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 bg-zinc-900/50 rounded px-3 py-1 text-xs text-gray-400 font-mono">
          {item.youtubeUrl?.replace("https://", "")}
        </div>
      </div>

      {/* Screenshot Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white mb-2">
              <ExternalLink
                className="w-5 h-5"
                style={{ color: "var(--lime-green)" }}
              />
              <span
                className="text-sm font-bold tracking-wider"
                style={{ color: "var(--lime-green)" }}
              >
                VISIT SITE
              </span>
            </div>
          </div>
        </div>

        {/* Live Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <span className="text-xs font-bold text-black">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-zinc-900/50">
        <h3
          className="text-lg font-black mb-1"
          style={{ color: "var(--lime-green)" }}
        >
          {item.title}
        </h3>
        {item.client && (
          <p className="text-sm text-gray-400 font-[Barlow] mb-3">
            {item.client}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {item.software?.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-gray-300 font-[Barlow] font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

// Component for artwork card with hover video
function ArtworkCard({
  item,
  onClick,
}: {
  item: ArtworkItem;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.images) {
      setCurrentSlide(
        (prev) => (prev + 1) % item.images!.length,
      );
    }
  };

  const currentImage = item.images
    ? item.images[currentSlide]
    : item.image;

  // Check if current slide is a video
  const isCurrentSlideVideo = currentImage?.endsWith(".mp4");

  // Use WebsiteCard for website items
  if (item.category === "websites") {
    return <WebsiteCard item={item} />;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950 hover:border-[var(--lime-green)] transition-all cursor-pointer hover:scale-[1.02] duration-300"
    >
      <div className="relative overflow-hidden aspect-square">
        {/* Static image or video thumbnail - always rendered to maintain container size */}
        {!isCurrentSlideVideo ? (
          <ImageWithFallback
            src={currentImage}
            alt={item.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
              item.videoUrl && isHovered
                ? "opacity-0"
                : "opacity-100"
            }`}
          />
        ) : (
          <video
            key={currentImage}
            src={currentImage}
            loop
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
        )}

        {/* Video for animations - positioned absolutely to overlay image (only for non-slideshow videos) */}
        {item.videoUrl && !item.images && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            loop
            muted
            playsInline
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>

        {/* Preview text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="text-sm font-bold tracking-[0.3em] px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10"
            style={{ color: "var(--lime-green)" }}
          >
            PREVIEW
          </span>
        </div>

        {/* Slideshow Arrow Button */}
        {item.images && item.images.length > 1 && (
          <button
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--lime-green)] hover:text-black transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-bold font-[Barlow] backdrop-blur-sm"
            style={{
              backgroundColor:
                item.category === "2d"
                  ? "var(--lime-green)"
                  : item.category === "3d"
                    ? "var(--golden-yellow)"
                    : item.category === "animations"
                      ? "var(--color-red-300)"
                      : item.category === "lyric-videos"
                        ? "var(--sky-blue)"
                        : item.category === "websites"
                          ? "var(--color-red-300)"
                          : item.category === "set-visuals"
                            ? "var(--golden-yellow)"
                            : "#9333ea",
              color: "#000",
            }}
          >
            {item.type}
          </span>
        </div>

        {/* Video/Link Icon */}
        {(item.videoUrl || item.youtubeUrl) && (
          <div className="absolute top-3 left-3">
            <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <Play
                className="w-5 h-5"
                style={{
                  color: "var(--lime-green)",
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 min-h-[80px]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black">{item.title}</h3>
          <span className="text-xs text-gray-500 font-[Barlow]">
            {item.date}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Artwork() {
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "2d"
    | "3d"
    | "animations"
    | "lyric-videos"
    | "websites"
    | "set-visuals"
    | "misc"
  >("2d");
  const [selectedItem, setSelectedItem] =
    useState<ArtworkItem | null>(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const artworkItems: ArtworkItem[] = [
    {
      id: 1,
      title: "Lost In You Remix",
      type: "Remix Cover",
      category: "2d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Lost_In_You_Remix_Artwork.jpeg",
      details:
        "Collage style artwork with vibrant colors for an unofficial remix: Quintino, NERVO - Lost In You (Toxic Wraith, Stripes Remix)",
      software: ["Adobe Photoshop"],
      client: "Myself/Toxic Wraith",
    },
    {
      id: 18,
      title: "TMLS043 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Aug 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/TMLS043.jpg",
      details:
        "Floaty light-blue cover art with clean text, clouds, and geometric objects/textures for an official Timeless release: Bukkoy, Ray - Flying So High",
      software: ["Adobe Photoshop"],
      client: "Timeless",
    },
    {
      id: 19,
      title: "TMLS044 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Aug 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/TMLS044.jpg",
      details:
        "Dark, club themed cover art with grimy textures and details for an official Timeless release: Maulik - She Wants To Party",
      software: ["Adobe Photoshop"],
      client: "Timeless",
    },
    {
      id: 20,
      title: "TMLS045 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Sep 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/TMLS045.jpg",
      details:
        "Colorful, shiny artwork with paper textures for an official Timeless release: Larza, Fisher Mackley ft. Alistair Jones - Come Alive",
      software: ["Adobe Photoshop"],
      client: "Timeless",
    },
    {
      id: 21,
      title: "TMLS046 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Sep 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/TMLS046.jpg",
      details:
        "Dark, sparkly, aurora-lights themed artwork for an official Timeless release: CHRSTN, Auryn - Tonight",
      software: ["Adobe Photoshop"],
      client: "Timeless",
    },
    {
      id: 22,
      title: "TMLS047 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Oct 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/TMLS047.jpg",
      details:
        "Textured, dithered, wavy & abstract themed artwork for an official  Timeless release: NANDAN - Say You're Sorry",
      software: ["Adobe Photoshop"],
      client: "Timeless",
    },
    {
      id: 17,
      title: "Through Hell Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/ThroughHell.jpeg",
      details:
        "Vector cartoon-y styled artwork in a hell theme for an official Stardust Records release: M1CK3Y, Illusionz, M4R1US BP - Through Hell",
      software: ["Adobe Photoshop"],
      client: "Stardust Records",
    },
    {
      id: 16,
      title: "Catharina Remix",
      type: "Remix Cover",
      category: "2d",
      date: "Apr 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Catharina_Remix_Artwork.png",
      details:
        "Modified version of the original artwork (color, text, and effects added) for an unofficial remix: Martin Garrix - Catharina (Thome, Stripes Remix)",
      software: ["Adobe Photoshop"],
      client: "Myself/Thome",
    },
    {
      id: 1,
      title: "SR044 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Apr 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR044_1.png",
      images: [
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR044_1.png",
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR044_2.jpeg",
      ],
      details:
        "Vintage, hip-hop tapes, brutalist style artwork (2 versions, different colors) for an official Solvana Records release: pøbel - Thrilla",
      software: ["Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 2,
      title: "SR043 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR043.png",
      details:
        "Dark, mysterious, night city artwork for an official Solvana Records release: Guy Coolid, paulø - BADMAN!",
      software: ["Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 3,
      title: "SR042 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR042.jpeg",
      details:
        "Cool-toned, monochromatic metallic/chrome-styled artwork for an official Solvana Records release: Orexo - Bring It Down",
      software: ["Adobe Photoshop", "Ditherista"],
      client: "Solvana Records",
    },
    {
      id: 4,
      title: "SR041 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR041.jpeg",
      details:
        "A bold, glitch-heavy, duochrome artwork with purple and neon yellow tones, featuring a picture of the artist with unique coloring and textures for an official Solvana Records release: IRXN - DONTGETMAD!",
      software: ["Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 5,
      title: "SR040 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR040.jpeg",
      details:
        "A moody, neon-purple artwork with a clean, modern layout for an official Solvana Records release: WSO - Hold On",
      software: ["Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 6,
      title: "SR039 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/SR039.jpeg",
      details:
        "A gritty, high-impact artwork split diagonally between fire/lava and darkness for an official Solvana Records release: Jaxxinator - Too Heavy (Carry On)",
      software: ["Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 7,
      title: "Boom Cover Art (2025 Version)",
      type: "Single Cover",
      category: "2d",
      date: "Sep 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Boom_Artwork.jpeg",
      details:
        'A fiery and chaotic explosion scene featuring a mix of a burning car and a planet exploding, signifying the title of the song, "Boom", for an official self-release: Stripes - Boom',
      software: ["Adobe Photoshop"],
      client: "Myself",
    },
    {
      id: 8,
      title: "Send Me An Angel Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jan 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Send_Me_An_Angel_Artwork.jpeg",
      details:
        "A clean, emotional, scrapbook-style artwork for my own official Quadron Records release: Stripes - Send Me An Angel",
      software: ["Adobe Photoshop"],
      client: "Quadron Records/Myself",
    },
    {
      id: 9,
      title: "Back In Time Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jun 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Back_In_Time_Artwork.jpeg",
      details:
        "A clean, atmospheric, blue and purple artwork with a dreamy neon hourglass for an official self-release: Stripes, NSJ, Aprox, Lonely Heaven - Back In Time",
      software: ["Adobe Photoshop"],
      client: "Myself, NSJ, Aprox, Lonely Heaven",
    },
    {
      id: 10,
      title: "QDRN108 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Sep 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/QDRN108.jpeg",
      details:
        "A dark, futuristic artwork with a sleek cyberpunk edge for an official Quadron Records release: NØT ME - Touch",
      software: ["Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 11,
      title: "QDRN102 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Aug 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/QDRN102.jpeg",
      details:
        "A vibrant, cinematic artwork with a cosmic, uplifting feel for an official Quadron Records release: ARMAN, V3NUS - Be",
      software: ["Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 12,
      title: "QDRN096 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jul 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/QDRN096.jpeg",
      details:
        "A dark, intense artwork drenched in molten gold tones for an official Quadron Records release: Neon Viruz - Golden Coil",
      software: ["Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 13,
      title: "QDRN093 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Jun 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/QDRN093.jpeg",
      details:
        "A bold, minimal artwork with high-contrast impact and liquid brush strokes for an official Quadron Records release: Wave & Dooper - Keep Drivin'",
      software: ["Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 14,
      title: "OCT023 Cover Art",
      type: "Single Cover",
      category: "2d",
      date: "Oct 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/OCT023.jpeg",
      details:
        "A nostalgic, emotionally heavy artwork with a soft neon tone for an official Octadron Records release: Dakota Arlond - Still Broken",
      software: ["Adobe Photoshop"],
      client: "Octadron Records (Sub-label of Quadron Records)",
    },
    {
      id: 15,
      title: "Tunnel Visions EP Cover Art",
      type: "EP Cover",
      category: "2d",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Tunnel_Visions_EP_Artwork.jpeg",
      details:
        "A sleek, color-washed portrait artwork with a modern electronic edge for Guy Coolid's official Tunnel Visions EP",
      software: ["Adobe Photoshop"],
      client: "Guy Coolid",
    },
    {
      id: 1001,
      title: "I Just Flow",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/I_Just_Flow_Artwork.jpeg",
      details:
        "Fiery mountain festival scene with artist logos for an official self-release: Hilefex, Stripes - I Just Flow",
      software: ["Blender", "Adobe Photoshop"],
      client: "Myself/Hilefex",
    },
    {
      id: 1002,
      title: "Love Me Too",
      type: "Single Cover",
      category: "3d",
      date: "May 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN140.jpeg",
      details:
        "A cinematic, neon-soaked cityscape artwork with a futuristic edge for my official Quadron Records release: Firee, Stripes - Love Me Too",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records/Myself",
    },
    {
      id: 1003,
      title: "QDRN139 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "May 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN139.jpeg",
      details:
        "A lush, cinematic forest artwork with a cool, ethereal glow for an official Quadron Records release: WEARY ft. Lucas Kozlov - With Me",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1003,
      title: "QDRN138 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "May 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN138.jpeg",
      details:
        "A cinematic, epic landscape artwork with a mountain forest background for an official Quadron Records release: ADROIT, VEATZ ft. Destiny Hooks - Never Be The Same",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1004,
      title: "QDRN136 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "May 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN136.jpeg",
      details:
        "A dramatic, storm-charged landscape artwork with electric intensity for an official Quadron Records release: Thome, BLUVZ - Thunder",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1005,
      title: "QDRN135 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN135.jpeg",
      details:
        "A vibrant, tropical artwork bathed in neon pink light for an official Quadron Records release: Mystic Lee, Kaydell, Black Winter - Heartbeat",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1006,
      title: "QDRN134 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN134.jpeg",
      details:
        "A dreamy purple landscape artwork where nature meets a distant city for an official Quadron Records release: Daevo, paulø, Adi ft. VINC - Wondering",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1007,
      title: "QDRN133 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN133.jpeg",
      details:
        "A surreal, dreamlike landscape artwork with a soft cosmic palette and floating frames for an official Quadron Records release: SLNCEpls - Out Of The Frame",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1008,
      title: "QDRN132 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN132.jpeg",
      details:
        "A crisp, alpine landscape artwork with a cool futuristic glow for an official Quadron Records release: Jacøb, AVIS - Colorado",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1009,
      title: "QDRN131 Cover Art",
      type: "EP Cover",
      category: "3d",
      date: "Mar 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN131.jpeg",
      details:
        "A surreal cosmic desert artwork with glowing stars, twisted trees, and planetary backdrops for an official Quadron Records release: MusicByDavid - All The Time EP",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1010,
      title: "QDRN130 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Mar 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN130.jpeg",
      details:
        "A dark volcanic canyon artwork with red lightning, jagged rock pillars, and a glowing crimson sky for an official Quadron Records release: Cl04k, CHOKKTAW, Teorah - Sanity",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1011,
      title: "QDRN129 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Mar 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN129.jpeg",
      details:
        "A surreal cosmic desert artwork with glowing wildflowers, distant mountains, and a star-filled galaxy sky for an official Quadron Records release: Nexoria - I'm Lost",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1012,
      title: "QDRN128 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Mar 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN128.jpeg",
      details:
        "A bright meadow artwork with wildflowers, rocks, drifting clouds, and a clear blue sky for an official Quadron Records release: Sun1ight, NeverFall. - Sweet Escape",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1013,
      title: "QDRN127 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN127.jpeg",
      details:
        "A misty forest artwork with towering trees, dense greenery, and soft morning light filtering through the woods for an official Quadron Records release: Nūves ft. Till - Statelines",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1014,
      title: "QDRN126 Cover Art",
      type: "Remix EP Cover",
      category: "3d",
      date: "Feb 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN126.jpeg",
      details:
        "A futuristic lunar base artwork with glowing spacecraft modules, floating clock spheres, and a deep starry night sky for an official Quadron Records release: Toxic Wraith ft. LUIGI - Clock Strike Twelve (The Remixes)",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1015,
      title: "QDRN125 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN125.jpeg",
      details:
        "A haunting red forest artwork with bare trees, a glowing moon, and a drifting ghost figure for an official Quadron Records release: Hedclem - Ghost",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1016,
      title: "QDRN124 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN124.jpeg",
      details:
        "A surreal alien landscape artwork with towering stone pillars, rocky terrain, and a vibrant cosmic sunset sky for an official Quadron Records release: Kamix - Blind",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1017,
      title: "QDRN123 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN123.jpeg",
      details:
        "A cosmic meadow artwork with purple flowers, rocky hills, and a vibrant star-filled galaxy sky for an official Quadron Records release: MusicByDavid - Telos",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1018,
      title: "QDRN122 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN122.jpeg",
      details:
        "A futuristic nightscape artwork with glowing blue structures, mountainous terrain, and a lone astronaut beneath digital constellations for an official Quadron Records release: Nexoria - Take Us Home",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1019,
      title: "QDRN121 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN121.jpeg",
      details:
        "An underwater ruins artwork with glowing teal structures, submerged stone pillars, and drifting particles beneath rolling ocean waves for an official Quadron Records release: SLNCEpls - Go Deep",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1020,
      title: "QDRN120 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN120.jpeg",
      details:
        "A surreal storm canyon artwork with glowing neon geometry, rocky cliffs, and electric lightning illuminating a futuristic structure for an official Quadron Records release: Kajacks - Run For Your Life",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1021,
      title: "QDRN119 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN119.jpeg",
      details:
        "A cinematic desert artwork with glowing golden structures, rocky dunes, cacti, and dramatic orange clouds over a futuristic landscape for an official Quadron Records release: Cl04k, BAMBINO, Teorah - Blame",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1022,
      title: "QDRN118 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Dec 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN118.png",
      details:
        "A dark industrial artwork with glowing red neon geometry and metallic pipes in a shadowy corridor for an official Quadron Records release: Neon Viruz - Running Away",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1023,
      title: "QDRN117 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Dec 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN117.jpeg",
      details:
        "A futuristic lunar base artwork with glowing clock spheres, spacecraft and modules beneath a starry night sky for an official Quadron Records release: Toxic Wraith ft. LUIGI - Clock Strike Twelve",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1024,
      title: "QDRN116 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Dec 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN116.jpeg",
      details:
        "A futuristic space exploration artwork with rocky lunar terrain and distant planets beneath a starry sky for an official Quadron Records release: Kamix, Michael Roman, Cl04k - New World",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1025,
      title: "QDRN115/RCSV057 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN115_RCSV057.jpeg",
      details:
        "A mystical cave artwork with glowing crystals, a shattered heart on rocky ground, and a star-filled sky opening above for an official Quadron Records/Recursive Recordings co-release: Arlane, Samarth Goel, Sukhbir Singh ft. Nathan Brumley - Heartless",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records/Recursive Recordings",
    },
    {
      id: 1026,
      title: "QDRN114 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN114.jpeg",
      details:
        "A moody lakeside artwork with a rustic cabin, misty water, and glowing red neon lighting under a dramatic sunset sky for an official Quadron Records release: Kamix, Coruxion - To The Beat",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1027,
      title: "QDRN113 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN113.jpeg",
      details:
        "A rainy neon city artwork with glowing street reflections, urban signage, and a futuristic nighttime atmosphere in a modern downtown setting for an official Quadron Records release: AVIS, INA FALL - Lie",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1028,
      title: "QDRN112 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN112.jpeg",
      details:
        "A vibrant forest meadow artwork with lush grass, blooming wildflowers, and sunlit oak trees surrounding a glowing futuristic centerpiece for an official Quadron Records release: Vezenance, Nari, Mike X - Jealous",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1029,
      title: "QDRN111 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN111.jpeg",
      details:
        "A mysterious night forest artwork with dense trees, warm glowing light, and atmospheric fog illuminating the scene for an official Quadron Records release: Wyko, Cl04k, Sghob ft. Barmuda - In My Mind",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1030,
      title: "QDRN110 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN110.jpeg",
      details:
        "A surreal desert night artwork with rolling sand dunes, scattered cacti, and a glowing horizon beneath a vibrant star-filled sky for an official Quadron Records release: Nil Martorell, Charlie Dens - Shine Your Light",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1031,
      title: "QDRN109 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN109.jpeg",
      details:
        "A futuristic concert stage artwork with towering speakers, glowing lights, and a crowd gathered beneath a massive illuminated performance setup for an official Quadron Records release: Kamix - Don't Wanna Wait",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1032,
      title: "QDRN106 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Sep 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN106.jpeg",
      details:
        "A dreamy celestial architecture artwork with towering white stone structures, turquoise domes, and soft glowing skies creating an ethereal futuristic skyline for an official Quadron Records release: NSJ, Grage, Ultra Line - Keeps Me High",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1033,
      title: "QDRN104 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Aug 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN104.jpeg",
      details:
        "A surreal mountain landscape artwork with glowing geometric rings, futuristic textures, and a luminous sky creating a vast cosmic atmosphere for an official Quadron Records release: Relacity, paulø - Out Of My Mind",
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1034,
      title: "Quadron Best of 2024",
      type: "Compilation Cover Art",
      category: "3d",
      date: "Dec 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRNBO24.jpeg",
      details:
        'A vibrant tropical jungle artwork with lush palm trees, towering cliffs, and bright greenery under a warm glowing sky for an official Quadron Records compilation: "Best Of Quadron 2024"',
      software: ["Blender", "Adobe Photoshop"],
      client: "Quadron Records",
    },
    {
      id: 1037,
      title: "TON031 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON031.jpeg",
      details:
        "A tropical sunset artwork with palm trees and smooth grass for an official TON 618 release: Aureonix - Metamorphosis",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1036,
      title: "TON030 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "May 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON030.jpeg",
      details:
        "A bright, sunny meadow artwork with colorful flowers and rocky logo textures for an official TON 618 release: Andreayer - Again & Again",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1031,
      title: "TON029 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "May 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON029.jpeg",
      details:
        "A dark, atmospheric red and blue mountain artwork with fiery blocky-textures for an official TON 618 release: clrwtr - Where Have You Gone",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1002,
      title: "TON028 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON028.jpeg",
      details:
        "A bright, gel-like, purple and pink artwork with bubbles and particles for an official TON 618 release: Keilex - Feeling The Light",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1003,
      title: "TON027 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Apr 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON027.jpeg",
      details:
        "A surreal cosmic ocean artwork with reflective water, icy formations, and a glowing metallic spiral beneath a vast star-filled sky for an official TON 618 release: Aureonix, Danzzle - Love Is Confusing",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1004,
      title: "TON026 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON026.jpeg",
      details:
        "A surreal rocky landscape artwork with ancient spiral stone formations, scattered ruins, and glowing embers beneath a colorful twilight sky for an official TON 618 release: JaxonZ - Steal Your Heart",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1005,
      title: "TON025 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON025.jpeg",
      details:
        "A fiery volcanic landscape artwork with blazing magma clouds, glowing reflections on dark water, and rugged mountains silhouetted against an intense crimson sky for an official TON 618 release: VANINO - For You",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1006,
      title: "TON024 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON024.jpeg",
      details:
        "A dramatic storm artwork with towering ruins, intense lightning strikes, and dark swirling clouds illuminating a powerful electric sky for an official TON 618 release: niviko. -  The Wild One",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1007,
      title: "TON023 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON023.jpeg",
      details:
        "A surreal cosmic landscape artwork with ornate metallic railings, reflective structures, and a glowing celestial sky filled with stars and distant galaxies for an official TON 618 release: West Collins - Worlds Apart",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1008,
      title: "TON022 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON022.jpeg",
      details:
        "A surreal pink and blue canyon artwork with towering rocky cliffs, glowing cosmic tentacles, and a vibrant neon twilight sky creating a mysterious otherworldly atmosphere for an official TON 618 release: KRIS DAM - Never Forever",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1009,
      title: "TON021 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON021.jpeg",
      details:
        "A frozen winter valley artwork with glowing icy structures, snow-covered trees, and shimmering blue light reflecting across a crystalline river for an official TON 618 release: ZeTrix - Cold",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1010,
      title: "TON020 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON020.jpeg",
      details:
        "A glowing violet alien landscape artwork with reflective water, futuristic geometric shapes, and luminous spiraling structures beneath a dramatic cosmic sky for an official TON 618 release: ARNASH - Lost Without You",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1011,
      title: "TON019 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Dec 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON019.jpeg",
      details:
        "A lush enchanted forest artwork with glowing golden structures, vibrant wildflowers, cascading waterfalls, and warm sunlight illuminating a vivid natural paradise for an official TON 618 release: Guy Coolid, Orexo - Feelings For You",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1012,
      title: "TON018 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Dec 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON018.jpeg",
      details:
        "A surreal nature artwork with giant stone hands emerging from lush grass, holding the logo beneath a bright peaceful sky for an official TON 618 release: FNTS, Fablers, Ryan Crosby - The Place I Need To Go",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1013,
      title: "TON017 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON017.jpeg",
      details:
        "A dreamy romantic landscape artwork with glowing pink energy swirling above a peaceful stream, colorful flowers, and distant cosmic skies for an official TON 618 release: ANAHĀTA, Rafael Delucee, Garret - The Way You Are",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1014,
      title: "TON016 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON016.jpeg",
      details: (
        <>
          A surreal cosmic forest artwork with glowing pink
          energy spirals, vibrant trees, rocky terrain, and
          distant planets illuminating a dreamy night landscape
          for an official TON 618 release: Toja - Love Tonight,
          in collaboration with{" "}
          <a
            href="https://www.instagram.com/lumo.artworks/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-400 hover:text-lime-300 underline transition-colors"
          >
            Lumo Artworks
          </a>
        </>
      ),
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1015,
      title: "TON015 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON015.jpeg",
      details:
        "A dark cosmic landscape artwork with glowing red and blue energy spirals hovering above an alien terrain, surrounded by futuristic structures and distant planets beneath a star-filled night sky for an official TON 618 release: Jaxxinator - In The Dark",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1016,
      title: "TON014 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON014.jpeg",
      details:
        "A surreal desert-pyramid landscape artwork with a glowing metallic spiral portal hovering above sandy terrain, surrounded by ancient Egyptian structures, scattered artifacts, and a radiant celestial planet beneath a star-filled cosmic sky for an official TON 618 release: CHOKKTAW, Dephan - LOW",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1017,
      title: "TON012 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Sep 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON012.jpeg",
      details:
        "A vibrant cosmic meadow artwork with a glowing purple energy spiral hovering above colorful flowers and lush alien vegetation, surrounded by distant planets and a swirling nebula beneath a star-filled night sky for an official TON 618 release: clrwtr - Still Breathing",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1018,
      title: "TON011 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Aug 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON011.jpeg",
      details:
        "A luminous stormy landscape artwork with a glowing blue energy spiral hovering above a vibrant grassy field, surrounded by futuristic geometric spheres and flashes of lightning beneath a dramatic cosmic sky for an official TON 618 release: MagLix - Live Your Way",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1019,
      title: "TON010 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Aug 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON010.jpeg",
      details:
        "A mysterious cosmic landscape artwork with a glowing violet energy spiral hovering above a rocky alien terrain, surrounded by reflective crystal-like spheres and distant mountains beneath a deep star-filled night sky for an official TON 618 release: BNK - On My Own",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1020,
      title: "TON009 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Aug 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON009.jpeg",
      details:
        "A dramatic retrofuturistic cosmic landscape artwork with a glowing red energy spiral hovering above a rugged rocky terrain, surrounded by shooting stars and streaks of lightning beneath a vivid star-filled night sky for an official TON 618 release: GRDR, RYTE - Lovers Do",
      software: ["Blender", "Adobe Photoshop"],
      client: "TON 618",
    },
    {
      id: 1021,
      title: "SR038 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR038.jpeg",
      details:
        "A warm desert sunset landscape artwork with glowing futuristic cube structures scattered across rocky cliffs and sandy terrain, surrounded by towering cacti and distant hills beneath a golden sky for an official Solvana Records release: Kamix, ClO4k - Affection",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1022,
      title: "SR037 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR037.jpeg",
      details:
        "A dramatic volcanic coastal landscape artwork with a towering futuristic metallic structure rising from glowing molten terrain, surrounded by rugged cliffs and reflective water beneath a fiery red sunset sky for an official Solvana Records release: JPT3R - Stamina",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1023,
      title: "SR036 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR036.jpeg",
      details:
        "A surreal crimson cosmic landscape artwork with glowing red spheres floating above a rugged alien terrain, surrounded by towering rock formations and distant planets beneath a dramatic star-filled sky for an official Solvana Records release: WSO - She Said",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1024,
      title: "SR035 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR035.jpeg",
      details:
        "A glowing futuristic cosmic landscape artwork with luminous ringed planets hovering above a rugged alien terrain, surrounded by lightning storms and distant mountains beneath a deep star-filled night sky for an official Solvana Records release: paulø - ready2party (Hands Up!) (VIP Mix)",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1025,
      title: "SR034 Cover Art",
      type: "Single Cover",
      category: "3d",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR034.jpeg",
      details:
        "A bright fantasy nature landscape artwork with a glowing teal futuristic structure rising from a lush grassy clearing, surrounded by wildflowers, rocky hills, and distant mountains beneath a clear blue sky for an official Solvana Records release: BENRED - In The Dark",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1026,
      title: "MNTN X Solvana ADE EP Cover Art",
      type: "EP Cover",
      category: "3d",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/MNTNxSolvana.jpeg",
      details:
        "A glowing futuristic festival landscape artwork with luminous geometric structures rising from reflective water and rocky terrain, surrounded by floating illuminated cubes beneath a dramatic golden sunset sky for an official MNTN Records/Solvana Records EP release: Solvana x MNTN - ADE Sampler 2025",
      software: ["Blender", "Adobe Photoshop"],
      client: "MNTN Records/Solvana Records",
    },
    {
      id: 1027,
      title: "Solvana Records Radio Artwork",
      type: "Radio Art",
      category: "3d",
      date: "Jul 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SolvanaRadio.jpeg",
      details:
        "A high-energy night road artwork featuring a sleek red sports car with a glowing golden illuminated wheel racing along a dark highway, surrounded by sparks of light and reflections beneath a starry night sky for an official Solvana Records radio episode: Solvana Radio - Episode 3",
      software: ["Blender", "Adobe Photoshop"],
      client: "Solvana Records",
    },
    {
      id: 1028,
      title: "Sober Cover Art (OG Version)",
      type: "Single Cover",
      category: "3d",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SoberOG.jpeg",
      details:
        "The original vibrant tropical landscape artwork with a towering stone monument rising above a lush island garden, surrounded by palm trees, colorful flowers, and flowing water beneath a warm golden sunset sky for an official release: AVIS, Jacøb - Sober",
      software: ["Blender", "Adobe Photoshop"],
      client: "AVIS/Jacøb/Nuance Recordings",
    },
    {
      id: 1029,
      title: "Till We Make It Art",
      type: "Single Cover",
      category: "3d",
      date: "TBD",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TillWeMakeIt.jpeg",
      details:
        "A bright dreamy nature landscape artwork with winding turquoise rivers flowing through a lush meadow of colorful wildflowers, surrounded by rolling green hills and soft clouds beneath a clear blue sky and rainbow for an official release: blo0my - Till We Make It",
      software: ["Blender", "Adobe Photoshop"],
      client: "blo0my",
    },
    {
      id: 1038,
      title: "Heartsick EP Visuals",
      type: "Animation",
      category: "animations",
      date: "Aug 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/misc/JOEVisual.png",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/JOEVisual.mp4",
      details:
        "8-second 3D animation of a heart with flashing effects and particles. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "JOE",
    },
    {
      id: 1030,
      title: "I Just Flow - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/I_Just_Flow_Artwork.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/IJustFlowAnimation.mp4",
      details:
        "8-second looping 3D animation of the I Just Flow artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Myself/Hilefex",
    },
    {
      id: 2001,
      title: "SR038 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR038.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/SR038Animation.mp4",
      details:
        "8-second looping 3D animation of the SR038 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Solvana Records",
    },
    {
      id: 2002,
      title: "SR036 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Nov 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR036.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/SR036Animation.mp4",
      details:
        "8-second looping 3D animation of the SR036 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Solvana Records",
    },
    {
      id: 2003,
      title: "SR034 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SR034.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/SR034Animation.mp4",
      details:
        "8-second looping 3D animation of the SR034 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Solvana Records",
    },
    {
      id: 2004,
      title: "MNTN X Solvana ADE EP - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Oct 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/MNTNxSolvana.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/MNTNxSolvanaAnimation.mp4",
      details:
        "8-second looping 3D animation of the MNTN X Solvana ADE EP artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "MNTN Records/Solvana Records",
    },
    {
      id: 2005,
      title: "Solvana Records Radio - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jul 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/SolvanaRadio.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/SolvanaRadioAnimation.mp4",
      details:
        "8-second looping 3D animation of the Solvana Records Radio artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Solvana Records",
    },
    {
      id: 2020,
      title: "TON031 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON031.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON031Animation.mp4",
      details:
        "8-second looping 3D animation of the TON031 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2006,
      title: "TON026 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON026.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON026Animation.mp4",
      details:
        "8-second looping 3D animation of the TON026 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2007,
      title: "TON024 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Feb 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON024.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON024Animation.mp4",
      details:
        "8-second looping 3D animation of the TON024 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2008,
      title: "TON021 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jan 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON021.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON021Animation.mp4",
      details:
        "8-second looping 3D animation of the TON021 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2009,
      title: "TON019 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Dec 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON019.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON019Animation.mp4",
      details:
        "8-second looping 3D animation of the TON019 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2010,
      title: "TON012 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Sep 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON012.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON012Animation.mp4",
      details:
        "8-second looping 3D animation of the TON012 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2011,
      title: "TON010 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Aug 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/TON010.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/TON010Animation.mp4",
      details:
        "8-second looping 3D animation of the TON010 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "TON 618",
    },
    {
      id: 2012,
      title: "Send Me An Angel - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jan 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/Send_Me_An_Angel_Artwork.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/SendMeAnAngelAnimation.mp4",
      details:
        "8-second looping 2D animation of the Send Me An Angel artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Adobe After Effects"],
      client: "Quadron Records/Myself",
    },
    {
      id: 2013,
      title: "QDRN135 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Apr 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN135.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN135Animation.mp4",
      details:
        "8-second looping 3D animation of the QDRN135 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 2014,
      title: "QDRN128 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Mar 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN128.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN128Animation.mp4",
      details:
        "8-second looping 3D animation of the QDRN128 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 2015,
      title: "QDRN121 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN121.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN121Animation.mp4",
      details:
        "8-second looping 3D animation of the QDRN121 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 2016,
      title: "QDRN120 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Jan 2025",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN120.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN120Animation.mp4",
      details:
        "8-second looping 3D animation of the QDRN120 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 2017,
      title: "QDRN115/RCSV057 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Nov 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/3d/QDRN115_RCSV057.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN115_RCSV057Animation.mp4",
      details:
        "8-second looping 3D animation of the QDRN115/RCSV057 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Blender", "Adobe After Effects"],
      client: "Quadron Records/Recursive Recordings",
    },
    {
      id: 2018,
      title: "QDRN108 - Animated Cover",
      type: "Animation",
      category: "animations",
      date: "Sep 2024",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/2d/QDRN108.jpeg",
      videoUrl:
        "https://assets.musicbystripes.com/client%20cover%20arts/animations/QDRN108Animation.mp4",
      details:
        "8-second looping 2D animation of the QDRN108 artwork optimized for a Spotify Canvas. *Not real quality, compressed for web.",
      software: ["Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 2021,
      title: "Timeless Isle Spotify Playlist Covers",
      type: "Spotify Playlist Covers",
      category: "misc",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/misc/TimelessIslePlaylistProject.jpg",
      details:
        "Package of five 1500x1500 2D artworks for Spotify Playlist covers. *Not real quality, compressed for web.",
      software: ["Adobe Photoshop"],
      client: "Timeless Isle",
    },
    {
      id: 1035,
      title: "Stripes Mashup Pack Vol.1",
      type: "Mashup Pack Artwork",
      category: "misc",
      date: "Apr 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/misc/Stripes_Mashup_Pack_Vol_1_Artwork.jpg",
      details:
        "Orange computer-textured DJ controller artwork with soft glowing tubes for the first edition of a mashup pack",
      software: ["Blender", "Adobe Photoshop"],
      client: "Myself",
    },
    {
      id: 2019,
      title:
        "Toxic Wraith Lost In It Remix Comp Social Media Graphic",
      type: "Social Media Graphic",
      category: "misc",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/client%20cover%20arts/misc/LostInItRemixCompGraphic.jpeg",
      details:
        'Social media graphic announcing/promoting the Lost In It Remix competition for Toxic Wraith and LAWEN\'s song "Lost In It" *Not real quality, compressed for web.',
      software: ["Adobe Photoshop"],
      client: "Toxic Wraith/LAWEN/Audius",
    },
    {
      id: 6001,
      title: "AVIS Visuals",
      type: "DJ Set Visuals",
      category: "set-visuals",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_1_thumb.png",
      images: [
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_1.mp4",
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_2.mp4",
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_3.mp4",
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_4.mp4",
      ],
      videoUrl:
        "https://assets.musicbystripes.com/set%20visuals/Avisv2_1.mp4",
      details:
        "Collection of custom DJ set visuals created for AVIS performances. Features dynamic motion graphics, branding elements, and synchronized visual effects.",
      software: [
        "Blender",
        "Adobe After Effects",
        "Adobe Premiere Pro",
      ],
      client: "AVIS",
    },
    {
      id: 5001,
      title: "Stripes' Website",
      type: "Website",
      category: "websites",
      date: "Mar 2026",
      image:
        "https://assets.musicbystripes.com/websites/mywebsite.png",
      youtubeUrl: "https://musicbystripes.com",
      details:
        "Personal portfolio website showcasing music production, graphic design work, drum samples, and contact information. Built with React, Tailwind CSS, and Supabase.",
      software: ["React", "Tailwind CSS", "Supabase", "Figma"],
      client: "Myself",
    },
    {
      id: 5002,
      title: "BUTTER's Website",
      type: "Website",
      category: "websites",
      date: "Jun 2026",
      image:
        "https://assets.musicbystripes.com/websites/butterwebsite.png",
      youtubeUrl: "https://buttermusic.dk",
      details:
        "Website for BUTTER, a Danish music producer. Features eye-catching home page, release catalog, and tour dates.",
      software: ["React", "Tailwind CSS", "Figma"],
      client: "Butter Music",
    },
    {
      id: 4002,
      title:
        "Bukkoy, Ray - Flying So High (Official Lyric Video)",
      type: "Lyric Video",
      category: "lyric-videos",
      date: "Aug 2026",
      image:
        "https://img.youtube.com/vi/CVymDXIjxZ4/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=CVymDXIjxZ4",
      details:
        "Full-length lyric video with animated text, animated backgrounds, and visual effects synchronized to the music matching the official cover art.",
      software: ["Adobe After Effects"],
      client: "Timeless",
    },
    {
      id: 4001,
      title:
        "Daevo, paulø, Adi - Wondering (ft. VINC) (Concept Lyric Video)",
      type: "Lyric Video",
      category: "lyric-videos",
      date: "Apr 2025",
      image:
        "https://img.youtube.com/vi/8ymRbuqmVPg/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=8ymRbuqmVPg",
      details:
        "Full-length lyric video with animated text, interesting backgrounds, and visual effects synchronized to the music",
      software: ["Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 3001,
      title:
        "Time To Talk, Azertion, JJD - Street Lights (ft. Axollo) (Fan-Made Lyric Video)",
      type: "Lyric Video",
      category: "lyric-videos",
      date: "Oct 2022",
      image:
        "https://img.youtube.com/vi/PbFfEBsAXrs/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=PbFfEBsAXrs",
      details:
        "Full-length lyric video with animated text, interesting backgrounds, and visual effects synchronized to the music",
      software: ["Adobe After Effects"],
      client: "N/A",
    },
    {
      id: 3002,
      title:
        "Wyko, Cl04k, Sghob - In My Mind (ft. Barmuda) (Official Lyric Video)",
      type: "Lyric Video",
      category: "lyric-videos",
      date: "Oct 2024",
      image:
        "https://img.youtube.com/vi/W3OyWIeCZOc/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=W3OyWIeCZOc",
      details:
        "Full-length lyric video with animated text and visual effects synchronized to the music",
      software: ["Adobe After Effects"],
      client: "Quadron Records",
    },
    {
      id: 3003,
      title:
        "Nexoria - Rewind (ft. Charlie Copper) (Official Lyric Video)",
      type: "Lyric Video",
      category: "lyric-videos",
      date: "Mar 2024",
      image:
        "https://img.youtube.com/vi/2-YM31nuCpI/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=2-YM31nuCpI",
      details:
        "Full-length lyric video with animated text and visual effects synchronized to the music",
      software: ["Adobe After Effects"],
      client: "Quadron Records",
    },
  ];

  const filteredItems =
    activeTab === "all"
      ? artworkItems
      : artworkItems.filter(
          (item) => item.category === activeTab,
        );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Background Image for entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://assets.musicbystripes.com/artwork_collage.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-10 saturate-25 translate-y-[125px]"
          style={{
            transform: `translateY(${scrollY * -0.02}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://assets.musicbystripes.com/artwork_page_background.png"
            alt="Artwork Background"
            className="w-full h-full object-cover opacity-30 saturate-0"
            style={{ objectPosition: "center center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            MY{" "}
            <span style={{ color: "var(--lime-green)" }}>
              DESIGNS
            </span>
          </h1>
          <p
            className="max-w-3xl text-[24px] font-[Barlow]"
            style={{ color: "var(--golden-yellow)" }}
          >
            Graphic design work for clients and my personal
            music :) <br />
            Want an artwork?{" "}
            <a
              href="https://www.instagram.com/musicbystripes"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              DM me on Instagram!
            </a>
          </p>

          <a
            href="https://www.behance.net/jaketr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--sky-blue)] hover:bg-[var(--sky-blue)]/80 text-black font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-[var(--sky-blue)]/30 font-[Barlow]"
          >
            View More on Behance
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10 sticky top-20 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("2d")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "2d"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              2D Covers
            </button>
            <button
              onClick={() => setActiveTab("3d")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "3d"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              3D Covers
            </button>
            <button
              onClick={() => setActiveTab("animations")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "animations"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Animations
            </button>
            <button
              onClick={() => setActiveTab("lyric-videos")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "lyric-videos"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Lyric Videos
            </button>
            <button
              onClick={() => setActiveTab("websites")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "websites"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Websites
            </button>
            <button
              onClick={() => setActiveTab("set-visuals")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "set-visuals"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Set Visuals
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "all"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("misc")}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-[Barlow] ${
                activeTab === "misc"
                  ? "bg-[var(--lime-green)] text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Misc
            </button>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 2,
              1024: 3,
              1280: 4,
            }}
          >
            <Masonry gutter="1.5rem">
              {filteredItems.map((item) => (
                <ArtworkCard
                  key={item.id}
                  item={item}
                  onClick={() => {
                    setSelectedItem(item);
                    setModalSlideIndex(0);
                  }}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </section>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-zinc-950 rounded-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--lime-green)] hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative">
                {selectedItem.videoUrl &&
                !selectedItem.images ? (
                  <div className="flex justify-center bg-black">
                    <video
                      src={selectedItem.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-xlg h-auto rounded-t-2xl"
                      controls
                    />
                  </div>
                ) : selectedItem.youtubeUrl &&
                  selectedItem.category === "lyric-videos" ? (
                  <div className="flex justify-center bg-black">
                    <iframe
                      width="100%"
                      height="600"
                      src={`https://www.youtube.com/embed/${selectedItem.youtubeUrl.split("v=")[1]}`}
                      title={selectedItem.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-2xl"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center bg-black">
                    {(() => {
                      const currentModalSlide =
                        selectedItem.images
                          ? selectedItem.images[modalSlideIndex]
                          : selectedItem.image;
                      const isModalSlideVideo =
                        currentModalSlide?.endsWith(".mp4");

                      return isModalSlideVideo ? (
                        <video
                          key={currentModalSlide}
                          src={currentModalSlide}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          className="max-w-5xl h-auto rounded-t-2xl"
                        />
                      ) : (
                        <ImageWithFallback
                          src={currentModalSlide}
                          alt={selectedItem.title}
                          className="max-w-5xl h-auto rounded-t-2xl"
                        />
                      );
                    })()}
                  </div>
                )}

                {/* Slideshow Arrow Button for Modal */}
                {selectedItem.images &&
                  selectedItem.images.length > 1 &&
                  selectedItem.category !== "lyric-videos" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalSlideIndex(
                          (prev) =>
                            (prev + 1) %
                            selectedItem.images!.length,
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--lime-green)] hover:text-black transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}

                {/* Video/Link Icon Overlay - only show for YouTube links on non-lyric-video items */}
                {selectedItem.youtubeUrl &&
                  !selectedItem.videoUrl &&
                  selectedItem.category !== "lyric-videos" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[var(--lime-green)]/20 backdrop-blur-sm flex items-center justify-center border-4 border-[var(--lime-green)]">
                        <Play
                          className="w-10 h-10"
                          style={{ color: "var(--lime-green)" }}
                        />
                      </div>
                    </div>
                  )}
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs px-3 py-1.5 rounded-full font-semibold font-[Barlow]"
                      style={{
                        backgroundColor:
                          selectedItem.category === "2d"
                            ? "var(--sky-blue)"
                            : selectedItem.category === "3d"
                              ? "var(--golden-yellow)"
                              : selectedItem.category ===
                                  "animations"
                                ? "var(--lime-green)"
                                : selectedItem.category ===
                                    "lyric-videos"
                                  ? "var(--sky-blue)"
                                  : selectedItem.category ===
                                      "websites"
                                    ? "var(--color-red-300)"
                                    : selectedItem.category ===
                                        "set-visuals"
                                      ? "var(--golden-yellow)"
                                      : "#9333ea",
                        color: "#000",
                      }}
                    >
                      {selectedItem.type}
                    </span>
                    <span className="text-sm text-gray-400 font-[Barlow]">
                      {selectedItem.date}
                    </span>
                  </div>
                  <h2
                    className="text-4xl md:text-5xl font-black"
                    style={{ color: "var(--lime-green)" }}
                  >
                    {selectedItem.title}
                  </h2>
                </div>

                {/* Details */}
                {selectedItem.details && (
                  <div className="mb-6">
                    <h3
                      className="text-xl font-black mb-2"
                      style={{ color: "var(--golden-yellow)" }}
                    >
                      DETAILS
                    </h3>
                    <p className="text-gray-300 font-[Barlow] leading-relaxed">
                      {selectedItem.details}
                    </p>
                  </div>
                )}

                {/* Technical Info */}
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  {selectedItem.client && (
                    <div>
                      <h3
                        className="text-sm font-black mb-2 uppercase tracking-wider"
                        style={{ color: "var(--sky-blue)" }}
                      >
                        Client
                      </h3>
                      <p className="text-gray-300 font-[Barlow]">
                        {selectedItem.client}
                      </p>
                    </div>
                  )}
                  {selectedItem.software && (
                    <div>
                      <h3
                        className="text-sm font-black mb-2 uppercase tracking-wider"
                        style={{ color: "var(--sky-blue)" }}
                      >
                        Software Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.software.map(
                          (soft, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-gray-300 font-[Barlow]"
                            >
                              {soft}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedItem.youtubeUrl && (
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={selectedItem.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all font-[Barlow] bg-zinc-900 hover:bg-zinc-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {selectedItem.category === "websites"
                        ? "Visit Website"
                        : "Watch on YouTube"}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}