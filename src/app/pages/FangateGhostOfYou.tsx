import { useState, useEffect } from "react";
import { X, Download, Check, ExternalLink } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useSearchParams } from "react-router";

const EDGE_FN = "soundcloud-exchange-follow";

function randomHex(len = 32) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => ("0" + b.toString(16)).slice(-2))
    .join("");
}

function base64UrlEncode(buf: ArrayBuffer) {
  const str = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return str
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function pkceChallengeFromVerifier(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export function FangateGhostOfYou() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDownloadGate, setShowDownloadGate] =
    useState(false);
  const [soundcloudFollowed, setSoundcloudFollowed] =
    useState(false);
  const [instagramFollowed, setInstagramFollowed] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canDownload = soundcloudFollowed && instagramFollowed;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for success parameter in URL
  useEffect(() => {
    const scSuccess = searchParams.get("sc_success");
    const igSuccess = searchParams.get("ig_success");

    if (scSuccess === "true") {
      setSoundcloudFollowed(true);
      setIsProcessing(false);
      setShowDownloadGate(true); // Keep modal open after redirect
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("sc_success");
      setSearchParams(newParams, { replace: true });
    }

    if (igSuccess === "true") {
      setInstagramFollowed(true);
    }
  }, [searchParams, setSearchParams]);

  const handleSoundCloudFollow = async () => {
    if (soundcloudFollowed || isProcessing) return;
    setIsProcessing(true);
    try {
      const verifier = randomHex(48);
      const challenge =
        await pkceChallengeFromVerifier(verifier);
      
      const currentPath = window.location.pathname + window.location.search;
      // Encode state with verifier and return path
      const stateData = {
        verifier,
        return_to: currentPath
      };
      const state = btoa(JSON.stringify(stateData));
      
      const authUrlRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302ccf60/${EDGE_FN}/auth-url?code_challenge=${encodeURIComponent(challenge)}&state=${encodeURIComponent(state)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        },
      );
      const authUrlJson = await authUrlRes
        .json()
        .catch(() => ({}));
      const authUrl = authUrlJson?.authUrl as
        | string
        | undefined;
      if (!authUrlRes.ok || !authUrl) {
        console.error("auth-url failed:", authUrlJson);
        alert(
          "Couldn't start SoundCloud authorization. Check Edge Function secrets and try again.",
        );
        setIsProcessing(false);
        return;
      }
      // Redirect in same window to avoid popup blockers
      sessionStorage.setItem("sc_pkce", JSON.stringify({ verifier, return_to: currentPath }));
      window.location.href = authUrl;
    } catch (error) {
      console.error(
        "Error initiating SoundCloud OAuth:",
        error,
      );
      alert(
        "Failed to start SoundCloud authorization. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  const handleInstagramFollow = () => {
    if (instagramFollowed) return;
    window.open("https://www.instagram.com/musicbystripes/", "_blank", "noopener,noreferrer");
    setInstagramFollowed(true);
    
    // Save Instagram follow status to localStorage
    const storageKey = `ig_followed_${window.location.pathname}`;
    localStorage.setItem(storageKey, "true");
  };

  const streamingLinks = [
    {
      name: "SPOTIFY",
      url: "https://open.spotify.com/track/4Uid33H5WNqVsBpSolaaJd",
      color: "#1DB954",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      name: "APPLE MUSIC",
      url: "https://music.apple.com/song/ghost-of-you-feat-beno-e2d2-stripes-remix-feat-beno/1820198697",
      color: "#FA243C",
      icon: (
        <svg
          viewBox="0 0 361 361"
          width="35"
          height="35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M254.5,55c-0.87,0.08-8.6,1.45-9.53,1.64l-107,21.59l-0.04,0.01c-2.79,0.59-4.98,1.58-6.67,3 c-2.04,1.71-3.17,4.13-3.6,6.95c-0.09,0.6-0.24,1.82-0.24,3.62v133.92c0,3.13-0.25,6.17-2.37,8.76 c-2.12,2.59-4.74,3.37-7.81,3.99c-2.33,0.47-4.66,0.94-6.99,1.41c-8.84,1.78-14.59,2.99-19.8,5.01 c-4.98,1.93-8.71,4.39-11.68,7.51c-5.89,6.17-8.28,14.54-7.46,22.38c0.7,6.69,3.71,13.09,8.88,17.82 c3.49,3.2,7.85,5.63,12.99,6.66c5.33,1.07,11.01,0.7,19.31-0.98c4.42-0.89,8.56-2.28,12.5-4.61 c3.9-2.3,7.24-5.37,9.85-9.11c2.62-3.75,4.31-7.92,5.24-12.35c0.96-4.57,1.19-8.7,1.19-13.26v-116.15 c0-6.22,1.76-7.86,6.78-9.08c0,0,88.94-17.94,93.09-18.75c5.79-1.11,8.52,0.54,8.52,6.61v79.29 c0,3.14-0.03,6.32-2.17,8.92c-2.12,2.59-4.74,3.37-7.81,3.99c-2.33,0.47-4.66,0.94-6.99,1.41 c-8.84,1.78-14.59,2.99-19.8,5.01c-4.98,1.93-8.71,4.39-11.68,7.51 c-5.89,6.17-8.49,14.54-7.67,22.38c0.7,6.69,3.92,13.09,9.09,17.82 c3.49,3.2,7.85,5.56,12.99,6.6c5.33,1.07,11.01,0.69,19.31-0.98 c4.42-0.89,8.56-2.22,12.5-4.55c3.9-2.3,7.24-5.37,9.85-9.11 c2.62-3.75,4.31-7.92,5.24-12.35c0.96-4.57,1-8.7,1-13.26V64.46 C263.54,58.3,260.29,54.5,254.5,55z"
          />
        </svg>
      ),
    },
    {
      name: "YOUTUBE MUSIC",
      url: "https://music.youtube.com/watch?v=XK-9gyXDpVI",
      color: "#FF0000",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
        </svg>
      ),
    },
    {
      name: "SOUNDCLOUD",
      url: "https://soundcloud.com/musicbystripes/butter-andrew-a-beno-ghost-of",
      color: "#FF5500",
      icon: (
        <svg
          width="30"
          height="30"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M14.492,208.896c0.619,0,1.143-0.509,1.232-1.226l3.365-26.671l-3.355-27.278c-0.1-0.717-0.623-1.23-1.242-1.23c-0.635,0-1.176,0.524-1.26,1.23l-2.941,27.278l2.941,26.662C13.316,208.377,13.857,208.896,14.492,208.896z"/>
          <path d="M3.397,198.752c0.608,0,1.101-0.473,1.19-1.18l2.608-16.574l-2.608-16.884c-0.09-0.685-0.582-1.18-1.19-1.18c-0.635,0-1.127,0.495-1.217,1.19L0,180.999l2.18,16.569C2.27,198.269,2.762,198.752,3.397,198.752z"/>
          <path d="M27.762,148.644c-0.08-0.867-0.715-1.5-1.503-1.5c-0.782,0-1.418,0.633-1.491,1.5l-2.811,32.355l2.811,31.174c0.073,0.862,0.709,1.487,1.491,1.487c0.788,0,1.423-0.625,1.503-1.487l3.18-31.174L27.762,148.644z"/>
          <path d="M38.152,214.916c0.922,0,1.668-0.759,1.758-1.751l3.005-32.156l-3.005-33.258c-0.09-0.999-0.836-1.749-1.758-1.749c-0.935,0-1.692,0.751-1.756,1.754l-2.656,33.253l2.656,32.156C36.46,214.158,37.217,214.916,38.152,214.916z"/>
          <path d="M50.127,215.438c1.074,0,1.936-0.86,2.025-2.011l-0.01,0.008l2.83-32.426l-2.83-30.857c-0.08-1.132-0.941-2.005-2.016-2.005c-1.09,0-1.947,0.873-2.012,2.014l-2.502,30.849l2.502,32.418C48.18,214.578,49.037,215.438,50.127,215.438z"/>
          <path d="M67.132,181.017l-2.655-50.172c-0.074-1.272-1.065-2.286-2.281-2.286c-1.207,0-2.195,1.013-2.269,2.286l-2.35,50.172l2.35,32.418c0.074,1.278,1.063,2.278,2.269,2.278c1.217,0,2.207-1,2.281-2.278v0.009L67.132,181.017z"/>
          <path d="M74.386,215.766c1.339,0,2.45-1.111,2.513-2.529v0.021l2.482-32.233l-2.482-61.656c-0.063-1.418-1.174-2.529-2.513-2.529c-1.37,0-2.471,1.111-2.545,2.529l-2.185,61.656l2.195,32.222C71.915,214.655,73.016,215.766,74.386,215.766z"/>
          <path d="M86.645,111.435c-1.508,0-2.725,1.238-2.787,2.799l-2.033,66.801l2.033,31.884c0.063,1.553,1.279,2.783,2.787,2.783c1.504,0,2.73-1.22,2.783-2.788v0.016l2.307-31.895l-2.307-66.801C89.375,112.663,88.148,111.435,86.645,111.435z"/>
          <path d="M99.01,215.766c1.656,0,2.975-1.336,3.037-3.056v0.019l2.133-31.693l-2.133-69.045c-0.063-1.714-1.381-3.056-3.037-3.056c-1.666,0-3.005,1.342-3.031,3.056l-1.916,69.045l1.916,31.693C96.005,214.43,97.344,215.766,99.01,215.766z"/>
          <path d="M111.477,215.734c1.787,0,3.237-1.463,3.291-3.318v0.029l1.963-31.404l-1.963-67.289c-0.054-1.854-1.504-3.311-3.291-3.311c-1.8,0-3.25,1.456-3.303,3.311l-1.725,67.289l1.736,31.389C108.227,214.271,109.677,215.734,111.477,215.734z"/>
          <path d="M129.359,181.041l-1.777-64.836c-0.043-2-1.609-3.571-3.551-3.571c-1.947,0-3.514,1.571-3.555,3.584l-1.594,64.823l1.594,31.198c0.041,1.984,1.607,3.556,3.555,3.556c1.941,0,3.508-1.572,3.551-3.585v0.029L129.359,181.041z"/>
          <path d="M136.682,215.853c2.064,0,3.773-1.717,3.805-3.828v0.017l1.613-30.984l-1.613-77.153c-0.031-2.119-1.74-3.833-3.805-3.833c-2.063,0-3.767,1.722-3.809,3.844l-1.434,77.111l1.434,31.016C132.915,214.136,134.619,215.853,136.682,215.853z"/>
          <path d="M149.291,92.814c-2.229,0-4.037,1.849-4.074,4.103l-1.667,84.151l1.677,30.526c0.027,2.225,1.836,4.068,4.064,4.068c2.195,0,4.037-1.844,4.047-4.105v0.037l1.82-30.526l-1.82-84.151C153.328,94.655,151.486,92.814,149.291,92.814z"/>
          <path d="M160.82,215.882c0.09,0.008,101.623,0.056,102.275,0.056c20.385,0,36.904-16.722,36.904-37.357c0-20.624-16.52-37.349-36.904-37.349c-5.059,0-9.879,1.034-14.275,2.907c-2.922-33.671-30.815-60.077-64.842-60.077c-8.318,0-16.429,1.662-23.593,4.469c-2.788,1.09-3.534,2.214-3.556,4.392v118.539C156.861,213.752,158.607,215.655,160.82,215.882z"/>
        </svg>
      ),
    },
    {
      name: "DEEZER",
      url: "https://link.deezer.com/s/32uPXL6NBNGTCTYXkEkrT",
      color: "#a53dff",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#000"
            d="M0.693 10.024C1.074 10.024 1.386 8.768 1.386 7.217C1.386 5.666 1.074 4.41 0.693 4.41C0.312 4.41 0 5.666 0 7.217C0 8.768 0.312 10.024 0.693 10.024ZM21.038 1.56C20.674 1.56 20.354 2.365 20.128 3.656C19.765 1.446 19.184 0 18.526 0C17.746 0 17.062 2.036 16.742 5C16.43 2.842 15.954 1.464 15.417 1.464C14.672 1.464 14.031 4.168 13.797 7.936C13.355 6.004 12.714 4.791 12.004 4.791C11.294 4.791 10.654 6.004 10.211 7.936C9.969 4.176 9.337 1.473 8.583 1.473C8.046 1.473 7.57 2.851 7.258 5.008C6.938 2.036 6.262 0 5.474 0C4.816 0 4.227 1.447 3.872 3.665C3.655 2.374 3.326 1.56 2.962 1.56C2.287 1.56 1.741 4.367 1.741 7.832C1.741 11.297 2.287 14.105 2.962 14.105C3.239 14.105 3.499 13.629 3.698 12.832C4.018 15.76 4.694 17.77 5.474 17.77C6.08 17.77 6.617 16.566 6.981 14.66C7.232 18.282 7.856 20.855 8.583 20.855C9.043 20.855 9.458 19.832 9.77 18.178C10.142 21.6 11 24 12.004 24C13.008 24 13.867 21.6 14.239 18.178C14.551 19.832 14.966 20.855 15.425 20.855C16.153 20.855 16.777 18.282 17.028 14.66C17.392 16.566 17.928 17.77 18.535 17.77C19.315 17.77 19.99 15.76 20.31 12.832C20.518 13.629 20.77 14.105 21.047 14.105C21.722 14.105 22.267 11.298 22.267 7.832C22.259 4.375 21.715 1.56 21.038 1.56ZM23.307 10.024C23.688 10.024 24 8.768 24 7.217C24 5.666 23.688 4.41 23.307 4.41C22.926 4.41 22.614 5.666 22.614 7.217C22.614 8.768 22.926 10.024 23.307 10.024Z"
          />
        </svg>
      ),
    },
  ];

  const handleDownloadClick = () => {
    if (canDownload) {
      window.open(
        "https://drive.google.com/uc?export=download&id=1lCHTBdkMxEoclPGU-q7Ic4_2lP2okppP",
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      setShowDownloadGate(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #84cc16 2px, transparent 2px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
            backgroundSize: "12px 12px",
            backgroundPosition: "6px 6px",
          }}
        ></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#84cc16]/10 via-transparent to-[#fbbf24]/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative group max-w-lg mx-auto">
              <img
                src="https://i1.sndcdn.com/artworks-dGIcZTcUqK5YddF4-gAHvuA-t1080x1080.jpg"
                alt="Ghost Of You Remix - Stripes, E2D2"
                className="w-full rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="mt-8 text-center">
              <h1
                className="text-5xl md:text-6xl font-black mb-3 font-[Barlow]"
                style={{ color: "var(--lime-green)" }}
              >GHOST OF YOU (E2D2, STRIPES REMIX)</h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-2 font-[Barlow]">BUTTER, Andrew A, beno</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold font-[Barlow]">
                Official Remix • 11 Jul 2025
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-black mb-3 font-[Barlow]"
                style={{ color: "var(--golden-yellow)" }}
              >
                STREAM / DOWNLOAD
              </h2>
              <p className="text-gray-400 font-[Barlow] text-lg">
                Stream on your favorite platform + download the masters for free (including the extended mix)!
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-[var(--lime-green)] mb-6">
              <h2 className="text-2xl font-black mb-4 uppercase text-[var(--lime-green)] font-[Barlow]">
                <Download className="inline-block w-6 h-6 mr-2 mb-1" />
                Free Download
              </h2>
              <p className="text-gray-400 mb-4 text-sm font-[Barlow]">
                Follow on SoundCloud and Instagram to unlock
              </p>
              <button
                onClick={handleDownloadClick}
                className={`w-full py-5 px-6 rounded-xl font-black text-lg uppercase tracking-wide transition-all font-[Barlow] ${canDownload ? "bg-[var(--lime-green)] text-black hover:scale-105 shadow-lg shadow-[var(--lime-green)]/30" : "bg-white/10 cursor-pointer hover:bg-white/15"} text-[#c0ff00]`}
              >
                <Download className="inline-block w-5 h-5 mr-2 mb-1" />
                {canDownload
                  ? "Download Now"
                  : "Unlock Free Download"}
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4 uppercase font-[Barlow]">
                Stream Now
              </h2>
              <div className="grid gap-3">
                {streamingLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: link.color }}
                      >
                        {link.icon}
                      </div>
                      <span className="font-semibold text-lg font-[Barlow]">
                        {link.name}
                      </span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDownloadGate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-8 max-w-md w-full border-2 border-[#84cc16] relative shadow-2xl shadow-[#84cc16]/20">
            <button
              onClick={() => setShowDownloadGate(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#84cc16] rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase font-[Barlow]">
                Unlock Download
              </h3>
              <p className="text-gray-300 mb-8 font-[Barlow] text-lg">
                Complete both steps below to unlock your free
                download
              </p>
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleSoundCloudFollow}
                  disabled={soundcloudFollowed || isProcessing}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${soundcloudFollowed ? "bg-[#FF5500] text-white border-2 border-[#FF5500]" : "bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30"} ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#FF5500] flex items-center justify-center">
                      <svg
                        viewBox="0 0 300 300"
                        fill="currentColor"
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.492,208.896c0.619,0,1.143-0.509,1.232-1.226l3.365-26.671l-3.355-27.278c-0.1-0.717-0.623-1.23-1.242-1.23c-0.635,0-1.176,0.524-1.26,1.23l-2.941,27.278l2.941,26.662C13.316,208.377,13.857,208.896,14.492,208.896z"/>
                        <path d="M3.397,198.752c0.608,0,1.101-0.473,1.19-1.18l2.608-16.574l-2.608-16.884c-0.09-0.685-0.582-1.18-1.19-1.18c-0.635,0-1.127,0.495-1.217,1.19L0,180.999l2.18,16.569C2.27,198.269,2.762,198.752,3.397,198.752z"/>
                        <path d="M27.762,148.644c-0.08-0.867-0.715-1.5-1.503-1.5c-0.782,0-1.418,0.633-1.491,1.5l-2.811,32.355l2.811,31.174c0.073,0.862,0.709,1.487,1.491,1.487c0.788,0,1.423-0.625,1.503-1.487l3.18-31.174L27.762,148.644z"/>
                        <path d="M38.152,214.916c0.922,0,1.668-0.759,1.758-1.751l3.005-32.156l-3.005-33.258c-0.09-0.999-0.836-1.749-1.758-1.749c-0.935,0-1.692,0.751-1.756,1.754l-2.656,33.253l2.656,32.156C36.46,214.158,37.217,214.916,38.152,214.916z"/>
                        <path d="M50.127,215.438c1.074,0,1.936-0.86,2.025-2.011l-0.01,0.008l2.83-32.426l-2.83-30.857c-0.08-1.132-0.941-2.005-2.016-2.005c-1.09,0-1.947,0.873-2.012,2.014l-2.502,30.849l2.502,32.418C48.18,214.578,49.037,215.438,50.127,215.438z"/>
                        <path d="M67.132,181.017l-2.655-50.172c-0.074-1.272-1.065-2.286-2.281-2.286c-1.207,0-2.195,1.013-2.269,2.286l-2.35,50.172l2.35,32.418c0.074,1.278,1.063,2.278,2.269,2.278c1.217,0,2.207-1,2.281-2.278v0.009L67.132,181.017z"/>
                        <path d="M74.386,215.766c1.339,0,2.45-1.111,2.513-2.529v0.021l2.482-32.233l-2.482-61.656c-0.063-1.418-1.174-2.529-2.513-2.529c-1.37,0-2.471,1.111-2.545,2.529l-2.185,61.656l2.195,32.222C71.915,214.655,73.016,215.766,74.386,215.766z"/>
                        <path d="M86.645,111.435c-1.508,0-2.725,1.238-2.787,2.799l-2.033,66.801l2.033,31.884c0.063,1.553,1.279,2.783,2.787,2.783c1.504,0,2.73-1.22,2.783-2.788v0.016l2.307-31.895l-2.307-66.801C89.375,112.663,88.148,111.435,86.645,111.435z"/>
                        <path d="M99.01,215.766c1.656,0,2.975-1.336,3.037-3.056v0.019l2.133-31.693l-2.133-69.045c-0.063-1.714-1.381-3.056-3.037-3.056c-1.666,0-3.005,1.342-3.031,3.056l-1.916,69.045l1.916,31.693C96.005,214.43,97.344,215.766,99.01,215.766z"/>
                        <path d="M111.477,215.734c1.787,0,3.237-1.463,3.291-3.318v0.029l1.963-31.404l-1.963-67.289c-0.054-1.854-1.504-3.311-3.291-3.311c-1.8,0-3.25,1.456-3.303,3.311l-1.725,67.289l1.736,31.389C108.227,214.271,109.677,215.734,111.477,215.734z"/>
                        <path d="M129.359,181.041l-1.777-64.836c-0.043-2-1.609-3.571-3.551-3.571c-1.947,0-3.514,1.571-3.555,3.584l-1.594,64.823l1.594,31.198c0.041,1.984,1.607,3.556,3.555,3.556c1.941,0,3.508-1.572,3.551-3.585v0.029L129.359,181.041z"/>
                        <path d="M136.682,215.853c2.064,0,3.773-1.717,3.805-3.828v0.017l1.613-30.984l-1.613-77.153c-0.031-2.119-1.74-3.833-3.805-3.833c-2.063,0-3.767,1.722-3.809,3.844l-1.434,77.111l1.434,31.016C132.915,214.136,134.619,215.853,136.682,215.853z"/>
                        <path d="M149.291,92.814c-2.229,0-4.037,1.849-4.074,4.103l-1.667,84.151l1.677,30.526c0.027,2.225,1.836,4.068,4.064,4.068c2.195,0,4.037-1.844,4.047-4.105v0.037l1.82-30.526l-1.82-84.151C153.328,94.655,151.486,92.814,149.291,92.814z"/>
                        <path d="M160.82,215.882c0.09,0.008,101.623,0.056,102.275,0.056c20.385,0,36.904-16.722,36.904-37.357c0-20.624-16.52-37.349-36.904-37.349c-5.059,0-9.879,1.034-14.275,2.907c-2.922-33.671-30.815-60.077-64.842-60.077c-8.318,0-16.429,1.662-23.593,4.469c-2.788,1.09-3.534,2.214-3.556,4.392v118.539C156.861,213.752,158.607,215.655,160.82,215.882z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-lg font-[Barlow]">
                      FOLLOW ON SOUNDCLOUD
                    </span>
                  </div>
                  {soundcloudFollowed ? (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#FF5500]" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 font-[Barlow]">
                      {isProcessing
                        ? "Processing..."
                        : "Required"}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleInstagramFollow}
                  disabled={instagramFollowed}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${instagramFollowed ? "bg-[#E1306C] text-white border-2 border-[#E1306C]" : "bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#E1306C] flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg font-[Barlow]">
                      FOLLOW ON INSTAGRAM
                    </span>
                  </div>
                  {instagramFollowed ? (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#E1306C]" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 font-[Barlow]">
                      Required
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}