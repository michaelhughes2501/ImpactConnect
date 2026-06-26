import { getAvailableDestinations } from "./destinations";
import type { ExportDestination, ExportPayload, ExportResult } from "./types";
import type { IntegrationId } from "@/lib/integrations/types";

export interface RunExportArgs {
  payload: ExportPayload;
  destinationIds: IntegrationId[];
}

export interface RunExportResult {
  results: { destination: ExportDestination; result: ExportResult }[];
}

export async function runExport({
  payload,
  destinationIds,
}: RunExportArgs): Promise<RunExportResult> {
  const available = getAvailableDestinations();
  const selected = available.filter((d) => destinationIds.includes(d.id));
  const settled = await Promise.all(
    selected.map(async (destination) => ({
      destination,
      result: await destination.send(payload).catch((err: unknown) => ({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      })),
    })),
  );
  return { results: settled };
}

export { getAvailableDestinations };
