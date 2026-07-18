// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: NextAuth API route - HOÀN CHỈNH (THÊM NGROK HEADERS)

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// ✅ Tạo handler
const handler = NextAuth(authOptions);

// ✅ Hàm wrapper để thêm headers
async function withHeaders(req: Request, context: any) {
  const response = await handler(req, context);

  // ✅ Thêm header để bỏ qua cảnh báo ngrok
  if (response instanceof NextResponse) {
    // ✅ NGROK SKIP WARNING
    response.headers.set("ngrok-skip-browser-warning", "true");

    // ✅ CORS HEADERS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, ngrok-skip-browser-warning",
    );

    // ✅ SECURITY HEADERS
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // ✅ CACHE CONTROL
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
  }

  return response;
}

// ✅ Export tất cả methods với wrapper
export async function GET(req: Request, context: any) {
  return withHeaders(req, context);
}

export async function POST(req: Request, context: any) {
  return withHeaders(req, context);
}

export async function PUT(req: Request, context: any) {
  return withHeaders(req, context);
}

export async function DELETE(req: Request, context: any) {
  return withHeaders(req, context);
}

export async function PATCH(req: Request, context: any) {
  return withHeaders(req, context);
}

export async function OPTIONS(req: Request, context: any) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, ngrok-skip-browser-warning",
      "ngrok-skip-browser-warning": "true",
    },
  });
}
