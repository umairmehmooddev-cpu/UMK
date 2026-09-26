import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const tones = {
  info: "bg-info-bg text-info",
  success: "bg-accent-soft text-accent",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
} as const;

export function Alert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-md px-4 py-3", tones[tone])}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 text-sm leading-6">{children}</div>
    </div>
  );
}
