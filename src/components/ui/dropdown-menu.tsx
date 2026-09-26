"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={6}
        className={cn(
          "z-50 min-w-52 rounded-md bg-surface p-1 text-ink shadow-md",
          className,
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  children,
  disabled,
  onSelect,
}: {
  children: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DropdownMenuPrimitive.Item
      disabled={disabled}
      onSelect={onSelect}
      className="cursor-pointer rounded-sm px-3 py-2 text-sm text-ink-soft outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-paper-deep data-[highlighted]:text-ink"
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Label className="px-3 py-2 text-xs font-medium text-muted">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}
