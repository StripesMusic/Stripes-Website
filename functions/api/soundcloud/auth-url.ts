// GET /api/soundcloud/auth-url?code_challenge=…&state=…
// Builds the SoundCloud sign-in link (OAuth with PKCE). The browser keeps the verifier.
import { type Env, json, missing } from "./_env";

export const onRequestGet = ({ request, env }: { request: Request; env: Env }) => {
  const q = new URL(request.url).searchParams;
  const challenge = q.get("code_challenge");
  const state = q.get("state");
  if (!challenge || !state) return json({ error: "Missing code_challenge or state" }, 400);

  const unset = missing(env, ["SOUNDCLOUD_CLIENT_ID", "SOUNDCLOUD_REDIRECT_URI"]);
  if (unset.length) return json({ error: `Not set up yet: ${unset.join(", ")}` }, 500);

  const url = new URL("https://secure.soundcloud.com/connect");
  url.search = new URLSearchParams({
    client_id: env.SOUNDCLOUD_CLIENT_ID,
    redirect_uri: env.SOUNDCLOUD_REDIRECT_URI,
    response_type: "code",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  return json({ authUrl: url.toString() });
};
