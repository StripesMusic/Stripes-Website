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

export function FangateCatharina() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDownloadGate, setShowDownloadGate] =
    useState(false);
  const [soundcloudFollowed, setSoundcloudFollowed] =
    useState(false);
  const [instagramFollowed, setInstagramFollowed] =
    useState(false);
  const [instagramThomeFollowed, setInstagramThomeFollowed] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canDownload = soundcloudFollowed && instagramFollowed && instagramThomeFollowed;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for success parameter in URL
  useEffect(() => {
    const scSuccess = searchParams.get("sc_success");
    const igSuccess = searchParams.get("ig_success");

    // Restore Instagram follow status from localStorage
    const storageKey = `ig_followed_${window.location.pathname}`;
    const savedIgStatus = localStorage.getItem(storageKey);
    if (savedIgStatus === "true") {
      setInstagramFollowed(true);
    }

    // Restore Thome Instagram follow status from localStorage
    const storageKeyThome = `ig_thome_followed_${window.location.pathname}`;
    const savedIgThomeStatus = localStorage.getItem(storageKeyThome);
    if (savedIgThomeStatus === "true") {
      setInstagramThomeFollowed(true);
    }

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

      const currentPath =
        window.location.pathname + window.location.search;
      // Encode state with verifier and return path
      const stateData = {
        verifier,
        return_to: currentPath,
      };
      const state = btoa(JSON.stringify(stateData));

      // Ask Edge Function for authorize URL (keeps client_id server-side)
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

    window.open(
      "https://www.instagram.com/musicbystripes/",
      "_blank",
      "noopener,noreferrer",
    );
    setInstagramFollowed(true);

    // Save Instagram follow status to localStorage
    const storageKey = `ig_followed_${window.location.pathname}`;
    localStorage.setItem(storageKey, "true");
  };

  const handleInstagramThomeFollow = () => {
    if (instagramThomeFollowed) return;

    window.open(
      "https://www.instagram.com/thomemusic/",
      "_blank",
      "noopener,noreferrer",
    );
    setInstagramThomeFollowed(true);

    // Save Thome Instagram follow status to localStorage
    const storageKeyThome = `ig_thome_followed_${window.location.pathname}`;
    localStorage.setItem(storageKeyThome, "true");
  };

  const streamingLinks = [
    {
      name: "SOUNDCLOUD",
      url: "https://soundcloud.com/thome_music/martin-garrix-catharina-thome",
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
  ];

  const handleDownloadClick = () => {
    if (canDownload) {
      // TODO: Update with actual Google Drive download link for Tell Me
      window.open(
        "https://drive.google.com/uc?export=download&id=1YQ1VZ6fyqxLWK2PJBQM_t_tF_D-wTWvd",
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      setShowDownloadGate(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background Texture - More visible halftone */}
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
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#84cc16]/10 via-transparent to-[#fbbf24]/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Artwork */}
          <div>
            <div className="relative group max-w-lg mx-auto">
              <img
                src="https://i1.sndcdn.com/artworks-KFRvuui9qzKgN8Ve-O0Cqow-t500x500.png"
                alt="Catharina (Thome, Stripes Remix) - Martin Garrix"
                className="w-full rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="mt-8 text-center">
              <h1
                className="text-5xl md:text-6xl font-black mb-3 font-[Barlow]"
                style={{ color: "var(--lime-green)" }}
              >
                CATHARINA (THOME, STRIPES REMIX)
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-2 font-[Barlow]">
                Martin Garrix
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold font-[Barlow]">
                Unofficial Remix • 18 APR 2026
              </p>
            </div>
          </div>

          {/* Right Side - Links */}
          <div className="space-y-4">
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-black mb-3 font-[Barlow]"
                style={{ color: "var(--golden-yellow)" }}
              >
                STREAM / DOWNLOAD
              </h2>
              <p className="text-gray-400 font-[Barlow] text-lg">
                Stream on SoundCloud + download the masters for free (including the extended mix)!
              </p>
            </div>

            {/* Free Download Section - Prominent with lime green border */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-[var(--lime-green)] mb-6">
              <h2 className="text-2xl font-black mb-4 uppercase text-[var(--lime-green)] font-[Barlow]">
                <Download className="inline-block w-6 h-6 mr-2 mb-1" />
                Free Download
              </h2>
              <p className="text-gray-400 mb-4 text-sm font-[Barlow]">
                Follow on SoundCloud and Instagram to unlock
              </p>

              {/* Download Button */}
              <button
                onClick={handleDownloadClick}
                className={`w-full py-5 px-6 rounded-xl font-black text-lg uppercase tracking-wide transition-all font-[Barlow] ${canDownload ? "bg-[var(--lime-green)] text-black hover:scale-105 shadow-lg shadow-[var(--lime-green)]/30" : "bg-white/10 cursor-pointer hover:bg-white/15"} text-[#c0ff00]`}
              >
                <Download className="inline-block w-5 h-5 mr-2 mb-1" />
                {canDownload
                  ? "Download Now"
                  : "Unlock Free Download"}
              </button>

              {/* Status */}
            </div>

            {/* Streaming Links */}
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

      {/* Download Gate Modal */}
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
                Complete all three steps below to unlock your free
                download
              </p>

              {/* Follow Buttons in Modal */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleSoundCloudFollow}
                  disabled={soundcloudFollowed || isProcessing}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    soundcloudFollowed
                      ? "bg-[#FF5500] text-white border-2 border-[#FF5500]"
                      : "bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30"
                  } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
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
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    instagramFollowed
                      ? "bg-[#E1306C] text-white border-2 border-[#E1306C]"
                      : "bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30"
                  }`}
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
                      FOLLOW STRIPES ON INSTAGRAM
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

                <button
                  onClick={handleInstagramThomeFollow}
                  disabled={instagramThomeFollowed}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    instagramThomeFollowed
                      ? "bg-[#E1306C] text-white border-2 border-[#E1306C]"
                      : "bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30"
                  }`}
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
                      FOLLOW THOME ON INSTAGRAM
                    </span>
                  </div>
                  {instagramThomeFollowed ? (
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