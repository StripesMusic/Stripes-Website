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

- The fangate pages talk to a Supabase function (`supabase/functions/server`). That function still runs on Supabase, not Cloudflare; the project id and public key are in `utils/supabase/info.tsx`.
- Changes made in Figma Make after this export are not synced here automatically.
