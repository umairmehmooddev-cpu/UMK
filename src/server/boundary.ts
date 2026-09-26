import "server-only";

import {
  serverBoundaryIds,
  type ServerBoundary,
  type ServerBoundaryId,
} from "@/types/boundary";

export function defineBoundary(
  id: ServerBoundaryId,
  purpose: string,
): ServerBoundary {
  return { id, purpose };
}

/** Ensures every planned server area has exactly one shell boundary. */
export function assertBoundaryList(
  boundaries: readonly ServerBoundary[],
): readonly ServerBoundary[] {
  const seen = new Set(boundaries.map((boundary) => boundary.id));
  const missing = serverBoundaryIds.filter((id) => !seen.has(id));

  if (missing.length > 0) {
    throw new Error(`Missing server boundaries: ${missing.join(", ")}`);
  }

  if (seen.size !== boundaries.length) {
    throw new Error("Duplicate server boundary id.");
  }

  return boundaries;
}
