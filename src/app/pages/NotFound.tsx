import { Link } from "react-router";
import { Home, Music, AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Geometric Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 48%, var(--lime-green) 48%, var(--lime-green) 52%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, var(--sky-blue) 48%, var(--sky-blue) 52%, transparent 52%)
            `,
            backgroundSize: "100px 100px, 100px 100px",
            backgroundPosition: "0 0, 50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, var(--golden-yellow) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lime-green)]/10 via-transparent to-[var(--sky-blue)]/10 pointer-events-none" />

      <style>{`
        @keyframes geometricSlide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        @keyframes geometricPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Number */}
        <div className="mb-8 relative">
          <h1
            className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter select-none"
            style={{
              background: `linear-gradient(135deg, var(--lime-green) 0%, var(--golden-yellow) 50%, var(--sky-blue) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "glitch 3s ease-in-out infinite",
            }}
          >
            404
          </h1>
          <div
            className="absolute inset-0 text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter opacity-20 blur-2xl select-none"
            style={{
              background: `linear-gradient(135deg, var(--lime-green) 0%, var(--golden-yellow) 50%, var(--sky-blue) 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="p-6 rounded-full border-4 border-[var(--lime-green)]/30 bg-[var(--lime-green)]/10"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <AlertCircle className="w-16 h-16 text-[var(--lime-green)]" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tight font-[Barlow]">
          PAGE NOT <span style={{ color: "var(--lime-green)" }}>FOUND</span>
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg bg-[var(--lime-green)] text-black hover:bg-[var(--lime-green)]/90 transition-all active:translate-y-[1px] shadow-[0_0_30px_rgba(186,255,0,0.3)] hover:shadow-[0_0_40px_rgba(186,255,0,0.5)] font-[Barlow]"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/music"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg border-2 border-[var(--sky-blue)] text-white hover:bg-[var(--sky-blue)]/20 transition-all active:translate-y-[1px] font-[Barlow]"
          >
            <Music className="w-5 h-5" />
            <span>Explore Music</span>
          </Link>
        </div>
      </div>
    </div>
  );
}