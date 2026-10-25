// The hero S: dust particles in three depth layers and faint hairlines behind them, on one 3D
// plane that tilts toward the cursor and leans back as you scroll, so the layers slide apart.
// On load the layers start far apart on a plane lying back and close up as it stands.
// The scene renders to a texture, then a glass pass bends it around each click ripple with a
// bevelled, colour-fringed rim. Everything settles and stops drawing when idle.
import { LOGO_H, LOGO_THIN, LOGO_W } from "./logoPaths";
import { audio } from "../../lib/audio";
import { onFrame } from "../../lib/ticker";
import { whenReady } from "../../lib/intro";

// cover: 0 with the hero in full view, 1 once the first panel has slid over it
export type HeroScroll = { cover: number };
type HeroOpts = { plane?: HTMLElement | null; area: () => { top: number; bottom: number } };

// The layout: "Stripes" set big along the left, and the S oversized behind its end, cropped
// off the right edge, as texture rather than a logo lockup. cx/cy are the S centre from the
// stage centre; the word box is in stage px. Bricolage at rest (wght 200, wdth 80): the word is
// WORD_W font-sizes wide, its caps 0.66 tall, the cap top 0.056 below the box top.
const ASPECT = LOGO_W / LOGO_H;
export const WORD_W = 1.55;
export function lockupLayout(W: number, H: number, top: number, bottom: number) {
  const narrow = W < 700 || W < H * 0.9;
  const room = Math.max(120, bottom - top), pad = narrow ? 16 : 28;
  if (narrow) {
    const h = Math.min(room * 0.8, W * 1.2), sw = h * ASPECT;
    const fs = Math.min((W - pad * 2) / WORD_W, room * 0.9);
    return { narrow, h, cx: W / 2 - sw * 0.32, cy: top + room * 0.42 - H / 2, fs, wx: pad, wy: top + room * 0.62 - fs * 0.33 - fs * 0.056 };
  }
  // the S fills the room between the nav and the text, so it never runs under the links
  const h = Math.min(room * 1.05, W * 0.7), sw = h * ASPECT;
  const fs = Math.min((W * 0.62) / WORD_W, room * 0.95), mid = top + room / 2;
  return { narrow, h, cx: W / 2 - sw * 0.34, cy: mid - H / 2, fs, wx: pad, wy: mid - fs * 0.33 - fs * 0.056 };
}

const ANG = (-24.2 * Math.PI) / 180;
const U = [Math.cos(ANG), Math.sin(ANG)];
const N = [-U[1], U[0]];
const LIFE = 1600;
const INTRO = 1900;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// plane coords (px, centred on the stage) -> tilted, perspective, risen screen position
const PROJ = `
uniform vec2 uRes; uniform vec2 uHalf; uniform float uDpr; uniform float uTheta; uniform float uPhi; uniform float uRise; uniform float uScale; uniform float uD;
vec4 project(vec3 p, out float k){
  // layers off the plane are pre-shrunk or grown so they line up when it faces you square on
  p.xy *= (uD - p.z) / uD;
  float cp = cos(uPhi), sp = sin(uPhi);
  vec3 q = vec3(p.x * cp + p.z * sp, p.y, -p.x * sp + p.z * cp);
  float c = cos(uTheta), s = sin(uTheta);
  float y = q.y * c - q.z * s;
  float z = q.y * s + q.z * c;
  p.x = q.x;
  k = uD / (uD - z);
  vec2 sc = uHalf + vec2(p.x, y) * k * uScale + vec2(0.0, uRise);
  vec2 cl = sc * uDpr / uRes * 2.0 - 1.0; cl.y = -cl.y;
  return vec4(cl, 0.0, 1.0);
}`;

// Hairlines: lit faintly inside the S, and outside it only in a soft pool around the cursor.
const LINE_VS = `
attribute vec2 aBase; attribute float aSide; attribute float aMask;
uniform vec2 uN; uniform vec3 uPtr; uniform float uAct; uniform vec2 uPv; uniform vec4 uRip[4]; uniform float uGlow;
varying float vMask; varying float vA; varying float vSide; varying float vE;
${PROJ}
void main(){
  vec2 d = aBase - uPtr.xy;
  float dist = length(d) + 0.001;
  float g = exp(-dist * dist / 32400.0);
  float disp = clamp(dot(uPv, uN), -10.0, 10.0) * 0.8 * g * uAct;
  disp += dot(d / dist, uN) * 8.0 * g * uAct;
  float ring = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 r = uRip[i];
    vec2 q = aBase - r.xy; float qd = length(q) + 0.001;
    float w = (qd - r.z) / 34.0;
    float e = exp(-w * w) * r.w;
    disp += dot(q / qd, uN) * 7.0 * e;
    ring += e;
  }
  vec2 p = aBase + uN * (disp + aSide * 0.9);
  float k; gl_Position = project(vec3(p, -140.0), k);
  float fog = smoothstep(0.6, 0.95, k);
  float spot = exp(-dist * dist / 78400.0) * uPtr.z;
  vMask = aMask; vSide = aSide; vE = clamp(ring * 0.6 + abs(disp) / 14.0, 0.0, 1.0);
  vA = (aMask * (0.15 + uGlow * 0.3) + spot * mix(0.08, 0.12, aMask) + min(ring, 1.0) * 0.14) * fog;
}`;
const LINE_FS = `
precision mediump float;
uniform vec3 uLineA; uniform vec3 uLineB; uniform vec3 uFast; uniform float uLineGain;
varying float vMask; varying float vA; varying float vSide; varying float vE;
void main(){
  float aa = 1.0 - abs(vSide);
  vec3 col = mix(uLineA, uLineB, vMask);
  col = mix(col, uFast, vE * 0.5);
  float a = min(1.0, vA * uLineGain) * aa;
  gl_FragColor = vec4(col * a, a);
}`;

const DUST_VS = `
attribute vec3 aPos; attribute float aKind; attribute float aSpd;
uniform float uGlow; uniform float uSpread;
varying float vK; varying float vS; varying float vFog;
${PROJ}
void main(){
  vec3 p = aPos;
  if (aKind > 0.5) p.z *= uSpread;
  float k; gl_Position = project(p, k);
  gl_PointSize = (aKind > 0.5 ? 1.5 + uGlow * 0.6 : 1.2) * k * uScale * uDpr;
  vFog = smoothstep(0.55, 0.95, k);
  vK = aKind; vS = clamp(aSpd / 5.0, 0.0, 1.0);
}`;
const DUST_FS = `
precision mediump float;
uniform vec3 uInk; uniform vec3 uAmb; uniform vec3 uFast; uniform float uAmbA;
varying float vK; varying float vS; varying float vFog;
void main(){
  vec2 q = gl_PointCoord - 0.5; float r = dot(q, q); if (r > 0.25) discard;
  float soft = smoothstep(0.25, 0.04, r);
  vec3 col = mix(uAmb, uInk, vK);
  col = mix(col, uFast, vS * 0.6);
  float a = ((vK > 0.5 ? 0.85 : uAmbA) * soft + vS * 0.2) * vFog;
  gl_FragColor = vec4(col * a, a);
}`;

// Glass: each ripple is a raised ring. The S refracts through its slope, each colour channel
// bends a little differently (fringing), the rim catches light from the upper left and the far
// side casts a shadow onto the spectrum behind.
const POST_VS = `
attribute vec2 aQuad;
void main(){ gl_Position = vec4(aQuad, 0.0, 1.0); }`;
const POST_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex; uniform vec2 uRes; uniform float uDpr; uniform vec4 uG[4];
uniform vec3 uRim; uniform vec3 uFast;
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 off = vec2(0.0); vec3 rim = vec3(0.0); float shade = 0.0; float body = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 r = uG[i];
    if (r.w > 0.0005) {
      vec2 d = fc - r.xy; float dist = length(d) + 0.001; vec2 n = d / dist;
      float wd = 9.0 * uDpr + r.z * 0.035;
      float w = (dist - r.z) / wd;
      float h = exp(-w * w);
      float dh = -2.0 * w * h;
      off -= n * dh * r.w * 11.0 * uDpr;
      float lit = dot(n, vec2(-0.55, 0.83));
      float sh = 3.0 * uDpr / wd;
      vec3 cw = vec3(w + sh, w, w - sh);
      vec3 slope = -2.0 * cw * exp(-cw * cw);
      rim += max(vec3(0.0), -slope * lit) * r.w;
      shade += max(0.0, dh * lit) * r.w;
      body += h * r.w;
    }
  }
  vec2 px = 1.0 / uRes;
  // the scene is premultiplied over transparent, so the spectrum behind shows through
  vec4 cr = texture2D(uTex, (fc + off * 1.3) * px);
  vec4 cg = texture2D(uTex, (fc + off) * px);
  vec4 cb = texture2D(uTex, (fc + off * 0.7) * px);
  vec3 col = vec3(cr.r, cg.g, cb.b);
  float a = max(cg.a, max(cr.a, cb.a));
  // a deep shadow on the side facing away from the light, darkening whatever is behind
  float sh = min(shade, 1.0) * 0.62;
  col *= 1.0 - sh;
  a += sh * (1.0 - a);
  // and a bright rim on the lit side
  rim = min(rim, vec3(1.0));
  vec3 lit = rim * rim * uRim * 0.95 + rim * uRim * 0.16 + uFast * min(body, 1.0) * 0.012;
  col += lit;
  a = min(1.0, max(a, max(lit.r, max(lit.g, lit.b))));
  gl_FragColor = vec4(min(col, vec3(a)), a);
}`;

type Pulse = { x: number; y: number; t: number; a: number; glass: number };
type V3 = [number, number, number];

// one palette in both themes, since the spectrum behind the S is the same in both: dark ink
// like the type, and white for motion and the glass rims
const PAL = {
  ink: [0.063, 0.067, 0.055] as V3, amb: [0.12, 0.14, 0.15] as V3, ambA: 0.22,
  lineA: [0.1, 0.11, 0.12] as V3, lineB: [0.063, 0.067, 0.055] as V3, lineGain: 1.6, fast: [0.97, 0.99, 0.92] as V3,
  rim: [0.98, 1, 0.94] as V3,
};

export function createHero(stage: HTMLElement, cv: HTMLCanvasElement, getScroll: () => HeroScroll, { plane, area }: HeroOpts) {
  const ctx = cv.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!ctx) return () => {};
  const gl: WebGLRenderingContext = ctx;
  const uintExt = gl.getExtension("OES_element_index_uint");

  const mk = (type: number, src: string) => {
    const o = gl.createShader(type)!;
    gl.shaderSource(o, src);
    gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || "shader");
    return o;
  };
  const program = (vs: string, fs: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    return p;
  };
  const lineP = program(LINE_VS, LINE_FS), dustP = program(DUST_VS, DUST_FS), postP = program(POST_VS, POST_FS);
  const locs = new Map<string, WebGLUniformLocation | null>();
  const uni = (p: WebGLProgram, name: string) => {
    const key = (p === lineP ? "l" : p === dustP ? "d" : "p") + name;
    if (!locs.has(key)) locs.set(key, gl.getUniformLocation(p, name));
    return locs.get(key)!;
  };
  const enabled: number[] = [];
  const attr = (p: WebGLProgram, b: WebGLBuffer, name: string, size: number) => {
    const l = gl.getAttribLocation(p, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    enabled.push(l);
  };
  const unbind = () => {
    while (enabled.length) gl.disableVertexAttribArray(enabled.pop()!);
  };
  const upload = (b: WebGLBuffer, data: ArrayBufferView, usage: number = gl.STATIC_DRAW) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data as BufferSource, usage);
  };

  const LB = { base: gl.createBuffer()!, side: gl.createBuffer()!, mask: gl.createBuffer()!, idx: gl.createBuffer()! };
  const DB = { pos: gl.createBuffer()!, kind: gl.createBuffer()!, spd: gl.createBuffer()! };
  const quad = gl.createBuffer()!;
  upload(quad, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
  const tex = gl.createTexture()!;
  const fbo = gl.createFramebuffer()!;

  const S = { W: 0, H: 0, DPR: 1, cx: 0, cy: 0, theta: 0.9, phi: 0, rise: 0, scale: 0.92, spread: 2.6, D: 1400, mask: new Uint8ClampedArray(0) };
  // the pose: tilt and lean toward the pointer (or a slow orbit on touch), smoothed
  const pose = { tx: 0, ty: 0, born: 0, key: "", css: "" };
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ptr = { sx: 0, sy: 0, x: 0, y: 0, fx: 0, fy: 0, vx: 0, vy: 0, pvx: 0, pvy: 0, inside: false, last: 0, amt: 0, act: 0 };
  const pulses: Pulse[] = [];
  const pal = PAL;
  let lineCount = 0, lineBig = false;
  let DN = 0, hx: Float32Array, hy: Float32Array, px: Float32Array, py: Float32Array, dvx: Float32Array, dvy: Float32Array;
  let dkind: Float32Array, dPos: Float32Array, dSpd: Float32Array;
  let awake = 60, dBeat = 0, prog = 0, needDraw = true, visible = true;

  const maskAt = (x: number, y: number) => {
    const ix = Math.round(x + S.W / 2), iy = Math.round(y + S.H / 2);
    return ix >= 0 && iy >= 0 && ix < S.W && iy < S.H ? S.mask[(iy * S.W + ix) * 4 + 3] / 255 : 0;
  };

  function measure() {
    const r = stage.getBoundingClientRect();
    S.W = Math.max(1, Math.round(r.width));
    S.H = Math.max(1, Math.round(r.height));
    S.DPR = Math.min(window.devicePixelRatio || 1, S.W * S.H > 2.4e6 ? 1.5 : 2);
    cv.width = Math.round(S.W * S.DPR);
    cv.height = Math.round(S.H * S.DPR);
    S.D = Math.max(S.W, S.H) * 1.3;
    const { W, H } = S, b = area(), L = lockupLayout(W, H, b.top, b.bottom);
    const sc = L.h / LOGO_H;
    S.cx = L.cx;
    S.cy = L.cy;
    if (plane) {
      plane.style.setProperty("--wx", L.wx.toFixed(1) + "px");
      plane.style.setProperty("--wy", L.wy.toFixed(1) + "px");
      plane.style.setProperty("--wfs", L.fs.toFixed(1) + "px");
            plane.dispatchEvent(new Event("s-layout"));
    }
    const mc = document.createElement("canvas");
    mc.width = W;
    mc.height = H;
    const mx = mc.getContext("2d")!;
    mx.filter = "blur(0.7px)";
    mx.translate(W / 2 + S.cx - (LOGO_W * sc) / 2, H / 2 + S.cy - (LOGO_H * sc) / 2);
    mx.scale(sc, sc);
    mx.fillStyle = "#fff";
    LOGO_THIN.forEach((p) => mx.fill(new Path2D(p)));
    S.mask = mx.getImageData(0, 0, W, H).data;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cv.width, cv.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    buildLines();
    buildDust();
    needDraw = true;
  }

  function buildLines() {
    const { W, H } = S, SP = W < 700 ? 8 : 9, STEP = 8, MX = W * 0.3 + 60;
    const x0 = -W / 2 - MX, x1 = W / 2 + MX, y0 = -H * 1.5, y1 = H * 0.75;
    const cs = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];
    const pn = cs.map((c) => c[0] * N[0] + c[1] * N[1]), pu = cs.map((c) => c[0] * U[0] + c[1] * U[1]);
    const o0 = Math.min(...pn), o1 = Math.max(...pn), s0 = Math.min(...pu), s1 = Math.max(...pu);
    const X: number[] = [], Y: number[] = [], MK: number[] = [], runs: [number, number][] = [];
    for (let o = o0; o <= o1; o += SP) {
      let started = false;
      const st = X.length;
      for (let s = s0; s <= s1; s += STEP) {
        const x = N[0] * o + U[0] * s, y = N[1] * o + U[1] * s;
        if (x < x0 || x > x1 || y < y0 || y > y1) {
          if (started) break;
          continue;
        }
        started = true;
        X.push(x);
        Y.push(y);
        MK.push(maskAt(x, y));
      }
      if (X.length - st > 1) runs.push([st, X.length - 1]);
      else X.length = Y.length = MK.length = st;
    }
    const P = X.length, VC = P * 2;
    const base = new Float32Array(VC * 2), side = new Float32Array(VC), mask = new Float32Array(VC);
    for (let i = 0; i < P; i++)
      for (let s = 0; s < 2; s++) {
        const j = i * 2 + s;
        base[j * 2] = X[i];
        base[j * 2 + 1] = Y[i];
        side[j] = s ? 1 : -1;
        mask[j] = MK[i];
      }
    lineBig = VC > 65535 && !!uintExt;
    let segs = 0;
    runs.forEach(([a, b]) => (segs += b - a));
    const idx = lineBig ? new Uint32Array(segs * 6) : new Uint16Array(segs * 6);
    let q = 0;
    for (const [a, b] of runs) {
      for (let i = a; i < b; i++) {
        const v = i * 2;
        if (!lineBig && v + 3 > 65535) break;
        idx[q++] = v; idx[q++] = v + 1; idx[q++] = v + 2;
        idx[q++] = v + 1; idx[q++] = v + 3; idx[q++] = v + 2;
      }
    }
    lineCount = q;
    upload(LB.base, base);
    upload(LB.side, side);
    upload(LB.mask, mask);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LB.idx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  }

  function buildDust() {
    const { W, H } = S, inS = Math.round(Math.min(26000, (W * H) / 45)), amb = Math.round((W * H) / 2600);
    const HX: number[] = [], HY: number[] = [], Z: number[] = [], K: number[] = [];
    let tries = 0;
    while (HX.length < inS && tries < inS * 60) {
      tries++;
      const x = (Math.random() - 0.5) * W, y = (Math.random() - 0.5) * H;
      if (Math.random() < maskAt(x, y)) {
        // three layers, so they visibly part when the plane tilts
        HX.push(x); HY.push(y); Z.push((Math.floor(Math.random() * 3) - 1) * 90 + (Math.random() - 0.5) * 16); K.push(1);
      }
    }
    for (let i = 0; i < amb; i++) {
      HX.push((Math.random() - 0.5) * (W + 120));
      HY.push(-H * 1.1 + Math.random() * H * 1.8);
      Z.push((Math.random() - 0.5) * 420);
      K.push(0);
    }
    DN = HX.length;
    hx = Float32Array.from(HX); hy = Float32Array.from(HY); dkind = Float32Array.from(K);
    px = Float32Array.from(HX); py = Float32Array.from(HY);
    dvx = new Float32Array(DN); dvy = new Float32Array(DN);
    dPos = new Float32Array(DN * 3); dSpd = new Float32Array(DN);
    for (let i = 0; i < DN; i++) {
      dPos[i * 3] = hx[i]; dPos[i * 3 + 1] = hy[i]; dPos[i * 3 + 2] = Z[i];
    }
    upload(DB.pos, dPos, gl.DYNAMIC_DRAW);
    upload(DB.kind, dkind);
    upload(DB.spd, dSpd, gl.DYNAMIC_DRAW);
    awake = 60;
  }

  // screen -> plane, the inverse of the shader's projection at z = 0: cast the eye ray through
  // the screen point and meet the rotated plane, then rotate the hit back into plane coords
  const toPlane = (sx: number, sy: number) => {
    const c = Math.cos(S.theta), s = Math.sin(S.theta), cp = Math.cos(S.phi), sp = Math.sin(S.phi), D = S.D;
    const X1 = (sx - S.W / 2) / S.scale, Y1 = (sy - S.H / 2 - S.rise) / S.scale;
    const nz = cp * c, t = (nz * D) / (nz * D - sp * X1 + cp * s * Y1);
    const wx = X1 * t, wy = Y1 * t, wz = D * (1 - t);
    return [wx * cp - (-wy * s + wz * c) * sp, wy * c + wz * s];
  };
  const toScreen = (x: number, y: number) => {
    const c = Math.cos(S.theta), s = Math.sin(S.theta), cp = Math.cos(S.phi), sp = Math.sin(S.phi);
    const Z = y * s - x * sp * c, k = S.D / (S.D - Z);
    return [S.W / 2 + x * cp * k * S.scale, S.H / 2 + (y * c + x * sp * s) * k * S.scale + S.rise, k * S.scale];
  };

  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    ptr.sx = e.clientX - r.left;
    ptr.sy = e.clientY - r.top;
    const [x, y] = toPlane(ptr.sx, ptr.sy);
    if (ptr.inside) {
      ptr.vx = ptr.vx * 0.5 + (x - ptr.x) * 0.5;
      ptr.vy = ptr.vy * 0.5 + (y - ptr.y) * 0.5;
    } else {
      ptr.fx = x;
      ptr.fy = y;
    }
    ptr.x = x;
    ptr.y = y;
    ptr.inside = true;
    ptr.last = performance.now();
    awake = 90;
  };
  const onLeave = () => {
    ptr.inside = false;
    ptr.vx = ptr.vy = 0;
  };
  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("a,button,label,input")) return;
    const r = stage.getBoundingClientRect(), [x, y] = toPlane(e.clientX - r.left, e.clientY - r.top);
    pulses.push({ x, y, t: performance.now(), a: 1.8, glass: 1 });
    awake = 200;
  };
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("pointercancel", onLeave);
  stage.addEventListener("pointerdown", onDown);
  // kicks ripple the S, push the dust out and flash it; the glow follows the sub bass in between
  let flash = 0;
  const offKick = audio.onKick((s) => {
    pulses.push({ x: S.cx, y: S.cy, t: performance.now(), a: 0.35 + s * 0.35, glass: 0.3 + s * 0.3 });
    awake = 120;
    dBeat = s;
    flash = s;
  });

  const DR = 190, DR2 = DR * DR;
  type Live = { x: number; y: number; r: number; a: number; glass: number };
  function stepDust(pr: Live[], act: boolean) {
    let maxV = 0;
    for (let i = 0; i < DN; i++) {
      const grow = 1 + dBeat * 0.024 * dkind[i];
      let ax = (hx[i] * grow - px[i]) * 0.011, ay = (hy[i] * grow - py[i]) * 0.011;
      if (act) {
        const dx = px[i] - ptr.x, dy = py[i] - ptr.y, r2 = dx * dx + dy * dy;
        if (r2 < DR2 && r2 > 0.01) {
          const r = Math.sqrt(r2), f = 1 - r / DR, f2 = f * f * (3 - 2 * f) * 0.32;
          ax += (dx / r) * f2 + ptr.vx * 0.006 * f;
          ay += (dy / r) * f2 + ptr.vy * 0.006 * f;
        }
      }
      for (let j = 0; j < pr.length; j++) {
        const q = pr[j], dx = px[i] - q.x, dy = py[i] - q.y, r = Math.sqrt(dx * dx + dy * dy) + 0.001, w = (r - q.r) / 30;
        if (w > -3 && w < 3) {
          const f = q.a * 0.7 * Math.exp(-w * w);
          ax += (dx / r) * f;
          ay += (dy / r) * f;
        }
      }
      dvx[i] = (dvx[i] + ax) * 0.84;
      dvy[i] = (dvy[i] + ay) * 0.84;
      px[i] += dvx[i];
      py[i] += dvy[i];
      dPos[i * 3] = px[i];
      dPos[i * 3 + 1] = py[i];
      const sp = Math.abs(dvx[i]) + Math.abs(dvy[i]);
      dSpd[i] = sp;
      if (sp > maxV) maxV = sp;
    }
    dBeat *= 0.88;
    flash *= 0.85;
    return maxV;
  }

  const setCommon = (p: WebGLProgram) => {
    gl.uniform2f(uni(p, "uRes"), cv.width, cv.height);
    gl.uniform2f(uni(p, "uHalf"), S.W / 2, S.H / 2);
    gl.uniform1f(uni(p, "uDpr"), S.DPR);
    gl.uniform1f(uni(p, "uTheta"), S.theta);
    gl.uniform1f(uni(p, "uPhi"), S.phi);
    gl.uniform1f(uni(p, "uRise"), S.rise);
    gl.uniform1f(uni(p, "uScale"), S.scale);
    gl.uniform1f(uni(p, "uD"), S.D);
    gl.uniform1f(uni(p, "uGlow"), Math.min(1.2, audio.level * 0.7 + flash * 0.5));
  };
  const ripPlane = new Float32Array(16), ripGlass = new Float32Array(16);

  function draw(pr: Live[]) {
    ripPlane.fill(0);
    ripGlass.fill(0);
    pr.slice(-4).forEach((q, i) => {
      ripPlane.set([q.x, q.y, q.r, Math.min(1, q.a)], i * 4);
      const [sx, sy, k] = toScreen(q.x, q.y);
      ripGlass.set([sx * S.DPR, (S.H - sy) * S.DPR, q.r * k * S.DPR, q.glass], i * 4);
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(lineP);
    attr(lineP, LB.base, "aBase", 2);
    attr(lineP, LB.side, "aSide", 1);
    attr(lineP, LB.mask, "aMask", 1);
    setCommon(lineP);
    gl.uniform2f(uni(lineP, "uN"), N[0], N[1]);
    gl.uniform3f(uni(lineP, "uPtr"), ptr.fx, ptr.fy, ptr.amt);
    gl.uniform1f(uni(lineP, "uAct"), ptr.act);
    gl.uniform3fv(uni(lineP, "uLineA"), pal.lineA);
    gl.uniform3fv(uni(lineP, "uLineB"), pal.lineB);
    gl.uniform3fv(uni(lineP, "uFast"), pal.fast);
    gl.uniform1f(uni(lineP, "uLineGain"), pal.lineGain);
    gl.uniform2f(uni(lineP, "uPv"), ptr.pvx, ptr.pvy);
    gl.uniform4fv(uni(lineP, "uRip"), ripPlane);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LB.idx);
    gl.drawElements(gl.TRIANGLES, lineCount, lineBig ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
    unbind();

    gl.useProgram(dustP);
    attr(dustP, DB.pos, "aPos", 3);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, dPos as BufferSource);
    attr(dustP, DB.spd, "aSpd", 1);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, dSpd as BufferSource);
    attr(dustP, DB.kind, "aKind", 1);
    setCommon(dustP);
    gl.uniform1f(uni(dustP, "uSpread"), S.spread);
    gl.uniform3fv(uni(dustP, "uInk"), pal.ink);
    gl.uniform3fv(uni(dustP, "uAmb"), pal.amb);
    gl.uniform3fv(uni(dustP, "uFast"), pal.fast);
    gl.uniform1f(uni(dustP, "uAmbA"), pal.ambA);
    gl.drawArrays(gl.POINTS, 0, DN);
    unbind();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.BLEND);
    gl.useProgram(postP);
    attr(postP, quad, "aQuad", 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(uni(postP, "uTex"), 0);
    gl.uniform2f(uni(postP, "uRes"), cv.width, cv.height);
    gl.uniform1f(uni(postP, "uDpr"), S.DPR);
    gl.uniform4fv(uni(postP, "uG"), ripGlass);
    gl.uniform3fv(uni(postP, "uRim"), pal.rim);
    gl.uniform3fv(uni(postP, "uFast"), pal.fast);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    unbind();
  }

  // Intro: the plane stands up from lying back while its layers close in. Scroll: it leans
  // back, shrinks a little and lifts away from the panel sliding over it. Pointer: it turns
  // to face the cursor by a few degrees. The DOM plane (the word) copies the same transform.
  function setPose(now: number) {
    const it = pose.born ? clamp01((now - pose.born) / (reduce ? 900 : INTRO)) : 0;
    const ei = 1 - Math.pow(1 - it, 4);
    let tx = 0, ty = 0;
    if (fine && ptr.inside) {
      tx = (ptr.sx / S.W - 0.5) * 2;
      ty = (ptr.sy / S.H - 0.5) * 2;
    } else if (!fine && !reduce) {
      const a = (now / 8000) * Math.PI * 2;
      tx = Math.sin(a) * 0.6;
      ty = Math.cos(a * 0.5) * 0.4;
    }
    pose.tx += (tx - pose.tx) * 0.08;
    pose.ty += (ty - pose.ty) * 0.08;
    const e = ease(prog);
    S.theta = (1 - ei) * (reduce ? 0.35 : 0.9) + 0.55 * e - 0.1 * pose.ty;
    S.phi = 0.17 * pose.tx;
    S.spread = 1 + (1 - ei) * 1.6;
    S.scale = (0.92 + 0.08 * ei) * (1 - 0.16 * e);
    S.rise = -0.14 * S.H * e;
    const key = [S.theta, S.phi, S.spread, S.scale, S.rise].map((v) => v.toFixed(4)).join();
    if (key === pose.key) return false;
    pose.key = key;
    if (plane) {
      const css = `translate3d(0, ${S.rise.toFixed(2)}px, 0) scale(${S.scale.toFixed(4)}) perspective(${S.D.toFixed(0)}px) rotateX(${S.theta.toFixed(4)}rad) rotateY(${S.phi.toFixed(4)}rad)`;
      if (css !== pose.css) plane.style.transform = pose.css = css;
    }
    return true;
  }

  function frame(now: number) {
    const sc = getScroll();
    prog += (sc.cover - prog) * 0.12;
    if (Math.abs(sc.cover - prog) < 1e-4) prog = sc.cover;
    if (!visible || sc.cover >= 0.999) return;
    const posed = setPose(now);

    for (let p = pulses.length - 1; p >= 0; p--) if (now - pulses[p].t > LIFE) pulses.splice(p, 1);
    const pr: Live[] = pulses.map((p) => {
      const u = (now - p.t) / LIFE;
      return { x: p.x, y: p.y, r: (now - p.t) * 0.45, a: p.a * (1 - u), glass: p.glass * Math.pow(1 - u, 1.6) };
    });

    // the pointer stays put on screen while the plane tilts under it
    if (ptr.inside) {
      const [x, y] = toPlane(ptr.sx, ptr.sy);
      ptr.x = x;
      ptr.y = y;
    }
    const act = ptr.inside && now - ptr.last < 120;
    const amtT = ptr.inside ? 1 : 0;
    const before = ptr.amt + ptr.act + ptr.fx + ptr.fy;
    ptr.amt += (amtT - ptr.amt) * 0.06;
    ptr.act += ((act ? 1 : 0) - ptr.act) * 0.06;
    ptr.fx += (ptr.x - ptr.fx) * 0.25;
    ptr.fy += (ptr.y - ptr.fy) * 0.25;
    ptr.pvx += (ptr.vx - ptr.pvx) * 0.2;
    ptr.pvy += (ptr.vy - ptr.pvy) * 0.2;
    ptr.vx *= 0.8;
    ptr.vy *= 0.8;
    const ptrMoving = Math.abs(ptr.amt + ptr.act + ptr.fx + ptr.fy - before) > 0.002 || Math.abs(ptr.pvx) + Math.abs(ptr.pvy) > 0.01;

    let dustMoving = false;
    if (awake > 0 || act || pr.length || dBeat > 0.01) {
      const mv = stepDust(pr, act);
      awake = mv > 0.03 || act || pr.length ? 30 : awake - 1;
      dustMoving = true;
    }
    if (needDraw || dustMoving || ptrMoving || posed || pr.length || audio.level > 0.003) {
      draw(pr);
      needDraw = false;
    }
  }

  // only rebuild when the stage or the room for the lockup really changed, since a rebuild
  // reshuffles the dust
  let fit = "";
  const refit = () => {
    const r = stage.getBoundingClientRect(), b = area();
    const key = [Math.round(r.width), Math.round(r.height), Math.round(b.top), Math.round(b.bottom)].join();
    if (key !== fit) {
      fit = key;
      measure();
    }
  };
  refit();
  // fonts change the hero text's height, and so the room left for the lockup
  document.fonts?.ready.then(refit);
  const offReady = whenReady(() => (pose.born = performance.now()));
  let rt = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(refit, 150);
  });
  ro.observe(stage);
  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible) needDraw = true;
  });
  io.observe(stage);
  const offFrame = onFrame(frame);

  return () => {
    offFrame();
    offKick();
    offReady();
    ro.disconnect();
    io.disconnect();
    clearTimeout(rt);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("pointercancel", onLeave);
    stage.removeEventListener("pointerdown", onDown);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
