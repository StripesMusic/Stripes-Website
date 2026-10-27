import { createBrowserRouter, useOutlet } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Music } from "./pages/Music";
import { Artwork } from "./pages/Artwork";
import { Drums } from "./pages/Drums";
import { Contact } from "./pages/Contact";
import { Fangate } from "./pages/Fangate";
import { gates } from "./data/fangates";
import { SoundCloudCallback } from "./pages/SoundCloudCallback";
import { GDAutoExport } from "./pages/tools/GDAutoExport";
import { AudioSilencePadder } from "./pages/tools/AudioSilencePadder";
import { SpotifyArtTester } from "./pages/tools/SpotifyArtTester";
import { Tools } from "./pages/tools/Tools";
import { NotFound } from "./pages/NotFound";
import { Privacy, Terms, Accessibility } from "./pages/Legal";

// One Layout for every page, so the nav, the preloader and the page transition persist across
// page changes. useOutlet hands the page over as an element, so the old page can fade out as itself.
function Root() {
  return <Layout>{useOutlet()}</Layout>;
}

export const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/music",
        Component: Music,
      },
      {
        path: "/designs",
        Component: Artwork,
      },
      {
        path: "/drums",
        Component: Drums,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      // one download page per release, all drawn by Fangate from data/fangates.ts
      ...gates.map((g) => ({ path: `/link/${g.slug}`, element: <Fangate g={g} /> })),
      {
        path: "/tools",
        Component: Tools,
      },
      {
        path: "/tools/gd-auto-export",
        Component: GDAutoExport,
      },
      {
        path: "/tools/audio-silence-padder",
        Component: AudioSilencePadder,
      },
      {
        path: "/tools/spotify-art-tester",
        Component: SpotifyArtTester,
      },
      {
        path: "/privacy",
        Component: Privacy,
      },
      {
        path: "/terms",
        Component: Terms,
      },
      {
        path: "/accessibility",
        Component: Accessibility,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "/soundcloud-callback",
    Component: SoundCloudCallback,
  },
]);
