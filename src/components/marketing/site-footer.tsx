import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>WorkbookOS. A visual specimen. Accounts are not part of this build.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          <Link href="/app" className="hover:text-ink">
            Sample workspace
          </Link>
          <Link href="/design" className="hover:text-ink">
            Design system
          </Link>
        </nav>
      </div>
    </footer>
  );
}
