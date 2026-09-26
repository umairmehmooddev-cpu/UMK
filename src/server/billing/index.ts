import "server-only";

import { defineBoundary } from "@/server/boundary";

export const billingBoundary = defineBoundary(
  "billing",
  "Entitlements and the credit ledger. No payment provider in the shell.",
);
