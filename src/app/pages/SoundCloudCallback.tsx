import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SC_API, decodeState } from "../lib/soundcloud";

export function SoundCloudCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(
    "Completing SoundCloud authorization...",
  );
  const [backUrl, setBackUrl] = useState("/link/ijustflow");

  // a code works once, so the exchange runs once even if the effect runs again
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const errorDesc = searchParams.get("error_description");

      if (error) {
        setMsg(
          `SoundCloud error: ${error}${errorDesc ? ` - ${errorDesc}` : ""}`,
        );
        return;
      }

      if (!code) {
        setMsg("Missing code in callback URL.");
        return;
      }

      if (!state) {
        setMsg("Missing state parameter. Please go back and try again.");
        return;
      }

      // the verifier and the page to go back to come back in the state (lib/soundcloud.ts); only
      // a path on this site is followed
      const st = decodeState(state);
      if (!st?.v) {
        setMsg("The sign-in didn't come back complete. Go back and press Follow on SoundCloud again.");
        return;
      }
      const codeVerifier = st.v;
      const returnTo = /^\/(?!\/)/.test(st.r) ? st.r : "/";
      setBackUrl(returnTo);

      try {
        const res = await fetch(`${SC_API}/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, codeVerifier }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.ok) {
          setMsg(`Backend failed: ${JSON.stringify(json)}`);
          return;
        }

        setMsg("Success! Redirecting back...");

        setTimeout(() => {
          // Redirect back with success parameter
          const separator = returnTo.includes("?") ? "&" : "?";
          navigate(`${returnTo}${separator}sc_success=true`, { replace: true });
        }, 600);
      } catch (e: any) {
        setMsg(`Error: ${String(e)}`);
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
