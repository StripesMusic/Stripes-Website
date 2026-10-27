import { useSyncExternalStore } from "react";
import { audio } from "./audio";

export function useAudio() {
  return useSyncExternalStore(audio.subscribe, audio.getState, audio.getState);
}
