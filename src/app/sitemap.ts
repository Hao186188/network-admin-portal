// src/app/sitemap.ts
// Vai trò: Tạo sitemap.xml động - BỎ QUA NẾU DÙNG next-sitemap

import type { MetadataRoute } from "next";

const baseUrl = "https://qtm3k14.vercel.app";

// ✅ Nếu dùng next-sitemap, comment hoặc xóa file này
// Hoặc export empty để không conflict

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
  ];

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changefreq as
      "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: route.priority,
  }));

  // Dynamic routes từ database
  try {
    const { supabase } = await import("@/lib/db/supabase-client");

    // Lấy announcements
    const { data: announcements } = await supabase
      .from("announcements")
      .select("id, updated_at")
      .order("created_at", { ascending: false })
      .limit(100);

    // Lấy forum posts
    const { data: forumPosts } = await supabase
      .from("forum_posts")
      .select("id, updated_at")
      .order("created_at", { ascending: false })
      .limit(100);

    const dynamicRoutes = [];

    if (announcements) {
      dynamicRoutes.push(
        ...announcements.map((item) => ({
          url: `${baseUrl}/announcements/${item.id}`,
          lastModified: item.updated_at || new Date().toISOString(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      );
    }

    if (forumPosts) {
      dynamicRoutes.push(
        ...forumPosts.map((item) => ({
          url: `${baseUrl}/forum/${item.id}`,
          lastModified: item.updated_at || new Date().toISOString(),
          changeFrequency: "daily" as const,
          priority: 0.9,
        })),
      );
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Error fetching dynamic routes:", error);
    return staticRoutes;
  }
}
