# Roadmap

Status: phased slices. Phase 0 is this assessment. Later phases are lean. Do not start Phase 2 in the same change as Phase 1.

The product loop is Import → Analyze → Transform → Edit → Brand → Publish → Share → Analyze → Improve → Reuse → Create Again. The phases below build that loop in an order that keeps the server authoritative. They do not build the deferred list at the bottom.

## Phase 0 — Assessment

Done when these files are on a branch from `main` and reviewed:

- `docs/ARCHITECTURE.md`
- `docs/PRODUCT.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`
- `docs/ROADMAP.md`

No install and no app scaffold in Phase 0. Typecheck, lint, test, and build were not run in that phase.

Findings that later phases inherit:

- `main` was a Vite/React/Tailwind audio transcriber. Express, `dotenv`, and `better-sqlite3` were declared and unused. `GEMINI_API_KEY` was compiled into the client.
- Draft PR #1 is a separate client-side pack factory with the same key defect. It is not this roadmap.
- The user overrode the Phase 0 stack recommendation (keep Express + Vite). Phase 1 is a Next.js App Router shell.

## Phase 1 — Next.js shell

The user chose Next.js App Router over the earlier Express + Vite recommendation. This slice replaces the transcriber. It does not build workbook, auth, database, or model features, and it does not add a transcription proxy.

Accept when all of the following are true:

1. Branch from the Phase 0 docs. PR #1 is not merged and not edited.
2. The Vite app, `@google/genai`, Express, and `better-sqlite3` are gone. `package-lock.json` is committed. Package manager stays npm.
3. `tsconfig.json` has `strict: true`. `npm run typecheck`, `npm run lint`, and `npm run build` exit 0. The PR states the results.
4. `next.config.ts` does not inline secrets. `.env.example` has placeholders only. `NEXT_PUBLIC_` is limited to the public origin. A server module rejects public names that look like secrets.
5. `GET /api/health` returns `{ "status": "ok" }` and no environment data.
6. `src/server/*` imports `server-only` and states its purpose. No provider SDK, database driver, or auth library is installed.
7. Client output does not contain `GEMINI_API_KEY` or `@google/genai`.

Out of Phase 1: automated tests (they start when authorization exists), renaming the GitHub repo, Docker, and a marketing site. The homepage is an `noindex` shell page.

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
- `AiProvider` port under `src/server/ai`. The provider SDK is installed in this slice, imported only by the server adapter.
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

## Settled before the shell

1. Base of the product line is `main`. PR #1 stays a separate draft.
2. The user chose Next.js App Router. Express + Vite is not the stack.
3. PostgreSQL waits until Phase 2. `better-sqlite3` is not coming back.
4. The transcriber was removed. There is no transcription proxy.
5. A provider adapter waits until Phase 4. Gemini is still the likely first adapter, and it is not installed.

The next implementation instruction should be Phase 2 from this file, or an explicit override. Do not add product features inside a follow-up to the shell unless that instruction says Phase 2.
