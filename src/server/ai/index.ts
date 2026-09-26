import "server-only";

import { defineBoundary } from "@/server/boundary";

export const aiBoundary = defineBoundary(
  "ai",
  "Provider port for later analysis and generation. No SDK and no model calls in the shell.",
);
