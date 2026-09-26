import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers";
import { SkipLink } from "@/components/shell/skip-link";
import { getPublicEnv } from "@/lib/public-env";
import { assertNoPublicSecrets } from "@/server/env";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

assertNoPublicSecrets();

const { appUrl } = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: appUrl,
  title: {
    default: "WorkbookOS",
    template: "%s · WorkbookOS",
  },
  description: "Create, Deliver & Measure Interactive Workbooks.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full bg-paper font-sans text-ink antialiased">
        <SkipLink />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
