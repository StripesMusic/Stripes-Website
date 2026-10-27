// POST /api/soundcloud/exchange { code, codeVerifier }
// Swaps the sign-in code for a one-time token (this is the step that needs the client secret),
// then follows Stripes from the visitor's account. The token isn't stored.
import { type Env, json, missing } from "./_env";

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const { code, codeVerifier } = (await request.json().catch(() => ({}))) as { code?: string; codeVerifier?: string };
  if (!code || !codeVerifier) return json({ ok: false, step: "validation", details: "Missing code or codeVerifier" }, 400);

  const unset = missing(env, ["SOUNDCLOUD_CLIENT_ID", "SOUNDCLOUD_CLIENT_SECRET", "SOUNDCLOUD_REDIRECT_URI", "SOUNDCLOUD_FOLLOW_USER_ID"]);
  if (unset.length) return json({ ok: false, step: "config", details: `Not set up yet: ${unset.join(", ")}` }, 500);

  try {
    const tokenRes = await fetch("https://secure.soundcloud.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: env.SOUNDCLOUD_CLIENT_ID,
        client_secret: env.SOUNDCLOUD_CLIENT_SECRET,
        redirect_uri: env.SOUNDCLOUD_REDIRECT_URI,
        code,
        code_verifier: codeVerifier,
      }),
    });
    if (!tokenRes.ok) {
      const details = await tokenRes.text();
      console.error("Token exchange failed:", tokenRes.status, details);
      return json({ ok: false, step: "token", status: tokenRes.status, details }, 400);
    }
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const followRes = await fetch(`https://api.soundcloud.com/me/followings/${env.SOUNDCLOUD_FOLLOW_USER_ID}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${access_token}`, Accept: "application/json" },
    });
    // signing in is proof enough, so a refused follow still unlocks the download
    if (!followRes.ok) {
      console.error("Follow failed (download unlocked anyway):", followRes.status, await followRes.text());
      return json({ ok: true, followFailed: true });
    }
    return json({ ok: true });
  } catch (err) {
    console.error("SoundCloud exchange error:", err);
    return json({ ok: false, step: "server", details: String(err) }, 500);
  }
};
