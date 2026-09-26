import "server-only";

const PUBLIC_SECRET_NAME =
  /(?:KEY|SECRET|TOKEN|PASSWORD|GEMINI|DATABASE|PRIVATE)/i;

/**
 * Fails fast when a secret is given the NEXT_PUBLIC_ prefix.
 * Next.js inlines NEXT_PUBLIC_ variables into the client bundle.
 */
export function assertNoPublicSecrets(): void {
  const names = Object.keys(process.env).filter(
    (name) =>
      name.startsWith("NEXT_PUBLIC_") && PUBLIC_SECRET_NAME.test(name),
  );

  if (names.length > 0) {
    throw new Error(
      `Refusing to expose server secrets through NEXT_PUBLIC_: ${names.join(", ")}`,
    );
  }
}
