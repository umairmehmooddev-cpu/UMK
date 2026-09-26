# Architecture

Status: decision record. No application code in this change. Nothing here is implemented or tested.

## Current repository

Checked-out baseline is `main` at `7cafe90` ("feat: Implement audio transcription with Gemini AI"). Remote: `umairmehmooddev-cpu/UMK`. Default branch: `main`.

This is a Google AI Studio applet, not a multi-user SaaS. The product name in-repo is "Audio Transcriber" (`metadata.json`). WORKBOOKOS does not exist in code yet.

| Fact | Evidence |
| --- | --- |
| Package manager | npm. `package.json` is present. `main` has no lockfile. No pnpm, Yarn, or Bun lockfile. |
| Web stack | Vite 6, React 19, TypeScript ~5.8, Tailwind CSS 4 (`@tailwindcss/vite`). Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. |
| UI libraries present | `lucide-react`, `motion`. Used only by the transcriber screen (`lucide-react`). `motion` is unused. |
| Server libraries present | `express`, `dotenv`, `better-sqlite3`, `tsx`, `@types/express`. No server entry file. No import of these modules under `src/`. |
| AI | `@google/genai` is constructed in the browser in `src/App.tsx`. Model string in that call: `gemini-3-flash-preview`. |
| Secret handling | `vite.config.ts` loads env and `define`s `process.env.GEMINI_API_KEY` into the client bundle. README tells the developer to put the key in `.env.local`. |
| TypeScript bar | `tsconfig.json` has no `strict`. `allowJs` is true. `noEmit` is true. `src/App.tsx` uses `any` on caught errors. `lint` script is `tsc --noEmit`. No ESLint. No test script. |
| Data | No schema, no migrations, no queries. `better-sqlite3` is an unused dependency. |
| Auth | None. |
| Deploy artifacts | No Dockerfile, no `vercel.json` / `fly.toml` / `render.yaml`, no `.github` workflows. |
| Hosting comments | `.env.example` says AI Studio injects `GEMINI_API_KEY` from its secrets panel and injects `APP_URL` as the Cloud Run service URL. `vite.config.ts` disables HMR when `DISABLE_HMR=true` (AI Studio). Dev script binds `0.0.0.0:3000`. |
| Install state on this assessment | `node_modules` is absent. Dependencies were not installed. |

### Unmerged parallel work

Draft PR #1 (`cursor/digital-pack-factory-0f94`, "Add a digital pack bot") is not on `main`. It adds a client-side "UMK Product Bot" that generates Etsy/Gumroad packs (`src/lib/generatePack.ts`, `src/pages/PackFactory.tsx`), adds `jszip` and a `package-lock.json`, and still constructs `GoogleGenAI` in the browser with the Vite-inlined `GEMINI_API_KEY`.

That branch is a different product. It is not the WORKBOOKOS baseline. Do not merge it in order to start this SaaS. Leave PR #1 untouched unless a later instruction explicitly says otherwise.

### What was not run

`npm install`, typecheck, lint, test, and build were not run. There is no installed toolchain and no test script. This document does not claim the transcriber starts, builds, or transcribes.

## Decisions

These keep the stack that is already declared. They correct the places where that applet cannot host a multi-user product.

| ID | Decision | Consequence |
| --- | --- | --- |
| D1 | Web UI stays Vite + React + TypeScript + Tailwind in this package. | Do not introduce Next.js or a second frontend framework. |
| D2 | npm is the package manager. | The first implementation commit that installs dependencies adds `package-lock.json`. |
| D3 | One Node package, two entrypoints: existing Vite client and a new Express server. | No monorepo and no npm workspaces until a boundary actually needs a separate deployable. |
| D4 | Express is the HTTP API. `dotenv` loads server env. `tsx` may run the server in development. | These are already dependencies. Do not add a second HTTP framework. |
| D5 | The browser is not a trusted tier. | The UI calls only this API. It never imports `@google/genai` and never sees a provider key. |
| D6 | PostgreSQL is the system of record when persistence starts. | `better-sqlite3` stays unused. It is a single-file, single-writer engine and cannot back multiple Cloud Run instances. Do not import it. |
| D7 | AI providers sit behind a server-side port. The first adapter is Gemini, using the existing `@google/genai` dependency, inside the server process only. | Swapping providers later does not change the UI. |
| D8 | Money and credits are server state. A payment-provider adapter is a later plug-in. | The client never decides a balance, a price, or an entitlement. |
| D9 | MVP tenancy is one user owning one workspace. Projects, workbooks, and brand kits belong to that workspace. | Schema may allow more workspaces later. Agency trees, shared editing, and SSO are out of scope. |
| D10 | Marketing pages that must rank are prerendered HTML served by the Node process. The logged-in app can stay a client-rendered SPA. | Meets SEO without abandoning Vite. |
| D11 | Published workbooks are immutable snapshots. Editing a draft does not change a URL that was already shared. | Analytics and public pages read the snapshot, not the live draft. |

## Boundaries

```
browser (Vite/React)
  marketing pages, auth screens, dashboard, editor, public workbook player
  → HTTPS JSON to our API only

server (Express)
  session, validation, authorization, orchestration, audit
  → domain functions
  → AiProvider port
  → billing/credits ledger
  → object storage for uploads and exports
  → PostgreSQL

domain
  pure TypeScript policies and types
  no Express, no Gemini SDK, no SQL driver

AiProvider port
  analyze(source) / generateWorkbook(brief)
  Gemini adapter is the first implementation

billing/credits
  plans, entitlements, append-only ledger
  payment adapter (not chosen) only grants or renews credits

publishing
  snapshot + public id + sanitized web view
  PDF export is a server job over the same snapshot
```

Suggested layout when implementation starts (not created now):

- `src/` — web client. Existing files stay until a shell replaces them.
- `server/http/` — routes, authn middleware, request schemas.
- `server/domain/` — workbook, workspace, publish, credits policies.
- `server/ai/` — `AiProvider` and adapters.
- `server/db/` — migrations and queries, introduced with Phase 2.

The domain module must be callable from tests without a listening port or a live model.

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

`Analysis` and `WorkbookDraft` are domain types, not Gemini response objects. The Gemini adapter is the only file allowed to import `@google/genai`. Provider errors are mapped to our error type before they cross the HTTP boundary. Document text is untrusted input to the model (see SECURITY.md). The port does not take an API key from the request.

Phase 1 does not call this port. The port arrives with the first AI feature.

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

The repo comments assume AI Studio on Cloud Run, with secrets injected into the app environment. That host is acceptable for a later container. The current injection pattern is not acceptable: AI Studio's client bundle must not receive `GEMINI_API_KEY`.

Target shape, when deployment is built:

- One container. Express serves `/api/*` and the built client assets.
- `GEMINI_API_KEY`, database URL, and session secret exist only in the server environment.
- `APP_URL` is a public origin used for links and cookies, still server-configured.
- Managed PostgreSQL (Cloud SQL if the host stays Cloud Run). The container disk is not the database.
- No Kubernetes, no multi-region, no AI Studio applet runtime as a dependency of the product.

There is no deploy pipeline today. Do not claim Cloud Run is already wired.

## Explicitly deferred

Marketplace, enterprise SSO, agency hierarchy, integration marketplace, native mobile apps, realtime collaboration, template marketplace, CRM, LMS, crypto, affiliate infrastructure.

Also deferred inside the architecture: a second AI vendor, a payment-provider implementation, custom domains, offline mode, and any use of `better-sqlite3` as the system of record.

## First implementation slice

Phase 1 (see ROADMAP.md) only establishes the trust boundary: strict TypeScript, a lockfile, an Express process with `GET /api/health`, and removal of the Vite `define` that inlines `GEMINI_API_KEY`. No workbook tables, no auth, no model calls.

The transcriber UI is a prototype to retire. Until it is removed, it must not call Gemini from the browser. Do not extend it into WORKBOOKOS.
