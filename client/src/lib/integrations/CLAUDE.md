# CLAUDE.md — client/src/lib/integrations/

OAuth plumbing: `providers.ts` (per-provider config), `oauth.ts` (auth URL / callback), `tokens.ts` (storage), `types.ts`. Add a new provider by extending these together with `server/routes/integrations.ts`.

See the repo-root `CLAUDE.md` for stack, layout, the two parallel auth/user concepts, API surface, and conventions. See `replit.md` for the product voice and prison-terminology glossary.
