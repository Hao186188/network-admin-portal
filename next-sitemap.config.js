// next-sitemap.config.js
// Vai trò: Cấu hình sitemap cho Next.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://qtm3k14.vercel.app",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
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
    ],
    additionalSitemaps: [
      "https://qtm3k14.vercel.app/sitemap.xml",
      "https://qtm3k14.vercel.app/server-sitemap.xml",
    ],
  },
  exclude: [
    "/api/*",
    "/admin/*",
    "/profile/*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/_next/*",
    "/static/*",
  ],
  generateIndexSitemap: true,
  changefreq: "daily",
  priority: 0.7,
  transform: (config, path) => {
    // Custom priority cho từng route
    if (path === "/") {
      return { ...config, priority: 1.0, changefreq: "daily" };
    }
    if (path.startsWith("/forum")) {
      return { ...config, priority: 0.9, changefreq: "daily" };
    }
    if (path.startsWith("/announcements")) {
      return { ...config, priority: 0.8, changefreq: "daily" };
    }
    if (path.startsWith("/assignments")) {
      return { ...config, priority: 0.8, changefreq: "weekly" };
    }
    return config;
  },
};
