// Each section names a colour scene with data-scene. The page takes the scene of the last section
// whose top has passed the middle of the screen; the colours themselves crossfade in CSS
// (stripes.css registers them so they can transition). "hero" is the default palette.
import { useEffect } from "react";

// the page background of each scene, for the phone's browser bar
const BAR: Record<string, string> = {
  hero: "#151613",
  ep: "#131313",
  releases: "#102729",
  olive: "#24281c",
  designs: "#c6c7c3",
  drums: "#181f36",
  about: "#c6c7c3",
  footer: "#9dbf3f",
};

export function useScenes(key: string) {
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let raf = 0, current = "";
    const pick = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let scene = "hero";
      document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        if (el.getBoundingClientRect().top <= mid) scene = el.dataset.scene!;
      });
      if (scene === current) return;
      current = scene;
      if (scene === "hero") delete root.dataset.scene;
      else root.dataset.scene = scene;
      meta?.setAttribute("content", BAR[scene] ?? BAR.hero);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    // the new page fades in after the old one fades out, so look again once it's there
    const late = setTimeout(pick, 450);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, [key]);
}
