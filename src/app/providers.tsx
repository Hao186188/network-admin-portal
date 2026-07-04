// src/app/providers.tsx
// Vai trò: Wrapper providers - BỌC SESSION PROVIDER ĐÚNG CÁCH

"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
