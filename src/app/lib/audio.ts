// Shared audio for the site: hover previews, the hero preview, and kick detection
// that drives the S and the wordmark. One thing plays at a time.
import { onFrame } from "./ticker";

export type Track = { id: string; title: string; sub: string; url: string; href?: string };
export type AudioState = {
  track: Track | null;
  playing: boolean;
  demo: boolean; // true while the stand-in synth beat plays because a clip is missing
  unavailable: boolean; // the last requested clip couldn't be loaded
  armed: boolean; // the visitor has clicked something, so browsers allow sound
};
type PlayOpts = { loop?: boolean; demoFallback?: boolean; quiet?: boolean }; // quiet: no "unavailable" notice (hover previews)
type Current = { el: HTMLAudioElement; gain: GainNode | null; track: Track; opts: PlayOpts; plain: boolean };

const SPB = 60 / 128;
const CHORDS = [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]];
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
// The stand-in beat only plays on preview builds, never on the live site.
const demoAllowed = () => /(^|\.)pages\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);

class AudioBus {
  state: AudioState = { track: null, playing: false, demo: false, unavailable: false, armed: false };
  private unavailableTimer = 0;
  level = 0;
  // bass, mids and highs, 0..1 and smoothed, for visuals that follow the whole spectrum
  bands = { low: 0, mid: 0, high: 0 };
  private subs = new Set<() => void>();
  private kickFns = new Set<(strength: number) => void>();
  private ac: AudioContext | null = null;
  private bus!: GainNode;
  private analyser!: AnalyserNode;
  private freq!: Uint8Array<ArrayBuffer>;
  private noise!: AudioBuffer;
  private cur: Current | null = null;
  private synth: { timer: number; next: number; n: number; out: GainNode } | null = null;
  private missing = new Set<string>();
  private bassAvg = 0;
  private lastKick = 0;
  private stopTicker: (() => void) | null = null;

  subscribe = (fn: () => void) => {
    this.subs.add(fn);
    return () => {
      this.subs.delete(fn);
    };
  };
  getState = () => this.state;
  onKick(fn: (strength: number) => void) {
    this.kickFns.add(fn);
    return () => {
      this.kickFns.delete(fn);
    };
  }
  private set(patch: Partial<AudioState>) {
    this.state = { ...this.state, ...patch };
    this.subs.forEach((f) => f());
  }

  // Call from a click or key press. Browsers only allow sound after one.
  arm() {
    if (!this.ac) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      this.ac = ac;
      this.bus = ac.createGain();
      this.analyser = ac.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.45;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      this.bus.connect(this.analyser);
      this.analyser.connect(ac.destination);
      this.noise = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const ch = this.noise.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    }
    this.ac.resume();
    if (!this.state.armed) this.set({ armed: true });
  }

  isCurrent(id: string) {
    return this.state.playing && this.state.track?.id === id;
  }

  toggle(track: Track, opts: PlayOpts = {}) {
    if (this.isCurrent(track.id)) this.stop();
    else this.play(track, opts);
  }

  play(track: Track, opts: PlayOpts = {}) {
    this.arm();
    if (!this.ac) return;
    this.stop(120);
    if (this.missing.has(track.url)) return this.fail(track, opts);
    this.load(track, opts, false);
  }

  // First try through WebAudio (needs CORS on the file) so kicks can drive the visuals,
  // then fall back to plain playback, then give up and remember the clip is missing.
  private load(track: Track, opts: PlayOpts, plain: boolean) {
    const ac = this.ac!;
    const el = new Audio();
    el.preload = "auto";
    el.loop = !!opts.loop;
    let gain: GainNode | null = null;
    if (!plain) {
      el.crossOrigin = "anonymous";
      gain = ac.createGain();
      gain.gain.value = 0;
      ac.createMediaElementSource(el).connect(gain);
      gain.connect(this.bus);
    }
    el.src = track.url;
    const cur: Current = { el, gain, track, opts, plain };
    this.cur = cur;
    el.addEventListener("error", () => {
      if (this.cur !== cur) return;
      this.cur = null;
      if (!plain) return this.load(track, opts, true);
      this.missing.add(track.url);
      this.fail(track, opts);
    });
    el.addEventListener("ended", () => {
      if (this.cur === cur) this.stop(0);
    });
    el.play()
      .then(() => {
        if (gain) gain.gain.setTargetAtTime(1, ac.currentTime, 0.04);
      })
      .catch((err: DOMException) => {
        if (this.cur === cur && err.name === "NotAllowedError") this.stop(0);
      });
    this.set({ track, playing: true, demo: false, unavailable: false });
    this.watch();
  }

  private fail(track: Track, opts: PlayOpts) {
    if (opts.demoFallback && demoAllowed()) return this.startDemo(track);
    if (opts.quiet) return this.set({ playing: false, track: null });
    clearTimeout(this.unavailableTimer);
    this.set({ track, playing: false, demo: false, unavailable: true });
    this.unavailableTimer = window.setTimeout(() => this.set({ unavailable: false }), 4000);
  }

  stop(fadeMs = 160) {
    const cur = this.cur;
    this.cur = null;
    if (cur) {
      if (cur.gain && this.ac && fadeMs > 0) {
        cur.gain.gain.setTargetAtTime(0, this.ac.currentTime, fadeMs / 4000);
        setTimeout(() => cur.el.pause(), fadeMs);
      } else cur.el.pause();
    }
    if (this.synth) {
      const { timer, out } = this.synth;
      clearInterval(timer);
      if (this.ac) out.gain.setTargetAtTime(0, this.ac.currentTime, 0.03);
      this.synth = null;
    }
    if (this.state.playing) this.set({ playing: false, demo: false });
  }

  // A 128 BPM stand-in beat, used for the hero preview until its clip is uploaded.
  private startDemo(track: Track) {
    const ac = this.ac!;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    const out = ac.createGain();
    out.gain.value = 0.5;
    out.connect(comp);
    comp.connect(this.bus);
    const syn = { timer: 0, next: ac.currentTime + 0.05, n: 0, out };
    const schedule = () => {
      while (syn.next < ac.currentTime + 0.12) {
        const t = syn.next, chord = CHORDS[Math.floor(syn.n / 4) % 4], inBar = syn.n % 4;
        this.kick(t, out);
        if (inBar === 1 || inBar === 3) this.hit(t, 0.16, "bandpass", 1700, 0.5, out);
        this.hit(t + SPB / 2, 0.05, "highpass", 8000, 0.22, out);
        this.stab(t + SPB / 2, chord, out);
        this.bassNote(t + SPB / 2, chord[0], out);
        if (inBar === 3) this.stab(t + SPB * 0.75, chord.map((n) => n + 12), out);
        syn.next += SPB;
        syn.n++;
      }
    };
    schedule();
    syn.timer = window.setInterval(schedule, 25);
    this.synth = syn;
    this.set({ track, playing: true, demo: true, unavailable: false });
    this.watch();
  }
  private kick(t: number, out: AudioNode) {
    const ac = this.ac!, o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.45);
  }
  private hit(t: number, dur: number, type: BiquadFilterType, f: number, gain: number, out: AudioNode) {
    const ac = this.ac!, s = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = this.noise;
    fl.type = type;
    fl.frequency.value = f;
    fl.Q.value = 0.8;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(fl);
    fl.connect(g);
    g.connect(out);
    s.start(t);
    s.stop(t + dur + 0.02);
  }
  private stab(t: number, notes: number[], out: AudioNode) {
    const ac = this.ac!, fl = ac.createBiquadFilter(), g = ac.createGain();
    fl.type = "lowpass";
    fl.Q.value = 6;
    fl.frequency.setValueAtTime(3200, t);
    fl.frequency.exponentialRampToValueAtTime(500, t + 0.22);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    fl.connect(g);
    g.connect(out);
    notes.forEach((n) =>
      [-9, 0, 9].forEach((det) => {
        const o = ac.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = hz(n);
        o.detune.value = det;
        o.connect(fl);
        o.start(t);
        o.stop(t + 0.3);
      }),
    );
  }
  private bassNote(t: number, n: number, out: AudioNode) {
    const ac = this.ac!, o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle";
    o.frequency.value = hz(n - 24);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + SPB * 0.45);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + SPB * 0.5);
  }

  // Kick detection on the low end. Works for the demo beat and for real songs.
  private watch() {
    if (this.stopTicker) return;
    this.stopTicker = onFrame((now) => {
      if (!this.state.playing) {
        this.level *= 0.9;
        this.bands.low *= 0.92;
        this.bands.mid *= 0.92;
        this.bands.high *= 0.92;
        if (this.level < 0.002 && this.stopTicker) {
          this.level = 0;
          this.bands.low = this.bands.mid = this.bands.high = 0;
          this.stopTicker();
          this.stopTicker = null;
        }
        return;
      }
      const ac = this.ac!;
      this.analyser.getByteFrequencyData(this.freq);
      const binHz = ac.sampleRate / this.analyser.fftSize, hi = Math.max(2, Math.round(140 / binHz));
      let s = 0;
      for (let i = 1; i <= hi; i++) s += this.freq[i];
      s /= hi * 255;
      this.level += (s - this.level) * 0.3;
      const band = (lo: number, hi: number) => {
        const a = Math.round(lo / binHz), b = Math.min(this.freq.length - 1, Math.round(hi / binHz));
        let sum = 0;
        for (let i = a; i <= b; i++) sum += this.freq[i];
        return sum / ((b - a + 1) * 255);
      };
      const bd = this.bands;
      bd.low += (s - bd.low) * 0.2;
      bd.mid += (band(300, 2000) - bd.mid) * 0.15;
      bd.high += (band(4000, 12000) - bd.high) * 0.25;
      if (s > this.bassAvg * 1.28 && s > 0.32 && now - this.lastKick > 210) {
        this.lastKick = now;
        const k = Math.min(1, s * 1.2);
        this.kickFns.forEach((f) => f(k));
      }
      this.bassAvg = this.bassAvg * 0.94 + s * 0.06;
    });
  }
}

export const audio = new AudioBus();
