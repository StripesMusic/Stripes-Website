import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const EDGE_FUNCTION_NAME = "soundcloud-exchange-follow";

export function SoundCloudCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(
    "Completing SoundCloud authorization...",
  );
  const [backUrl, setBackUrl] = useState("/link/ijustflow");

  useEffect(() => {
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

      let codeVerifier = "";
      let returnTo = "/link/ijustflow";

      // Prefer sessionStorage (written just before the OAuth redirect) — avoids all URL encoding issues
      const storedPkce = sessionStorage.getItem("sc_pkce");
      if (storedPkce) {
        try {
          const pkceData = JSON.parse(storedPkce);
          codeVerifier = pkceData.verifier;
          returnTo = pkceData.return_to || "/link/ijustflow";
          sessionStorage.removeItem("sc_pkce");
          setBackUrl(returnTo);
        } catch {
          setMsg("Session data corrupted. Please go back and try again.");
          return;
        }
      } else {
        // Fallback: decode state parameter (multiple encoding strategies)
        let parsed = false;
        const attempts = [
          () => JSON.parse(atob(state.replace(/ /g, "+"))),
          () => JSON.parse(atob(decodeURIComponent(state))),
          () => JSON.parse(atob(state)),
        ];
        for (const attempt of attempts) {
          try {
            const stateData = attempt();
            codeVerifier = stateData.verifier;
            returnTo = stateData.return_to || "/link/ijustflow";
            setBackUrl(returnTo);
            parsed = true;
            break;
          } catch { /* try next */ }
        }
        if (!parsed) {
          setMsg("Invalid state parameter. Please go back and try again.");
          return;
        }
      }

      if (!codeVerifier) {
        setMsg("Missing PKCE verifier in URL. Please go back and try again.");
        return;
      }

      try {
        const fnUrl = `https://${projectId}.supabase.co/functions/v1/make-server-302ccf60/soundcloud-exchange-follow/exchange`;
        const res = await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--lime-green)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-[Barlow]">{msg}</p>

        <div className="mt-4">
          <a
            href={backUrl}
            className="inline-block px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors font-bold"
          >
            Back to download
          </a>
        </div>
      </div>
    </div>
  );
}