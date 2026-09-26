"use client";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NavLink } from "@/components/ui/nav-link";

export function AppMenu() {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-ink hover:bg-paper-deep lg:hidden">
        Menu
      </DialogTrigger>
      <DialogContent
        title="Sample studio"
        description="Move between the sample workspace and the other visual specimens."
      >
        <nav className="grid gap-1" aria-label="Workspace">
          <DialogClose asChild>
            <NavLink href="/app" current>
              Workbooks
            </NavLink>
          </DialogClose>
          <DialogClose asChild>
            <NavLink href="/design">Design system</NavLink>
          </DialogClose>
          <DialogClose asChild>
            <NavLink href="/">Marketing page</NavLink>
          </DialogClose>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
