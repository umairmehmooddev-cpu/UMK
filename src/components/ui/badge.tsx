import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const tones = {
  neutral: "bg-paper-deep text-ink-soft",
  accent: "bg-accent-soft text-accent",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
