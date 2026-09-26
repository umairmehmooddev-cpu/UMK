import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "bg-surface text-ink shadow-xs hover:bg-paper-deep",
  ghost: "bg-transparent text-ink-soft hover:bg-paper-deep hover:text-ink",
  danger: "bg-danger text-on-accent hover:bg-danger-hover",
} as const;

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
    loading?: boolean;
  };

type ButtonAsLink = Common &
  Omit<ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

function classesFor(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md text-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if ("href" in props && props.href !== undefined) {
    const { href, children, variant, size, className, ...linkProps } = props;
    return (
      <Link href={href} className={classesFor(variant, size, className)} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { children, variant, size, className, loading, disabled, type, ...buttonProps } = props;

  return (
    <button
      type={type ?? "button"}
      className={classesFor(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading ? true : undefined}
      {...buttonProps}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
