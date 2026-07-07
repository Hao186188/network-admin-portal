// src/proxy.ts
// Vai trò: Proxy để bảo vệ routes - FIX LỖI REDIRECT

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public routes - không cần đăng nhập
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

    // Auth routes - cho phép truy cập không cần token
    if (path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Public routes
    if (publicRoutes.includes(path)) {
      return NextResponse.next();
    }

    // Kiểm tra đăng nhập
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // ADMIN ONLY routes
    const adminRoutes = ["/admin", "/admin/users", "/admin/settings"];
    if (adminRoutes.some((route) => path.startsWith(route))) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // TEACHER and ADMIN routes
    const teacherRoutes = ["/submissions", "/submissions/grade"];
    if (teacherRoutes.some((route) => path.startsWith(route))) {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
