// src/app/manifest.ts
// HOÀN CHỈNH - FIX LỖI MANIFEST VÀ FAVICON

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
    scope: "/",
    id: "mang3hub",
    categories: ["education", "networking", "learning"],
    lang: "vi",
    dir: "ltr",
    prefer_related_applications: false,

    icons: [
      // ✅ Favicon - KHÔNG khai báo trong manifest để tránh lỗi
      // Trình duyệt tự động tìm /favicon.ico
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
