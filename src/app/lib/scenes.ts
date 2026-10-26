// Each section names a colour scene with data-scene. The page takes the scene of the last section
// whose top has passed the middle of the screen; the colours themselves crossfade in CSS
// (stripes.css registers them so they can transition). "hero" is the default palette.
import { useEffect } from "react";
import { getTheme, onTheme } from "./theme";

// the page background of each scene, for the phone's browser bar
const LIGHT: Record<string, string> = {
  hero: "#cdcec8",
  ep: "#131313",
  releases: "#102729",
  olive: "#c4c7b7",
  designs: "#c6c7c3",
  drums: "#181f36",
  about: "#c3cbde",
  spectrum: "#5d74b3",
  footer: "#9dbf3f",
};
const DARK: Record<string, string> = {
  hero: "#151613",
  ep: "#131313",
  releases: "#b7ccc8",
  olive: "#24281c",
  designs: "#24281c",
  drums: "#181f36",
  about: "#c6c7c3",
  spectrum: "#343434",
  footer: "#9dbf3f",
};

export function useScenes(key: string) {
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let raf = 0, current = "";
    const bar = () => {
      const m = getTheme() === "light" ? LIGHT : DARK;
      meta?.setAttribute("content", m[current] ?? m.hero);
    };
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
      bar();
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    // the new page fades in after the old one fades out, so look again once it's there
    const late = setTimeout(pick, 450);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    const offTheme = onTheme(bar);
    return () => {
      offTheme();
      cancelAnimationFrame(raf);
      clearTimeout(late);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, [key]);
}
