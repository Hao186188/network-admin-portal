// src/app/api/auth/_log/route.ts
// Vai trò: NextAuth log endpoint

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  // NextAuth log endpoint - chỉ cần trả về 200
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ success: true });
}
