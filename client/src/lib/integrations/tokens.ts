import type { IntegrationId, IntegrationTokens } from "./types";

const STORAGE_KEY = "impactconnect.integrations.v1";

type TokenStore = Partial<Record<IntegrationId, IntegrationTokens>>;

function read(): TokenStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TokenStore) : {};
  } catch {
    return {};
  }
}

function write(store: TokenStore): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadTokens(id: IntegrationId): IntegrationTokens | undefined {
  return read()[id];
}

export function saveTokens(id: IntegrationId, tokens: IntegrationTokens): void {
  const store = read();
  store[id] = tokens;
  write(store);
}

export function clearTokens(id: IntegrationId): void {
  const store = read();
  delete store[id];
  write(store);
}

export function isExpired(tokens: IntegrationTokens, skewMs = 60_000): boolean {
  return Date.now() + skewMs >= tokens.expiresAt;
}
