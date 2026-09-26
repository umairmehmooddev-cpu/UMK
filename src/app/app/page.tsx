import type { Metadata } from "next";

import { NewWorkbookDialog } from "@/components/app/new-workbook-dialog";
import { sampleCounts, sampleWorkbooks } from "@/components/app/sample-workbooks";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableFrame, Td, Th } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Workbooks",
  description: "Sample workspace specimen. No account and no saved workbooks.",
};

export default function WorkspacePage() {
  return (
    <div className="grid gap-6">
      <Alert tone="info" title="Sample data">
        This workspace is a visual specimen. Nothing is requested from a server,
        and nothing is saved.
      </Alert>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Workbooks</h1>
          <p className="mt-1 text-sm text-muted">
            Drafts in the sample studio. Scan them, then publish when a later
            slice exists.
          </p>
        </div>
        <NewWorkbookDialog />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {sampleCounts.map((count) => (
          <Card key={count.label} className="p-4">
            <p className="text-xs text-muted">{count.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {count.value}
            </p>
            <p className="mt-1 text-xs text-muted">{count.note}</p>
          </Card>
        ))}
      </div>
      <TableFrame label="Sample workbooks. Scroll horizontally on a narrow screen.">
        <Table>
          <caption className="sr-only">
            Sample workbooks. These rows are not loaded from a database.
          </caption>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
              <Th>Owner</Th>
            </tr>
          </thead>
          <tbody>
            {sampleWorkbooks.map((workbook) => (
              <tr key={workbook.name}>
                <Td className="font-medium text-ink">{workbook.name}</Td>
                <Td>
                  <Badge tone={workbook.status === "Published" ? "accent" : "neutral"}>
                    {workbook.status}
                  </Badge>
                </Td>
                <Td>{workbook.updated}</Td>
                <Td>{workbook.owner}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableFrame>
      <section aria-labelledby="published-heading" className="grid gap-3">
        <h2 id="published-heading" className="text-sm font-semibold text-ink">
          Published links
        </h2>
        <EmptyState
          title="No published links yet"
          description="When a workbook is published, its public link will be listed here. This specimen has nowhere to publish."
        />
      </section>
    </div>
  );
}
