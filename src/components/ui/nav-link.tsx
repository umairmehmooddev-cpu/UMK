import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export function NavLink({
  href,
  current,
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & { current?: boolean }) {
  return (
    <Link
      {...props}
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-md px-3 text-sm",
        current
          ? "bg-accent-soft font-medium text-accent"
          : "text-ink-soft hover:bg-paper-deep hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
