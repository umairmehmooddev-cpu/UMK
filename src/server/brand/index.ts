import "server-only";

import { defineBoundary } from "@/server/boundary";

export const brandBoundary = defineBoundary(
  "brand",
  "Workspace brand kit. No logo storage in the shell.",
);
