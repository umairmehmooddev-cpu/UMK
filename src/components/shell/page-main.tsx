import type { ReactNode } from "react";

export function PageMain({ children }: { children: ReactNode }) {
  return (
    <main
      id="content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12"
    >
      {children}
    </main>
  );
}
