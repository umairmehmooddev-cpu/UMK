import "server-only";

import { defineBoundary } from "@/server/boundary";

export const publishingBoundary = defineBoundary(
  "publishing",
  "Immutable public snapshots. No public workbook route and no PDF export in the shell.",
);
