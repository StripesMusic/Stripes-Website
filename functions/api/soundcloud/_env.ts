// Settings for the SoundCloud follow, kept in Cloudflare Pages → Settings → Variables and Secrets
// (never in the code). The redirect URI must match the one registered on the SoundCloud app.
export interface Env {
  SOUNDCLOUD_CLIENT_ID: string;
  SOUNDCLOUD_CLIENT_SECRET: string;
  SOUNDCLOUD_REDIRECT_URI: string;
  SOUNDCLOUD_FOLLOW_USER_ID: string;
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// names of any settings that haven't been added yet
export const missing = (env: Partial<Env>, keys: (keyof Env)[]) => keys.filter((k) => !env[k]);
