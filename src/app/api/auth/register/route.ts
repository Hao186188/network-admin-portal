// src/app/api/auth/register/route.ts
// Vai trò: API đăng ký - SỬA LỖI 400, 500

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "STUDENT" } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 },
      );
    }

    // Kiểm tra email đã tồn tại
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Check user error:", checkError);
      return NextResponse.json(
        { message: "Lỗi kiểm tra email" },
        { status: 500 },
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Insert user error:", insertError);
      return NextResponse.json(
        { message: "Lỗi tạo tài khoản" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng ký" },
      { status: 500 },
    );
  }
}
