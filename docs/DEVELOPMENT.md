# Development

Status: how to work in this repo as it exists today, and the bar later slices must meet. No dependencies were installed for this document.

## What exists today

Repository: `umairmehmooddev-cpu/UMK`. Default branch: `main`. The app on `main` is the Audio Transcriber applet.

Declared scripts in `package.json`:

| Script | Command | Meaning |
| --- | --- | --- |
| `dev` | `vite --port=3000 --host=0.0.0.0` | Client dev server. |
| `build` | `vite build` | Client production bundle. |
| `preview` | `vite preview` | Serve that bundle. |
| `clean` | `rm -rf dist` | Delete `dist/`. |
| `lint` | `tsc --noEmit` | Typecheck only. Not ESLint. The tsconfig is not `strict`. |

There is no `test` script and no `start` script. `node_modules` is not in the tree. `main` has no lockfile. Node available in the assessment environment was v22.14.0 and npm 10.9.7; that only describes the machine, not a verified app install.

README local steps (not re-run here):

1. Install Node.js.
2. `npm install`.
3. Put `GEMINI_API_KEY` in `.env.local`.
4. `npm run dev`.

`.gitignore` ignores `.env*` except `.env.example`. Do not commit `.env`, `.env.local`, or real keys. `.env.example` holds placeholders (`MY_GEMINI_API_KEY`, `MY_APP_URL`) and comments that describe AI Studio injection. Those placeholders are not live credentials. History on this assessment did not contain a long embedded key literal.

`vite.config.ts` currently copies `GEMINI_API_KEY` into the client bundle. Follow the README only to understand the applet. Do not treat that pattern as the WORKBOOKOS setup. See SECURITY.md.

Draft PR #1 (`cursor/digital-pack-factory-0f94`) is an unmerged client-side pack factory. It has its own lockfile. Do not branch WORKBOOKOS from it and do not mix its lockfile into `main` accidentally.

## Not verified

Typecheck, lint, test, and build were not run. Reasons: this change is documentation only, dependencies are not installed, and there is no test suite to run. Do not write that the transcriber works.

## How to work incrementally

One slice at a time, in the order in ROADMAP.md. A slice is mergeable when its acceptance checks pass. It does not smuggle the next slice's tables or screens.

Rules for every implementation slice:

- Branch from current `main`. Leave PR #1 alone unless the task names it.
- Change only what the slice needs. The transcriber files stay until a slice says to retire them, and they must not gain new product behavior.
- Prefer a failing test that names the behavior, then the smallest code that makes it pass.
- Server input is validated at the HTTP boundary. Domain functions take typed values.
- TypeScript is strict. Do not add `any`. Do not silence errors with blanket assertions.
- Provider keys and session secrets stay in server env. The web bundle does not read them.
- No new framework, ORM, or queue until a decision in ARCHITECTURE.md is revised in the same PR.
- Unused dependencies (`better-sqlite3`, `motion`, and on `main` also `express` until the server exists) are not removed in a drive-by. A slice that still does not use them leaves them listed.

## Quality bar

Required before a slice is called done:

| Check | Requirement |
| --- | --- |
| Typecheck | `tsc --noEmit` with `strict` true for both client and server programs. |
| Lint | The repo has no ESLint config. Until one is added, the typecheck is the lint gate, and new code still avoids `any` and unused public exports. Adding ESLint is allowed inside Phase 1 if it stays a thin recommended config; it is not a product feature. |
| Tests | Automated tests for the behavior the slice claims. Phase 1's minimum is the health route. Later slices add authz, credit idempotency, and draft-vs-public separation before those features are exposed. |
| Build | `npm run build` succeeds for the client. The server process starts and answers `/api/health`. |
| Secrets | `git grep` on the client source finds no `GEMINI_API_KEY` and no `@google/genai` import. |
| Honesty | A README or PR that says a command passes includes the command output from that branch. |

Test runner decision for the first tests: Node's built-in test runner (`node:test`) via the existing `tsx` devDependency. Do not add Vitest, Jest, or Supertest until a slice cannot express its test in `node:test`.

Suggested scripts to add in Phase 1 (not present now):

- `typecheck` — `tsc --noEmit` (client) and `tsc -p tsconfig.server.json --noEmit`.
- `test` — `tsx --test`.
- `dev:server` — `tsx server/index.ts`.

Keep the current `lint` script working, or point it at the same strict typecheck and say so in the PR.

## Local setup notes

After Phase 1 exists, local setup should be:

1. Node.js 22.
2. `npm ci` once a lockfile exists (`npm install` until the first lockfile is committed).
3. Copy `.env.example` to `.env.local`. Leave provider keys empty until an AI slice needs them. Never put a provider key in a `VITE_` variable.
4. `npm run dev` for the client. `npm run dev:server` for the API, on a different port, with the client proxying `/api` to it.
5. PostgreSQL is not required until the persistence slice. Do not create a SQLite file as a stand-in.

There is no Docker Compose and no CI workflow. Do not document them as available.

AI Studio's `DISABLE_HMR` switch can stay in `vite.config.ts` so this repo still opens in that environment. It is not a product requirement.

## Branching

- `main` is the integration branch.
- Short-lived branches. Open a pull request. Prefer draft until the quality bar for that slice has been run.
- Do not force-push `main`. Do not force-push a branch someone else is using.
- Do not commit `node_modules`, `dist`, coverage, or env files.
- Commit messages state the slice outcome in plain language. The existing history uses a `feat:` prefix; either that prefix or a `docs:` / `fix:` prefix is fine if the subject says what changed.
- One slice per PR when possible. Docs-only changes do not include drive-by refactors of `src/App.tsx`.

## First slice boundary

The next implementation instruction should do Phase 1 from ROADMAP.md and nothing after it. It should not scaffold the workbook editor, auth, or billing, and it should not install a new application framework.
