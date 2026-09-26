# Security

Status: threat model and required controls. The controls are not implemented. The current applet violates the key-isolation rule below.

## Current exposure

`vite.config.ts` does this:

```ts
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
},
```

`src/App.tsx` then runs `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })` in the browser and sends audio bytes to Gemini from the client.

Anyone who can load the built JavaScript can read that key and spend the account. This is the highest-severity defect in the repo. Phase 1 removes the `define` and the client SDK call. Until that ships, do not put a production key in `.env.local` and do not deploy this applet as WORKBOOKOS.

`.env.example` contains the placeholder `MY_GEMINI_API_KEY`, not a live key. A scan of git history during this assessment did not find a long embedded key literal. `.gitignore` ignores `.env*` except `.env.example`. That ignore rule is necessary and stays.

The unmerged pack-factory branch (PR #1) repeats the same client-side `GoogleGenAI` construction. Merging it would keep the defect.

No authentication exists, so there is also no authorization. That is acceptable only while the app holds no tenant data.

## Principles

- The server is the authority for identity, ownership, credits, and publish state.
- The browser holds UI state and the user's own session cookie. It does not hold provider keys, ledger truth, or other tenants' ids as a permission.
- Imported documents and model output are untrusted.
- Every credit mutation is auditable and idempotent.
- Secrets are environment variables on the server, or the host's secret store. They are not compiled into assets.

## Threats and required controls

### Provider key theft

Threat: a key in the client bundle, a source map, a log line, or an error response.

Controls:

- `GEMINI_API_KEY` is read only in the server Gemini adapter.
- Vite `define` must not mention it. No `VITE_GEMINI_API_KEY`.
- The client does not import `@google/genai`.
- Logs and HTTP errors may include a provider request id. They must not include the key, the Authorization header, or the full prompt plus document body.
- Rotate the key if it was ever injected into a deployed bundle or shared in a chat log. This assessment did not find a committed live key and did not verify deployed bundles.

### Untrusted documents

Threat: a producer uploads a file that attacks the parser, the model, or the recipient's browser. Expect oversized files, zip bombs, polyglot files, HTML and script, macro-bearing office files, and text that tries to override the system prompt.

Controls, when import exists:

- Allowlist extensions and sniffed types. Reject the rest.
- Cap size and decompressed size. Parse with timeouts. Do not render a preview by dumping file HTML into the app origin.
- Store bytes outside the static web root, keyed by a server-generated id. Download routes check workspace ownership.
- Extracted text is data, not instructions. The Gemini adapter wraps it in a delimited untrusted block and ignores model requests to reveal the system prompt, the key, or other tenants' data.
- The model does not choose tools that can read the database or the filesystem.
- Snapshot HTML is sanitized (a real sanitizer, not a regex) before it is stored. The public player does not use `dangerouslySetInnerHTML` on raw model output.
- PDF export uses the sanitized snapshot, not the original upload.

### Broken object-level authorization

Threat: changing a workbook id, project id, or storage key in a request reads or edits another customer's draft.

Controls:

- Every protected route loads the resource and its workspace and compares `owner_user_id` to the session user.
- Ids from the client are lookup keys only.
- Cross-tenant access returns the same not-found response as a missing id.
- Tests must cover two users and one id from the other user for each protected resource type, before that resource type ships.
- Admin routes check the server role and write an audit row. They are not a hidden query parameter.

### Session and account attacks

Threat: stolen cookies, fixation, credential stuffing, password reuse.

Controls, when auth exists:

- Session cookie is httpOnly, Secure, SameSite=Lax (Strict if the product does not need cross-site OAuth returns).
- Session id is random and stored server-side. Rotating it on login is required.
- Passwords hashed with argon2id if passwords are the login method. Magic links, if chosen instead, are single-use and short-lived.
- No enterprise SSO in the MVP. Do not add a half-built OAuth client "for later."
- Account disable revokes sessions.

### Public workbook URLs

Threat: guessing a link, leaking a draft through a public route, leaving an old version editable, indexing private coaching material, or using the public page as an XSS host.

Controls:

- Public id is at least 128 bits from a CSPRNG. Sequential integers are not public ids.
- A slug is cosmetic. Guessing a slug does not reveal a private workbook.
- The public handler loads a snapshot row with `visibility = public`. It does not join the draft.
- Unpublished and unlisted snapshots are not linked from any index.
- Default `noindex`. Indexing is an explicit owner choice per snapshot.
- Content-Security-Policy on the public player disallows unexpected script sources.
- Analytics events store the snapshot id, event name, and time. They do not store the recipient's name unless a later product decision says the workbook asked for it, and that field is then the recipient's answer, not a tracking identifier we invented.

### Credit and billing fraud

Threat: double-submit, replay, client-reported cost, negative balance, or a failed model call that still charges.

Controls:

- Balance is the sum of ledger rows for the account. The client display is a cache.
- Each debit or grant carries an idempotency key. Uniqueness is `(account_id, idempotency_key)`.
- Insert the reservation in the same database transaction that checks the available balance. If the insert conflicts, return the stored result and do not call the provider.
- Call the provider only after the reservation commits.
- On provider failure, insert a compensating credit with a derived idempotency key (`${original}:compensate`). One compensation, not one per retry.
- Entitlements (publish, export, monthly grant) are read on the server at the moment of the action.
- A payment-provider webhook, when one exists, verifies the provider signature and uses the provider event id as the idempotency key. The browser success URL does not grant credits.
- Admin adjustments require a reason and an audit row.

### Server input and platform

Threat: injection in any field that later becomes SQL, HTML, a path, or a shell argument.

Controls:

- Validate body, query, and params with a schema. Reject unknown critical fields rather than passing a raw object into the domain.
- SQL uses parameters. File paths are generated on the server.
- No `child_process` with user strings.
- Dependencies install from the lockfile (`npm ci`) once it exists. `better-sqlite3` is a native module that is unused; do not build features on it.
- Errors returned to the client are a code and a short message. Stack traces stay in server logs.

## Audit

Record actor, action, subject type, subject id, request id, and timestamp for: login success and failure, logout, role change, credit grant and debit, publish, unpublish, admin impersonation (do not build impersonation in the MVP), and account disable.

Audit rows are append-only. They are not a debug log. Document text does not belong in them.

## Logging and observability

Structured logs with a request id. Level and message plus ids. Redact cookies, provider keys, and request bodies on import and generate routes.

Health check (`GET /api/health`) returns process liveness only. It does not return env, versions of secrets, or a database URL.

## Deferred security work

SSO, SCIM, customer-managed keys, a formal penetration test, malware scanning with a third-party sandbox, and regional data residency. Basic upload limits and sanitizing still ship with import and publish. They are not deferred.
