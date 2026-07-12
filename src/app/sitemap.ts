// src/app/sitemap.ts
// FIXED: Sitemap hoàn chỉnh

import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qtm3k14.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    { path: "/", priority: 1.0, changefreq: "daily" },
    { path: "/about", priority: 0.8, changefreq: "monthly" },
    { path: "/announcements", priority: 0.9, changefreq: "daily" },
    { path: "/assignments", priority: 0.9, changefreq: "weekly" },
    { path: "/chat", priority: 0.7, changefreq: "weekly" },
    { path: "/documents", priority: 0.9, changefreq: "daily" },
    { path: "/forum", priority: 0.9, changefreq: "daily" },
    { path: "/courses", priority: 0.8, changefreq: "weekly" },
    { path: "/dashboard", priority: 0.8, changefreq: "daily" },
    { path: "/profile", priority: 0.7, changefreq: "daily" },
    { path: "/schedule", priority: 0.8, changefreq: "weekly" },
    { path: "/lectures", priority: 0.8, changefreq: "weekly" },
    { path: "/contact", priority: 0.6, changefreq: "monthly" },
    { path: "/faq", priority: 0.6, changefreq: "monthly" },
    { path: "/software", priority: 0.7, changefreq: "weekly" },
  ];

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq as
      "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: route.priority,
  }));

  // Dynamic routes - Có thể bỏ qua nếu không có DB
  try {
    // Giả lập dynamic routes (thay bằng API thực tế nếu có)
    const dynamicRoutes = [
      {
        url: `${baseUrl}/announcements/1`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/forum/1`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Error generating dynamic routes:", error);
    return staticRoutes;
  }
}
