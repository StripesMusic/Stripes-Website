// Where SoundCloud sends the visitor after signing in: the site's function follows Stripes for
// them, then they go back to the download page with ?sc_success=true. If anything on the way
// fails (they cancel, SoundCloud errors, the follow doesn't go through), the download unlocks
// anyway: nobody should lose the download to a sign-in problem.
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SC_API, SC_RETURN_KEY, decodeState } from "../lib/soundcloud";

// only a path on this site is followed back
const sitePath = (p?: string | null) => (p && /^\/(?!\/)/.test(p) ? p : null);
const lastPage = () => {
  try {
    return localStorage.getItem(SC_RETURN_KEY);
  } catch {
    return null;
  }
};

export function SoundCloudCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Following Stripes on SoundCloud…");
  const [backUrl, setBackUrl] = useState("/");

  // a code works once, so the exchange runs once even if the effect runs again
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const state = searchParams.get("state");
    const st = state ? decodeState(state) : null;
    const returnTo = sitePath(st?.r) ?? sitePath(lastPage()) ?? "/";
    const back = `${returnTo}${returnTo.includes("?") ? "&" : "?"}sc_success=true`;
    setBackUrl(back);
    const goBack = (text: string, wait: number) => {
      setMsg(text);
      setTimeout(() => navigate(back, { replace: true }), wait);
    };
    const unlockAnyway = (why: unknown) => {
      console.warn("SoundCloud follow didn't go through:", why);
      goBack("SoundCloud didn't go through, but your download is unlocked anyway. Taking you back…", 1800);
    };

    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) return unlockAnyway(`${error} ${searchParams.get("error_description") ?? ""}`);
    if (!code || !st?.v) return unlockAnyway("missing code or state");

    (async () => {
      try {
        const res = await fetch(`${SC_API}/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, codeVerifier: st.v }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.ok) return unlockAnyway(json);
        goBack("Done! Taking you back…", 600);
      } catch (e) {
        unlockAnyway(e);
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="s-site s-callback" data-scene="ep">
      <div className="s-callback-in s-pad">
        <span className="s-eq on" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="s-big" role="status">
          {msg}
        </p>
        <a href={backUrl} className="s-btn">
          Back to the download
        </a>
      </div>
    </div>
  );
}
