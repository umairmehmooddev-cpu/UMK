# WORKBOOKOS

Create, Deliver & Measure Interactive Workbooks.

This repository is the application shell: Next.js App Router, TypeScript strict, Tailwind CSS, and ESLint. It does not include accounts, workbooks, import, AI, publishing, or billing.

The previous Vite audio transcriber was removed. It called Gemini from the browser with `GEMINI_API_KEY` inlined by Vite. That applet was not WORKBOOKOS, and the shell does not replace it with a transcription proxy.

## Prerequisites

- Node.js 22
- npm

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The dev server listens on port 3000. `NEXT_PUBLIC_APP_URL` is optional and defaults to `http://localhost:3000`.

Server-only secrets must not use the `NEXT_PUBLIC_` prefix. Do not add `GEMINI_API_KEY` until a later server adapter reads it. Client Components must not import a provider SDK.

## Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Development server |
| `lint` | `eslint` | ESLint (`eslint-config-next`) |
| `typecheck` | `next typegen && tsc --noEmit` | Generate route types, then strict `tsc` |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve the production build |

Prettier is not installed. Formatting stays with the editor and ESLint so the shell does not add a second formatter.

## Layout

`src/app` holds routes. `src/components` holds reusable UI. `src/features` is an empty registry for later product UI. `src/lib/public-env.ts` is the only environment module Client Components may import. `src/server/*` is marked `server-only` and is where auth, data, documents, workbooks, AI, billing, and publishing will live. Those modules currently export a purpose statement and do not call external services.

`GET /api/health` returns `{ "status": "ok" }` and no environment data.

## Not in this build

Auth, database, AI calls, the workbook editor, PDF export, product analytics, and billing. See `docs/ROADMAP.md`.
