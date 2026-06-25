import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { completeCallback } from "@/lib/integrations/oauth";

export default function IntegrationsCallback() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    completeCallback(window.location.search)
      .then(({ returnTo }) => {
        if (!cancelled) navigate(returnTo || "/integrations");
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      {error ? (
        <>
          <h2 className="text-lg font-semibold">Connection failed</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Finishing connection…
        </p>
      )}
    </div>
  );
}
