// Every download page (/link/<slug>): one entry per release, all drawn by pages/Fangate.tsx.
// To add a release, copy an entry: links are [platform, url] in the order they're shown,
// download is a direct-download link (make one with the GD Auto Export tool), and without
// gate: false the download unlocks once SoundCloud and Instagram are followed.
export type Platform = "spotify" | "apple" | "ytmusic" | "youtube" | "soundcloud" | "deezer";
export type GateTrack = { n: string; title: string; artists: string; preview: string; download: string };
export type Gate = {
  slug: string;
  title: string;
  artists: string;
  type: string;
  date: string;
  cover: string;
  links: [Platform, string][];
  download?: string;
  gate?: false;
  // more Instagram accounts to follow before the download unlocks
  follows?: { name: string; href: string }[];
  tracks?: GateTrack[];
  blurb?: string;
  what?: "pack";
};

export const gates: Gate[] = [
  {
    slug: "always",
    title: "Always",
    artists: "paulø, blo0my, Stripes",
    type: "Single",
    date: "05 Jul 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Always_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/4FhwjCJhlxRaneJWGliE5Q"],
      ["apple", "https://music.apple.com/us/song/always/1749505187"],
      ["ytmusic", "https://music.youtube.com/watch?v=DlGCpid88WA"],
      ["soundcloud", "https://soundcloud.com/redoceanmg/paulo-blo0my-stripes-always"],
      ["deezer", "https://link.deezer.com/s/32uQkrH8svn2Ocv7Im9AN"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1nTNeS7K-bP6F29ocD9NVSfCPUTMic7H",
  },
  {
    slug: "askyfullofstarsremix",
    title: "A Sky Full Of Stars (NSJ, Stripes, Lonely Heaven Remix)",
    artists: "Coldplay",
    type: "Unofficial Remix",
    date: "23 Mar 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/A_Sky_Full_Of_Stars_Remix_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/musicbystripes/a-sky-full-of-stars-remix"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1BjmyXmSnpMZFY49ssGlasrg9ZPMTXb-P",
  },
  {
    slug: "backintime",
    title: "Back In Time",
    artists: "Stripes, NSJ, Aprox, Lonely Heaven",
    type: "Single",
    date: "07 Jun 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Back_In_Time_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/05sLBnfY0NajORvJonHhNc"],
      ["apple", "https://music.apple.com/song/back-in-time-feat-lonely-heaven/1867618023"],
      ["ytmusic", "https://music.youtube.com/watch?v=rmXM7YfMxYE"],
      ["soundcloud", "https://soundcloud.com/nandanmusicofficial/stripes-nsj-aprox-lonely-heaven-back-in-time"],
      ["deezer", "https://link.deezer.com/s/32uQIFXOIFdtJmXtJsRCb"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1lVb40kUnCGouraywGxEXBPRpv8jRP6T2",
  },
  {
    slug: "backtome",
    title: "Back To Me (Chillbird, Stripes Edit)",
    artists: "Rave Vegas, Miles Arnell, CALVO",
    type: "Unofficial Edit",
    date: "09 Jan 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Back_To_Me_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/averychillbird/rave-vegas-feat-miles-arnell-back-to-me-calvo-remix-stripes-chillbird-edit"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1FvWrxyuc6vziMgVbPDHxLM9hT1OqfFE4",
  },
  {
    slug: "boom",
    title: "Boom",
    artists: "Stripes",
    type: "Single",
    date: "04 Aug 2023",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Boom_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/2CMxUQGBbLwXtNq1aYHICH"],
      ["apple", "https://music.apple.com/song/boom/1842406757"],
      ["ytmusic", "https://music.youtube.com/watch?v=2kcvLQi8Rgk"],
      ["soundcloud", "https://soundcloud.com/musicbystripes/stripes-boom"],
      ["deezer", "https://link.deezer.com/s/32uR6aSMywqbXlxVAW0v5"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1C5-WFK_XhvhgX8IqS8f7eojUc2FHykpZ",
  },
  {
    slug: "catharinaremix",
    title: "Catharina (Thome, Stripes Remix)",
    artists: "Martin Garrix",
    type: "Unofficial Remix",
    date: "18 Apr 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Catharina_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/thome_music/martin-garrix-catharina-thome"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1YQ1VZ6fyqxLWK2PJBQM_t_tF_D-wTWvd",
    follows: [{ name: "Thome", href: "https://www.instagram.com/thomemusic/" }],
  },
  {
    slug: "clarityremix",
    title: "Clarity (Stripes, Alvin Mo Remix)",
    artists: "Stripes, Alvin Mo",
    type: "Unofficial Remix",
    date: "31 May 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Clarity_Artwork.jpg",
    links: [
      ["soundcloud", "https://on.soundcloud.com/C3eUocZDLIBEg3W6xO"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1_hfECmRguUun-AkUhqsrpLjHnMwwgppf",
  },
  {
    slug: "dontkillmyviberemix",
    title: "Don't Kill My Vibe (Stripes, 7sunami Remix)",
    artists: "Toxic Wraith",
    type: "Official Remix",
    date: "03 Oct 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Dont_Kill_My_Vibe_Remix_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/6FzulqsyAQzs54qEVpy1KC"],
      ["apple", "https://music.apple.com/song/dont-kill-my-vibe-stripes-7sunami-remix/1842398204"],
      ["ytmusic", "https://music.youtube.com/watch?v=CACZm60G1Fk"],
      ["soundcloud", "https://soundcloud.com/toxicwraithmusic/toxic-wraith-dont-kill-my-vibe-stripes-7sunami-remix"],
      ["deezer", "https://link.deezer.com/s/32uPRjITMjsFOv585khqO"],
    ],
    download: "https://hypeddit.com/toxicwraithmusic/dontkillmyvibestripes7sunamiremixfreedl",
  },
  {
    slug: "forgetyou",
    title: "Forget You",
    artists: "7sunami, Thome, Stripes",
    type: "Single",
    date: "09 Oct 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Forget_You_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/album/0oUQKr8QL2graRykkTJ6Pn"],
      ["apple", "https://music.apple.com/gb/album/forget-you-single/6818386400"],
      ["ytmusic", "https://music.youtube.com/playlist?list=OLAK5uy_lVTVEMcv79HEJCLrY-KRWXf0gsqmzN5RI"],
      ["soundcloud", "https://soundcloud.com/musicbystripes/forget-you"],
      ["deezer", "https://www.deezer.com/en/album/1111282282"],
    ],
    download: "https://drive.google.com/uc?export=download&id=15AF9D_qkEn-sxPw6pyPbdf2g9tnIK4NW",
  },
  {
    slug: "ghostofyouremix",
    title: "Ghost Of You (E2D2, Stripes Remix)",
    artists: "BUTTER, Andrew A, beno",
    type: "Official Remix",
    date: "11 Jul 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Ghost_Of_You_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/4Uid33H5WNqVsBpSolaaJd"],
      ["apple", "https://music.apple.com/song/ghost-of-you-feat-beno-e2d2-stripes-remix-feat-beno/1820198697"],
      ["ytmusic", "https://music.youtube.com/watch?v=XK-9gyXDpVI"],
      ["soundcloud", "https://soundcloud.com/musicbystripes/butter-andrew-a-beno-ghost-of"],
      ["deezer", "https://link.deezer.com/s/32uPXL6NBNGTCTYXkEkrT"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1lCHTBdkMxEoclPGU-q7Ic4_2lP2okppP",
  },
  {
    slug: "ijustflow",
    title: "I Just Flow",
    artists: "Stripes, Hilefex",
    type: "Single",
    date: "23 Jan 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/I_Just_Flow_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/21i0tDZDaN7NMYKtFTRNMr"],
      ["apple", "https://music.apple.com/us/album/i-just-flow-radio-edit/1870413927"],
      ["ytmusic", "https://music.youtube.com/watch?v=mDCR71pUn4s"],
      ["soundcloud", "https://soundcloud.com/musicbystripes/i-just-flow"],
      ["deezer", "https://link.deezer.com/s/32uPRGBeJ194Z6XFupYn5"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1X2axcXJiBn3nLeGi-EsiBeWTJ7iX1ECu",
  },
  {
    slug: "infinityremix",
    title: "Infinity (Stripes Remix)",
    artists: "One Direction",
    type: "Unofficial Remix",
    date: "23 May 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Infinity_Remix_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/musicbystripes/infinityremix"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1vB8Me5OZf7zBMtb_mXiH6RKoDnrTvNGP",
  },
  {
    slug: "lostinyou",
    title: "Lost In You (Toxic Wraith, Stripes Remix)",
    artists: "Quintino, NERVO",
    type: "Unofficial Remix",
    date: "28 Nov 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Lost_In_You_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/toxicwraithmusic/quintino-nervo-lost-in-you-toxic-wraith-stripes-remix"],
    ],
    download: "https://hypeddit.com/toxicwraithmusic/lostinyouremix",
  // Hypeddit runs its own follow steps
    gate: false,
  },
  {
    slug: "lovemetoo",
    title: "Love Me Too",
    artists: "Firee, Stripes",
    type: "Single",
    date: "30 May 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Love_Me_Too_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/1U20O4vCxW0T9wgcPBmrRi"],
      ["apple", "https://music.apple.com/song/love-me-too/1840204529"],
      ["ytmusic", "https://music.youtube.com/watch?v=i911h98VddQ"],
      ["soundcloud", "https://soundcloud.com/quadron/firee-stripes-love-me-too"],
      ["deezer", "https://link.deezer.com/s/32uQ4zg0EyldfGjwd1Ooh"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1QKeSRkcdauXf74vsH-Mo5WBdO4Lr_3ju",
  },
  {
    slug: "lucky",
    title: "Lucky",
    artists: "7sunami, Cl04k, Stripes",
    type: "Single",
    date: "17 May 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Lucky_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/0dmF3rIDIgau4yfwaWE5Ql"],
      ["apple", "https://music.apple.com/song/lucky/1742534062"],
      ["ytmusic", "https://music.youtube.com/watch?v=oefQGR0RVvo"],
      ["soundcloud", "https://soundcloud.com/fhcgoinghard/7sunami-cl04k-stripes-lucky"],
      ["deezer", "https://link.deezer.com/s/32uQOJ02ATv7BRKoRz1ag"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1yCSrzi0oO8q87DLU1Y7NOAobEWIpugup",
  },
  {
    slug: "mashuppackvol1",
    title: "Mashup Pack Vol. 1",
    artists: "Stripes",
    type: "Mashup pack",
    date: "Apr 2026",
    cover: "https://assets.musicbystripes.com/client%20cover%20arts/misc/Stripes_Mashup_Pack_Vol_1_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/musicbystripes/stripes-mashup-pack-vol-1-free/s-ZMsXgInOG5B"],
    ],
    download: "https://drive.google.com/uc?export=download&id=19NriMnkKtzBrLujl7oLSP7dXWI0-BssF",
    blurb: "23 exclusive mashups, free to download.",
    what: "pack",
  },
  {
    slug: "morethanyesterdayremix",
    title: "More Than Yesterday (Jay Hertz, Stripes Remix)",
    artists: "Two Friends, Russell Dickerson",
    type: "Unofficial Remix",
    date: "12 Oct 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/More_Than_Yesterday_Remix_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/jayhertzmusic/two-friends-feat-russell-3"],
    ],
    download: "https://drive.google.com/uc?export=download&id=10E4G9Vu-W7Lvc4WXltEjW7LUu_4tC-8k",
  },
  {
    slug: "neverlookingback",
    title: "Never Looking Back",
    artists: "Stripes",
    type: "Single",
    date: "20 Jun 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Never_Looking_Back_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/4cvw6gaGVrb7Lp5Jq9ZnbE"],
      ["apple", "https://music.apple.com/song/never-looking-back/1839251885"],
      ["ytmusic", "https://music.youtube.com/watch?v=gVz0BUSz-qE"],
      ["soundcloud", "https://soundcloud.com/ton618rec/neverlookingback"],
      ["deezer", "https://link.deezer.com/s/32uQ0Sr3iB86MRTDETix7"],
    ],
    download: "https://drive.google.com/uc?export=download&id=15TSwERt6acAcjGKUYh1m5ADBHNUMBP77",
  },
  {
    slug: "outofcontrolep",
    title: "Out Of Control",
    artists: "Stripes, 7sunami",
    type: "EP",
    date: "16 Oct 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Out_Of_Control_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/album/3okq02ephOLWVQH5tuOI33"],
      ["apple", "https://music.apple.com/us/album/out-of-control-ep-ep/6819803380"],
      ["ytmusic", "https://music.youtube.com/playlist?list=OLAK5uy_nfXq4lE6NDDm98PoRjeBt_Mww5lYvluzQ"],
      ["soundcloud", "https://soundcloud.com/musicbystripes/sets/out-of-control"],
      ["deezer", "https://www.deezer.com/en/album/1114781642"],
    ],
    tracks: [
    { n: "01", title: "Out Of Control", artists: "Stripes, 7sunami", preview: "outofcontrol", download: "https://drive.google.com/uc?export=download&id=18fCSbPPL6h137iiXk2-nIOFhbMnE0kj1" },
    { n: "02", title: "Forget You", artists: "7sunami, Thome, Stripes", preview: "forgetyou", download: "https://drive.google.com/uc?export=download&id=15AF9D_qkEn-sxPw6pyPbdf2g9tnIK4NW" },
    { n: "03", title: "Under The Moonlight", artists: "Stripes, 7sunami", preview: "underthemoonlight", download: "https://drive.google.com/uc?export=download&id=1-aBAGtG7qPHRt4VJIBcJqw0FjT6Pus6y" },
    { n: "04", title: "Won't Give Up", artists: "Stripes, 7sunami", preview: "wontgiveup", download: "https://drive.google.com/uc?export=download&id=1X0cIiKkrqOfTUpS3e6qVtYAzC5kl2vli" },
    ],
  },
  {
    slug: "runwithyou",
    title: "Run With You",
    artists: "Stripes, Alvin Mo, paulø",
    type: "Single",
    date: "14 Nov 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Run_With_You_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/6n81zVTTCSujhphDzDB4fh"],
      ["apple", "https://music.apple.com/us/song/run-with-you/1854320274"],
      ["ytmusic", "https://music.youtube.com/watch?v=vAVhxmT56kI"],
      ["soundcloud", "https://soundcloud.com/futurizedrecords/runwithyou"],
      ["deezer", "https://link.deezer.com/s/32uPKvZOjCWdBLVWyPDSY"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1s3DWZ42VCcA6sc0D-sKprQ9Nc0xh0_FO",
  },
  {
    slug: "sendmeanangel",
    title: "Send Me An Angel",
    artists: "Stripes",
    type: "Single",
    date: "05 Jan 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Send_Me_An_Angel_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/3TjhWlVc8NSWZRPQAOlst8"],
      ["apple", "https://music.apple.com/song/send-me-an-angel/1842336673"],
      ["soundcloud", "https://soundcloud.com/quadron/stripes-send-me-an-angel"],
      ["deezer", "https://link.deezer.com/s/32uR3ZHPGTmjPD5JH5Pl2"],
    ],
    download: "https://drive.google.com/uc?export=download&id=12ZzEGDEeGhwvAQxFL6BIGVCgte_cxT8k",
  },
  {
    slug: "sikeflip",
    title: "Sike (blo0my, Stripes Flip)",
    artists: "Custody",
    type: "Unofficial Flip",
    date: "05 Mar 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Sike_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/musicbystripes/sike-flip"],
    ],
  },
  {
    slug: "tellme",
    title: "Tell Me",
    artists: "Stripes, ANAHĀTA",
    type: "Single",
    date: "22 Apr 2026",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/Tell_Me_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/0mOXjJE8LPYydOJirxAEiX"],
      ["apple", "https://music.apple.com/us/album/tell-me/1889088307?i=1889088308"],
      ["ytmusic", "https://www.youtube.com/watch?v=FtFTk8IU8KI"],
      ["soundcloud", "https://soundcloud.com/feelqrecordings/fqr407"],
      ["deezer", "https://www.deezer.com/us/track/3928998681"],
    ],
    download: "https://drive.google.com/uc?export=download&id=13e1B6YlWGms_Rdpb0HH0YdGf4AhK0iFU",
  },
  {
    slug: "theendedit",
    title: "The End (Stripes, NSJ Edit)",
    artists: "Years, Ivar Lisinski",
    type: "Unofficial Edit",
    date: "21 Jan 2024",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/The_End_Artwork.jpg",
    links: [
      ["soundcloud", "https://soundcloud.com/musicbystripes/years-feat-ivar-lisinski-the-end-stripes-nsj-reimagined-1"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1FbEwNrjmXGH_DR98klbIFK1kWjNWbyfS",
  },
  {
    slug: "youandi",
    title: "You & I",
    artists: "Stripes, Jay Hertz",
    type: "Single",
    date: "08 Jan 2025",
    cover: "https://assets.musicbystripes.com/releases%20cover%20arts/You%26I_Artwork.jpg",
    links: [
      ["spotify", "https://open.spotify.com/track/68QEShwnVSRLGFy5a4amA3"],
      ["apple", "https://music.apple.com/us/song/you-i/1784969294"],
      ["ytmusic", "https://music.youtube.com/watch?v=XTp9Fh89qio"],
      ["soundcloud", "https://soundcloud.com/jayhertzmusic/stripes-jay-hertz-you-i"],
      ["deezer", "https://link.deezer.com/s/32uQ8inilIiYZOFBN4wqj"],
    ],
    download: "https://drive.google.com/uc?export=download&id=1RmmwmqjG5z610LTSUmIPHFzNuK0Jl2tS",
  },

];

export const gateFor = (slug: string) => gates.find((g) => g.slug === slug);
