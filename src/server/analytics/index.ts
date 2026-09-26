import "server-only";

import { defineBoundary } from "@/server/boundary";

export const analyticsBoundary = defineBoundary(
  "analytics",
  "Append-only product events. No collection in the shell.",
);
