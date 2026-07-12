// src/components/providers/theme-provider.tsx
// THEME PROVIDER - CÁCH 2

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme" | "data-mode";
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: "light" | "dark" | "system";
  enableColorScheme?: boolean;
  nonce?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={true}
      storageKey="theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
