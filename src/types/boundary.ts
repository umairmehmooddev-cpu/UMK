export const serverBoundaryIds = [
  "auth",
  "db",
  "documents",
  "workbooks",
  "templates",
  "brand",
  "ai",
  "publishing",
  "analytics",
  "billing",
  "security",
] as const;

export type ServerBoundaryId = (typeof serverBoundaryIds)[number];

export type ServerBoundary = {
  readonly id: ServerBoundaryId;
  readonly purpose: string;
};
