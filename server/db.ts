import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// `true` only when a Postgres connection string is configured. When false the
// app falls back to in-memory storage (see server/storage.ts) so it boots and
// runs locally without provisioning a database. Postgres-backed Replit Auth is
// only wired up when a real REPL_ID is present, which also implies a DB.
export const DATABASE_READY = Boolean(process.env.DATABASE_URL);

export const pool = DATABASE_READY
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : undefined;

// Typed as a Drizzle client for call sites, but only constructed when a
// database is configured. It is never dereferenced while DATABASE_READY is
// false (storage falls back to MemStorage and auth setup is skipped).
export const db = (DATABASE_READY
  ? drizzle({ client: pool!, schema })
  : undefined) as ReturnType<typeof drizzle>;

if (!DATABASE_READY) {
  // eslint-disable-next-line no-console
  console.warn(
    "[ImpactConnect] DATABASE_URL not set — using in-memory storage. " +
      "Set DATABASE_URL to enable the Postgres-backed Drizzle layer.",
  );
}
