// Dark by default; the nav button switches to light and remembers it. index.html applies the
// saved choice before the page paints, so there's no flash of the wrong theme.
import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "s-theme";
const subs = new Set<() => void>();

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function setTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    // private mode: it lasts until the tab closes
  }
  subs.forEach((f) => f());
}

export function onTheme(f: () => void) {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}

export const useTheme = () => useSyncExternalStore(onTheme, getTheme, () => "dark" as Theme);
