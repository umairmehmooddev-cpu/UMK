import "server-only";

import { defineBoundary } from "@/server/boundary";

export const securityBoundary = defineBoundary(
  "security",
  "Authorization and secret handling. Tenant checks are not implemented in the shell.",
);
