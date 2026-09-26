import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div>{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink shadow-xs placeholder:text-muted disabled:cursor-not-allowed disabled:bg-paper-deep disabled:text-muted aria-[invalid=true]:border-danger";

type ControlProps = {
  id: string;
  error?: string;
  hint?: string;
};

export function Input({
  id,
  error,
  hint,
  className,
  ...props
}: ControlProps & ComponentProps<"input">) {
  return (
    <input
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={cn(controlClass, "min-h-11", className)}
      {...props}
    />
  );
}

export function TextArea({
  id,
  error,
  hint,
  className,
  ...props
}: ControlProps & ComponentProps<"textarea">) {
  return (
    <textarea
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={cn(controlClass, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}
