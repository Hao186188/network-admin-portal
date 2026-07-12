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
  "/googlefd0bb1779e2131d9.html",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/manifest.webmanifest",
  "/og-image",
];

// Static file extensions
const STATIC_EXTENSIONS =
  /\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|json|woff|woff2|ttf|eot|xml|txt)$/;

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Debug log
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Middleware:", path, "Token:", !!token);
    }

    // ✅ 1. QUAN TRỌNG: Cho phép tất cả API routes của NextAuth
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // 2. Cho phép static files
    if (path.startsWith("/_next") || STATIC_EXTENSIONS.test(path)) {
      return NextResponse.next();
    }

    // 3. Kiểm tra public routes
    const isPublicRoute = PUBLIC_ROUTES.includes(path);
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // 4. Cho phép verification routes
    if (path.includes("google") && path.includes(".html")) {
      return NextResponse.next();
    }

    // 5. Kiểm tra đăng nhập
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // 6. ADMIN ONLY routes
    if (path.startsWith("/admin")) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 7. TEACHER và ADMIN routes
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
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$|google.*\\.html$).*)",
  ],
};
