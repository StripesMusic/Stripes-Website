// SoundCloud Banner Splitter: cut the profile picture out of a banner so the two line up.
//
// The geometry is in the units of a 2480 x 520 header. Measured on soundcloud.com (Nov 2026,
// desktop, logged out, at two window sizes) against a known header and picture: the circle is
// 405.5 across, 55 in from the left and centred top to bottom (57.25 above and below). It scales
// with the header, so any header the same shape as 2480 x 520 works at any size. On your own
// logged-in profile SoundCloud lifts the circle about 11 higher, so check from a private window.
import { useCallback, useEffect, useRef, useState } from "react";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { ToolPage } from "../../components/ToolPage";

const BW = 2480; // banner reference width
const BH = 520; // banner reference height
const ASPECT = BW / BH;
const DEF: Tune = { left: 55, top: 57.25, size: 405.5, grain: 0 };
const MAX_BYTES = 2 * 1024 * 1024; // SoundCloud's upload cap for header images
const TUNE_KEY = "scb-tune-2";

type Win = { x: number; y: number; w: number }; // in source pixels; height = w / ASPECT
type Tune = { left: number; top: number; size: number; grain: number };
type OutSize = "native" | "800" | "1000";

function loadTune(): Tune {
  try {
    const t = JSON.parse(localStorage.getItem(TUNE_KEY) || "null");
    if (t && ["left", "top", "size", "grain"].every((k) => typeof t[k] === "number")) return t;
  } catch {
    /* no storage: use the defaults */
  }
  return DEF;
}

function saveTune(t: Tune) {
  try {
    localStorage.setItem(TUNE_KEY, JSON.stringify(t));
  } catch {
    /* fine without it */
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function toBlob(canvas: HTMLCanvasElement, type: string, q?: number) {
  return new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("This image is too big for your browser to export"))), type, q));
}

function mb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// SoundCloud squashes the fine grain in profile pictures harder than in headers, so the picture
// can look smoother than the header around it. This adds the grain back: an unsharp mask on the
// finest detail (a 1px blur), amount 0-1.
function boostGrain(ctx: CanvasRenderingContext2D, px: number, amount: number) {
  const src = ctx.getImageData(0, 0, px, px);
  const d = src.data;
  const out = new Uint8ClampedArray(d);
  const row = px * 4;
  for (let y = 1; y < px - 1; y++) {
    for (let x = 1; x < px - 1; x++) {
      const i = y * row + x * 4;
      for (let c = 0; c < 3; c++) {
        const j = i + c;
        const blur = (d[j] * 4 + (d[j - 4] + d[j + 4] + d[j - row] + d[j + row]) * 2 + d[j - row - 4] + d[j - row + 4] + d[j + row - 4] + d[j + row + 4]) / 16;
        out[j] = d[j] + (d[j] - blur) * amount;
      }
    }
  }
  ctx.putImageData(new ImageData(out, px, px), 0, 0);
}

// the biggest window of the banner's shape that fits, centred
function fullWindow(iw: number, ih: number): Win {
  const w = Math.min(iw, ih * ASPECT);
  return { x: (iw - w) / 2, y: (ih - w / ASPECT) / 2, w };
}

export function SoundCloudBannerSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [win, setWin] = useState<Win>({ x: 0, y: 0, w: 1 });
  const [tune, setTune] = useState<Tune>(loadTune);
  const [outSize, setOutSize] = useState<OutSize>("native");
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [edge, setEdge] = useState(false);
  const [lift, setLift] = useState(false);
  const [busy, setBusy] = useState<"" | "pfp" | "banner">("");
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const iw = img?.naturalWidth ?? 1;
  const ih = img?.naturalHeight ?? 1;
  const maxW = Math.min(iw, ih * ASPECT);
  const minW = Math.min(maxW, Math.max(maxW * 0.2, 620));
  const wh = win.w / ASPECT;
  const scale = win.w / BW; // source pixels per banner unit
  const shapeOk = img ? Math.abs(iw / ih - ASPECT) / ASPECT < 0.004 : true;
  const whole = img ? shapeOk && win.w >= maxW - 1 : true;
  const nativePfp = Math.round(tune.size * scale);
  const pfpPx = outSize === "native" ? nativePfp : Number(outSize);

  // ---------- loading ----------
  const accept = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setMsg({ text: "That isn't an image. Try a JPG, PNG or WebP.", bad: true });
      return;
    }
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      if (src) URL.revokeObjectURL(src);
      setFile(f);
      setSrc(url);
      setImg(im);
      setWin(fullWindow(im.naturalWidth, im.naturalHeight));
      const short = im.naturalWidth < BW || im.naturalHeight < BH;
      setMsg(short ? { text: `This image is ${im.naturalWidth} × ${im.naturalHeight}. SoundCloud asks for at least 2480 × 520, so the header may look soft.`, bad: true } : null);
    };
    im.onerror = () => {
      URL.revokeObjectURL(url);
      setMsg({ text: "Your browser couldn't open that image.", bad: true });
    };
    im.src = url;
  };

  const reset = () => {
    if (src) URL.revokeObjectURL(src);
    setFile(null);
    setImg(null);
    setSrc(null);
    setMsg(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ---------- the cut ----------
  const pfpCanvas = useCallback(
    (px: number) => {
      if (!img) return null;
      const c = document.createElement("canvas");
      c.width = c.height = px;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, win.x + tune.left * scale, win.y + tune.top * scale, tune.size * scale, tune.size * scale, 0, 0, px, px);
      if (tune.grain > 0) boostGrain(ctx, px, tune.grain / 100);
      return c;
    },
    [img, win, tune, scale],
  );

  // live picture for the preview, cut exactly the way the download is
  useEffect(() => {
    if (!img) return;
    let url: string | null = null;
    let dead = false;
    const t = setTimeout(async () => {
      const c = pfpCanvas(Math.min(pfpPx, 600));
      if (!c) return;
      const b = await toBlob(c, "image/png").catch(() => null);
      if (!b || dead) return;
      url = URL.createObjectURL(b);
      setPfpUrl(url);
    }, 90);
    return () => {
      dead = true;
      clearTimeout(t);
      if (url) setTimeout(() => URL.revokeObjectURL(url!), 1000);
    };
  }, [img, pfpCanvas, pfpPx]);

  // the banner half of the preview, drawn at 2x like SoundCloud serves it
  useEffect(() => {
    const c = canvasRef.current;
    if (!img || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const id = requestAnimationFrame(() => {
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, BW, BH);
      ctx.drawImage(img, win.x, win.y, win.w, wh, 0, 0, BW, BH);
    });
    return () => cancelAnimationFrame(id);
  }, [img, win, wh]);

  // ---------- moving the window ----------
  const moveTo = (x: number, y: number, w = win.w) => setWin({ w, x: clamp(x, 0, iw - w), y: clamp(y, 0, ih - w / ASPECT) });

  const onDown = (e: React.PointerEvent) => {
    if (!img) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const stage = stageRef.current;
    if (!d || !stage) return;
    const k = iw / stage.clientWidth;
    moveTo(d.x + (e.clientX - d.px) * k, d.y + (e.clientY - d.py) * k);
  };
  const onUp = () => {
    drag.current = null;
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = (e.shiftKey ? 50 : 5) * (iw / (stageRef.current?.clientWidth || iw));
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    moveTo(win.x + d[0], win.y + d[1]);
  };
  const zoomTo = (w: number) => {
    const cx = win.x + win.w / 2;
    const cy = win.y + wh / 2;
    moveTo(cx - w / 2, cy - w / ASPECT / 2, w);
  };

  const setTuneSave = (t: Tune) => {
    const r = (v: number) => Math.round(v * 100) / 100;
    const next = { left: clamp(r(t.left), 0, 200), top: clamp(r(t.top), 0, 200), size: clamp(r(t.size), 100, BH), grain: clamp(Math.round(t.grain), 0, 100) };
    setTune(next);
    saveTune(next);
  };

  // ---------- downloads ----------
  const base = (file?.name || "banner").replace(/\.[^.]+$/, "");

  const downloadPfp = async () => {
    setBusy("pfp");
    try {
      const c = pfpCanvas(pfpPx);
      if (!c) throw new Error("Couldn't draw the picture");
      let b = await toBlob(c, "image/png");
      let ext = "png";
      if (b.size > MAX_BYTES) {
        b = await toBlob(c, "image/jpeg", 0.95);
        ext = "jpg";
      }
      save(b, `${base}-soundcloud-pfp.${ext}`);
      setMsg({ text: `Saved a ${pfpPx} × ${pfpPx} ${ext.toUpperCase()} (${mb(b.size)}).` });
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : "Export failed", bad: true });
    }
    setBusy("");
  };

  const downloadBanner = async () => {
    setBusy("banner");
    try {
      // keep native resolution (between 1x and 2x the reference), then step down until it fits 2 MB
      let blob: Blob | null = null;
      // widths in steps of 124 keep the height a whole number, so the shape stays exactly 124 : 26
      const step = (v: number) => Math.max(BW, Math.floor(v / 124) * 124);
      let w = step(clamp(win.w, BW, BW * 2));
      for (;;) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = Math.round(w / ASPECT);
        const ctx = c.getContext("2d");
        if (!ctx) throw new Error("Couldn't draw the banner");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img!, win.x, win.y, win.w, wh, 0, 0, c.width, c.height);
        const qs = w === BW ? [0.92, 0.86, 0.8, 0.72, 0.6] : [0.92, 0.86];
        for (const q of qs) {
          const b = await toBlob(c, "image/jpeg", q);
          if (b.size <= MAX_BYTES) {
            blob = b;
            break;
          }
        }
        if (blob || w === BW) break;
        w = step(w * 0.8);
      }
      if (!blob) throw new Error("Couldn't get the banner under 2 MB");
      save(blob, `${base}-soundcloud-banner.jpg`);
      setMsg({ text: `Saved a ${w} × ${Math.round(w / ASPECT)} JPG (${mb(blob.size)}). The picture still lines up: it's cut from the same spot.` });
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : "Export failed", bad: true });
    }
    setBusy("");
  };

  const tuned = (Object.keys(DEF) as (keyof Tune)[]).some((k) => tune[k] !== DEF[k]);
  const tooBig = !!file && file.size > MAX_BYTES;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <ToolPage
      path="/tools/soundcloud-banner-splitter"
      title="SoundCloud Banner Splitter"
      lede="Cut your profile picture out of your header so the two read as one image."
      note="Works locally."
      wide
      how={
        <ol>
          <li>Drop in your header. Anything shaped like 2480 × 520 is used whole; anything else gets a frame you can drag.</li>
          <li>Check the preview, then download the profile picture.</li>
          <li>Upload the header and the picture to SoundCloud. If you cropped, or the header is over 2 MB, download the banner here too and upload that one.</li>
          <li>
            <span>
              Check it <strong>logged out</strong> (a private window) on a computer. Your own profile view pushes the picture out of place, and phones lay the page
              out differently, so it only lines up on desktop.
            </span>
          </li>
        </ol>
      }
      why={
        <>
          <p>
            SoundCloud doesn't put the picture where you'd guess. I measured it on the live site against a known header: on a 2480 × 520 header the circle is 405.5
            across, 55 in from the left and centred top to bottom. Cut a plain 400 square 60 in and the edges miss by a pixel or two, which is the seam you see.
          </p>
          <p>
            It only lines up on a computer with the window wide enough for the full header, and only for other people: on your own logged-in profile SoundCloud lifts
            the picture a few pixels. SoundCloud also smooths the grain in pictures more than in headers; "Grain boost" under Fine tune adds some back.
          </p>
        </>
      }
    >
      <div className="s-form">
        <div className="s-field">
          <span className="s-mono" id="scb-file">
            Header image
          </span>
          <div
            className={"s-drop" + (isDragging ? " is-over" : "") + (file ? " has-file" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) accept(f);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              aria-labelledby="scb-file"
              className="s-drop-input"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) accept(f);
              }}
            />
            {file && img ? (
              <>
                <span className="s-drop-name">{file.name}</span>
                <span className="s-mono">
                  {iw} × {ih} · {mb(file.size)} · choose another
                </span>
              </>
            ) : (
              <>
                <span className="s-drop-name">Drop a header here, or choose one</span>
                <span className="s-mono">2480 × 520 or bigger · JPG, PNG, WebP</span>
              </>
            )}
          </div>
        </div>
      </div>

      {img && src && (
        <div className="s-scb">
          {/* 1. pick the spot */}
          <div className="s-field">
            <span className="s-mono">{whole ? "Your header, used whole" : "Drag the frame to pick your header"}</span>
            <div
              ref={stageRef}
              className={"s-scb-stage" + (whole ? " is-whole" : "")}
              style={{ aspectRatio: `${iw} / ${ih}` }}
              onPointerDown={whole ? undefined : onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <img src={src} alt="" draggable={false} />
              <div
                className="s-scb-win"
                tabIndex={whole ? -1 : 0}
                role={whole ? undefined : "slider"}
                aria-label="Header position. Use the arrow keys to move it."
                aria-valuetext={`${Math.round(win.x)}, ${Math.round(win.y)}`}
                onKeyDown={onKey}
                style={{ left: pct(win.x, iw), top: pct(win.y, ih), width: pct(win.w, iw), height: pct(wh, ih) }}
              >
                <span className="s-scb-ring" style={{ left: pct(tune.left, BW), top: pct(tune.top, BH), width: pct(tune.size, BW), height: pct(tune.size, BH) }} />
              </div>
            </div>
            {maxW > minW + 1 && (
              <label className="s-scb-zoom">
                <span className="s-mono">Zoom</span>
                <input type="range" min={0} max={1000} value={Math.round(((maxW - win.w) / (maxW - minW)) * 1000)} onChange={(e) => zoomTo(maxW - (Number(e.target.value) / 1000) * (maxW - minW))} />
                <span className="s-mono">{Math.round(win.w)} px wide</span>
              </label>
            )}
            {!whole && <p className="s-hint">Upload the banner download from here, not your original, or the picture won't line up.</p>}
          </div>

          {/* 2. preview */}
          <div className="s-field">
            <div className="s-scb-row">
              <span className="s-mono">Preview · SoundCloud on a computer</span>
              <div className="s-seg" role="group" aria-label="Preview options">
                <button type="button" aria-pressed={edge} onClick={() => setEdge(!edge)}>
                  Show the edge
                </button>
                <button type="button" aria-pressed={lift} onClick={() => setLift(!lift)}>
                  Lift it out
                </button>
              </div>
            </div>
            <div className="s-scb-sc">
              <canvas ref={canvasRef} width={BW} height={BH} aria-label="Header preview" role="img" />
              {pfpUrl && (
                <img
                  className={"s-scb-pfp" + (edge ? " is-edge" : "") + (lift ? " is-lift" : "")}
                  src={pfpUrl}
                  alt="Profile picture preview"
                  style={{ left: pct(tune.left, BW), top: pct(tune.top, BH), width: pct(tune.size, BW), height: pct(tune.size, BH) }}
                />
              )}
              {/* SoundCloud's name tags, measured from the live page; click them to type your own */}
              <div className="s-scb-name">
                <span contentEditable suppressContentEditableWarning spellCheck={false} aria-label="Display name (editable)">
                  Stripes
                </span>
                <small contentEditable suppressContentEditableWarning spellCheck={false} aria-label="Second line (editable)">
                  Virginia, United States
                </small>
              </div>
            </div>
          </div>

          {/* 3. downloads */}
          <div className="s-scb-out">
            <div className="s-field">
              <span className="s-mono" id="scb-size">
                Profile picture size
              </span>
              <div className="s-seg" role="group" aria-labelledby="scb-size">
                {(["native", "800", "1000"] as OutSize[]).map((o) => (
                  <button key={o} type="button" aria-pressed={outSize === o} onClick={() => setOutSize(o)}>
                    {o === "native" ? `${nativePfp} px (as cut)` : `${o} px`}
                  </button>
                ))}
              </div>
            </div>
            <div className="s-ctas">
              <button type="button" className="s-btn s-btn-solid s-btn-lg" onClick={downloadPfp} disabled={!!busy}>
                {busy === "pfp" ? "Saving…" : "Download profile picture"}
              </button>
              <button type="button" className={"s-btn s-btn-lg" + (!whole || tooBig ? " s-btn-solid" : "")} onClick={downloadBanner} disabled={!!busy}>
                {busy === "banner" ? "Saving…" : "Download banner"}
              </button>
              <button type="button" className="s-btn s-btn-lg" onClick={reset} disabled={!!busy}>
                Start over
              </button>
            </div>
            {whole && tooBig && <p className="s-hint">Over SoundCloud's 2 MB limit, so upload the banner download from here instead.</p>}
          </div>

          {/* 4. fine tune */}
          <details className="s-scb-tune">
            <summary className="s-mono">Fine tune{tuned ? " · changed" : ""}</summary>
            <div className="s-scb-tune-row">
              {(
                [
                  ["left", "From the left"],
                  ["top", "From the top"],
                  ["size", "Size"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="s-field">
                  <span className="s-mono">{label}</span>
                  <input className="s-input" type="number" step="0.25" value={tune[k]} onChange={(e) => setTuneSave({ ...tune, [k]: Number(e.target.value) })} />
                </label>
              ))}
              <label className="s-field s-scb-grain">
                <span className="s-mono">Grain boost {tune.grain}%</span>
                <input type="range" min={0} max={60} value={tune.grain} onChange={(e) => setTuneSave({ ...tune, grain: Number(e.target.value) })} />
              </label>
              <button type="button" className="s-btn" onClick={() => setTuneSave(DEF)} disabled={!tuned}>
                Reset
              </button>
            </div>
          </details>
        </div>
      )}

      {msg && (
        <p className={"s-status s-mono" + (msg.bad ? " is-bad" : " is-good")} role={msg.bad ? "alert" : "status"}>
          {msg.text}
        </p>
      )}
    </ToolPage>
  );
}
