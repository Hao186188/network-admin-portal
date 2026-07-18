// next.config.js
// HOÀN CHỈNH - THÊM allowedDevOrigins CHO IP + NGROK SUPPORT

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ ALLOWED DEV ORIGINS - QUAN TRỌNG CHO IP VÀ NGROK
  allowedDevOrigins: [
    "192.168.1.54",
    "192.168.1.52",
    "localhost",
    "127.0.0.1",
    "*.ngrok-free.dev",
    "*.ngrok.io",
  ],

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
      // ✅ Thêm ngrok cho images
      {
        protocol: "https",
        hostname: "*.ngrok-free.dev",
      },
      {
        protocol: "https",
        hostname: "*.ngrok.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Experimental - TĂNG GIỚI HẠN + NGROK
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "192.168.1.54:3000",
        "192.168.1.52:3000",
        "qtm3k14.vercel.app",
        "*.ngrok-free.dev",
        "*.ngrok.io",
      ],
      bodySizeLimit: "10mb",
    },
    optimizeCss: true,
    scrollRestoration: true,
    webpackMemoryOptimizations: true,
  },

  // ✅ Turbopack config
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  // ✅ Performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ✅ Build optimization
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
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // ✅ CORS HEADERS
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, ngrok-skip-browser-warning",
          },
          // ✅ NGROK SKIP WARNING
          {
            key: "ngrok-skip-browser-warning",
            value: "true",
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
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          // ✅ CORS CHO API
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, ngrok-skip-browser-warning",
          },
          // ✅ NGROK SKIP WARNING
          {
            key: "ngrok-skip-browser-warning",
            value: "true",
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
      {
        source: "/old-documents",
        destination: "/documents",
        permanent: true,
      },
    ];
  },

  // ✅ Rewrites (nếu cần)
  async rewrites() {
    return [
      // Không có rewrite nào
    ];
  },

  // ✅ Webpack config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
