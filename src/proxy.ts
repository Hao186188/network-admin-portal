// src/proxy.ts
// Vai trò: Proxy để bảo vệ routes

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password).*)",
  ],
};
