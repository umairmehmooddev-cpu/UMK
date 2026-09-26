import "server-only";

import { defineBoundary } from "@/server/boundary";

export const dbBoundary = defineBoundary(
  "db",
  "PostgreSQL system of record. No driver and no schema are installed in the shell.",
);
