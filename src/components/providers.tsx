"use client";

import type { ReactNode } from "react";

import { CommandMenu } from "@/components/ui/command-menu";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>
        {children}
        <CommandMenu />
      </ToastProvider>
    </TooltipProvider>
  );
}
