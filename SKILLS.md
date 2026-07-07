# SKILLS.md — FreeWorld Connect (ImpactConnect)

A short cookbook of project-specific procedures. For overall architecture, see `CLAUDE.md`. For product voice and prison-terminology vocabulary, see `replit.md`.

---

## Add a new SPA route

Routes live in `client/src/App.tsx` inside the authenticated `<Switch>`. Pages `discover`, `matches`, `messages`, `profile`, `resources` exist in `client/src/pages/` but aren't always mounted — adding a route is usually just:

```tsx
<Route path="/discover" component={Discover} />
```

For URL params, Wouter uses `:name` syntax; access via `useRoute("/chat/:matchId")` or component props. Don't introduce React Router — the project standard is Wouter.

## Add an API endpoint

Two locations: dating-feature routes go in `server/routes.ts`; the integrations subsystem lives in `server/routes/integrations.ts`. Decide first whether the endpoint needs a logged-in identity:

```ts
import { isAuthenticated } from "./replit_integrations/auth";

app.get("/api/foo", isAuthenticated, async (req: any, res) => {
  const userId = req.user.claims.sub;          // Replit OIDC subject
  const result = await storage.getFoo(userId); // call MemStorage / storage layer
  res.json(result);
});
```

If you forget the guard, the SPA's client-side gating is the only defense — every new endpoint touching real user data should be wrapped.

## Add an OAuth integration

The integrations subsystem lives under `client/src/lib/integrations/` (oauth, providers, tokens, types) with a matching backend route in `server/routes/integrations.ts` and UI in `client/src/components/integrations/`. To add a new provider:

1. Extend `providers.ts` with the provider's client id, scopes, auth URL, and token URL.
2. Handle the OAuth callback in `server/routes/integrations.ts` — store tokens through the pattern in `tokens.ts`.
3. Wire an `IntegrationCard` variant if the UX differs materially.

## Build an export destination

`client/src/lib/export/` contains `destinations.ts`, `types.ts`, and `workflow.ts`. A new export target is a new destination entry plus the workflow steps it needs; the UI in `client/src/components/export/ExportDialog.tsx` consumes both.

## Add a Drizzle column / table

1. Edit `shared/schema.ts` — add the column to the `pgTable(...)` definition.
2. Run `npm run db:push` against a database you control (it mutates the live DB at `DATABASE_URL`).
3. If routes need to read or write the new column, extend `IStorage` in `server/storage.ts` and the current storage implementation.
4. If the route logic genuinely needs Postgres (not the in-memory map), either extend `MemStorage` for now or stand up a real Drizzle-backed `IStorage` implementation — the routes should keep calling `storage.foo(...)`, not import Drizzle directly.

Don't drop `sessions` or `auth_users` (in `shared/models/auth.ts`) — those are mandatory for Replit Auth.

## Add a shadcn component

Per `components.json` (style: `new-york`, base color: `neutral`, `cssVariables: true`):

```bash
npx shadcn@latest add <component>
```

It writes to `client/src/components/ui/`. Use these primitives over Radix-direct or hand-rolled equivalents.

## Build a form

React Hook Form + Zod via `@hookform/resolvers`:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";

const form = useForm({ resolver: zodResolver(insertUserSchema) });
```

Shared schemas live in `shared/schema.ts` (`insertUserSchema`, `insertLikeSchema`, `insertMessageSchema`). Page-local schemas can live next to the form.

## Query / mutate via TanStack Query

```ts
// Reads — queryKey IS the URL (joined with "/")
const { data } = useQuery<Match[]>({ queryKey: ["/api/matches", userId] });

// Writes — apiRequest sends credentials:"include" so the Replit session cookie travels
import { apiRequest } from "@/lib/queryClient";
const mut = useMutation({
  mutationFn: (body: NewLike) => apiRequest("POST", "/api/likes", body),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/matches"] }),
});
```

Don't write a custom `queryFn` unless you need non-standard handling — the default in `client/src/lib/queryClient.ts` already does the right thing.

## Use the current Replit auth user on the client

```ts
import { useAuth } from "@/hooks/use-auth";
const { user, isAuthenticated, isLoading, logout } = useAuth();
```

This is the **Replit** identity (from `/api/auth/user`). The dating-app `users` table is separate — if you need a dating-app user id, you currently have to pass it explicitly through the URL (see how `home.tsx` / `chat.tsx` do it). Bridging the two is a bigger change; ask before doing it.

## Show a toast

```ts
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();
toast({ title: "Sent", description: "Your message was delivered." });
```

`<Toaster />` is mounted in `App.tsx` — don't add another one.

## Switch a route from MemStorage to real Postgres

If you're upgrading a feature off the in-memory backend:

1. Verify the corresponding `pgTable(...)` exists in `shared/schema.ts`.
2. Implement a `PostgresStorage` (or extend a single `DbStorage`) that satisfies `IStorage` — use the `db` export from `server/db.ts`.
3. Swap the `export const storage` in `server/storage.ts` to the new implementation. **Don't** change how `server/routes.ts` calls it.
4. Run `npm run db:push` so the table is present on `DATABASE_URL`.
5. Note in the PR that data won't migrate from `MemStorage` (it's seeded demo state).

## Build mobile-first

The viewport is a phone. Use `min-h-screen`, `pb-20` (clearance for `bottom-navigation.tsx`), and don't introduce desktop-only sidebars. Test in a 375 × 812 window first.

## Run the app locally

```
npm install
# Provide DATABASE_URL, SESSION_SECRET, REPL_ID (and optionally ISSUER_URL)
npm run dev   # cross-env NODE_ENV=development tsx server/index.ts → API + Vite middleware on PORT (default 5000)
```

Without Replit-style HTTPS, the `secure: true` session cookie won't stick. For non-Replit local dev, you'll need an HTTPS proxy or to temporarily relax the cookie config — don't commit that relaxation.

## Pre-push checklist

- `npm run check` (tsc) is the only static gate.
- If you changed `shared/schema.ts`, decide whether to run `npm run db:push` yourself or leave it for the user (it mutates a live DB).
- Work on `claude/claude-md-docs-IgTld`. Open a draft PR. Do not push to `main`.
- Don't touch `.agents/skills/` or `skills-lock.json` — those are the Replit Agent's skill provenance lockfile.
