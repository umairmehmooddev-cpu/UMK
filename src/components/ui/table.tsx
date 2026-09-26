import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function TableFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="overflow-x-auto rounded-lg bg-surface shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      {children}
    </div>
  );
}

export function Table({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={cn("w-full min-w-[40rem] border-collapse text-left text-sm", className)}>
      {children}
    </table>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-4 py-3 text-xs font-medium tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-line px-4 py-3 text-ink-soft", className)}>
      {children}
    </td>
  );
}
