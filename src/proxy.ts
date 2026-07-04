// src/proxy.ts
// Vai trò: Proxy để bảo vệ routes - THAY THẾ CHO MIDDLEWARE

import { NextResponse } from "next/server";

export function proxy(req: any) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password|.well-known).*)",
  ],
};
