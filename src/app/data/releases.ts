export type Collaborator = { name: string; image: string; link: string };

export type Release = {
  title: string;
  type: string;
  date: string;
  image: string;
  link: string;
  collaborators: Collaborator[];
  // the clip's file name in previews/ when it isn't the link slug; false while there's no clip
  preview?: string | false;
};

// Newest first. The homepage and the Music page both read from here.
export const releases: Release[] = [
  {
    title: "Forget You",
    type: "Single",
    date: "09 Oct 2026",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Forget_You_Artwork.jpg",
    link: "/link/forgetyou",
    collaborators: [
      {
        name: "7sunami",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
        link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
      },
      {
        name: "Thome",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Thome.jpg",
        link: "https://open.spotify.com/artist/46zB3pu5W8PMqhW6Nchb7i",
      },
    ],
  },
  {
    title: "Tell Me",
    type: "Single",
    date: "22 Apr 2026",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Tell_Me_Artwork.jpg",
    link: "/link/tellme",
    collaborators: [
      {
        name: "ANAHĀTA",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/ANAHATA.jpg",
        link: "https://open.spotify.com/artist/53JGhjcwoSdXy14kOAE3vu",
      },
    ],
  },
  {
    title: "Catharina Remix",
    type: "Unofficial Remix",
    date: "18 Apr 2026",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Catharina_Artwork.jpg",
    link: "/link/catharinaremix",
    collaborators: [
      {
        name: "Thome",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Thome.jpg",
        link: "https://open.spotify.com/artist/46zB3pu5W8PMqhW6Nchb7i",
      },
    ],
  },
  {
    title: "I Just Flow",
    type: "Single",
    date: "23 Jan 2026",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/I_Just_Flow_Artwork.jpg",
    link: "/link/ijustflow",
    collaborators: [
      {
        name: "Hilefex",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Hilefex.jpg",
        link: "https://open.spotify.com/artist/2MOJXg84M4LKx0ovvHvMmf",
      },
    ],
  },
  {
    title: "Back To Me Edit",
    type: "Unofficial Edit",
    date: "09 Jan 2026",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Back_To_Me_Artwork.jpg",
    link: "/link/backtome",
    preview: "backtomecalvoremixedit",
    collaborators: [
      {
        name: "CHILLBIRD",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/CHILLBIRD.jpg",
        link: "https://open.spotify.com/artist/7g0aPxm6CS5k6jCAZSFmbW",
      },
    ],
  },
  {
    title: "Lost In You Remix",
    type: "Unofficial Remix",
    date: "28 Nov 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Lost_In_You_Artwork.jpg",
    link: "/link/lostinyou",
    collaborators: [
      {
        name: "Toxic Wraith",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/ToxicWraith.jpg",
        link: "https://open.spotify.com/artist/7IzlaNBh2EWdsR6xIOp9Bb",
      },
    ],
  },
  {
    title: "Run With You",
    type: "Single",
    date: "14 Nov 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Run_With_You_Artwork.jpg",
    link: "/link/runwithyou",
    collaborators: [
      {
        name: "Alvin Mo",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/AlvinMo.jpg",
        link: "https://open.spotify.com/artist/25CAEDl6yMGwwl31Mu3N2H",
      },
      {
        name: "paulø",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/paulo.jpg",
        link: "https://open.spotify.com/artist/2Wzd6JY9NxUJcuJFFZQbSU",
      },
    ],
  },
  {
    title: "Don't Kill My Vibe Remix",
    type: "Official Remix",
    date: "03 Oct 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Dont_Kill_My_Vibe_Remix_Artwork.jpg",
    link: "/link/dontkillmyviberemix",
    collaborators: [
      {
        name: "7sunami",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
        link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
      },
    ],
  },
  {
    title: "Ghost Of You Remix",
    type: "Official Remix",
    date: "11 Jul 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Ghost_Of_You_Artwork.jpg",
    link: "/link/ghostofyouremix",
    collaborators: [
      {
        name: "E2D2",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/E2D2.jpg",
        link: "https://open.spotify.com/artist/4pYWodVn2BToKzPRDXPxPX",
      },
    ],
  },
  {
    title: "Never Looking Back",
    type: "Single",
    date: "20 Jun 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Never_Looking_Back_Artwork.jpg",
    link: "/link/neverlookingback",
    collaborators: [],
  },
  {
    title: "Clarity Remix",
    type: "Unofficial Remix",
    date: "31 May 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Clarity_Artwork.jpg",
    link: "/link/clarityremix",
    preview: "clarityedit",
    collaborators: [
      {
        name: "Alvin Mo",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/AlvinMo.jpg",
        link: "https://open.spotify.com/artist/25CAEDl6yMGwwl31Mu3N2H",
      },
    ],
  },
  {
    title: "Love Me Too",
    type: "Single",
    date: "30 May 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Love_Me_Too_Artwork.jpg",
    link: "/link/lovemetoo",
    collaborators: [
      {
        name: "Firee",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Firee.jpg",
        link: "https://open.spotify.com/artist/0Wbg8xMFsAWu5lwCV5QYXD",
      },
    ],
  },
  {
    title: "Infinity Remix",
    type: "Unofficial Remix",
    date: "23 May 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Infinity_Remix_Artwork.jpg",
    link: "/link/infinityremix",
    collaborators: [],
  },
  {
    title: "You & I",
    type: "Single",
    date: "08 Jan 2025",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/You%26I_Artwork.jpg",
    link: "/link/youandi",
    preview: false,
    collaborators: [
      {
        name: "Jay Hertz",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/JayHertz.jpg",
        link: "https://open.spotify.com/artist/5Z1BF0oYInmQqzC892tP1i",
      },
    ],
  },
  {
    title: "More Than Yesterday Remix",
    type: "Unofficial Remix",
    date: "12 Oct 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/More_Than_Yesterday_Remix_Artwork.jpg",
    link: "/link/morethanyesterdayremix",
    collaborators: [
      {
        name: "Jay Hertz",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/JayHertz.jpg",
        link: "https://open.spotify.com/artist/5Z1BF0oYInmQqzC892tP1i",
      },
    ],
  },
  {
    title: "Always",
    type: "Single",
    date: "05 Jul 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Always_Artwork.jpg",
    link: "/link/always",
    collaborators: [
      {
        name: "paulø",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/paulo.jpg",
        link: "https://open.spotify.com/artist/2Wzd6JY9NxUJcuJFFZQbSU",
      },
      {
        name: "blo0my",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/blo0my.jpg",
        link: "https://open.spotify.com/artist/1j6cfWLS5Tks2ZFJzLugvq",
      },
    ],
  },
  {
    title: "Back In Time",
    type: "Single",
    date: "07 Jun 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Back_In_Time_Artwork.jpg",
    link: "/link/backintime",
    collaborators: [
      {
        name: "NSJ",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
        link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
      },
      {
        name: "Aprox",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Aprox.jpg",
        link: "https://open.spotify.com/artist/4I7z1x8bnDwjy9hDpvpUjv",
      },
      {
        name: "Lonely Heaven",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/LonelyHeaven.jpg",
        link: "https://open.spotify.com/artist/6S1RSNqYr0l7sfvFDnep8l",
      },
    ],
  },
  {
    title: "Lucky",
    type: "Single",
    date: "17 May 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Lucky_Artwork.jpg",
    link: "/link/lucky",
    collaborators: [
      {
        name: "7sunami",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/7sunami.jpg",
        link: "https://open.spotify.com/artist/5FINL72stprdOm9iCN7E5M",
      },
      {
        name: "Cl04k",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/Cl04k.jpg",
        link: "https://open.spotify.com/artist/3gHUsouQKQ3JoH1N7kNjQu",
      },
    ],
  },
  {
    title: "A Sky Full Of Stars Remix",
    type: "Unofficial Remix",
    date: "23 Mar 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/A_Sky_Full_Of_Stars_Remix_Artwork.jpg",
    link: "/link/askyfullofstarsremix",
    collaborators: [
      {
        name: "NSJ",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
        link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
      },
      {
        name: "Lonely Heaven",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/LonelyHeaven.jpg",
        link: "https://open.spotify.com/artist/6S1RSNqYr0l7sfvFDnep8l",
      },
    ],
  },
  {
    title: "Sike Flip",
    type: "Unofficial Flip",
    date: "05 Mar 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Sike_Artwork.jpg",
    link: "/link/sikeflip",
    preview: false,
    collaborators: [
      {
        name: "blo0my",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/blo0my.jpg",
        link: "https://open.spotify.com/artist/1j6cfWLS5Tks2ZFJzLugvq",
      },
    ],
  },
  {
    title: "The End Edit",
    type: "Unofficial Edit",
    date: "21 Jan 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/The_End_Artwork.jpg",
    link: "/link/theendedit",
    collaborators: [
      {
        name: "NSJ",
        image:
          "https://assets.musicbystripes.com/releases%20collaborators/NANDAN.jpg",
        link: "https://open.spotify.com/artist/33ePCWx7UDL1puxyUnrAxJ",
      },
    ],
  },
  {
    title: "Send Me An Angel",
    type: "Single",
    date: "05 Jan 2024",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Send_Me_An_Angel_Artwork.jpg",
    link: "/link/sendmeanangel",
    collaborators: [],
  },
  {
    title: "Boom",
    type: "Single",
    date: "04 Aug 2023",
    image:
      "https://assets.musicbystripes.com/releases%20cover%20arts/Boom_Artwork.jpg",
    link: "/link/boom",
    collaborators: [],
  },
];

// Preview clips live on R2 at previews/<name>.mp3. The name is the fangate slug
// ("/link/forgetyou" -> "forgetyou") unless the release says otherwise.
export const clipUrl = (name: string) => `https://assets.musicbystripes.com/previews/${name}.mp3`;
export const previewUrl = (r: Release) =>
  r.preview === false ? null : clipUrl(r.preview ?? r.link.split("/").pop()!);

// The newest release, featured at the top of the homepage.
export const ep = {
  title: "Out Of Control",
  type: "EP",
  date: "16 Oct 2026",
  image: "https://assets.musicbystripes.com/releases%20cover%20arts/Out_Of_Control_Artwork.jpg",
  link: "/link/outofcontrolep",
  tracks: [
    { n: "01", title: "Out Of Control", artists: "Stripes, 7sunami", preview: "outofcontrol" },
    { n: "02", title: "Forget You", artists: "7sunami, Thome, Stripes", preview: "forgetyou" },
    { n: "03", title: "Under The Moonlight", artists: "Stripes, 7sunami", preview: "underthemoonlight" },
    { n: "04", title: "Won't Give Up", artists: "Stripes, 7sunami", preview: "wontgiveup" },
  ],
};
