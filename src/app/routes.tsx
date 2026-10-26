import { createBrowserRouter, useOutlet } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Music } from "./pages/Music";
import { Artwork } from "./pages/Artwork";
import { Drums } from "./pages/Drums";
import { Contact } from "./pages/Contact";
import { FangateForgetYou } from "./pages/FangateForgetYou";
import { FangateOutOfControlEP } from "./pages/FangateOutOfControlEP";
import { FangateCatharina } from "./pages/FangateCatharina";
import { FangateTellMe } from "./pages/FangateTellMe";
import { Fangate } from "./pages/Fangate";
import { FangateBackToMe } from "./pages/FangateBackToMe";
import { FangateLostInYou } from "./pages/FangateLostInYou";
import { FangateRunWithYou } from "./pages/FangateRunWithYou";
import { FangateDontKillMyVibe } from "./pages/FangateDontKillMyVibe";
import { FangateGhostOfYou } from "./pages/FangateGhostOfYou";
import { FangateNeverLookingBack } from "./pages/FangateNeverLookingBack";
import { FangateClarityRemix } from "./pages/FangateClarityRemix";
import { FangateLoveMeToo } from "./pages/FangateLoveMeToo";
import { FangateInfinityRemix } from "./pages/FangateInfinityRemix";
import { FangateYouAndI } from "./pages/FangateYouAndI";
import { FangateMoreThanYesterday } from "./pages/FangateMoreThanYesterday";
import { FangateAlways } from "./pages/FangateAlways";
import { FangateBackInTime } from "./pages/FangateBackInTime";
import { FangateLucky } from "./pages/FangateLucky";
import { FangateASkyFullOfStarsRemix } from "./pages/FangateASkyFullOfStarsRemix";
import { FangateSikeFlip } from "./pages/FangateSikeFlip";
import { FangateTheEndEdit } from "./pages/FangateTheEndEdit";
import { FangateSendMeAnAngel } from "./pages/FangateSendMeAnAngel";
import { FangateBoom } from "./pages/FangateBoom";
import { FangateMashupPack } from "./pages/FangateMashupPack";
import { SoundCloudCallback } from "./pages/SoundCloudCallback";
import { GDAutoExport } from "./pages/tools/GDAutoExport";
import { AudioSilencePadder } from "./pages/tools/AudioSilencePadder";
import { SpotifyArtTester } from "./pages/tools/SpotifyArtTester";
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
      {
        path: "/link/forgetyou",
        Component: FangateForgetYou,
      },
      {
        path: "/link/catharinaremix",
        Component: FangateCatharina,
      },
      {
        path: "/link/tellme",
        Component: FangateTellMe,
      },
      {
        path: "/link/ijustflow",
        Component: Fangate,
      },
      {
        path: "/link/backtome",
        Component: FangateBackToMe,
      },
      {
        path: "/link/lostinyou",
        Component: FangateLostInYou,
      },
      {
        path: "/link/runwithyou",
        Component: FangateRunWithYou,
      },
      {
        path: "/link/dontkillmyviberemix",
        Component: FangateDontKillMyVibe,
      },
      {
        path: "/link/ghostofyouremix",
        Component: FangateGhostOfYou,
      },
      {
        path: "/link/neverlookingback",
        Component: FangateNeverLookingBack,
      },
      {
        path: "/link/clarityremix",
        Component: FangateClarityRemix,
      },
      {
        path: "/link/lovemetoo",
        Component: FangateLoveMeToo,
      },
      {
        path: "/link/infinityremix",
        Component: FangateInfinityRemix,
      },
      {
        path: "/link/youandi",
        Component: FangateYouAndI,
      },
      {
        path: "/link/morethanyesterdayremix",
        Component: FangateMoreThanYesterday,
      },
      {
        path: "/link/always",
        Component: FangateAlways,
      },
      {
        path: "/link/backintime",
        Component: FangateBackInTime,
      },
      {
        path: "/link/lucky",
        Component: FangateLucky,
      },
      {
        path: "/link/askyfullofstarsremix",
        Component: FangateASkyFullOfStarsRemix,
      },
      {
        path: "/link/sikeflip",
        Component: FangateSikeFlip,
      },
      {
        path: "/link/theendedit",
        Component: FangateTheEndEdit,
      },
      {
        path: "/link/sendmeanangel",
        Component: FangateSendMeAnAngel,
      },
      {
        path: "/link/boom",
        Component: FangateBoom,
      },
      {
        path: "/link/mashuppackvol1",
        Component: FangateMashupPack,
      },
      {
        path: "/link/outofcontrolep",
        Component: FangateOutOfControlEP,
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
