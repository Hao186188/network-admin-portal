// src/app/providers.tsx
// Vai trò: Tổng hợp providers

"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <ThemeProvider defaultTheme="system" storageKey="theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
