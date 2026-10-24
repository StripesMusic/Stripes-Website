import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: () => (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/home",
    Component: () => (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/about",
    Component: () => (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: "/music",
    Component: () => (
      <Layout>
        <Music />
      </Layout>
    ),
  },
  {
    path: "/designs",
    Component: () => (
      <Layout>
        <Artwork />
      </Layout>
    ),
  },
  {
    path: "/drums",
    Component: () => (
      <Layout>
        <Drums />
      </Layout>
    ),
  },
  {
    path: "/contact",
    Component: () => (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: "/link/forgetyou",
    Component: () => (
      <Layout>
        <FangateForgetYou />
      </Layout>
    ),
  },
  {
    path: "/link/catharinaremix",
    Component: () => (
      <Layout>
        <FangateCatharina />
      </Layout>
    ),
  },
  {
    path: "/link/tellme",
    Component: () => (
      <Layout>
        <FangateTellMe />
      </Layout>
    ),
  },
  {
    path: "/link/ijustflow",
    Component: () => (
      <Layout>
        <Fangate />
      </Layout>
    ),
  },
  {
    path: "/link/backtome",
    Component: () => (
      <Layout>
        <FangateBackToMe />
      </Layout>
    ),
  },
  {
    path: "/link/lostinyou",
    Component: () => (
      <Layout>
        <FangateLostInYou />
      </Layout>
    ),
  },
  {
    path: "/link/runwithyou",
    Component: () => (
      <Layout>
        <FangateRunWithYou />
      </Layout>
    ),
  },
  {
    path: "/link/dontkillmyviberemix",
    Component: () => (
      <Layout>
        <FangateDontKillMyVibe />
      </Layout>
    ),
  },
  {
    path: "/link/ghostofyouremix",
    Component: () => (
      <Layout>
        <FangateGhostOfYou />
      </Layout>
    ),
  },
  {
    path: "/link/neverlookingback",
    Component: () => (
      <Layout>
        <FangateNeverLookingBack />
      </Layout>
    ),
  },
  {
    path: "/link/clarityremix",
    Component: () => (
      <Layout>
        <FangateClarityRemix />
      </Layout>
    ),
  },
  {
    path: "/link/lovemetoo",
    Component: () => (
      <Layout>
        <FangateLoveMeToo />
      </Layout>
    ),
  },
  {
    path: "/link/infinityremix",
    Component: () => (
      <Layout>
        <FangateInfinityRemix />
      </Layout>
    ),
  },
  {
    path: "/link/youandi",
    Component: () => (
      <Layout>
        <FangateYouAndI />
      </Layout>
    ),
  },
  {
    path: "/link/morethanyesterdayremix",
    Component: () => (
      <Layout>
        <FangateMoreThanYesterday />
      </Layout>
    ),
  },
  {
    path: "/link/always",
    Component: () => (
      <Layout>
        <FangateAlways />
      </Layout>
    ),
  },
  {
    path: "/link/backintime",
    Component: () => (
      <Layout>
        <FangateBackInTime />
      </Layout>
    ),
  },
  {
    path: "/link/lucky",
    Component: () => (
      <Layout>
        <FangateLucky />
      </Layout>
    ),
  },
  {
    path: "/link/askyfullofstarsremix",
    Component: () => (
      <Layout>
        <FangateASkyFullOfStarsRemix />
      </Layout>
    ),
  },
  {
    path: "/link/sikeflip",
    Component: () => (
      <Layout>
        <FangateSikeFlip />
      </Layout>
    ),
  },
  {
    path: "/link/theendedit",
    Component: () => (
      <Layout>
        <FangateTheEndEdit />
      </Layout>
    ),
  },
  {
    path: "/link/sendmeanangel",
    Component: () => (
      <Layout>
        <FangateSendMeAnAngel />
      </Layout>
    ),
  },
  {
    path: "/link/boom",
    Component: () => (
      <Layout>
        <FangateBoom />
      </Layout>
    ),
  },
  {
    path: "/link/mashuppackvol1",
    Component: () => (
      <Layout>
        <FangateMashupPack />
      </Layout>
    ),
  },
  {
    path: "/link/outofcontrolep",
    Component: () => (
      <Layout>
        <FangateOutOfControlEP />
      </Layout>
    ),
  },
  {
    path: "/soundcloud-callback",
    Component: SoundCloudCallback,
  },
  {
    path: "/tools/gd-auto-export",
    Component: () => (
      <Layout>
        <GDAutoExport />
      </Layout>
    ),
  },
  {
    path: "/tools/audio-silence-padder",
    Component: () => (
      <Layout>
        <AudioSilencePadder />
      </Layout>
    ),
  },
  {
    path: "/tools/spotify-art-tester",
    Component: () => (
      <Layout>
        <SpotifyArtTester />
      </Layout>
    ),
  },
  {
    path: "*",
    Component: () => (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);