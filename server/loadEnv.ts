// Load .env into process.env before any other module reads it. Imported first
// in server/index.ts. Safe no-op if the file is missing or the runtime predates
// process.loadEnvFile (Node < 20.12) — env vars can also be provided by the
// shell/host (Replit, Docker, CI), so a missing .env is not an error.
try {
  process.loadEnvFile?.();
} catch {
  // .env is optional; ignore "file not found".
}
