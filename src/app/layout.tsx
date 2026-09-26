import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { SkipLink } from "@/components/shell/skip-link";
import { getPublicEnv } from "@/lib/public-env";
import { assertNoPublicSecrets } from "@/server/env";

import "./globals.css";

assertNoPublicSecrets();

const { appUrl } = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: appUrl,
  title: {
    default: "WORKBOOKOS",
    template: "%s · WORKBOOKOS",
  },
  description: "Create, Deliver & Measure Interactive Workbooks.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
