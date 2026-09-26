import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          WORKBOOKOS
        </Link>
        <p className="text-sm text-muted">Application shell</p>
      </div>
    </header>
  );
}
