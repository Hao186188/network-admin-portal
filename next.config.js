// next.config.js
// HOÀN CHỈNH - TƯƠNG THÍCH NEXT.JS 16 + TURBOPACK

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ✅ Experimental - ĐÃ CÓ sẵn
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "qtm3k14.vercel.app"],
    },
    optimizeCss: true,
    scrollRestoration: true,
  },

  // ✅ Turbopack config (thay thế cho webpack)
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  // ✅ Performance - BỎ swcMinify (không còn dùng)
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ✅ Build optimization - KHÔNG dùng swcMinify nữa
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // ✅ Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
