// src/app/providers.tsx
// PROVIDERS - HOÀN CHỈNH

"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="theme"
        >
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
