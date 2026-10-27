// Following on SoundCloud to unlock a download: the visitor signs in on SoundCloud (OAuth with
// PKCE), the site's own function (functions/api/soundcloud) follows Stripes for them, and
// /soundcloud-callback sends them back to the page with ?sc_success=true. The verifier waits in
// sessionStorage during the round trip.
export const SC_API = "/api/soundcloud";

const randomHex = (len: number) => Array.from(crypto.getRandomValues(new Uint8Array(len)), (b) => b.toString(16).padStart(2, "0")).join("");
const base64Url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Sends the browser to SoundCloud. Resolves false if the sign-in couldn't be started.
export async function startSoundCloudFollow(returnTo: string): Promise<boolean> {
  try {
    const verifier = randomHex(48);
    const challenge = base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
    const state = randomHex(16);
    const res = await fetch(`${SC_API}/auth-url?code_challenge=${encodeURIComponent(challenge)}&state=${encodeURIComponent(state)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.authUrl) {
      console.error("auth-url failed:", json);
      return false;
    }
    sessionStorage.setItem("sc_pkce", JSON.stringify({ verifier, return_to: returnTo }));
    location.href = json.authUrl;
    return true;
  } catch (err) {
    console.error("Couldn't start SoundCloud sign-in", err);
    return false;
  }
}
