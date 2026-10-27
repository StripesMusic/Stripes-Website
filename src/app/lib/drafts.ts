// Drafts: ideas that show only on preview addresses (pages.dev and localhost), never on
// musicbystripes.com, each with a switch in the Drafts panel so they can be compared on and off.
// Switches are remembered on this device.
import { useSyncExternalStore } from "react";

export const isPreview = () => typeof location !== "undefined" && /(^|\.)pages\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);

export type DraftKey = "grain" | "rough";
const KEY = "s-drafts";
const defaults: Record<DraftKey, boolean> = { grain: true, rough: true };

let state: Record<DraftKey, boolean> = { ...defaults };
try {
  state = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
} catch {}
const subs = new Set<() => void>();

const apply = () => {
  const root = document.documentElement;
  (Object.keys(state) as DraftKey[]).forEach((k) => root.classList.toggle(`s-draft-${k}`, isPreview() && state[k]));
};
if (typeof document !== "undefined") apply();

export function setDraft(k: DraftKey, on: boolean) {
  state = { ...state, [k]: on };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  apply();
  subs.forEach((f) => f());
}

export function useDrafts() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => state,
  );
}
