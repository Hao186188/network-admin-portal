// src/app/sitemap-forum.xml.ts
// Sitemap cho forum posts

import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qtm3k14.vercel.app";

export default async function sitemapForum(): Promise<MetadataRoute.Sitemap> {
  try {
    // Giả lập lấy dữ liệu từ database
    // Thay thế bằng API call thực tế
    const forumPosts = [
      { id: "1", updated_at: new Date().toISOString() },
      { id: "2", updated_at: new Date().toISOString() },
      { id: "3", updated_at: new Date().toISOString() },
    ];

    return forumPosts.map((item) => ({
      url: `${baseUrl}/forum/${item.id}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Error fetching forum posts for sitemap:", error);
    return [];
  }
}
