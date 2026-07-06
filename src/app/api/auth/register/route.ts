// src/app/api/auth/register/route.ts
// Vai trò: API đăng ký - FIX LỖI 500

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "STUDENT" } = body;

    console.log("📝 Register request:", { name, email, role });

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

    // Kiểm tra kết nối Supabase
    if (!supabase) {
      console.error("❌ Supabase client not initialized");
      return NextResponse.json(
        { message: "Lỗi kết nối database" },
        { status: 500 },
      );
    }

    // Kiểm tra email đã tồn tại
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (checkError) {
      console.error("❌ Check user error:", checkError);
      return NextResponse.json(
        { message: "Lỗi kiểm tra email: " + checkError.message },
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
      console.error("❌ Insert user error:", insertError);
      return NextResponse.json(
        { message: "Lỗi tạo tài khoản: " + insertError.message },
        { status: 500 },
      );
    }

    console.log("✅ User created successfully:", newUser.id);

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
    console.error("❌ Register error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký",
      },
      { status: 500 },
    );
  }
}
