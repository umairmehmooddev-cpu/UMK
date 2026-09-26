import "server-only";

import { defineBoundary } from "@/server/boundary";

export const workbooksBoundary = defineBoundary(
  "workbooks",
  "Draft workbook model. No editor and no persistence in the shell.",
);
