import { apiRequest } from "@/lib/queryClient";
import type {
  IntegrationId,
  IntegrationProvider,
  IntegrationTokens,
} from "./types";
import { getProvider } from "./providers";
import { loadTokens, saveTokens, clearTokens, isExpired } from "./tokens";

const CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined) ?? "";

const PENDING_KEY = "impactconnect.integrations.pkce";

interface PendingFlow {
  id: IntegrationId;
  verifier: string;
  state: string;
  returnTo: string;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function randomBase64Url(byteLength: number): Promise<string> {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function redirectUri(): string {
  return `${window.location.origin}/integrations/callback`;
}

function assertClientId(): void {
  if (!CLIENT_ID) {
    throw new Error(
      "VITE_GOOGLE_OAUTH_CLIENT_ID is not set. Add it to client/.env before connecting.",
    );
  }
}

export async function startConnect(id: IntegrationId): Promise<void> {
  assertClientId();
  const provider = getProvider(id);
  const verifier = await randomBase64Url(32);
  const challenge = await sha256(verifier);
  const state = await randomBase64Url(16);

  const pending: PendingFlow = {
    id,
    verifier,
    state,
    returnTo: window.location.pathname + window.location.search,
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));

  const url = new URL(provider.authorizationEndpoint);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", provider.scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");

  window.location.assign(url.toString());
}

export interface CallbackResult {
  provider: IntegrationProvider;
  returnTo: string;
}

export async function completeCallback(
  search: string,
): Promise<CallbackResult> {
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const state = params.get("state");
  const error = params.get("error");
  if (error) throw new Error(`OAuth error: ${error}`);
  if (!code || !state) throw new Error("Missing code or state in callback.");

  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) throw new Error("No pending OAuth flow found in this browser tab.");
  const pending = JSON.parse(raw) as PendingFlow;
  sessionStorage.removeItem(PENDING_KEY);

  if (pending.state !== state) throw new Error("OAuth state mismatch.");

  const res = await apiRequest("POST", "/api/integrations/oauth/exchange", {
    integrationId: pending.id,
    code,
    codeVerifier: pending.verifier,
    redirectUri: redirectUri(),
  });
  const tokens = (await res.json()) as IntegrationTokens;
  saveTokens(pending.id, tokens);

  return { provider: getProvider(pending.id), returnTo: pending.returnTo };
}

export async function getFreshAccessToken(
  id: IntegrationId,
): Promise<string | null> {
  const tokens = loadTokens(id);
  if (!tokens) return null;
  if (!isExpired(tokens)) return tokens.accessToken;
  if (!tokens.refreshToken) return null;

  try {
    const res = await apiRequest("POST", "/api/integrations/oauth/refresh", {
      integrationId: id,
      refreshToken: tokens.refreshToken,
    });
    const refreshed = (await res.json()) as IntegrationTokens;
    const merged: IntegrationTokens = {
      ...refreshed,
      refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
    };
    saveTokens(id, merged);
    return merged.accessToken;
  } catch {
    clearTokens(id);
    return null;
  }
}
