// src/app/sitemap-announcements.xml.ts
// Sitemap cho announcements

import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qtm3k14.vercel.app";

export default async function sitemapAnnouncements(): Promise<MetadataRoute.Sitemap> {
  try {
    // Giả lập lấy dữ liệu từ database
    // Thay thế bằng API call thực tế
    const announcements = [
      { id: "1", updated_at: new Date().toISOString() },
      { id: "2", updated_at: new Date().toISOString() },
      { id: "3", updated_at: new Date().toISOString() },
    ];

    return announcements.map((item) => ({
      url: `${baseUrl}/announcements/${item.id}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching announcements for sitemap:", error);
    return [];
  }
}
