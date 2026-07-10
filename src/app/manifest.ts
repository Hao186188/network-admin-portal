// src/app/manifest.ts
// Vai trò: Tạo manifest.json cho PWA

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mạng 3 Hub - Quản trị Mạng 3",
    short_name: "Mạng 3 Hub",
    description: "Nền tảng học tập hiện đại dành cho sinh viên Quản trị Mạng 3",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["education", "learning", "networking"],
    lang: "vi",
  };
}
