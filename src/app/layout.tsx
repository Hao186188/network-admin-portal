// src/app/layout.tsx
// Vai trò: Layout chính - FIXED FONTS SUBSETS

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

// ✅ Inter font - Chỉ hỗ trợ latin, latin-ext, devanagari
const inter = Inter({
  subsets: ["latin", "latin-ext"], // ✅ KHÔNG có "vietnamese"
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// ✅ Poppins font - Chỉ hỗ trợ latin, latin-ext, devanagari
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"], // ✅ KHÔNG có "vietnamese"
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mạng 3 Hub - Quản trị Mạng 3",
  description:
    "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang",
  keywords:
    "Mạng 3 Hub, Quản trị Mạng, Học tập, Kiên Giang, Cao đẳng Nghề, Network Administration",
  authors: [{ name: "Võ Nhật Hào" }],
  openGraph: {
    title: "Mạng 3 Hub",
    description: "Nền tảng học tập Quản trị Mạng 3",
    type: "website",
    url: "https://qtm3k14.vercel.app",
    siteName: "Mạng 3 Hub",
    locale: "vi_VN",
  },
  verification: {
    google: "fWJ9xSva7OMPit8NxNyIzmzItlhloIppaCNr6cIhoJQ",
  },
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Sitemap link */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />
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
