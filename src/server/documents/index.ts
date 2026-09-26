import "server-only";

import { defineBoundary } from "@/server/boundary";

export const documentsBoundary = defineBoundary(
  "documents",
  "Untrusted source files. No upload, parser, or object storage in the shell.",
);
