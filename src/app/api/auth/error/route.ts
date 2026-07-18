// src/app/api/auth/error/route.ts
// NextAuth Error Handler Route

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get(" error");

  console.log("❌ [NextAuth Error]:", error);

  // Redirect về login page với error message
  const loginUrl = new URL("/login", request.url);
  if (error) {
    loginUrl.searchParams.set("error", error);
  }

  return NextResponse.redirect(loginUrl);
}

export async function POST(request: Request) {
  return GET(request);
}
