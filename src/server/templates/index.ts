import "server-only";

import { defineBoundary } from "@/server/boundary";

export const templatesBoundary = defineBoundary(
  "templates",
  "Built-in workbook templates. None are seeded in the shell.",
);
