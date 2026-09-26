import type { ReactNode } from "react";

import { AppMenu } from "@/components/app/app-menu";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/ui/nav-link";

const later = ["Brand kit", "Analytics", "Templates"] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-paper lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-line lg:flex lg:flex-col lg:px-3 lg:py-4">
        <p className="px-3 font-serif text-lg tracking-tight text-ink">WorkbookOS</p>
        <p className="px-3 pt-1 text-xs text-muted">Sample studio</p>
        <nav className="mt-6 grid gap-1" aria-label="Workspace">
          <NavLink href="/app" current>
            Workbooks
          </NavLink>
          <NavLink href="/design">Design system</NavLink>
          <NavLink href="/">Marketing page</NavLink>
          {later.map((item) => (
            <p
              key={item}
              className="flex min-h-11 items-center justify-between px-3 text-sm text-muted"
            >
              {item}
              <span className="text-xs">Later</span>
            </p>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-line px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <AppMenu />
            <p className="truncate text-sm font-medium text-ink">Sample studio</p>
          </div>
          <Badge tone="accent" className="shrink-0">
            Sample data
          </Badge>
        </header>
        <main id="content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
