export type IntegrationId =
  | "google-classroom"
  | "google-keep"
  | "google-docs"
  | "google-forms";

export interface IntegrationProvider {
  id: IntegrationId;
  label: string;
  description: string;
  scopes: string[];
  authorizationEndpoint: string;
  tokenEndpoint: string;
  iconHref: string;
}

export interface IntegrationTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scope: string;
}

export interface IntegrationStatus {
  provider: IntegrationProvider;
  connected: boolean;
  tokens?: IntegrationTokens;
}
