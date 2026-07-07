// src/app/api/auth/session/route.ts
// Vai trò: Debug session - KHÔNG BỊ CACHE

export const dynamic = "force-dynamic";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("🔍 Debug Session API:", session);
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user || null,
      expires: session?.expires || null,
    });
  } catch (error) {
    console.error("❌ Debug Session Error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}
