// src/app/api/auth/reset-password/route.ts
// Vai trò: API đặt lại mật khẩu - FIXED

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp token và mật khẩu mới" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 },
      );
    }

    // Tìm user với token hợp lệ
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("reset_token", token)
      .gt("reset_token_expiry", new Date().toISOString())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 },
      );
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu và xóa token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { message: "Có lỗi xảy ra, vui lòng thử lại sau" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Đặt lại mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra, vui lòng thử lại sau" },
      { status: 500 },
    );
  }
}
