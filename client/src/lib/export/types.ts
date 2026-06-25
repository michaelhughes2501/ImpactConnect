import type { IntegrationId } from "@/lib/integrations/types";

export interface ExportPayload {
  title: string;
  body: string;
  attachments?: { name: string; mimeType: string; data: string }[];
  questions?: { prompt: string; type: "short" | "long" | "choice"; choices?: string[] }[];
}

export interface ExportResult {
  ok: boolean;
  url?: string;
  message?: string;
}

export interface ExportDestination {
  id: IntegrationId;
  label: string;
  description: string;
  iconHref: string;
  send: (payload: ExportPayload) => Promise<ExportResult>;
}
