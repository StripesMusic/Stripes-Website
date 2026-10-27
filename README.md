# Stripes website

The official Stripes website, exported from Figma Make (WEBSITEv1) and set up to build on its own.

Built with React, Vite and Tailwind CSS. Most images are loaded from `assets.musicbystripes.com`.

## Hosting on Cloudflare Pages

Build settings:

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`

Every push to `main` redeploys the site.

## Running it locally (optional)

```
npm install
npm run dev
```

## Notes

- The download pages' SoundCloud follow runs on Cloudflare Pages Functions in `functions/api/soundcloud`. Its settings (SOUNDCLOUD_CLIENT_ID, SOUNDCLOUD_CLIENT_SECRET, SOUNDCLOUD_REDIRECT_URI, and optionally SOUNDCLOUD_FOLLOW_USER_ID) live in the Pages project's Variables and Secrets. To run them locally, put them in a `.dev.vars` file (git-ignored) and run `npx wrangler pages dev dist` after a build.
- Changes made in Figma Make after this export are not synced here automatically.
