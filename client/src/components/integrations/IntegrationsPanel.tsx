import { useCallback, useState } from "react";
import { PROVIDER_LIST } from "@/lib/integrations/providers";
import { loadTokens } from "@/lib/integrations/tokens";
import IntegrationCard from "./IntegrationCard";

export default function IntegrationsPanel() {
  const [version, setVersion] = useState(0);
  const onChange = useCallback(() => setVersion((v) => v + 1), []);

  return (
    <section className="space-y-4" data-testid="integrations-panel">
      <header>
        <h2 className="text-xl font-semibold">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect Google services to use them as export destinations.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDER_LIST.map((provider) => (
          <IntegrationCard
            key={`${provider.id}:${version}`}
            provider={provider}
            connected={loadTokens(provider.id) !== undefined}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}
