// src/app/sitemap-index.xml.ts
// FIXED: Thêm type đầy đủ cho parameters

import type { MetadataRoute } from "next";

// Định nghĩa type cho transform function
interface SitemapTransformConfig {
  siteUrl: string;
  changefreq: string;
  priority: number;
  sitemapSize: number;
  generateRobotsTxt: boolean;
  exclude: string[];
  robotsTxtOptions: {
    policies: Array<{ userAgent: string; allow?: string; disallow?: string }>;
    additionalSitemaps: string[];
  };
}

export default function sitemapIndex(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://qtm3k14.vercel.app";

  // Tạo sitemap index cho nhiều sitemap files
  return [
    {
      url: `${baseUrl}/sitemap-0.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-announcements.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-forum.xml`,
      lastModified: new Date(),
    },
  ];
}
