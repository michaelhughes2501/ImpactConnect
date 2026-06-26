import { PROVIDER_LIST } from "@/lib/integrations/providers";
import { loadTokens } from "@/lib/integrations/tokens";
import { getFreshAccessToken } from "@/lib/integrations/oauth";
import type { IntegrationId } from "@/lib/integrations/types";
import type { ExportDestination, ExportPayload, ExportResult } from "./types";

const SENDERS: Record<IntegrationId, (token: string, payload: ExportPayload) => Promise<ExportResult>> = {
  "google-classroom": async (token, payload) => {
    const coursesRes = await fetch(
      "https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=1",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!coursesRes.ok) return { ok: false, message: await coursesRes.text() };
    const courses = await coursesRes.json();
    const courseId = courses?.courses?.[0]?.id;
    if (!courseId) return { ok: false, message: "No active Classroom course found." };
    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${courseId}/announcements`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${payload.title}\n\n${payload.body}` }),
      },
    );
    if (!res.ok) return { ok: false, message: await res.text() };
    const data = await res.json();
    return { ok: true, url: data.alternateLink };
  },
  "google-keep": async () => {
    // Google Keep API requires a Google Workspace account and is server-to-server only.
    // Surfaced here as a placeholder destination so the wiring is in place.
    return {
      ok: false,
      message:
        "Google Keep API requires Workspace + service-account delegation; client-side send is not supported.",
    };
  },
  "google-docs": async (token, payload) => {
    const create = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: payload.title }),
    });
    if (!create.ok) return { ok: false, message: await create.text() };
    const doc = await create.json();
    const updateRes = await fetch(
      `https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            { insertText: { location: { index: 1 }, text: payload.body } },
          ],
        }),
      },
    );
    if (!updateRes.ok) return { ok: false, message: await updateRes.text() };
    return {
      ok: true,
      url: `https://docs.google.com/document/d/${doc.documentId}/edit`,
    };
  },
  "google-forms": async (token, payload) => {
    const create = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info: { title: payload.title } }),
    });
    if (!create.ok) return { ok: false, message: await create.text() };
    const form = await create.json();
    const items = (payload.questions ?? []).map((q, index) => ({
      createItem: {
        item: {
          title: q.prompt,
          questionItem: {
            question:
              q.type === "choice"
                ? {
                    choiceQuestion: {
                      type: "RADIO",
                      options: (q.choices ?? []).map((c) => ({ value: c })),
                    },
                  }
                : { textQuestion: { paragraph: q.type === "long" } },
          },
        },
        location: { index },
      },
    }));
    if (items.length) {
      const updateRes = await fetch(
        `https://forms.googleapis.com/v1/forms/${form.formId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requests: items }),
        },
      );
      if (!updateRes.ok) return { ok: false, message: await updateRes.text() };
    }
    return { ok: true, url: form.responderUri };
  },
};

export function getAvailableDestinations(): ExportDestination[] {
  return PROVIDER_LIST.filter((p) => loadTokens(p.id) !== undefined).map(
    (p) => ({
      id: p.id,
      label: p.label,
      description: p.description,
      iconHref: p.iconHref,
      send: async (payload) => {
        const token = await getFreshAccessToken(p.id);
        if (!token) {
          return {
            ok: false,
            message: `${p.label} is not connected. Reconnect on the Integrations page.`,
          };
        }
        return SENDERS[p.id](token, payload);
      },
    }),
  );
}
