"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

const commands = [
  {
    label: "Marketing page",
    hint: "Positioning specimen",
    href: "/",
  },
  {
    label: "Sample workspace",
    hint: "Dashboard specimen",
    href: "/app",
  },
  {
    label: "Design system",
    hint: "Component specimen",
    href: "/design",
  },
] as const;

export function CommandMenu() {
  const router = useRouter();
  const listId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = commands.filter((command) =>
    command.label.toLowerCase().includes(normalized),
  );
  const active = results.length === 0 ? 0 : activeIndex % results.length;

  function go(href: string) {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    router.push(href);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery("");
          setActiveIndex(0);
        }
      }}
    >
      <DialogContent
        title="Jump to a specimen"
        description="Sample shortcuts only. This menu does not search workbooks."
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(inputId)?.focus();
        }}
      >
        <input
          id={inputId}
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            results[active] ? `${listId}-${active}` : undefined
          }
          placeholder="Type a page name"
          className="min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-muted"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => index + 1);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => index + results.length - 1);
            }
            if (event.key === "Enter" && results[active]) {
              event.preventDefault();
              go(results[active].href);
            }
          }}
        />
        <ul id={listId} role="listbox" className="mt-3 grid gap-1">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">No matching specimens.</li>
          ) : (
            results.map((command, index) => (
              <li key={command.href} role="presentation">
                <button
                  id={`${listId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 rounded-md px-3 py-2 text-left text-sm",
                    index === active
                      ? "bg-accent-soft text-accent"
                      : "text-ink-soft hover:bg-paper-deep",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(command.href)}
                >
                  <span className="font-medium">{command.label}</span>
                  <span className="text-xs text-muted">{command.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
