import type { Metadata } from "next";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create, Deliver & Measure Interactive Workbooks",
  description:
    "WorkbookOS helps coaches, consultants, educators, and agencies turn expertise into interactive workbooks.",
};

const loop = [
  "Import",
  "Analyze",
  "Transform",
  "Edit",
  "Brand",
  "Publish",
  "Share",
  "Measure",
  "Improve",
] as const;

const practices = [
  {
    title: "Create",
    body: "Start from a lesson, a method, or notes you already trust. The draft stays private while you shape the prompts people will actually answer.",
  },
  {
    title: "Deliver",
    body: "Apply your name, colors, and logo, then share a link. Export a PDF when a client needs a file they can keep.",
  },
  {
    title: "Measure",
    body: "See that someone opened the workbook and how far they got. The next version can improve without changing the one they already have.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="content" className="flex-1">
        <div className="mx-auto grid w-full max-w-6xl gap-16 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="text-sm font-medium tracking-wide text-accent">
              For coaches, consultants, educators, and agencies
            </p>
            <h1 className="mt-4 max-w-[16ch] font-serif text-[clamp(2.5rem,1.2rem+3.4vw,4.5rem)] leading-[1.06] tracking-[-0.02em] text-ink">
              Create, Deliver & Measure Interactive Workbooks.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              Turn what you teach into a workbook people can open, finish, and
              return to. Import the source. Shape the draft. Brand it. Share a
              link. Learn what they used, then make the next one.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/app" size="lg" className="w-full sm:w-auto">
                Open the sample workspace
              </Button>
              <Button
                href="/design"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                View the design system
              </Button>
            </div>
          </div>
          <Card className="rounded-xl p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-ink">The workbook loop</h2>
            <ol className="mt-5 grid gap-2">
              {loop.map((step, index) => (
                <li key={step} className="flex items-baseline gap-3 text-sm">
                  <span className="w-6 shrink-0 font-medium text-accent">
                    {index + 1}
                  </span>
                  <span className="text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <section
          id="practice"
          className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:px-12"
        >
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              A quieter way to ship the work you already know.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-soft">
              The same loop serves a course companion, a weekly client
              workbook, a lead magnet, or an agency producing work for several
              clients. The workspace stays dense enough to use every day.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {practices.map((practice) => (
              <Card key={practice.title} className="rounded-xl">
                <h3 className="font-serif text-2xl text-ink">{practice.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{practice.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="tone-inverse bg-ink text-on-accent">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-20">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
                A workbook should feel as considered as the teaching inside it.
              </h2>
              <p className="mt-4 text-sm leading-6 text-on-accent">
                This page is the marketing specimen. Publishing, accounts, and
                billing are later slices.
              </p>
            </div>
            <Button href="/app" variant="secondary" size="lg" className="w-full sm:w-auto">
              Look at a sample workspace
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
