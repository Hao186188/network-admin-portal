// src/app/api/auth/verify-email/route.ts
// XÁC THỰC EMAIL

import { supabaseAdmin } from "@/lib/db/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ" },
        { status: 400 },
      );
    }

    // Tìm user với token
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, message: "Token không tồn tại hoặc đã hết hạn" },
        { status: 400 },
      );
    }

    // Kiểm tra token đã hết hạn chưa
    if (user.verification_token_expires) {
      const expiresAt = new Date(user.verification_token_expires);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          {
            success: false,
            message: "Token đã hết hạn. Vui lòng đăng ký lại.",
          },
          { status: 400 },
        );
      }
    }

    // Cập nhật trạng thái đã xác thực
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        is_verified: true,
        verification_token: null,
        verification_token_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ Update verification error:", updateError);
      return NextResponse.json(
        { success: false, message: "Lỗi xác thực tài khoản" },
        { status: 500 },
      );
    }

    console.log("✅ Email verified:", user.email);

    return NextResponse.json({
      success: true,
      message: "Xác thực email thành công!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("❌ Verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Có lỗi xảy ra" },
      { status: 500 },
    );
  }
}
