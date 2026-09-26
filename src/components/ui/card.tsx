import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-surface p-6 text-ink shadow-sm", className)}>
      {children}
    </div>
  );
}
