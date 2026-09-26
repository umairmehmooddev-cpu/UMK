# Roadmap

Status: phased slices. Phase 0 is this assessment. Later phases are lean. Do not start Phase 2 in the same change as Phase 1.

The product loop is Import → Analyze → Transform → Edit → Brand → Publish → Share → Analyze → Improve → Reuse → Create Again. The phases below build that loop in an order that keeps the server authoritative. They do not build the deferred list at the bottom.

## Phase 0 — Assessment (this change)

Done when these files are on a branch from `main` and reviewed:

- `docs/ARCHITECTURE.md`
- `docs/PRODUCT.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`
- `docs/ROADMAP.md`

No install, no app scaffold, no product code. Typecheck, lint, test, and build were not run because dependencies are not installed and this phase forbids running the app toolchain as if it were the product.

Findings that later phases inherit:

- `main` is a Vite/React/Tailwind audio transcriber. Express, `dotenv`, and `better-sqlite3` are declared and unused. There is no lockfile and no CI.
- `GEMINI_API_KEY` is compiled into the client. That must stop before any WORKBOOKOS feature.
- Draft PR #1 is a separate client-side pack factory with the same key defect. It is not this roadmap.

## Phase 1 — Trust boundary

Smallest implementation step. No workbook, no auth, no database, no model call.

Accept when all of the following are true:

1. Branch from `main`. PR #1 is not merged and not edited.
2. `npm install` has been run and `package-lock.json` is committed. Package manager stays npm.
3. Client `tsconfig.json` has `strict: true`. A separate `tsconfig.server.json` typechecks the server with `strict` and Node types, without DOM-only shortcuts. Existing `any` in `src/App.tsx` is removed or the file is deleted in this same slice.
4. `server/index.ts` starts Express, loads env with `dotenv`, and responds to `GET /api/health` with HTTP 200 and a small JSON body that contains no secrets.
5. `vite.config.ts` no longer defines `process.env.GEMINI_API_KEY`. Client source does not import `@google/genai` and does not read that env var. The transcriber button must not call Gemini. A short message that transcription is unavailable is enough. Do not build a transcription proxy.
6. A `node:test` test imports the Express app and asserts the health response. `package.json` has a `test` script that runs it via `tsx`.
7. `npm run lint` (or a new `typecheck` script that replaces it), `npm test`, and `npm run build` have been run on the branch and the PR states the results. If one fails, the PR says so.
8. No new product routes, no SQLite file, no PostgreSQL, no auth library, no payment SDK.

Out of Phase 1: renaming the GitHub repo, deleting unused dependencies, Docker, and a marketing page.

## Phase 2 — Account and tenancy

A producer can sign up and see an empty workspace they own.

- PostgreSQL, plain SQL migrations, `pg`. Still no ORM and no `better-sqlite3`.
- User, session, workspace (`owner_user_id`), project. One workspace created at signup.
- httpOnly session cookie. Password hashing with argon2id, or magic link, but not both and not SSO.
- Server checks ownership on every project route. Two-user test proves cross-tenant ids return not found.
- Settings page: display name and email.
- Dashboard lists projects for the signed-in user. Empty state tells them to create a project.

No workbook editor yet.

## Phase 3 — Manual workbook

The loop works without AI, so generation is not on the critical path.

- Workbook draft belongs to a project. Create, rename, edit structured sections, save.
- A few built-in templates copied into the draft at creation. Templates are code or seed data, not a store.
- Brand kit on the workspace: name, two colors, logo upload stored outside the web root.
- Editor is usable on a phone-width browser and a desktop browser. Keyboard access for the primary actions.
- Still no model calls and no public URL.

## Phase 4 — Import and AI

- Upload an allowlisted source file with size caps. Extract text on the server. Keep the original bytes private to the workspace.
- `AiProvider` port. Gemini adapter is the only `@google/genai` import, and it lives on the server.
- Analyze and generate endpoints. The UI calls those routes.
- Credit account, ledger, reservation, idempotency key, compensating credit on provider failure. Tests cover replay and insufficient balance.
- Admin is not required to grant the first test credits if a signup grant is a server constant. The grant still writes a ledger row.

## Phase 5 — Deliver and measure

- Publish freezes a sanitized snapshot. Public URL uses a random 128-bit id. Default `noindex`.
- Recipient opens the interactive workbook with no account. Drafts are not on that route.
- Republish creates a new snapshot. The previous URL stays on the previous snapshot.
- PDF export of the snapshot.
- Append-only analytics: open and section completion. Producer sees counts on the workbook.
- Audit rows for publish and credit mutations.

## Phase 6 — Commercial shell

- Marketing pages as prerendered HTML: positioning, the loop, signup. One wedge may be emphasized in copy; the schema stays wedge-neutral.
- Plans and entitlements enforced on the server (credit grant size, publish allowed or not).
- Payment provider chosen here, behind a port. Webhooks verified and idempotent. If validation is still happening with free grants, ship entitlements without the card form and keep the provider unconfigured.
- Admin basics: find a user, disable the account, post an audited credit adjustment.
- Deploy: one container, server env for secrets, managed Postgres. CI runs typecheck, test, and build.
- Error pages and structured logs with request ids. No document bodies in logs.

After Phase 6 the success criteria in PRODUCT.md can be measured with real users.

## Explicitly not planned

Marketplace, enterprise SSO, agency hierarchy, integration marketplace, native mobile apps, complex collaboration, a large template marketplace, CRM, full LMS, crypto, and affiliate infrastructure.

Also not planned as their own phases: multi-region, microservices, a second AI vendor, custom domains, and realtime presence. Revisit only after the Phase 6 criteria have been observed.

## What the next instruction should decide

The next implementation instruction should accept Phase 1 as written, or override these points before any code:

1. Base is `main`. PR #1 stays a separate draft.
2. Phase 1 scope is the trust boundary only.
3. Express + Vite/React/Tailwind + TypeScript + npm stay. PostgreSQL waits until Phase 2. `better-sqlite3` is not wired up.
4. The transcriber stops calling Gemini in Phase 1 and is not replaced with a server transcription feature.
5. Gemini remains the first provider, but no adapter is written until Phase 4.

If those five points are accepted, the instruction can be: implement Phase 1 from this file and stop.
