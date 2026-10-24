import { useState } from "react";

const demoGif = "https://assets.musicbystripes.com/GDAutoExportExample.gif";

export function GDAutoExport() {
  const [driveLink, setDriveLink] = useState("");
  const [finalLink, setFinalLink] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "good" | "bad" | ""
  >("");
  const [showOutput, setShowOutput] = useState(false);

  const convert = () => {
    const input = driveLink.trim();
    const m1 = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const m2 = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const id = (m1 && m1[1]) || (m2 && m2[1]);

    if (!id) {
      setStatusMessage("Invalid Google Drive file link");
      setStatusType("bad");
      setShowOutput(false);
      return;
    }

    const link = `https://drive.google.com/uc?export=download&id=${id}`;
    setFinalLink(link);
    setShowOutput(true);
    setStatusMessage("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(finalLink).then(() => {
      setStatusMessage("Copied!");
      setStatusType("good");
    });
  };

  const clearAll = () => {
    setDriveLink("");
    setShowOutput(false);
    setStatusMessage("");
  };

  return (
    <div className="min-h-screen bg-black text-white py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Halftone Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, var(--lime-green) 1px, transparent 1px),
              radial-gradient(circle, var(--sky-blue) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px, 40px 40px",
            backgroundPosition: "0 0, 20px 20px",
            animation: "halftoneWave 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, var(--golden-yellow) 0.5px, transparent 0.5px)
            `,
            backgroundSize: "25px 25px",
            backgroundPosition: "10px 10px",
            animation:
              "halftoneWave 6s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--lime-green)]/5 via-transparent to-[var(--sky-blue)]/5 pointer-events-none"
        style={{
          animation: "pulseGlow 8s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes halftoneWave {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, -10px);
          }
          50% {
            transform: translate(0, -20px);
          }
          75% {
            transform: translate(-15px, -10px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            GOOGLE DRIVE LINK AUTO{" "}
            <span style={{ color: "var(--lime-green)" }}>
              DOWNLOAD
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-[Barlow]">
            Convert Google Drive file links into automatic
            download URLs
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.03] border border-white/10 rounded-2xl shadow-[0_18px_55px_rgba(0,0,0,0.55)] overflow-hidden backdrop-blur-[3px]">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-b from-[var(--lime-green)]/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black font-[Barlow]">
                DRIVE LINK GENERATOR
              </h2>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/12 bg-black/25 font-[Barlow]">
                AUTO-DOWNLOAD
              </span>
            </div>
            <p className="text-sm text-gray-400 font-[Barlow]">
              Paste a Drive file link and get a direct download
              URL.
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6">
            {/* Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider font-[Barlow]">
                Google Drive file link
              </label>
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && convert()
                }
                placeholder="https://drive.google.com/file/d/FILE_ID/view"
                className="w-full h-10 rounded-xl border border-white/12 bg-black/25 text-white px-4 text-sm font-[Barlow] placeholder:text-white/45 focus:outline-none focus:border-[var(--lime-green)]/65 focus:ring-4 focus:ring-[var(--lime-green)]/18 transition-all"
              />
              <p className="mt-2 text-xs text-white/55 font-[Barlow]">
                Supports both /file/d/ and ?id= formats
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={convert}
              className="w-full h-10 rounded-xl font-bold text-white bg-[#1a1a1a] border-2 border-[var(--lime-green)] hover:bg-[var(--lime-green)] hover:text-black transition-all active:translate-y-[1px] font-[Barlow]"
            >
              Generate Link
            </button>

            {/* Output */}
            {showOutput && (
              <div className="mt-4">
                <div className="border border-white/12 rounded-xl bg-black/30 p-3 text-sm break-all font-[Barlow] text-gray-300">
                  {finalLink}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={copyLink}
                    className="flex-1 h-10 rounded-xl font-bold text-white bg-white/6 border border-white/10 hover:bg-white/10 transition-all active:translate-y-[1px] font-[Barlow]"
                  >
                    Copy
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex-1 h-10 rounded-xl font-bold text-white bg-white/6 border border-white/10 hover:bg-white/10 transition-all active:translate-y-[1px] font-[Barlow]"
                  >
                    Clear
                  </button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`mt-2 text-xs font-bold font-[Barlow] ${
                      statusType === "good"
                        ? "text-[var(--lime-green)]"
                        : "text-red-500"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {!showOutput && statusMessage && (
              <div className="mt-2 text-xs font-bold text-red-500 font-[Barlow]">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-[3px]">
          <h3 className="text-lg font-bold mb-3 font-[Barlow]">
            HOW TO USE
          </h3>
          <ol className="space-y-2 text-sm text-gray-400 font-[Barlow] list-decimal list-inside">
            <li>
              Share your Google Drive file with "Anyone with the
              link" access
            </li>
            <li>Copy the sharing link from Google Drive</li>
            <li>Paste it into the input field above</li>
            <li>
              Click "Generate Link" to get your direct download
              URL
            </li>
            <li>
              Use the generated link anywhere for instant
              downloads
            </li>
          </ol>
        </div>

        {/* Why Use This Tool Section */}
        <div className="mt-8 p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-[3px]">
          <h3 className="text-lg font-bold mb-3 font-[Barlow]">
            WHY USE THIS TOOL?
          </h3>
          <p className="text-sm text-gray-400 font-[Barlow] leading-relaxed mb-4">
            This tool converts Google Drive links into automatic
            download URLs. When someone opens one of these links
            in their browser, the file downloads immediately. No
            Google Drive "middleman" page required. This is
            perfect for music producers sharing extended mixes
            or sample packs. By eliminating extra steps, you
            reduce the chance of users clicking away before
            downloading. It also removes confusion about which
            download button to click, creating a smoother, more
            professional experience for your audience.
          </p>
          <p className="text-sm text-gray-300 font-[Barlow] font-semibold mb-3">
            Here's a demonstration:
          </p>
          <img
            src={demoGif}
            alt="Google Drive auto-download demonstration"
            className="w-full rounded-xl border border-white/10"
          />
        </div>
      </div>
    </div>
  );
}