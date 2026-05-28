# CLAUDE.md — FreeWorld Connect (ImpactConnect)

## Overview

A mobile-first dating app for justice-impacted (formerly incarcerated) people. The product voice uses authentic prison terminology — *Yard* (discover), *Connects* (matches), *Kites* (messages), *Props* (likes), *Solid*, *Touched down*, etc. See `replit.md` for the full glossary; match this vocabulary in any new UI copy.

Originated on Replit. The `.replit` workflow and `server/replit_integrations/auth/` (Replit OIDC via `openid-client` + Passport) reflect that.

## Stack

- **Runtime:** Node.js 20, ES modules, `tsx` in dev.
- **Server:** Express 4, modular under `server/`. Single process serves the API *and* (via Vite middleware in dev / static in prod) the SPA.
- **DB schema:** Drizzle ORM against PostgreSQL (Neon serverless driver, `ws` for websockets). Schema in `shared/schema.ts`; migrations via `drizzle-kit push` (`npm run db:push`).
- **Runtime storage:** `server/storage.ts` exports an in-memory `MemStorage` implementation of `IStorage` with seeded demo users. Routes call `storage`, **not** Drizzle directly. The Drizzle schema is wired up for `db:push` and is the source of truth for table shape, but reads/writes against actual Postgres tables are not in place yet — when you touch dating-feature code, decide whether to extend `MemStorage` or wire in a real Drizzle-backed `IStorage`. Don't assume data persists across restarts today.
- **Auth:** Replit OIDC. Session table is real Postgres (`connect-pg-simple` against `DATABASE_URL`). The dating-app `users` table in `MemStorage` is **separate** from the Replit `auth_users` table — they are not joined.
- **Frontend:** React 18, Vite, Wouter for routing, TanStack Query for server state, React Hook Form + Zod for forms.
- **UI library:** shadcn/ui (style: `new-york`, base color `neutral`) over Radix primitives. `components.json` is the shadcn config.
- **Styling:** Tailwind CSS v3 (`tailwind.config.ts`), CSS variables for theming in `client/src/index.css`, dark mode via `class`. `tailwindcss-animate` + `@tailwindcss/typography`.
- **Animation:** `framer-motion`, plus `tw-animate-css` and Embla for carousels.

## Scripts

```
npm run dev      # NODE_ENV=development tsx server/index.ts — serves API + Vite middleware on PORT (default 5000)
npm run build    # vite build (client → dist/public) && esbuild server/index.ts → dist/index.js
npm run start    # NODE_ENV=production node dist/index.js
npm run check    # tsc (typecheck only; noEmit)
npm run db:push  # drizzle-kit push — applies shared/schema.ts to the live DB at DATABASE_URL
```

No tests, no linter configured. `npm run check` is the only static gate.

## Layout

```
client/                          frontend root (Vite's `root` is `client/`)
  index.html
  src/
    main.tsx                     React entry
    App.tsx                      QueryClientProvider → TooltipProvider → Router (Wouter)
    index.css                    Tailwind layers + CSS-variable theme tokens
    pages/                       landing, home, discover, matches, messages, chat, profile, resources, not-found
    components/
      bottom-navigation.tsx, header.tsx, profile-card.tsx, match-modal.tsx,
      safety-banner.tsx, sentence-calculator.tsx (≈70 KB — a large feature surface),
      ui/                        shadcn-generated primitives (button, dialog, form, …)
    hooks/                       use-auth.ts, use-toast.ts, use-mobile.tsx
    lib/                         queryClient.ts, auth-utils.ts, currentUser.ts, utils.ts (cn helper)

server/
  index.ts                       Express bootstrap: setupAuth → registerRoutes → vite/static → listen
  routes.ts                      dating-app REST API (/api/auth, /api/discover, /api/likes, /api/matches, /api/messages, /api/profiles, /api/users)
  storage.ts                     IStorage interface + MemStorage with seeded demo users
  vite.ts                        dev middleware + prod static serving + tiny `log()` helper
  db.ts                          Neon Pool + Drizzle client (currently used only by the auth subsystem)
  replit_integrations/auth/
    index.ts                     re-exports
    replitAuth.ts                OIDC discovery, passport strategy per hostname, session cookie
    storage.ts                   authStorage.upsertUser (Drizzle against auth_users)
    routes.ts                    GET /api/auth/user (returns the current Replit auth user)

shared/
  schema.ts                      Drizzle tables: users, profiles, matches, likes, messages + insert/select zod schemas
  models/auth.ts                 Drizzle tables: sessions, authUsers (mandatory for Replit Auth — don't drop)

.agents/skills/                  Replit Agent skills lockfile mirror (see skills-lock.json)
artifacts/mockup-sandbox/        a separate Vite mockup playground (own package.json, own deps); don't conflate with the main app
.replit                          workflow + ports (5000→80) + agent integrations
.github/workflows/               codeql, dependency-review, python-app, webpack (mostly default GH templates)
replit.md                        product overview + prison-terminology glossary (treat as the product brief)
```

Path aliases (`vite.config.ts` and `tsconfig.json`):

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## Two parallel auth/user concepts — read this before touching auth

There are **two** user surfaces and they don't share a table:

1. **Replit OIDC user** (`shared/models/auth.ts` → `auth_users`, session in `sessions`). Populated by `replitAuth.ts` on every successful login via `upsertUser(claims)`. The client reads this via `GET /api/auth/user` (in `server/replit_integrations/auth/routes.ts`) and `client/src/hooks/use-auth.ts` uses it to gate the SPA between `<Landing />` and the authenticated routes.
2. **Dating-app user** (`shared/schema.ts` → `users`, plus `profiles`, `likes`, `matches`, `messages`). Defined for Drizzle but currently only manipulated through the in-memory `MemStorage`. The dating endpoints in `server/routes.ts` accept emails + plaintext passwords (`POST /api/auth/register`, `POST /api/auth/login`) — these compare passwords with `===` and are clearly **not production-safe**. Treat this as demo scaffolding.

If you're asked to "fix login" or "wire auth properly," confirm which of the two systems is in scope before changing code — the Replit flow is the gate the SPA actually uses today.

## API surface

Replit auth (cookie-session):
- `GET /api/login` — start OIDC
- `GET /api/callback` — finish OIDC
- `GET /api/logout` — end session
- `GET /api/auth/user` — current authenticated identity (`isAuthenticated` guard)

Dating app (currently unguarded — no `isAuthenticated` wrapper on these routes; the SPA gates access on the client):
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/discover/:userId`
- `POST /api/likes`
- `GET /api/matches/:userId`, `GET /api/match/:matchId`
- `POST /api/messages`, `GET /api/messages/match/:matchId`, `GET /api/messages/recent/:userId`, `PATCH /api/messages/read/:matchId/:userId`
- `GET /api/users/:id`, `GET /api/profiles/:userId`

When adding new endpoints that need a logged-in identity, wrap them with `isAuthenticated` from `server/replit_integrations/auth/replitAuth.ts`. `req.user.claims.sub` is the Replit user id.

## Frontend conventions

- **Routing.** Wouter, declared in `client/src/App.tsx`. Unauthenticated users see `<Landing />`; authenticated users see `<Home />` at `/` and `<Chat />` at `/chat/:matchId`. Other pages (`discover`, `matches`, `messages`, `profile`, `resources`) exist in `pages/` but aren't currently wired to routes — add a `<Route>` in `App.tsx` to expose them.
- **Server state.** TanStack Query with the global `queryClient` from `client/src/lib/queryClient.ts`. The default `queryFn` (`getQueryFn({ on401: "throw" })`) treats `queryKey: ["/api/foo", id]` as the URL — `queryKey.join("/")`. Honor that pattern.
- **Mutations.** Use `apiRequest(method, url, data?)` from the same file; it sets `credentials: "include"` so the Replit session cookie travels.
- **Forms.** React Hook Form + Zod via `@hookform/resolvers`. Validation schemas live next to forms or in `shared/schema.ts` (`insertUserSchema`, etc.).
- **Toasts.** `useToast` (`hooks/use-toast.ts`) + the `<Toaster />` mounted in `App.tsx`.
- **UI primitives.** Use existing shadcn components in `components/ui/` rather than building new ones. To add new shadcn components, follow `components.json` (the new-york style with `cssVariables: true`).
- **Mobile-first.** Layouts assume a phone viewport with a bottom nav (`bottom-navigation.tsx`); test small screens first.

## Backend conventions

- **Server logs.** Use the `log(msg, source?)` helper from `server/vite.ts`. The request-logging middleware in `server/index.ts` truncates lines at 79 chars — don't expand this without thought, it's there to keep terminal output readable.
- **Storage.** Call `storage.foo(...)` from routes; do not import Drizzle from route files for dating-feature data. If you migrate `MemStorage` to a real DB backend, keep the `IStorage` interface stable.
- **Schema changes.** Edit `shared/schema.ts`, then run `npm run db:push`. Drizzle config lives in `drizzle.config.ts` and requires `DATABASE_URL`.
- **Port.** The server listens on `process.env.PORT || 5000` with `host: 0.0.0.0` and `reusePort: true`. The `.replit` config maps `5000 → 80` externally — don't change the port without updating both.

## Environment

Required:
- `DATABASE_URL` — Postgres (Neon). Used by Drizzle and by `connect-pg-simple` for the auth session store.
- `SESSION_SECRET` — express-session cookie signing.
- `REPL_ID` — Replit OIDC client_id.
- `ISSUER_URL` — defaults to `https://replit.com/oidc`.

Optional / Replit-set:
- `NODE_ENV` — `development` enables Vite middleware and the cartographer plugin (`REPL_ID`-gated in `vite.config.ts`).
- `PORT` — defaults to 5000.

Session cookies are set with `secure: true`. Local dev outside Replit (over plain HTTP) won't be able to set them — run behind HTTPS or override carefully if testing locally.

## `artifacts/mockup-sandbox/`

Independent Vite project (its own `package.json`, `vite.config.ts`, `tsconfig.json`) used for design mockups. It is **not** imported by the main app. Treat it as a sibling project: don't add it to the main build, and don't share state with it.

## `.agents/skills/` and `skills-lock.json`

This repo opted into a set of Replit Agent skills (Vercel/Anthropic/Supabase/etc. authoring skills, plus the prison-context skills). `skills-lock.json` pins each skill's source repo + commit hash. If you're not the Replit Agent, you can ignore this directory — but **do not delete it**, the hashes are how the agent verifies skill provenance.

## Conventions

- **TypeScript** is `"strict": true`. Fix type errors at the source rather than suppressing.
- **No emojis in code or commits** unless explicitly requested.
- **No new comments** unless the *why* is non-obvious. Existing code follows this.
- **Imports.** Prefer the aliases (`@/`, `@shared/`) over long relatives.
- **Path-style queryKeys.** As noted, keep `queryKey: ["/api/path", ...args]` shape so the default `queryFn` produces the right URL.

## Workflow

- Dev branch for this task: `claude/claude-md-docs-IgTld`.
- Typecheck before pushing: `npm run check`.
- If you change `shared/schema.ts` and want it applied, run `npm run db:push` against a database you control (or leave it for the user — `db:push` mutates the real DB at `DATABASE_URL`).
- Commit + push to the working branch, then open a draft PR. Do not push to `main`.

## Known gotchas

- `replit.md` is the canonical product brief — including the prison-terminology vocabulary. Re-read it before writing user-facing copy.
- The `users` table is duplicated in concept (Replit `auth_users` vs. dating `users`); reads/writes for the dating app currently bypass Postgres entirely (see "Two parallel auth/user concepts" above).
- Vite v8 + React 18 + Tailwind v3 here — do not auto-upgrade Tailwind to v4 (which would invalidate `tailwind.config.ts` and the `@tailwind base/components/utilities` directives in `index.css`).
- `package.json` name is the Replit default `"rest-express"` — not meaningful.
- `.github/workflows/python-app.yml` and `webpack.yml` are GitHub starter templates that don't match this stack; treat them as inert unless asked to clean them up.
