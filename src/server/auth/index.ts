import "server-only";

import { defineBoundary } from "@/server/boundary";

export const authBoundary = defineBoundary(
  "auth",
  "Session and identity. No login, password storage, or session cookie in the shell.",
);
