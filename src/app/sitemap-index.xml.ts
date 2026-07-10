// src/app/sitemap-index.xml.ts
// Vai trò: Sitemap index cho nhiều sitemap

import type { MetadataRoute } from "next";

export default function sitemapIndex(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://qtm3k14.vercel.app/sitemap.xml",
      lastModified: new Date().toISOString(),
    },
  ];
}
