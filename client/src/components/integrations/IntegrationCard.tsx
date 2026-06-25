import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { IntegrationProvider } from "@/lib/integrations/types";
import { startConnect } from "@/lib/integrations/oauth";
import { clearTokens } from "@/lib/integrations/tokens";

interface Props {
  provider: IntegrationProvider;
  connected: boolean;
  onChange: () => void;
}

export default function IntegrationCard({ provider, connected, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  async function handleConnect() {
    setBusy(true);
    try {
      await startConnect(provider.id);
    } catch (err) {
      setBusy(false);
      toast({
        title: `Couldn't start ${provider.label} connection`,
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  }

  function handleDisconnect() {
    clearTokens(provider.id);
    onChange();
    toast({ title: `${provider.label} disconnected` });
  }

  return (
    <Card data-testid={`integration-card-${provider.id}`}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <img
          src={provider.iconHref}
          alt=""
          className="h-8 w-8"
          aria-hidden
        />
        <div className="flex-1">
          <CardTitle className="text-base">{provider.label}</CardTitle>
        </div>
        {connected ? (
          <Badge variant="secondary">Connected</Badge>
        ) : (
          <Badge variant="outline">Not connected</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{provider.description}</p>
        {connected ? (
          <Button
            variant="outline"
            onClick={handleDisconnect}
            data-testid={`disconnect-${provider.id}`}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={busy}
            data-testid={`connect-${provider.id}`}
          >
            {busy ? "Redirecting…" : "Connect"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
