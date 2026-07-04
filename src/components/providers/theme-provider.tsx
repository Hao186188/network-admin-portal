// src/components/providers/theme-provider.tsx
// Vai trò: Theme provider - KHÔNG CHỨA SCRIPT

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

type Attribute = "class" | "data-theme" | "data-mode";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: Attribute | Attribute[];
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  forcedTheme?: string;
  storageKey?: string;
  themes?: string[];
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Chỉ render sau khi mounted để tránh hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
