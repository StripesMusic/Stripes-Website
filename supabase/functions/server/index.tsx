import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-302ccf60/health", (c) => {
  return c.json({ status: "ok" });
});

// Check if user has completed Instagram follow
app.get("/make-server-302ccf60/instagram/check/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");
  const data = await kv.get(`instagram_follow_${sessionId}`);
  return c.json({ completed: !!data });
});

// SoundCloud OAuth with PKCE - Get auth URL
app.get("/make-server-302ccf60/soundcloud-exchange-follow/auth-url", (c) => {
  const clientId = Deno.env.get("SOUNDCLOUD_CLIENT_ID");
  const redirectUri = Deno.env.get("SOUNDCLOUD_REDIRECT_URI");
  const codeChallenge = c.req.query("code_challenge");
  const state = c.req.query("state");
  
  if (!codeChallenge || !state) {
    return c.json({ error: "Missing code_challenge or state" }, 400);
  }
  
  // Build SoundCloud OAuth URL with PKCE (using new secure endpoint)
  const authUrl = `https://secure.soundcloud.com/connect?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri!)}&response_type=code&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;

  console.log("Generated auth URL with redirect_uri:", redirectUri);

  return c.json({ authUrl });
});

// SoundCloud OAuth with PKCE - Exchange code and follow
app.post("/make-server-302ccf60/soundcloud-exchange-follow/exchange", async (c) => {
  try {
    const { code, codeVerifier } = await c.req.json();
    const clientId = Deno.env.get("SOUNDCLOUD_CLIENT_ID");
    const clientSecret = Deno.env.get("SOUNDCLOUD_CLIENT_SECRET");
    const redirectUri = Deno.env.get("SOUNDCLOUD_REDIRECT_URI");
    const followUserId = Deno.env.get("SOUNDCLOUD_FOLLOW_USER_ID");

    if (!code || !codeVerifier) {
      return c.json({ ok: false, step: "validation", status: 400, details: "Missing code or codeVerifier" }, 400);
    }

    // Exchange authorization code for access token (using secure endpoint)
    const tokenResponse = await fetch("https://secure.soundcloud.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri!,
        code: code,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return c.json({ ok: false, step: "token", status: tokenResponse.status, details: errorText }, 400);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Log the follow attempt
    console.log(`Attempting to follow user ID: ${followUserId}`);

    // Follow the specified user - try with Bearer token format
    const followResponse = await fetch(
      `https://api.soundcloud.com/me/followings/${followUserId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Follow response status: ${followResponse.status}`);

    // If follow fails, log but still return success since OAuth was successful
    // SoundCloud's public API may have restrictions on programmatic follows
    if (!followResponse.ok) {
      const errorText = await followResponse.text();
      console.error("Follow request failed (but allowing download anyway):", errorText);
      // Return success anyway - the OAuth authorization itself is enough proof
      return c.json({ ok: true, message: "Authorized (follow may require manual action)", followFailed: true });
    }

    return c.json({ ok: true, message: "Successfully followed user" });
  } catch (error) {
    console.error("SoundCloud exchange error:", error);
    return c.json({ ok: false, step: "server", status: 500, details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);