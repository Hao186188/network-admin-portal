// src/app/sitemap.ts
// Vai trò: Tạo sitemap.xml động cho SEO

import type { MetadataRoute } from "next";

const baseUrl = "https://qtm3k14.vercel.app";

// ✅ Danh sách tất cả routes
const routes = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/announcements", priority: 0.9, changefreq: "daily" },
  { path: "/assignments", priority: 0.9, changefreq: "weekly" },
  { path: "/chat", priority: 0.7, changefreq: "weekly" },
  { path: "/cisco-lab", priority: 0.8, changefreq: "weekly" },
  { path: "/contact", priority: 0.5, changefreq: "monthly" },
  { path: "/courses", priority: 0.9, changefreq: "weekly" },
  { path: "/dashboard", priority: 0.8, changefreq: "daily" },
  { path: "/docker", priority: 0.7, changefreq: "weekly" },
  { path: "/documents", priority: 0.9, changefreq: "daily" },
  { path: "/exams", priority: 0.8, changefreq: "monthly" },
  { path: "/faq", priority: 0.6, changefreq: "monthly" },
  { path: "/forum", priority: 0.9, changefreq: "daily" },
  { path: "/iso", priority: 0.6, changefreq: "monthly" },
  { path: "/lectures", priority: 0.9, changefreq: "weekly" },
  { path: "/linux", priority: 0.7, changefreq: "weekly" },
  { path: "/network-automation", priority: 0.7, changefreq: "weekly" },
  { path: "/packet-tracer", priority: 0.7, changefreq: "weekly" },
  { path: "/profile", priority: 0.7, changefreq: "daily" },
  { path: "/projects", priority: 0.8, changefreq: "weekly" },
  { path: "/python", priority: 0.7, changefreq: "weekly" },
  { path: "/schedule", priority: 0.8, changefreq: "weekly" },
  { path: "/software", priority: 0.6, changefreq: "monthly" },
  { path: "/source-code", priority: 0.7, changefreq: "weekly" },
  { path: "/submissions", priority: 0.8, changefreq: "daily" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/vm", priority: 0.6, changefreq: "monthly" },
];

// ✅ Dynamic routes từ database
async function getDynamicRoutes() {
  const { supabase } = await import("@/lib/db/supabase-client");

  try {
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

    // Lấy assignments
    const { data: assignments } = await supabase
      .from("assignments")
      .select("id, updated_at")
      .order("created_at", { ascending: false })
      .limit(100);

    const dynamicRoutes = [];

    // Announcements
    if (announcements) {
      dynamicRoutes.push(
        ...announcements.map((item) => ({
          path: `/announcements/${item.id}`,
          priority: 0.8,
          changefreq: "weekly" as const,
          lastModified: item.updated_at || new Date().toISOString(),
        })),
      );
    }

    // Forum posts
    if (forumPosts) {
      dynamicRoutes.push(
        ...forumPosts.map((item) => ({
          path: `/forum/${item.id}`,
          priority: 0.9,
          changefreq: "daily" as const,
          lastModified: item.updated_at || new Date().toISOString(),
        })),
      );
    }

    // Assignments
    if (assignments) {
      dynamicRoutes.push(
        ...assignments.map((item) => ({
          path: `/assignments/${item.id}`,
          priority: 0.8,
          changefreq: "weekly" as const,
          lastModified: item.updated_at || new Date().toISOString(),
        })),
      );
    }

    return dynamicRoutes;
  } catch (error) {
    console.error("Error fetching dynamic routes:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changefreq as
      "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: route.priority,
  }));

  // Dynamic routes
  const dynamicRoutes = await getDynamicRoutes();
  const dynamicSitemap = dynamicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified || new Date().toISOString(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  return [...staticRoutes, ...dynamicSitemap];
}
