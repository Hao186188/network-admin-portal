// src/app/providers.tsx
// Vai trò: Tổng hợp providers cho app

"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
