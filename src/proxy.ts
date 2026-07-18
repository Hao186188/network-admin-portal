// src/proxy.ts
// Vai trò: Proxy/Middleware bảo vệ routes - HOÀN CHỈNH (THÊM CORS + NGROK)

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ✅ Public routes
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/faq",
  "/contact",
  "/terms",
  "/googlefd0bb1779e2131d9.html",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/manifest.webmanifest",
  "/og-image",
  "/grid.svg",
];

// ✅ Static file extensions
const STATIC_EXTENSIONS =
  /\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|json|woff|woff2|ttf|eot|xml|txt|mp4|webm|m3u8)$/;

// ✅ Allowed origins (cho phép từ IP, localhost, ngrok)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.52:3000",
  "http://192.168.1.54:3000",
  "https://qtm3k14.vercel.app",
  // ✅ Thêm ngrok URLs (tự động detect)
  "https://*.ngrok-free.dev",
  "https://*.ngrok.io",
];

// ✅ Hàm kiểm tra origin (hỗ trợ wildcard)
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  // Kiểm tra chính xác
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // Kiểm tra wildcard cho ngrok
  if (origin.includes("ngrok-free.dev") || origin.includes("ngrok.io")) {
    return true;
  }

  // Kiểm tra local network IP
  if (origin.match(/^http:\/\/192\.168\.[0-9]+\.[0-9]+:[0-9]+$/)) {
    return true;
  }

  // Kiểm tra localhost với các cổng khác
  if (origin.match(/^http:\/\/localhost:[0-9]+$/)) {
    return true;
  }

  return false;
}

// ✅ Hàm tạo CORS headers
function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning",
    "Access-Control-Max-Age": "86400",
  };

  // ✅ Thêm header để bỏ qua cảnh báo ngrok
  headers["ngrok-skip-browser-warning"] = "true";

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  } else {
    // Fallback: cho phép tất cả (không khuyến khích trong production)
    headers["Access-Control-Allow-Origin"] = "*";
  }

  return headers;
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const origin = req.headers.get("origin");

    // ✅ Debug log
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 [Proxy]", path, "Token:", !!token, "Origin:", origin);
    }

    // ✅ 1. XỬ LÝ PREFLIGHT OPTIONS REQUEST
    if (req.method === "OPTIONS") {
      const headers = getCorsHeaders(origin);
      // ✅ Thêm headers cho ngrok
      headers["ngrok-skip-browser-warning"] = "true";
      return new NextResponse(null, {
        status: 204,
        headers: {
          ...headers,
          "Content-Length": "0",
        },
      });
    }

    // ✅ 2. QUAN TRỌNG: Cho phép tất cả API routes của NextAuth
    if (path.startsWith("/api/auth")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      // ✅ Thêm CORS headers vào response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // ✅ Thêm header bỏ qua cảnh báo ngrok
      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 3. Cho phép tất cả API routes (thêm CORS)
    if (path.startsWith("/api/")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // ✅ Thêm header bỏ qua cảnh báo ngrok
      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 4. Cho phép static files
    if (path.startsWith("/_next") || STATIC_EXTENSIONS.test(path)) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // ✅ Thêm header bỏ qua cảnh báo ngrok
      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 5. Kiểm tra public routes
    if (
      PUBLIC_ROUTES.some(
        (route) => path === route || path.startsWith(route + "/"),
      )
    ) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // ✅ Thêm header bỏ qua cảnh báo ngrok
      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 6. Chưa đăng nhập -> redirect về login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      // ✅ Thêm header vào redirect response
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // ✅ 7. Kiểm tra quyền
    const userRole = (token.role as string)?.toUpperCase() || "STUDENT";

    // Admin routes
    if (path.startsWith("/admin") && userRole !== "ADMIN") {
      const redirectUrl = new URL("/dashboard", req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // Teacher routes
    if (
      (path.startsWith("/submissions") ||
        path.startsWith("/lectures/create") ||
        path.startsWith("/lectures/edit")) &&
      userRole !== "TEACHER" &&
      userRole !== "ADMIN"
    ) {
      const redirectUrl = new URL("/dashboard", req.url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // ✅ 8. Profile route - cho phép truy cập
    if (path.startsWith("/profile")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 9. Lectures - Student có thể xem, chỉ Teacher/Admin mới được quản lý
    if (path.startsWith("/lectures")) {
      // Cho phép tất cả user xem lectures
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 10. Assignments - Student có thể xem, chỉ Teacher/Admin mới được quản lý
    if (path.startsWith("/assignments")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 11. Dashboard - yêu cầu đã đăng nhập
    if (path.startsWith("/dashboard")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 12. Documents - yêu cầu đã đăng nhập
    if (path.startsWith("/documents")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 13. Forum - yêu cầu đã đăng nhập
    if (path.startsWith("/forum")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 14. Chat - yêu cầu đã đăng nhập
    if (path.startsWith("/chat")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;
    }

    // ✅ 15. Các routes khác - yêu cầu đã đăng nhập
    const response = NextResponse.next();
    const corsHeaders = getCorsHeaders(origin);

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // ✅ Thêm header bỏ qua cảnh báo ngrok cho tất cả response
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      },
    },
  },
);

// ✅ Cấu hình matcher - KHÔNG LOẠI TRỪ API/AUTH ĐỂ CÓ THỂ THÊM CORS
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - files with extensions (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
