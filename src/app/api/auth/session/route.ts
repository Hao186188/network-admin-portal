// src/app/api/auth/session/route.ts
// Vai trò: API lấy session - HOÀN CHỈNH

export const dynamic = "force-dynamic";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ✅ GET handler
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // ✅ Luôn trả về object, không trả về null
    return NextResponse.json(session || {});
  } catch (error) {
    console.error("❌ [GET] Session Error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}

// ✅ POST handler
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    // ✅ Luôn trả về object, không trả về null
    return NextResponse.json(session || {});
  } catch (error) {
    console.error("❌ [POST] Session Error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}
