// src/app/api/auth/forgot-password/route.ts
// Vai trò: API quên mật khẩu - FIXED (Dùng Supabase)

import { supabase } from "@/lib/db/supabase-client";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng nhập email" },
        { status: 400 },
      );
    }

    // Kiểm tra email tồn tại
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !user) {
      // Không tiết lộ email có tồn tại hay không (security)
      return NextResponse.json(
        {
          message: "Nếu email tồn tại, chúng tôi sẽ gửi link đặt lại mật khẩu",
        },
        { status: 200 },
      );
    }

    // Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Lưu token vào database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error saving reset token:", updateError);
      return NextResponse.json(
        { message: "Có lỗi xảy ra, vui lòng thử lại sau" },
        { status: 500 },
      );
    }

    // Trong thực tế, gửi email ở đây
    // Hiện tại, trả về token để test (trong production, KHÔNG trả về token)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log("🔑 Reset link:", resetLink);

    return NextResponse.json({
      message: "Link đặt lại mật khẩu đã được gửi đến email của bạn",
      resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra, vui lòng thử lại sau" },
      { status: 500 },
    );
  }
}
