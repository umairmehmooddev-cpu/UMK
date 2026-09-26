# Architecture

Status: decision record. The app on this branch is a Next.js shell. Product features are not implemented.

## Current repository

Remote: `umairmehmooddev-cpu/UMK`. Default branch: `main`.

`main` at `7cafe90` was a Google AI Studio audio transcriber (Vite, React, Tailwind). `vite.config.ts` inlined `GEMINI_API_KEY` into the browser, and `src/App.tsx` constructed `@google/genai` on the client. Express, `dotenv`, and `better-sqlite3` were declared and unused. That applet was removed when the shell was created. It was not WORKBOOKOS, and it was not kept behind a transcription proxy.

The shell is Next.js 16 App Router, React 19, TypeScript `strict`, Tailwind CSS 4, and ESLint (`eslint-config-next`). npm is the package manager, with `package-lock.json` committed from the shell install. There is still no database, auth, AI SDK, Dockerfile, or CI workflow.

| Fact | Evidence |
| --- | --- |
| Package manager | npm. `package-lock.json` is produced by the shell. |
| App | `next` App Router under `src/app`. Production command is `next build`. |
| TypeScript | `strict: true` in `tsconfig.json`. `npm run typecheck` runs `next typegen && tsc --noEmit`. |
| Lint | `eslint.config.mjs` uses `eslint-config-next` and bans `@google/genai`. |
| Secrets | `src/lib/public-env.ts` reads `NEXT_PUBLIC_APP_URL` only. `src/server/env.ts` rejects `NEXT_PUBLIC_` names that look like secrets. `next.config.ts` does not define an `env` map. |
| Server modules | `src/server/*` imports `server-only`. They export purpose markers. They do not open a database or call a model. |
| Health | `GET /api/health` returns `{ "status": "ok" }`. |
| Deploy artifacts | No Dockerfile, no `vercel.json` / `fly.toml` / `render.yaml`, no `.github` workflows. |

### Unmerged parallel work

Draft PR #1 (`cursor/digital-pack-factory-0f94`, "Add a digital pack bot") is not on `main`. It adds a client-side "UMK Product Bot" that generates Etsy/Gumroad packs (`src/lib/generatePack.ts`, `src/pages/PackFactory.tsx`), adds `jszip` and a `package-lock.json`, and still constructs `GoogleGenAI` in the browser with the Vite-inlined `GEMINI_API_KEY`.

That branch is a different product. It is not the WORKBOOKOS baseline. Do not merge it in order to start this SaaS. Leave PR #1 untouched unless a later instruction explicitly says otherwise.

Phase 0 did not install dependencies or run the toolchain. The shell slice does. Command results belong in the shell pull request, not as a standing claim in this file.

## Decisions

Phase 0 recommended keeping Vite and adding Express, because those libraries were already declared. The user overrode that recommendation before the shell was written. D1, D3, D4, and D10 below are the override. D2 and D5–D9 and D11 still stand.

| ID | Decision | Consequence |
| --- | --- | --- |
| D1 | The application is Next.js App Router (Next 16), React, TypeScript, and Tailwind in one package. | The Vite client and Express server are not the architecture. Do not add them back. |
| D2 | npm is the package manager. | `package-lock.json` is committed. Use `npm ci` after that. |
| D3 | One Next.js app. Server work lives in `src/server` and in Route Handlers under `src/app`. | No monorepo and no second HTTP framework. |
| D4 | Route Handlers and Server Components are the server. `server-only` marks modules the client must not import. | Do not add Express, `dotenv`, or a separate API process for the shell. |
| D5 | The browser is not a trusted tier. | Client Components never import `@google/genai` and never see a provider key. ESLint rejects that import. |
| D6 | PostgreSQL is the system of record when persistence starts. | `better-sqlite3` was removed with the applet. Do not add it back. |
| D7 | AI providers sit behind a server-side port. The shell does not install a provider SDK. The first adapter may be Gemini later, and it will live under `src/server/ai`. | The UI never talks to a provider. |
| D8 | Money and credits are server state. A payment-provider adapter is a later plug-in. | The client never decides a balance, a price, or an entitlement. |
| D9 | MVP tenancy is one user owning one workspace. Projects, workbooks, and brand kits belong to that workspace. | Schema may allow more workspaces later. Agency trees, shared editing, and SSO are out of scope. |
| D10 | Marketing pages that must rank are Server Components (or static HTML from the App Router). The shell homepage is `noindex` until that slice exists. | SEO does not require a second framework. |
| D11 | Published workbooks are immutable snapshots. Editing a draft does not change a URL that was already shared. | Analytics and public pages read the snapshot, not the live draft. |

## Boundaries

```
browser
  Server Components render HTML
  Client Components hold interaction only, and receive serializable props
  → no provider SDK, no secret env

Next.js server (this process)
  src/app routes and Route Handlers
  src/server modules (server-only)
  → domain policies, when those slices exist
  → AiProvider port (not installed)
  → billing/credits ledger (not installed)
  → object storage for uploads and exports (not installed)
  → PostgreSQL (not installed)

src/lib/public-env.ts
  NEXT_PUBLIC_APP_URL only
```

Layout in the shell (chosen over a top-level `server/` folder so App Router conventions stay intact):

- `src/app` — routes, root layout, `GET /api/health`.
- `src/components` — reusable UI (header, main, footer, boundary list). No `"use client"` yet: the shell has no browser state.
- `src/features` — empty feature registry for later product UI.
- `src/lib` — client-safe helpers. Today that is public env only.
- `src/server/{auth,db,documents,workbooks,templates,brand,ai,publishing,analytics,billing,security}` — one purpose marker each. No I/O.
- `src/types` — shared boundary types with no secrets.

Domain functions, when they exist, stay free of Next.js request objects so tests can call them without a listening port or a live model. The shell does not pretend those functions exist.

## Data ownership

Nothing below is migrated yet. It is the target model for later slices.

| Data | Owner | Rule |
| --- | --- | --- |
| User, password hash or login secret, settings | The user | Server-only. Never returned in full to the client. |
| Workspace | One `owner_user_id` in the MVP | All product data hangs off a workspace. |
| Project | Workspace | A folder for workbooks. No nested orgs. |
| Workbook draft | Project | Mutable. Private. |
| Source document | Workbook | Untrusted bytes. Stored outside the web root. |
| Brand kit | Workspace | Applied at publish time onto a snapshot. |
| Template | System | A small built-in set. Users do not upload templates into a marketplace. |
| Published snapshot | Workbook | Immutable. Has its own id. |
| Analytics event | Published snapshot | Append-only. No account passwords, document bodies, or raw IPs stored as product data. |
| Credit account and ledger | The user (billing account) | Ledger is the balance. Append-only. Idempotency key required on every mutation. |
| Audit event | Actor + subject | Auth, publish, credit, and admin actions. |

Delete semantics, when they are built: deleting a user must delete or detach their workspaces, drafts, sources, snapshots, and sessions. Public snapshots should disappear with the workspace. Ledger rows are retained for finance audit even if the product UI hides them; that retention rule needs a real privacy review before launch, and until then do not implement account deletion.

## Authorization

Deny by default. Every protected operation resolves the actor from the server session and loads the resource's workspace on the server.

MVP rule: allow the operation only when `workspace.owner_user_id` equals the session user. Project, workbook, source, and brand-kit routes inherit that check through foreign keys. The client-supplied owner id is ignored.

- Unauthenticated content read is allowed only for a published snapshot whose visibility is public.
- A missing resource and a resource owned by someone else both respond as not found, so ids cannot be used to probe other tenants.
- Admin is a server-side role flag. Admin mutations write an audit row that includes actor, action, subject, and request id.
- There is no client-side authorization that the server trusts.

Session shape, when auth is built: httpOnly, Secure, SameSite cookie bound to a server session row. Tokens in `localStorage` are not the plan.

## AI provider port

The UI submits source ids and a workbook id. The server loads the bytes, checks entitlement, reserves credits, calls the port, and stores the result.

```ts
type AiProvider = {
  analyze(input: { text: string; filename: string }): Promise<Analysis>;
  generateWorkbook(input: { analysis: Analysis; templateId: string }): Promise<WorkbookDraft>;
};
```

`Analysis` and `WorkbookDraft` are domain types, not provider response objects. When an adapter is added, it is the only file allowed to import a provider SDK, and it lives under `src/server/ai`. Provider errors are mapped to our error type before they cross the HTTP boundary. Document text is untrusted input to the model (see SECURITY.md). The port does not take an API key from the request.

The shell does not call this port and does not install `@google/genai`.

## Billing and credits

Entitlements (can publish, can export, monthly credit grant) are rows the server reads. The client renders them.

The ledger is the source of truth for balance:

- A mutation inserts one row with a unique `(account_id, idempotency_key)`.
- A replay of the same key returns the original row and does not call the provider again.
- The provider is called only after a reservation row exists.
- Provider failure writes a compensating credit linked to that reservation, with its own idempotency key.
- A stuck reservation is visible to an operator. It is not silently dropped.

No payment provider is selected. Stripe or an equivalent may sit behind a `BillingProvider` port later. Until then, an admin grant (audited, idempotent) is enough to exercise credits.

## Publishing

A publish action copies the current draft, brand kit, and template into a snapshot. The public URL key is a random 128-bit id. A human slug may be shown, and it is not the authorization secret.

The public player renders the snapshot only. Draft fields, owner email, and source files are not on that response. HTML from imported documents or model output is sanitized before it is stored on the snapshot. PDF export reads the same snapshot.

Default robots policy: `noindex`. The owner can opt a snapshot into indexing when they actually want a lead magnet to be crawled.

## Deployment constraint

`main` assumed AI Studio on Cloud Run, with `GEMINI_API_KEY` injected into the applet. That injection path was removed with the Vite app. A later container can still run on Cloud Run or any Node host. The process is `next start` after `next build`.

Target shape, when deployment is built:

- One Node process serving the Next.js app.
- `GEMINI_API_KEY`, database URL, and session secret exist only in the server environment, without a `NEXT_PUBLIC_` prefix, and without a `next.config.ts` `env` entry.
- `NEXT_PUBLIC_APP_URL` is the public origin used for metadata. It is not a secret.
- Managed PostgreSQL. The container disk is not the database.
- No Kubernetes, no multi-region, no AI Studio applet runtime.

There is no deploy pipeline today. Do not claim a host is already wired.

## Explicitly deferred

Marketplace, enterprise SSO, agency hierarchy, integration marketplace, native mobile apps, realtime collaboration, template marketplace, CRM, LMS, crypto, affiliate infrastructure.

Also deferred inside the architecture: a second AI vendor, a payment-provider implementation, custom domains, offline mode, Express, and `better-sqlite3`.

## Shell slice

The first implementation slice is this Next.js shell (see ROADMAP.md Phase 1). It replaces the transcriber, turns on strict TypeScript and ESLint, and reserves server modules. It does not add workbook tables, auth, or model calls.

The next product slice is Phase 2: account and tenancy.
