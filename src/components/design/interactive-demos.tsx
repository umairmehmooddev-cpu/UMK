"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

export function InteractiveDemos() {
  const publish = useToast();

  return (
    <div className="grid gap-10">
      <section aria-labelledby="menus-heading" className="grid gap-4">
        <h2 id="menus-heading" className="text-base font-semibold text-ink">
          Menu, tooltip, dialog, toast
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sample actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() =>
                  publish({
                    title: "Sample action",
                    description: "The menu item did not change any data.",
                  })
                }
              >
                Duplicate draft
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip label="Shortcuts stay in this specimen. Nothing is searched on a server.">
            <Button variant="secondary">Tooltip</Button>
          </Tooltip>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent
              title="Confirm a sample action"
              description="Closing this dialog does not delete or publish anything."
            >
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      publish({
                        title: "Dialog closed",
                        description: "Sample confirmation. Nothing was saved.",
                      })
                    }
                  >
                    Confirm
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="secondary"
            onClick={() =>
              publish({
                title: "Sample notice",
                description: "Toasts announce themselves and do not steal focus.",
              })
            }
          >
            Show toast
          </Button>
        </div>
        <p className="text-sm text-muted">
          Press <kbd className="rounded bg-paper-deep px-1.5 py-0.5 font-sans text-xs">Ctrl</kbd>{" "}
          or <kbd className="rounded bg-paper-deep px-1.5 py-0.5 font-sans text-xs">⌘</kbd> plus{" "}
          <kbd className="rounded bg-paper-deep px-1.5 py-0.5 font-sans text-xs">K</kbd> to open
          the command menu.
        </p>
      </section>
      <section aria-labelledby="tabs-heading">
        <h2 id="tabs-heading" className="text-base font-semibold text-ink">
          Tabs
        </h2>
        <div className="mt-4">
          <Tabs defaultValue="create">
            <TabsList>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="deliver">Deliver</TabsTrigger>
              <TabsTrigger value="measure">Measure</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              Import a source and shape a private draft.
            </TabsContent>
            <TabsContent value="deliver">
              Brand the workbook and share a link.
            </TabsContent>
            <TabsContent value="measure">
              See opens on the published snapshot.
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
