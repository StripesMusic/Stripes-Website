// Following on SoundCloud to unlock a download: the visitor signs in on SoundCloud (OAuth with
// PKCE), the site's own function (functions/api/soundcloud) follows Stripes for them, and
// /soundcloud-callback sends them back to the page with ?sc_success=true. The verifier and the
// page to return to travel in the state parameter, so the round trip works even when SoundCloud
// sends the visitor back in another tab or to the other address (www or not), where this tab's
// storage can't be read.
export const SC_API = "/api/soundcloud";

const randomHex = (len: number) => Array.from(crypto.getRandomValues(new Uint8Array(len)), (b) => b.toString(16).padStart(2, "0")).join("");
const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export type ScState = { v: string; r: string; n: string };
const encodeState = (s: ScState) => base64Url(new TextEncoder().encode(JSON.stringify(s)));
export function decodeState(state: string): ScState | null {
  try {
    const b64 = state.replace(/-/g, "+").replace(/_/g, "/").replace(/ /g, "+");
    const bytes = Uint8Array.from(atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4)), (c) => c.charCodeAt(0));
    const s = JSON.parse(new TextDecoder().decode(bytes));
    return typeof s?.v === "string" && typeof s?.r === "string" ? s : null;
  } catch {
    return null;
  }
}

// Sends the browser to SoundCloud. Resolves false if the sign-in couldn't be started.
export async function startSoundCloudFollow(returnTo: string): Promise<boolean> {
  try {
    const verifier = randomHex(48);
    const challenge = base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
    const state = encodeState({ v: verifier, r: returnTo, n: randomHex(8) });
    const res = await fetch(`${SC_API}/auth-url?code_challenge=${encodeURIComponent(challenge)}&state=${encodeURIComponent(state)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.authUrl) {
      console.error("auth-url failed:", json);
      return false;
    }
    location.href = json.authUrl;
    return true;
  } catch (err) {
    console.error("Couldn't start SoundCloud sign-in", err);
    return false;
  }
}
