"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  title,
  description,
  children,
  className,
  onOpenAutoFocus,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  onOpenAutoFocus?: (event: Event) => void;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-ink/45" />
      <DialogPrimitive.Content
        onOpenAutoFocus={onOpenAutoFocus}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-6 text-ink shadow-lg",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <DialogPrimitive.Title className="text-lg font-semibold tracking-tight">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className="rounded-md px-2 py-1 text-sm text-muted hover:bg-paper-deep hover:text-ink">
            Close
          </DialogPrimitive.Close>
        </div>
        <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted">
          {description}
        </DialogPrimitive.Description>
        {children ? <div className="mt-5">{children}</div> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
