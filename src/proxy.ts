// src/proxy.ts
// Vai trò: Middleware bảo vệ routes - ĐƠN GIẢN HÓA

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Cho phép API routes và static files
    if (
      path.startsWith("/_next") ||
      path.startsWith("/api/auth") ||
      path.startsWith("/api/test") ||
      path.match(/\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|json)$/)
    ) {
      return NextResponse.next();
    }

    // Public routes
    const publicRoutes = [
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

    if (
      publicRoutes.includes(path) ||
      publicRoutes.some((route) => path.startsWith(route))
    ) {
      return NextResponse.next();
    }

    // Kiểm tra đăng nhập
    if (!token) {
      console.log("🔒 Redirect to login - No token for path:", path);
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    console.log("🔑 Middleware - User:", token.email, "Role:", token.role);

    // ADMIN ONLY routes
    if (path.startsWith("/admin")) {
      if (token.role !== "ADMIN") {
        console.log("🚫 Access denied - Not admin:", token.role);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // TEACHER and ADMIN routes
    if (path.startsWith("/submissions")) {
      if (token.role !== "TEACHER" && token.role !== "ADMIN") {
        console.log("🚫 Access denied - Not teacher:", token.role);
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json)$).*)",
  ],
};
