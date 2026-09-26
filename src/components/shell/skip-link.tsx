export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:outline focus:outline-2 focus:outline-offset-2"
    >
      Skip to content
    </a>
  );
}
