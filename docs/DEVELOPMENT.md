# Development

Status: how to work in the Next.js shell, and the bar later slices must meet.

## Stack override

Phase 0 recommended keeping the existing Vite client and adding Express, because those dependencies were already declared. The user overrode that before implementation. The app is Next.js App Router. Do not reintroduce Vite, Express, or the audio transcriber.

## What exists today

Repository: `umairmehmooddev-cpu/UMK`. Default branch: `main`. This branch replaces the Audio Transcriber applet with the WORKBOOKOS shell.

Declared scripts in `package.json`:

| Script | Command | Meaning |
| --- | --- | --- |
| `dev` | `next dev` | Next.js dev server. Next 16 defaults the hostname to `0.0.0.0` and the port to 3000. |
| `build` | `next build` | Production build. |
| `start` | `next start` | Serve that build. |
| `lint` | `eslint` | `eslint-config-next` (core web vitals and TypeScript). |
| `typecheck` | `next typegen && tsc --noEmit` | Route types, then `tsc` with `strict`. |

There is no test script yet. The shell has no product behavior that needs a fixture beyond the production build and `GET /api/health`. Add `node:test` or the Next test runner when Phase 2 introduces authorization. Do not add Vitest, Jest, or Supertest until a slice cannot be expressed without them.

Prettier is not installed. Keep formatting small: ESLint plus the editor. Add Prettier only when a slice needs a shared format and wires a script in the same change.

`.gitignore` ignores `.env*` except `.env.example`, and ignores `.next/`, `node_modules/`, and `next-env.d.ts` (Next generates that file). `.env.example` contains `NEXT_PUBLIC_APP_URL=http://localhost:3000` and comments. It does not contain a provider key.

Draft PR #1 (`cursor/digital-pack-factory-0f94`) is an unmerged client-side pack factory. Do not branch WORKBOOKOS from it and do not merge it into this shell.

## Local setup

1. Node.js 22.
2. `npm ci` (the shell commits `package-lock.json`).
3. `cp .env.example .env.local` when you want an explicit public origin. The shell starts without it and uses `http://localhost:3000`.
4. `npm run dev`.
5. `GET /api/health` returns `{ "status": "ok" }`.

PostgreSQL is not required. Do not create a SQLite file as a stand-in. Do not put a provider key in `.env.local` until `src/server/ai` has an adapter, and never give that key a `NEXT_PUBLIC_` or `VITE_` name.

There is no Docker Compose and no CI workflow. Do not document them as available.

## How to work incrementally

One slice at a time, in the order in ROADMAP.md. A slice is mergeable when its acceptance checks pass. It does not smuggle the next slice's tables or screens.

Rules for every implementation slice:

- Branch from current `main`. Leave PR #1 alone unless the task names it.
- TypeScript is strict. Do not add `any`. Do not silence errors with blanket assertions.
- Server input is validated at the route boundary. Domain functions take typed values.
- Provider keys and session secrets stay in server env. They never use `NEXT_PUBLIC_`. `next.config.ts` must not grow an `env` map.
- Client Components do not import `src/server/*` (`server-only` fails the build) and do not import `@google/genai` (ESLint fails).
- New product UI goes under `src/features` and composes `src/components`. Add `"use client"` only on the leaf that needs state or browser APIs.
- No new framework, ORM, queue, or provider SDK until a decision in ARCHITECTURE.md is revised in the same PR.
- Do not add a dependency "for later" with no caller.

## Quality bar

Required before a slice is called done:

| Check | Requirement |
| --- | --- |
| Typecheck | `npm run typecheck` exits 0. |
| Lint | `npm run lint` exits 0. |
| Build | `npm run build` exits 0. |
| Secrets | Client source and `.next/static` contain no `GEMINI_API_KEY` and no `@google/genai`. |
| Honesty | A PR that says a command passes includes the result from that branch. |

## Branching

- `main` is the integration branch.
- Short-lived branches. Open a pull request. Prefer draft until the quality bar for that slice has been run.
- Do not force-push `main`. Do not force-push a branch someone else is using.
- Do not commit `node_modules`, `.next`, `dist`, coverage, or env files other than `.env.example`.
- Commit messages state the slice outcome in plain language.

## Next slice

Phase 2 in ROADMAP.md: account and tenancy on PostgreSQL. Do not start it inside a shell-only change.
