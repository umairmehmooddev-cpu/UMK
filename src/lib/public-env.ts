/**
 * Client-safe environment.
 * This module may be imported from Client Components.
 * It reads NEXT_PUBLIC_APP_URL only. Do not add secrets here.
 */

export type PublicEnv = {
  readonly appUrl: URL;
};

export function getPublicEnv(): PublicEnv {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) {
    return { appUrl: new URL("http://localhost:3000") };
  }

  try {
    return { appUrl: new URL(raw) };
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be an absolute URL.");
  }
}
