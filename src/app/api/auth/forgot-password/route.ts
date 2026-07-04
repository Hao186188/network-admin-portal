// src/app/api/auth/forgot-password/route.ts

import db from "@/lib/db/json-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng nhập email" },
        { status: 400 },
      );
    }

    const user = await db.findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "Email không tồn tại trong hệ thống" },
        { status: 404 },
      );
    }

    // Tạo token reset password (giả lập)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Ở đây sẽ gửi email với link reset
    console.log("Reset link:", resetLink);

    return NextResponse.json({
      message: "Link đặt lại mật khẩu đã được gửi đến email của bạn",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi gửi link đặt lại mật khẩu" },
      { status: 500 },
    );
  }
}
