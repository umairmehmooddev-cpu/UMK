# Product

Status: scope decision for WORKBOOKOS. The running UI in this repository is an audio transcriber, not this product.

## Positioning

Create, Deliver & Measure Interactive Workbooks.

A person who already has expertise turns source material into a workbook, ships it under their brand, shares a link, and sees whether people used it. They then improve that workbook or start the next one from what they learned.

## Users

Coaches, consultants, educators, course creators, trainers, agencies, and other knowledge businesses.

The buyer is the person who produces the workbook. The person who fills it in is a recipient on a public or shared link. Recipients do not need an account in the MVP.

## Loop

Import → Analyze → Transform → Edit → Brand → Publish → Share → Analyze → Improve → Reuse → Create Again.

Each arrow is a product job:

| Step | Job |
| --- | --- |
| Import | Bring notes, a lesson, a transcript, or an outline in. The file is untrusted. |
| Analyze | Show structure, gaps, and what can become exercises. |
| Transform | Generate a workbook draft from that analysis and a template. |
| Edit | Change sections, prompts, and order without a designer. |
| Brand | Apply the workspace's name, colors, and logo. |
| Publish | Freeze a snapshot and mint a public URL. |
| Share | Hand the URL (and later a PDF) to students or clients. |
| Analyze | See basic opens and completion signals on that snapshot. |
| Improve | Edit the draft and publish again. Old links keep the old snapshot. |
| Reuse | Start another workbook from a template or a prior workbook in the same workspace. |
| Create Again | Repeat the loop for the next client, cohort, or lead magnet. |

## Wedges

These are hypotheses about who feels the pain first. The product must be able to serve all four. Do not hard-code navigation, pricing, or schema to a single wedge before real users show up.

| Id | Wedge | Why it might be first |
| --- | --- | --- |
| A | Course companions | A lesson becomes a workbook students open beside the course. |
| B | Repeated workbook production for coaches | The same coach ships a new client workbook every week. |
| C | Lead-magnet workbooks | A public URL captures attention; analytics show that it was opened. |
| D | Agency workbook production | An operator produces workbooks for several clients. MVP still uses one owner per workspace, not an agency tree. |

Validation records which wedge the account resembles. It does not build four products.

## MVP

Every item needs a user or operator purpose. If it does not, it waits.

| Capability | Purpose |
| --- | --- |
| Marketing site | Explain the loop and give a way to sign up. Public pages must be indexable HTML. |
| Auth | A producer has a private account. Recipients do not. |
| Dashboard | See workspaces' projects and workbooks and the next unfinished step. |
| Workspace / project | Separate client or course work without an org chart. |
| Create workbook | Start from blank or from a built-in template. |
| Import content | Attach source material to a workbook. |
| AI content analysis | Turn imported text into a reviewable outline. Spends credits. |
| AI workbook generation | Turn an analysis plus a template into an editable draft. Spends credits. |
| Workbook editor | Fix the draft before anyone else sees it. |
| Templates | A small system set so the first workbook is not a blank page. |
| Brand kit | One look per workspace, applied at publish. |
| PDF export | A file for people who will not open the link. |
| Interactive web publishing | The recipient can read and respond in the browser. |
| Public workbook URLs | Share without an account. |
| Basic analytics | Know the published piece was opened and how far people got. |
| AI credits | Bound cost. The producer can see why the balance changed. |
| Subscription-ready billing architecture | Plans and entitlements exist on the server before a card form does. |
| User settings | Name, email, password or login, brand defaults. |
| Admin basics | Inspect a user, adjust credits with an audit reason, disable an account. |
| Security, auditability, errors, tests, deployment | Required to charge money and to host other people's documents. |

Out of the first release, on purpose:

- Marketplace of any kind (templates, experts, or integrations).
- Enterprise SSO and SCIM.
- Agency roles, client hierarchies, and white-label tenancy.
- Native iOS or Android apps. The web UI must work on phone, tablet, and desktop.
- Realtime co-editing, comments, and suggestions.
- A large template store. A handful of built-in templates is enough.
- CRM, email drips, and a full LMS (gradebook, cohorts, video hosting).
- Crypto payments and a custom affiliate platform.

Also out of the first release: choosing the wedge permanently, multi-provider model routing, and custom domains.

## Success criteria for validation

The release is worth continuing when all of the following are true for accounts that are not the developers:

1. A new producer can sign up, import a real source, generate a draft, edit it, brand it, and publish a URL in one sitting without an engineer.
2. A second account cannot read or edit the first account's drafts, sources, or unpublished work.
3. A recipient can open the public URL on a phone and complete the workbook without an account.
4. The producer can see that the recipient opened it.
5. One generation debits credits once. Repeating the same request does not debit again. The ledger row states the reason.
6. Publishing a new version does not change the workbook a previous recipient already opened.
7. Support can explain a credit change from the ledger without reading application logs full of document text.

Measures to record, not targets invented here:

- Time from signup to first published URL.
- Which wedge best describes the account (A–D), self-reported at signup or inferred from behavior.
- Count of published workbooks that receive at least one recipient open.
- Credit reservations that fail or stick.
- Support contacts caused by lost drafts or wrong-tenant access (target: none).

The audio transcriber and the unmerged digital-pack bot are not validation of this loop. They do not create, deliver, or measure a workbook.
