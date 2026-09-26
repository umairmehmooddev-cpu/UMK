import Link from "next/link";

import { SiteMenu } from "@/components/marketing/site-menu";
import { NavLink } from "@/components/ui/nav-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          WorkbookOS
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink href="/#practice">The practice</NavLink>
          <NavLink href="/app">Sample workspace</NavLink>
          <NavLink href="/design">Design system</NavLink>
        </nav>
        <SiteMenu />
      </div>
    </header>
  );
}
