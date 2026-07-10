// src/app/robots.ts
// Vai trò: Tạo robots.txt cho SEO

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/profile/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/_next/",
        "/static/",
      ],
    },
    sitemap: "https://qtm3k14.vercel.app/sitemap.xml",
  };
}
