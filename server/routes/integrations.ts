import type { Express } from "express";

interface ExchangeBody {
  integrationId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

interface RefreshBody {
  integrationId: string;
  refreshToken: string;
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

function readGoogleCreds(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET must be set in server env.",
    );
  }
  return { clientId, clientSecret };
}

function shapeTokens(data: GoogleTokenResponse) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  };
}

export function registerIntegrationsRoutes(app: Express): void {
  app.post("/api/integrations/oauth/exchange", async (req, res) => {
    try {
      const { code, codeVerifier, redirectUri } = req.body as ExchangeBody;
      if (!code || !codeVerifier || !redirectUri) {
        return res.status(400).json({ message: "Missing required fields." });
      }
      const { clientId, clientSecret } = readGoogleCreds();
      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      });
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = (await response.json()) as GoogleTokenResponse & {
        error?: string;
        error_description?: string;
      };
      if (!response.ok) {
        return res.status(response.status).json({
          message: data.error_description ?? data.error ?? "Token exchange failed.",
        });
      }
      return res.json(shapeTokens(data));
    } catch (err) {
      return res
        .status(500)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  });

  app.post("/api/integrations/oauth/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body as RefreshBody;
      if (!refreshToken) {
        return res.status(400).json({ message: "Missing refreshToken." });
      }
      const { clientId, clientSecret } = readGoogleCreds();
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      });
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = (await response.json()) as GoogleTokenResponse & {
        error?: string;
        error_description?: string;
      };
      if (!response.ok) {
        return res.status(response.status).json({
          message: data.error_description ?? data.error ?? "Token refresh failed.",
        });
      }
      return res.json(shapeTokens(data));
    } catch (err) {
      return res
        .status(500)
        .json({ message: err instanceof Error ? err.message : String(err) });
    }
  });
}
