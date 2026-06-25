import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAvailableDestinations, runExport } from "@/lib/export/workflow";
import type { ExportPayload } from "@/lib/export/types";
import type { IntegrationId } from "@/lib/integrations/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: ExportPayload;
}

export default function ExportDialog({ open, onOpenChange, payload }: Props) {
  const destinations = getAvailableDestinations();
  const [selected, setSelected] = useState<Set<IntegrationId>>(new Set());
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  function toggle(id: IntegrationId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleExport() {
    setRunning(true);
    try {
      const { results } = await runExport({
        payload,
        destinationIds: Array.from(selected),
      });
      onOpenChange(false);
      setSelected(new Set());
      for (const { destination, result } of results) {
        toast({
          title: `${destination.label}: ${result.ok ? "Exported" : "Failed"}`,
          description: result.url ?? result.message,
          variant: result.ok ? "default" : "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="export-dialog">
        <DialogHeader>
          <DialogTitle>Export to&hellip;</DialogTitle>
        </DialogHeader>
        {destinations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No connected destinations. Connect a Google service on the
            Integrations page first.
          </p>
        ) : (
          <ul className="space-y-2">
            {destinations.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <Checkbox
                  id={`export-${d.id}`}
                  checked={selected.has(d.id)}
                  onCheckedChange={() => toggle(d.id)}
                  data-testid={`export-target-${d.id}`}
                />
                <Label htmlFor={`export-${d.id}`} className="flex-1">
                  <span className="font-medium">{d.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {d.description}
                  </span>
                </Label>
              </li>
            ))}
          </ul>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={running || selected.size === 0}
            data-testid="export-run"
          >
            {running ? "Exporting…" : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
