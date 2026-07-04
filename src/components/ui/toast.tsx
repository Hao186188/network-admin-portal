// src/components/ui/toast.tsx
// Vai trò: Component Toast notifications

"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className:
          "rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl",
        duration: 4000,
      }}
    />
  );
}
