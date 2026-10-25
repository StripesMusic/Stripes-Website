// "Play it loud": a full-bleed colour spectrum, after Ragged Edge, that follows the music. It
// drifts on its own; when anything plays, the sub bass pumps it (zoom, flow and the bright
// core, sidechain dips included), kicks shove it, the mids slide the colours towards lime and
// the highs add shimmer.
import { useEffect, useRef } from "react";
import { audio, type Track } from "../../lib/audio";
import { useAudio } from "../../lib/useAudio";
import { onFrame } from "../../lib/ticker";
import { socials } from "../../data/socials";
import { Eq } from "./Eq";

const VERT = `attribute vec2 p; varying vec2 v; void main() { v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uT, uLow, uMid, uHigh, uPush;
uniform vec3 uA, uB, uC, uD;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * n(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0) * 3.0;
  if (t < 1.0) return mix(uA, uB, t);
  if (t < 2.0) return mix(uB, uC, t - 1.0);
  return mix(uC, uD, t - 2.0);
}
void main() {
  // the field breathes with the sub bass and jumps on kicks
  vec2 p = (v - 0.5) * vec2(uRes.x / uRes.y, 1.0) * (1.0 - uLow * 0.07 - uPush * 0.05);
  float t = uT;
  float warp = 1.5 + uLow * 1.4 + uPush * 0.9;
  vec2 q = vec2(fbm(p * 1.1 + vec2(0.0, t * 0.06)), fbm(p * 1.1 + vec2(5.2, -t * 0.05)));
  vec2 r = vec2(fbm(p * 1.3 + q * warp + vec2(1.7, 9.2) + t * 0.04), fbm(p * 1.3 + q * warp + vec2(8.3, 2.8) - t * 0.03));
  float f = fbm(p * 1.2 + r * 1.4);
  float s = v.x * 0.75 + 0.1 + (r.x - 0.5) * 0.9 + (f - 0.5) * 0.5 + uMid * 0.22;
  vec3 col = ramp(s);
  col = mix(col, vec3(1.0), pow(f, 3.0) * (0.2 + uLow * 0.18 + uPush * 0.22));
  col += (h(gl_FragCoord.xy + fract(t * 7.0)) - 0.5) * (0.035 + uHigh * 0.09);
  gl_FragColor = vec4(col, 1.0);
}`;
const STOPS = ["#7087c7", "#78cfd3", "#b9e14d", "#e8f5bd"].map((c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255));

function startGL(cv: HTMLCanvasElement) {
  const gl = cv.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl) throw new Error("no webgl");
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = { res: u("uRes"), t: u("uT"), low: u("uLow"), mid: u("uMid"), high: u("uHigh"), push: u("uPush") };
  ["uA", "uB", "uC", "uD"].forEach((k, i) => gl.uniform3fv(u(k), STOPS[i]));
  return {
    size(w: number, h: number) {
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
    },
    draw(t: number, low: number, mid: number, high: number, push: number) {
      gl.uniform1f(U.t, t);
      gl.uniform1f(U.low, low);
      gl.uniform1f(U.mid, mid);
      gl.uniform1f(U.high, high);
      gl.uniform1f(U.push, push);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    // give the context back when the page changes, so they don't pile up
    dispose() {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export function Spectrum({ track }: { track: Track }) {
  const secRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const s = useAudio();
  const on = s.playing && s.track?.id === track.id;

  useEffect(() => {
    const sec = secRef.current!, cv = cvRef.current!;
    let g: ReturnType<typeof startGL>;
    try {
      g = startGL(cv);
    } catch (err) {
      console.warn("Spectrum unavailable", err);
      sec.classList.add("is-flat");
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // it's soft anyway, so it renders at half size or less and the browser scales it up
    const size = () => {
      const r = sec.getBoundingClientRect(), k = Math.min(0.5, 900 / Math.max(1, r.width));
      g.size(Math.max(2, Math.round(r.width * k)), Math.max(2, Math.round(r.height * k)));
      if (reduce) g.draw(12, 0, 0, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(sec);
    if (reduce)
      return () => {
        ro.disconnect();
        g.dispose();
      };

    let t = 12, last = 0, push = 0, visible = false, stop: (() => void) | null = null;
    const offKick = audio.onKick((k) => {
      push = Math.min(1.4, push + k * 0.9);
    });
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const b = audio.bands;
      t += dt * (0.5 + b.low * 1.2 + push * 1.6);
      push *= Math.pow(0.04, dt);
      g.draw(t, b.low, b.mid, b.high, push);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !stop) {
        last = 0;
        stop = onFrame(frame);
      } else if (!visible && stop) {
        stop();
        stop = null;
      }
    });
    io.observe(sec);
    return () => {
      io.disconnect();
      ro.disconnect();
      offKick();
      stop?.();
      g.dispose();
    };
  }, []);

  return (
    <section className="s-panel s-spec" data-scene="spectrum" ref={secRef} aria-labelledby="spec-title">
      <canvas ref={cvRef} className="s-spec-gl" aria-hidden="true" />
      <div className="s-grain" aria-hidden="true" />
      <div className="s-spec-in s-pad">
        <div className="s-sec-head">
          <span className="s-mono">Listen</span>
          <button type="button" className="s-btn" aria-pressed={on} onClick={() => audio.toggle(track, { loop: true, demoFallback: true })}>
            {on ? <Eq on /> : <span className="s-tri s-tri-sm" aria-hidden="true" />}
            {on ? "Stop" : `Play "${track.title}"`}
          </button>
        </div>
        <h2 className="s-spec-title" id="spec-title">
          <span>Play it</span>
          <span>loud</span>
        </h2>
        <div className="s-spec-foot">
          <p className="s-big">Follow along wherever you listen. The colours here follow the music.</p>
          <ul className="s-spec-links">
            {socials.map((l) => (
              <li key={l.name}>
                <a className="s-btn" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
