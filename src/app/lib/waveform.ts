// The shape of a clip as bar heights (0..1), for the player bar. The clip is fetched and decoded
// once and remembered for the visit. Needs the file to allow cross-origin reads, as the analysis does.
const cache = new Map<string, Promise<number[] | null>>();

export function waveform(url: string, bars = 120): Promise<number[] | null> {
  const key = `${url}#${bars}`;
  let p = cache.get(key);
  if (!p) {
    p = (async () => {
      try {
        const buf = await (await fetch(url, { mode: "cors" })).arrayBuffer();
        const AC = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
        const audio = await new AC(1, 1, 44100).decodeAudioData(buf);
        const ch = audio.getChannelData(0);
        const step = Math.floor(ch.length / bars);
        const out: number[] = [];
        for (let b = 0; b < bars; b++) {
          // the loudest stretch in each slice, as RMS over short windows, reads closer to how it sounds than raw peaks
          let pk = 0;
          for (let i = b * step; i < (b + 1) * step; i += 256) {
            let s = 0;
            for (let j = i; j < i + 256 && j < ch.length; j++) s += ch[j] * ch[j];
            pk = Math.max(pk, Math.sqrt(s / 256));
          }
          out.push(pk);
        }
        const max = Math.max(...out, 1e-4);
        return out.map((v) => Math.max(0.06, v / max));
      } catch {
        return null;
      }
    })();
    cache.set(key, p);
  }
  return p;
}
