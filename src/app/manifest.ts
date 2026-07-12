// src/app/manifest.ts
// FIXED: Sửa lỗi type "any maskable"

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mạng 3 Hub - Network Administration Portal",
    short_name: "Mạng 3 Hub",
    description:
      "Hệ thống quản lý học tập cho lớp Quản trị Mạng 3, Trường Cao đẳng Nghề Kiên Giang",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any" as const, // ✅ Fix: chỉ "any" hoặc "maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any" as const, // ✅ Fix
      },
      {
        src: "/maskable-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable" as const, // ✅ Fix: riêng cho maskable
      },
      {
        src: "/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable" as const, // ✅ Fix
      },
    ],
    categories: ["education", "networking", "learning"],
    lang: "vi",
    dir: "ltr",
    prefer_related_applications: false,
  };
}
