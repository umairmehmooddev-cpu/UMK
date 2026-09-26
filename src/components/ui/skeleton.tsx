import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-paper-deep motion-safe:animate-pulse",
        className,
      )}
      aria-hidden="true"
    />
  );
}
