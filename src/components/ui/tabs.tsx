"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ children }: { children: ReactNode }) {
  return (
    <TabsPrimitive.List className="flex gap-1 border-b border-line">
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "min-h-11 border-b-2 border-transparent px-3 text-sm text-muted",
        "data-[state=active]:border-accent data-[state=active]:font-medium data-[state=active]:text-ink",
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <TabsPrimitive.Content value={value} className="pt-4 text-sm leading-6 text-ink-soft">
      {children}
    </TabsPrimitive.Content>
  );
}
