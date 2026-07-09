// src/proxy.ts
// Vai trò: Middleware bảo vệ routes - FIXED

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Public routes - KHÔNG cần đăng nhập
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
];

// Static file extensions
const STATIC_EXTENSIONS =
  /\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|json|woff|woff2|ttf|eot)$/;

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Debug log (chỉ trong development)
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Middleware:", path, "Token:", !!token);
    }

    // 1. Cho phép static files và API auth
    if (
      path.startsWith("/_next") ||
      path.startsWith("/api/auth") ||
      STATIC_EXTENSIONS.test(path)
    ) {
      return NextResponse.next();
    }

    // 2. Kiểm tra public routes
    const isPublicRoute =
      PUBLIC_ROUTES.includes(path) ||
      PUBLIC_ROUTES.some((route) => path === route); // CHỈ SO SÁNH CHÍNH XÁC

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // 3. Kiểm tra đăng nhập
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // 4. ADMIN ONLY routes
    if (path.startsWith("/admin")) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 5. TEACHER và ADMIN routes
    if (path.startsWith("/submissions")) {
      if (token.role !== "TEACHER" && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Cho phép tất cả request, middleware sẽ xử lý logic
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (static files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
