// src/proxy.ts
// Vai trò: Proxy/Middleware bảo vệ routes - HOÀN CHỈNH (THÊM CORS)

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

// ✅ Allowed origins (cho phép từ IP và localhost)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.52:3000",
  "https://qtm3k14.vercel.app",
];

// ✅ Hàm kiểm tra origin
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed);
}

// ✅ Hàm tạo CORS headers
function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };

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

      return response;
    }

    // ✅ 3. Cho phép tất cả API routes (thêm CORS)
    if (path.startsWith("/api/")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // ✅ 4. Cho phép static files
    if (path.startsWith("/_next") || STATIC_EXTENSIONS.test(path)) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

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

      return response;
    }

    // ✅ 6. Chưa đăng nhập -> redirect về login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ 7. Kiểm tra quyền
    const userRole = (token.role as string)?.toUpperCase() || "STUDENT";

    // Admin routes
    if (path.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Teacher routes
    if (
      (path.startsWith("/submissions") ||
        path.startsWith("/lectures/create") ||
        path.startsWith("/lectures/edit")) &&
      userRole !== "TEACHER" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ 8. Profile route - cho phép truy cập
    if (path.startsWith("/profile")) {
      const response = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

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

      return response;
    }

    // ✅ 10. Các routes khác - yêu cầu đã đăng nhập
    const response = NextResponse.next();
    const corsHeaders = getCorsHeaders(origin);

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

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
