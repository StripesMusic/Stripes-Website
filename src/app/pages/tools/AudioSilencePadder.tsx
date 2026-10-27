import { useState, useRef, useCallback } from "react";
import { ToolPage } from "../../components/ToolPage";

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
    <ToolPage
      path="/tools/audio-silence-padder"
      title="Audio Silence Padder"
      lede="Add silence to the start or end of any track, right in your browser."
      note="Works locally."
      how={
        <ul>
          <li>Uses the browser's own Web Audio API: nothing to install or load.</li>
          <li>Takes MP3, WAV, FLAC, AAC, OGG and anything else your browser can play.</li>
          <li>
            Always gives back a WAV (lossless PCM), named with <code>_silence_start</code> or <code>_silence_end</code>.
          </li>
          <li>Your audio never leaves your device.</li>
        </ul>
      }
      why={
        <p>
          Some platforms and DJ software want audio to start or end with silence: to stop clipping at the start, to give CDJs time to load before the drop, or
          to pad a mix so it doesn't cut off. Rather than opening a DAW just to re-export with empty bars, drop the file here.
        </p>
      }
    >
      <div className="s-form">
        <div className="s-field">
          <span className="s-mono" id="asp-file">
            Audio file
          </span>
          <div
            className={"s-drop" + (isDragging ? " is-over" : "") + (file ? " has-file" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input ref={inputRef} type="file" accept="audio/*" onChange={onFileChange} disabled={isWorking} aria-labelledby="asp-file" className="s-drop-input" />
            {file ? (
              <>
                <span className="s-drop-name">{file.name}</span>
                <span className="s-mono">{(file.size / 1024 / 1024).toFixed(2)} MB · choose another</span>
              </>
            ) : (
              <>
                <span className="s-drop-name">Drop a track here, or choose one</span>
                <span className="s-mono">MP3, WAV, FLAC, AAC, OGG and more</span>
              </>
            )}
          </div>
        </div>

        <label className="s-field">
          <span className="s-mono">Silence (seconds)</span>
          <input className="s-input" type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={isWorking} placeholder="60" />
        </label>

        <div className="s-field">
          <span className="s-mono" id="asp-pos">
            Where
          </span>
          <div className="s-seg" role="group" aria-labelledby="asp-pos">
            {(["beginning", "end"] as Position[]).map((p) => (
              <button key={p} type="button" aria-pressed={position === p} onClick={() => setPosition(p)} disabled={isWorking}>
                {p === "beginning" ? "At the start" : "At the end"}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="s-btn s-btn-solid s-btn-lg" onClick={process} disabled={!file || isWorking}>
          {isWorking ? "Working…" : "Add silence"}
        </button>
      </div>

      {isWorking && (
        <div className="s-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Processing">
          <span style={{ width: `${progress}%` }} />
          <span className="s-mono">{progress}%</span>
        </div>
      )}

      {phase === "done" && outputUrl && (
        <div className="s-out">
          <span className="s-mono">Done</span>
          <code className="s-out-val">{outputName}</code>
          <div className="s-ctas">
            <button type="button" className="s-btn s-btn-solid" onClick={download}>
              Download
            </button>
            <button type="button" className="s-btn" onClick={reset}>
              Start over
            </button>
          </div>
        </div>
      )}
      {errorMsg && (
        <p className="s-status s-mono is-bad" role="alert">
          {errorMsg}
        </p>
      )}
    </ToolPage>
  );
}
