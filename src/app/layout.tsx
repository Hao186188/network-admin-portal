// src/app/layout.tsx
// LAYOUT - HOÀN CHỈNH TỐI ƯU

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
  keywords:
    "Mạng 3 Hub, Quản trị Mạng, Học tập, Kiên Giang, Cao đẳng Nghề, Network Administration",
  authors: [{ name: "Võ Nhật Hào" }],
  creator: "Võ Nhật Hào",
  publisher: "Mạng 3 Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xDi7yQEL2pog2kHYPth3-zWqrvkkgldFURSfgDdVVtU",
  },
  openGraph: {
    title: "Mạng 3 Hub - Quản trị Mạng 3",
    description:
      "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3.",
    url: "https://qtm3k14.vercel.app",
    siteName: "Mạng 3 Hub",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://qtm3k14.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mạng 3 Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mạng 3 Hub - Quản trị Mạng 3",
    description:
      "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3.",
    images: ["https://qtm3k14.vercel.app/og-image.png"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://qtm3k14.vercel.app",
  ),
  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/vi",
    },
  },
  category: "education",
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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Mạng 3 Hub"
          href="/feed.xml"
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
