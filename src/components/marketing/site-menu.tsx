"use client";

import Link from "next/link";

import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const links = [
  { href: "/#practice", label: "The practice" },
  { href: "/app", label: "Sample workspace" },
  { href: "/design", label: "Design system" },
] as const;

export function SiteMenu() {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-ink hover:bg-paper-deep md:hidden">
        Menu
      </DialogTrigger>
      <DialogContent
        title="WorkbookOS"
        description="Visual specimens for the marketing page, the workspace, and the design system."
      >
        <nav className="grid gap-1" aria-label="Sections">
          {links.map((link) => (
            <DialogClose asChild key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-3 text-sm text-ink hover:bg-paper-deep"
              >
                {link.label}
              </Link>
            </DialogClose>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
