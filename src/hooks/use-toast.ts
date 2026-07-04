// src/hooks/use-toast.ts

"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    toast: {
      success: (message: string) => toast.success(message),
      error: (message: string) => toast.error(message),
      warning: (message: string) => toast.warning(message),
      info: (message: string) => toast.info(message),
      loading: (message: string) => toast.loading(message),
      dismiss: (id: string) => toast.dismiss(id),
    },
  };
}
