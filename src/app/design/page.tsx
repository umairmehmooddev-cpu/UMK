import type { Metadata } from "next";
import Link from "next/link";

import { InteractiveDemos } from "@/components/design/interactive-demos";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, TextArea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableFrame, Td, Th } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Design system",
  description: "WorkbookOS visual tokens and component states.",
};

const swatches = [
  ["bg-paper", "Paper"],
  ["bg-paper-deep", "Paper deep"],
  ["bg-surface", "Surface"],
  ["bg-ink", "Ink"],
  ["bg-accent", "Accent"],
  ["bg-accent-soft", "Accent soft"],
  ["bg-danger", "Danger"],
  ["bg-warning-bg", "Warning"],
  ["bg-info-bg", "Info"],
] as const;

export default function DesignPage() {
  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="min-w-0">
            <p className="truncate font-serif text-xl tracking-tight text-ink">
              Design system
            </p>
          </div>
          <nav className="flex shrink-0 items-center gap-1" aria-label="Specimens">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink"
            >
              Marketing
            </Link>
            <Link
              href="/app"
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink"
            >
              Workspace
            </Link>
          </nav>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-sm font-medium text-accent">One brand, two densities</p>
        <h1 className="mt-2 max-w-2xl font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          Tokens, then components.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
          Marketing pages use the serif and more space. The workspace uses the
          same colors, type, and controls at a tighter rhythm. Nothing on this
          page is loaded from an account.
        </p>

        <section className="mt-12" aria-labelledby="color-heading">
          <h2 id="color-heading" className="text-base font-semibold text-ink">
            Color
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {swatches.map(([tone, name]) => (
              <li key={name} className="overflow-hidden rounded-md shadow-sm">
                <div className={`h-16 ${tone}`} />
                <p className="bg-surface px-3 py-2 text-sm text-ink">{name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="type-heading">
          <h2 id="type-heading" className="text-base font-semibold text-ink">
            Type
          </h2>
          <div className="mt-4 grid gap-4">
            <p className="font-serif text-4xl tracking-tight text-ink">
              Editorial display
            </p>
            <p className="text-base leading-7 text-ink-soft">
              Interface text stays in the sans. Body copy is 16px with relaxed
              leading on marketing pages and 14px in the workspace.
            </p>
            <p className="text-sm text-muted">Muted labels, hints, and meta.</p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="button-heading">
          <h2 id="button-heading" className="text-base font-semibold text-ink">
            Buttons
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button style={{ backgroundColor: "var(--color-accent-hover)" }}>Hover</Button>
            <Button className="outline-2 outline-offset-2 outline-focus">Focus</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2" aria-labelledby="field-heading">
          <h2 id="field-heading" className="text-base font-semibold text-ink lg:col-span-2">
            Inputs
          </h2>
          <Field id="title-field" label="Workbook title" hint="Shown on the cover.">
            <Input id="title-field" name="title" hint="Shown on the cover." placeholder="Week one" />
          </Field>
          <Field
            id="title-error"
            label="Workbook title"
            error="Add a title before you continue."
          >
            <Input
              id="title-error"
              name="title-error"
              error="Add a title before you continue."
              defaultValue=""
              placeholder="Required"
            />
          </Field>
          <Field id="notes-field" label="Notes" hint="Optional context for the draft.">
            <TextArea id="notes-field" name="notes" hint="Optional context for the draft." />
          </Field>
          <Field id="locked-field" label="Locked field">
            <Input id="locked-field" name="locked" value="Sample studio" disabled readOnly />
          </Field>
        </section>

        <section className="mt-12" aria-labelledby="status-heading">
          <h2 id="status-heading" className="text-base font-semibold text-ink">
            Badges and alerts
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            <Alert tone="info" title="Info">
              A calm notice. Use it for sample data and orientation.
            </Alert>
            <Alert tone="success" title="Success">
              The draft was kept on this device only in a later slice. This alert is a specimen.
            </Alert>
            <Alert tone="warning" title="Warning">
              A published link still points at the previous snapshot.
            </Alert>
            <Alert tone="danger" title="Something went wrong">
              The sample could not be refreshed. No request was sent.
            </Alert>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="surface-heading">
          <h2 id="surface-heading" className="text-base font-semibold text-ink">
            Card, table, empty, loading
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="text-base font-semibold">Card</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Raised surface for a workbook, a stat, or a marketing point.
              </p>
            </Card>
            <EmptyState
              title="Nothing here yet"
              description="Empty states name the next action instead of leaving a blank panel."
              action={<Button variant="secondary">Sample action</Button>}
            />
          </div>
          <div className="mt-4">
            <TableFrame label="Specimen table">
              <Table>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>State</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td className="font-medium text-ink">Intake</Td>
                    <Td>
                      <Badge>Draft</Badge>
                    </Td>
                  </tr>
                </tbody>
              </Table>
            </TableFrame>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Spinner label="Loading specimen" />
            <p className="text-sm text-muted">Loading</p>
            <div className="grid flex-1 gap-2" aria-hidden="true">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="menu-static-heading">
          <h2 id="menu-static-heading" className="text-base font-semibold text-ink">
            Menu panel
          </h2>
          <div className="mt-4 w-full max-w-xs rounded-md bg-surface p-1 shadow-md">
            <p className="px-3 py-2 text-xs font-medium text-muted">Highlighted item</p>
            <p className="rounded-sm bg-paper-deep px-3 py-2 text-sm text-ink">Duplicate draft</p>
            <p className="px-3 py-2 text-sm text-ink-soft opacity-50">Archive, disabled</p>
          </div>
        </section>

        <div className="mt-12">
          <InteractiveDemos />
        </div>
      </main>
    </div>
  );
}
