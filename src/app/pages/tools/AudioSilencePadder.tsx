import { useState, useRef, useCallback } from "react";

type Position = "beginning" | "end";
type Phase = "idle" | "processing" | "done" | "error";

// Encode an AudioBuffer to a WAV Blob (16-bit PCM)
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const write = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };
  const writeU32 = (o: number, v: number) =>
    view.setUint32(o, v, true);
  const writeU16 = (o: number, v: number) =>
    view.setUint16(o, v, true);

  write(0, "RIFF");
  writeU32(4, 36 + dataSize);
  write(8, "WAVE");
  write(12, "fmt ");
  writeU32(16, 16);
  writeU16(20, 1); // PCM
  writeU16(22, numChannels);
  writeU32(24, sampleRate);
  writeU32(28, sampleRate * blockAlign);
  writeU16(32, blockAlign);
  writeU16(34, 16);
  write(36, "data");
  writeU32(40, dataSize);

  // Interleave channels as 16-bit signed PCM
  const channels = Array.from({ length: numChannels }, (_, c) =>
    buffer.getChannelData(c),
  );
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(
        offset,
        s < 0 ? s * 0x8000 : s * 0x7fff,
        true,
      );
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export function AudioSilencePadder() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState("60");
  const [position, setPosition] =
    useState<Position>("beginning");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(
    null,
  );
  const [outputName, setOutputName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (f: File) => {
    setFile(f);
    setOutputUrl(null);
    setPhase("idle");
    setErrorMsg("");
    setProgress(0);
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  }, []);

  const process = async () => {
    if (!file) return;
    const secs = Number(duration);
    if (!duration || isNaN(secs) || secs <= 0) {
      setErrorMsg("Please enter a valid duration in seconds");
      return;
    }

    setErrorMsg("");
    setPhase("processing");
    setProgress(10);

    try {
      // Decode the audio file using the browser's built-in decoder
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const audioCtx = new AudioContext();
      const decoded =
        await audioCtx.decodeAudioData(arrayBuffer);
      setProgress(60);

      const sampleRate = decoded.sampleRate;
      const numChannels = decoded.numberOfChannels;
      const silenceSamples = Math.floor(sampleRate * secs);
      const totalSamples = decoded.length + silenceSamples;

      const outBuffer = audioCtx.createBuffer(
        numChannels,
        totalSamples,
        sampleRate,
      );

      for (let c = 0; c < numChannels; c++) {
        const src = decoded.getChannelData(c);
        const dst = outBuffer.getChannelData(c);
        if (position === "beginning") {
          dst.set(src, silenceSamples); // silence is already zeros
        } else {
          dst.set(src, 0);
          // tail is already zeros
        }
      }

      setProgress(85);

      const wav = audioBufferToWav(outBuffer);
      const url = URL.createObjectURL(wav);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const suffix =
        position === "beginning"
          ? "_silence_start"
          : "_silence_end";

      setOutputUrl(url);
      setOutputName(`${baseName}${suffix}.wav`);
      setProgress(100);
      setPhase("done");
      await audioCtx.close();
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Could not decode audio file",
      );
      setPhase("error");
    }
  };

  const download = () => {
    if (!outputUrl) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = outputName;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setOutputUrl(null);
    setPhase("idle");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isWorking = phase === "processing";

  return (
    <div className="min-h-screen bg-black text-white py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halftone Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, var(--lime-green) 1px, transparent 1px),
              radial-gradient(circle, var(--lime-green) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px, 40px 40px",
            backgroundPosition: "0 0, 20px 20px",
            animation: "halftoneWave 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--golden-yellow) 0.5px, transparent 0.5px)`,
            backgroundSize: "25px 25px",
            backgroundPosition: "10px 10px",
            animation:
              "halftoneWave 6s ease-in-out infinite reverse",
          }}
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--lime-green)]/5 via-transparent to-[var(--lime-green)]/5 pointer-events-none"
        style={{
          animation: "pulseGlow 8s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes halftoneWave {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(15px, -10px); }
          50%  { transform: translate(0, -20px); }
          75%  { transform: translate(-15px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            AUDIO SILENCE{" "}
            <span style={{ color: "var(--lime-green)" }}>
              PADDER
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-[Barlow]">
            Add silence to the beginning or end of any audio
            file — instant, right in your browser
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.03] border border-white/10 rounded-2xl shadow-[0_18px_55px_rgba(0,0,0,0.55)] overflow-hidden backdrop-blur-[3px]">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-b from-[var(--lime-green)]/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black font-[Barlow]">
                SILENCE PADDER
              </h2>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-white/12 bg-black/25 font-[Barlow]">
                WEB AUDIO API
              </span>
            </div>
            <p className="text-sm text-gray-400 font-[Barlow]">
              Upload an audio file, configure options, and
              download the padded result as WAV.
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Drop Zone */}
            <div>
              <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider font-[Barlow]">
                Audio file
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                  isDragging
                    ? "border-[var(--lime-green)] bg-[var(--lime-green)]/10"
                    : file
                      ? "border-[var(--lime-green)]/40 bg-[var(--lime-green)]/5"
                      : "border-white/15 bg-black/20 hover:border-white/30"
                }`}
                onClick={() =>
                  !isWorking && inputRef.current?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/*"
                  onChange={onFileChange}
                  className="hidden"
                  disabled={isWorking}
                />
                <div className="px-6 py-8 text-center">
                  {file ? (
                    <>
                      <div className="text-2xl mb-2">🎵</div>
                      <p className="text-sm font-semibold text-white font-[Barlow] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-white/45 font-[Barlow] mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB — click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-3 opacity-40">
                        ⬆
                      </div>
                      <p className="text-sm text-white/60 font-[Barlow]">
                        Drag &amp; drop or click to select an
                        audio file
                      </p>
                      <p className="text-xs text-white/30 font-[Barlow] mt-1">
                        MP3, WAV, FLAC, AAC, OGG, and more
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider font-[Barlow]">
                Silence duration (seconds)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isWorking}
                placeholder="60"
                className="w-full h-10 rounded-xl border border-white/12 bg-black/25 text-white px-4 text-sm font-[Barlow] placeholder:text-white/45 focus:outline-none focus:border-[var(--lime-green)]/65 focus:ring-4 focus:ring-[var(--lime-green)]/18 transition-all disabled:opacity-50"
              />
            </div>

            {/* Position Toggle */}
            <div>
              <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider font-[Barlow]">
                Where to add silence
              </label>
              <div className="flex rounded-xl overflow-hidden border border-white/12">
                {(["beginning", "end"] as Position[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      disabled={isWorking}
                      className={`flex-1 h-10 text-sm font-bold font-[Barlow] uppercase transition-all disabled:opacity-50 ${
                        position === p
                          ? "bg-[var(--lime-green)] text-black"
                          : "bg-black/25 text-white/60 hover:bg-white/8"
                      } ${p === "end" ? "border-l border-white/12" : ""}`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={process}
              disabled={!file || isWorking}
              className="w-full h-10 rounded-xl font-bold text-white bg-[#1a1a1a] border-2 border-[var(--lime-green)] hover:bg-[var(--lime-green)] hover:text-black transition-all active:translate-y-[1px] font-[Barlow] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a] disabled:hover:text-white"
            >
              {isWorking ? "PROCESSING…" : "ADD SILENCE"}
            </button>

            {/* Progress Bar */}
            {isWorking && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/50 font-[Barlow]">
                    Processing audio…
                  </span>
                  <span className="text-xs text-white/50 font-[Barlow]">
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: "var(--lime-green)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Done */}
            {phase === "done" && outputUrl && (
              <div className="border border-[var(--lime-green)]/30 rounded-xl bg-[var(--lime-green)]/5 p-4">
                <p className="text-sm font-semibold text-white font-[Barlow] mb-1">
                  Done!
                </p>
                <p className="text-xs text-white/50 font-[Barlow] mb-4 truncate">
                  {outputName}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={download}
                    className="flex-1 h-10 rounded-xl font-bold text-black bg-[var(--lime-green)] hover:opacity-90 transition-all active:translate-y-[1px] font-[Barlow]"
                  >
                    DOWNLOAD
                  </button>
                  <button
                    onClick={reset}
                    className="flex-1 h-10 rounded-xl font-bold text-white bg-white/6 border border-white/10 hover:bg-white/10 transition-all active:translate-y-[1px] font-[Barlow]"
                  >
                    START OVER
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {phase === "error" && errorMsg && (
              <div className="text-xs font-bold text-red-400 font-[Barlow] bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {errorMsg}
              </div>
            )}

            {phase === "idle" && errorMsg && (
              <div className="text-xs font-bold text-red-400 font-[Barlow]">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-[3px]">
          <h3 className="text-lg font-bold mb-3 font-[Barlow]">
            HOW IT WORKS
          </h3>
          <ul className="space-y-2 text-sm text-gray-400 font-[Barlow] list-disc list-inside">
            <li>
              Uses the browser's built-in Web Audio API — no
              plugins or loading required
            </li>
            <li>
              Accepts MP3, WAV, FLAC, AAC, OGG, and any other
              format your browser can play
            </li>
            <li>
              Output is always a WAV file (lossless,
              uncompressed PCM)
            </li>
            <li>
              Output is named with a{" "}
              <code className="text-white/70">
                _silence_start
              </code>{" "}
              or{" "}
              <code className="text-white/70">
                _silence_end
              </code>{" "}
              suffix
            </li>
            <li>Your audio never leaves your device</li>
          </ul>
        </div>

        {/* Why */}
        <div className="mt-8 p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-[3px]">
          <h3 className="text-lg font-bold mb-3 font-[Barlow]">
            WHY USE THIS?
          </h3>
          <p className="text-sm text-gray-400 font-[Barlow] leading-relaxed">
            Some streaming platforms and DJ software need audio
            to start or end with silence — to prevent clipping
            at playback start, give CDJs load time before the
            drop, or pad a mix export so it does not cut off
            abruptly. Rather than opening a DAW just to
            re-export with empty bars, drop your file here and
            get the padded version in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}