"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastInput = {
  title: string;
  description?: string;
};

type ToastRecord = ToastInput & { id: string };

const ToastDispatch = createContext<(toast: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastDispatch);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const publish = useCallback((toast: ToastInput) => {
    setToasts((current) => [
      ...current,
      { ...toast, id: crypto.randomUUID() },
    ]);
  }, []);

  return (
    <ToastDispatch.Provider value={publish}>
      <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className="rounded-md bg-ink px-4 py-3 text-on-accent shadow-lg"
            onOpenChange={(open) => {
              if (!open) {
                setToasts((current) => current.filter((item) => item.id !== toast.id));
              }
            }}
          >
            <ToastPrimitive.Title className="text-sm font-medium">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description ? (
              <ToastPrimitive.Description className="mt-1 text-sm leading-6 text-on-accent">
                {toast.description}
              </ToastPrimitive.Description>
            ) : null}
            <ToastPrimitive.Close className="mt-2 text-sm underline-offset-2 hover:underline">
              Dismiss
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed inset-x-4 bottom-4 z-50 flex w-auto flex-col gap-2 outline-none sm:inset-x-auto sm:right-4 sm:w-96" />
      </ToastPrimitive.Provider>
    </ToastDispatch.Provider>
  );
}
