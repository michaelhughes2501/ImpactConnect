import type { IntegrationProvider, IntegrationId } from "./types";

const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";

export const PROVIDERS: Record<IntegrationId, IntegrationProvider> = {
  "google-classroom": {
    id: "google-classroom",
    label: "Google Classroom",
    description: "Post announcements, assignments, and materials to a class.",
    scopes: [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.announcements",
      "https://www.googleapis.com/auth/classroom.coursework.me",
    ],
    authorizationEndpoint: GOOGLE_AUTH,
    tokenEndpoint: GOOGLE_TOKEN,
    iconHref: "https://www.gstatic.com/classroom/logo_square_rounded.svg",
  },
  "google-keep": {
    id: "google-keep",
    label: "Google Keep",
    description: "Save exported notes to your Keep notebook.",
    scopes: ["https://www.googleapis.com/auth/keep"],
    authorizationEndpoint: GOOGLE_AUTH,
    tokenEndpoint: GOOGLE_TOKEN,
    iconHref: "https://ssl.gstatic.com/keep/icon_2020q4v2.png",
  },
  "google-docs": {
    id: "google-docs",
    label: "Google Docs",
    description: "Create a new Google Doc from exported content.",
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive.file",
    ],
    authorizationEndpoint: GOOGLE_AUTH,
    tokenEndpoint: GOOGLE_TOKEN,
    iconHref: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  "google-forms": {
    id: "google-forms",
    label: "Google Forms",
    description: "Generate a Form from exported question content.",
    scopes: [
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/drive.file",
    ],
    authorizationEndpoint: GOOGLE_AUTH,
    tokenEndpoint: GOOGLE_TOKEN,
    iconHref: "https://ssl.gstatic.com/docs/forms/device_home/android_192.png",
  },
};

export const PROVIDER_LIST: IntegrationProvider[] = Object.values(PROVIDERS);

export function getProvider(id: IntegrationId): IntegrationProvider {
  return PROVIDERS[id];
}
