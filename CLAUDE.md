# CLAUDE.md

Guidance for Claude Code (and humans) when working in this repository.

## Project overview

**FreeWorld Connect** (this repo, code-named **ImpactConnect**) is a mobile-first dating app for justice-impacted individuals. It uses swipe-based discovery ("The Yard"), kite-style messaging ("Kites"), and a like/match system ("Props"). The UI deliberately leans on authentic reentry/prison terminology to feel familiar to the target audience.

For deeper architecture and design history, see [`replit.md`](./replit.md).

## Stack

| Layer       | Technology                                                       |
|-------------|------------------------------------------------------------------|
| Frontend    | React 18 + TypeScript, Vite, Wouter (router), TanStack Query     |
| UI          | Tailwind CSS + shadcn/ui (Radix primitives)                      |
| Forms       | react-hook-form + Zod (`drizzle-zod` for DB schemas)             |
| Backend     | Express.js + TypeScript                                          |
| Database    | PostgreSQL on Neon (serverless), Drizzle ORM                     |
| Dev/build   | `tsx` (run TS in dev), Vite (frontend build), esbuild (server)   |
| Host        | Replit (autoscale; Node 20 + PostgreSQL 16 modules)              |

## Repo layout

```
ImpactConnect/
├── client/                       # React frontend
│   └── src/
│       ├── main.tsx              # ReactDOM entry
│       ├── App.tsx               # Wouter routes
│       ├── pages/                # landing, home, discover, matches, messages, chat, profile, resources, not-found
│       ├── components/
│       │   ├── ui/               # shadcn primitives (~40 files)
│       │   ├── bottom-navigation.tsx
│       │   ├── profile-card.tsx
│       │   ├── match-modal.tsx
│       │   └── safety-banner.tsx
│       ├── hooks/                # use-auth, use-mobile, use-toast
│       └── lib/                  # queryClient, auth-utils, currentUser
│
├── server/                       # Express backend
│   ├── index.ts                  # entrypoint (auth, routes, Vite middleware in dev)
│   ├── routes.ts                 # REST endpoints
│   ├── storage.ts                # DB operations on top of Drizzle
│   ├── db.ts                     # Neon/PostgreSQL connection
│   └── vite.ts                   # Vite dev middleware integration
│
├── shared/                       # Code shared by client + server
│   ├── schema.ts                 # Drizzle tables (users, profiles, matches, likes, messages)
│   └── models/auth.ts            # sessions, authUsers
│
├── migrations/                   # Drizzle-generated SQL
├── artifacts/                    # Design mockups / sandbox projects
├── .agents/                      # Replit/Claude agent skills metadata
├── skills-lock.json              # Locked agent skill versions
├── replit.md                     # Architecture & user-flow documentation
├── .replit                       # Replit modules, deployment, PORT=5000
├── components.json               # shadcn config
├── vite.config.ts                # Vite + path aliases
├── tailwind.config.ts            # Design tokens
├── drizzle.config.ts             # ORM config (points at shared/schema.ts)
├── tsconfig.json                 # Strict TS, path aliases
└── package.json
```

## Commands

```bash
npm install
npm run dev        # NODE_ENV=development tsx server/index.ts (Vite HMR in dev)
npm run check      # tsc (typecheck only)
npm run db:push    # drizzle-kit push — applies shared/schema.ts to the database
npm run build      # vite build (client) + esbuild bundles server/index.ts → dist/
npm run start      # NODE_ENV=production node dist/index.js
```

Dev server listens on `PORT` (default **5000**, per `.replit`).

## Environment

`.env` (gitignored). Required keys:

- `DATABASE_URL` — Neon/PostgreSQL connection string
- `SESSION_SECRET` — used for session signing
- (Replit-specific runtime vars are wired automatically)

The Drizzle config (`drizzle.config.ts`) reads `DATABASE_URL` for migrations.

## Database schema (Drizzle)

All tables live in [`shared/schema.ts`](./shared/schema.ts) and `shared/models/auth.ts`:

- **`users`** — auth identity (email, password hash) + profile core (name, age, bio, photos, location, preferences, verification)
- **`profiles`** — visibility/privacy settings, stats (profile views, matches, response rate)
- **`matches`** — links `user1Id` ↔ `user2Id` when there's a mutual like
- **`likes`** — individual like / super-like rows with timestamps
- **`messages`** — chat messages, FK to a match, sender, read status
- **`sessions`** + **`authUsers`** — session storage / auth models

Generate insert/select schemas with `drizzle-zod` so server validation and TS types stay in sync.

## Key API routes (`server/routes.ts`)

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET  /api/discover/:userId` — discover candidates
- `POST /api/likes` — create like (creates a match if reciprocal)
- `GET  /api/matches/:userId`, `GET /api/match/:matchId`
- Messaging endpoints (history, send, read)
- Profile read/update

## Build & deploy

- **Dev**: Vite middleware is mounted on the Express server (`server/vite.ts`) so the same Node process serves the API and the client with HMR.
- **Production build**: `vite build` outputs to `dist/public/`; `esbuild` bundles the server to `dist/index.js`.
- **Production runtime**: Express serves API routes plus the prebuilt static client.
- **Replit deployment**: autoscale target defined in `.replit`.

## Conventions

- **Shared types**: keep request/response shapes in `shared/` so client and server import the same Zod/Drizzle types. Don't redefine entity shapes in `client/src/`.
- **API access on the client**: use TanStack Query (`useQuery` / `useMutation`) via the helpers in `client/src/lib/queryClient.ts`. Don't `fetch` raw from components.
- **Routing**: Wouter, not React Router. Use the existing route registration pattern in `App.tsx`.
- **UI primitives**: add new components with `npx shadcn add <component>` to keep `components.json` aligned. Custom components go alongside the page that uses them or in `client/src/components/`.
- **Schema changes**: edit `shared/schema.ts`, run `npm run db:push`, regenerate Zod schemas. Never apply ad-hoc SQL.
- **Mobile-first**: design every new screen for narrow viewports first; the `bottom-navigation.tsx` is the primary navigation surface.
- **Authentic terminology**: keep the prison/reentry slang already in the UI (Yard, Kites, Props, Cellies). Update copy alongside any rename.

## Notable repo concerns

- `artifacts/` contains experimental projects/mockups — **don't import from there into `client/` or `server/`**.
- `.agents/` and `skills-lock.json` describe the Claude/Replit agent skill set used in this project; treat them as build-tool configuration.
- `replit.md` is the long-form architecture doc; update it whenever you make a structural change.

## CI

`.github/workflows/` includes `codeql.yml`, `dependency-review.yml`, `python-app.yml`, `webpack.yml`, and `dependabot.yml`. The Python and Webpack workflows are leftover templates — wire them to something useful or delete them when you have time.
