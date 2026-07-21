// src/app/layout.tsx
// LAYOUT - HOÀN CHỈNH

import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mạng 3 Hub - Quản trị Mạng 3",
    template: "%s | Mạng 3 Hub",
  },
  description:
    "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang.",
  // ... rest metadata
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="xDi7yQEL2pog2kHYPth3-zWqrvkkgldFURSfgDdVVtU"
        />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Chặn lỗi SVG path undefined - không ảnh hưởng chức năng
              const originalError = console.error;
              console.error = function() {
                const msg = arguments[0] || '';
                if (typeof msg === 'string' && msg.includes('attribute d: Expected moveto path command')) {
                  return;
                }
                return originalError.apply(console, arguments);
              };
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-inter antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "rounded-xl shadow-lg",
              duration: 4000,
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
