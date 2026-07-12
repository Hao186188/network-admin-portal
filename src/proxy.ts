// src/proxy.ts (hoặc src/middleware.ts)
// Vai trò: Middleware bảo vệ routes - HOÀN CHỈNH

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ✅ Public routes - KHÔNG cần đăng nhập
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

// ✅ Role-based route access
const ROLE_ROUTES = {
  ADMIN: ["/admin"],
  TEACHER: ["/submissions", "/lectures/create"],
  STUDENT: ["/dashboard", "/documents", "/assignments", "/forum", "/chat"],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Debug log (chỉ ở development)
    if (process.env.NODE_ENV === "development") {
      console.log(
        "🔍 [Middleware]",
        path,
        "Token:",
        !!token,
        "Role:",
        token?.role,
      );
    }

    // ✅ 1. Cho phép tất cả API routes của NextAuth
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // ✅ 2. Cho phép static files
    if (path.startsWith("/_next") || STATIC_EXTENSIONS.test(path)) {
      return NextResponse.next();
    }

    // ✅ 3. Kiểm tra public routes
    if (
      PUBLIC_ROUTES.some(
        (route) => path === route || path.startsWith(route + "/"),
      )
    ) {
      return NextResponse.next();
    }

    // ✅ 4. Verification routes (Google, etc.)
    if (path.includes("google") && path.includes(".html")) {
      return NextResponse.next();
    }

    // ✅ 5. Chưa đăng nhập -> redirect về login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ 6. Kiểm tra quyền truy cập theo role
    const userRole = token.role as string;

    // Admin routes
    if (path.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Teacher routes
    if (
      path.startsWith("/submissions") ||
      path.startsWith("/lectures/create")
    ) {
      if (userRole !== "TEACHER" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Student routes - tất cả đều có thể truy cập
    // Không cần kiểm tra thêm vì đã có token

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Cho phép tất cả request đi qua middleware
        return true;
      },
    },
  },
);

// ✅ Cấu hình matcher - tối ưu performance
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - api/auth (auth API)
     * - files with extensions (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*$).*)",
  ],
};
