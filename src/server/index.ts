import "server-only";

import { aiBoundary } from "@/server/ai";
import { analyticsBoundary } from "@/server/analytics";
import { authBoundary } from "@/server/auth";
import { billingBoundary } from "@/server/billing";
import { assertBoundaryList } from "@/server/boundary";
import { brandBoundary } from "@/server/brand";
import { dbBoundary } from "@/server/db";
import { documentsBoundary } from "@/server/documents";
import { publishingBoundary } from "@/server/publishing";
import { securityBoundary } from "@/server/security";
import { templatesBoundary } from "@/server/templates";
import { workbooksBoundary } from "@/server/workbooks";
import type { ServerBoundary } from "@/types/boundary";

export const serverBoundaries: readonly ServerBoundary[] = assertBoundaryList([
  authBoundary,
  dbBoundary,
  documentsBoundary,
  workbooksBoundary,
  templatesBoundary,
  brandBoundary,
  aiBoundary,
  publishingBoundary,
  analyticsBoundary,
  billingBoundary,
  securityBoundary,
]);
