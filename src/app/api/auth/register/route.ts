// src/app/api/auth/register/route.ts
// Vai trò: API đăng ký - THÊM USERNAME VÀ PHONE

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, email, phone, password, role = "STUDENT" } = body;

    console.log("📝 Register request:", { username, name, email, phone, role });

    // Validate input
    if (!username || !name || !email || !phone || !password) {
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

    // Kiểm tra username đã tồn tại
    const { data: existingUsername, error: checkUsernameError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (checkUsernameError) {
      console.error("Check username error:", checkUsernameError);
      return NextResponse.json(
        { message: "Lỗi kiểm tra tên đăng nhập" },
        { status: 500 },
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { message: "Tên đăng nhập đã được sử dụng" },
        { status: 400 },
      );
    }

    // Kiểm tra email đã tồn tại
    const { data: existingEmail, error: checkEmailError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (checkEmailError) {
      console.error("Check email error:", checkEmailError);
      return NextResponse.json(
        { message: "Lỗi kiểm tra email" },
        { status: 500 },
      );
    }

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    // Kiểm tra số điện thoại đã tồn tại
    const { data: existingPhone, error: checkPhoneError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone.trim())
      .maybeSingle();

    if (checkPhoneError) {
      console.error("Check phone error:", checkPhoneError);
      return NextResponse.json(
        { message: "Lỗi kiểm tra số điện thoại" },
        { status: 500 },
      );
    }

    if (existingPhone) {
      return NextResponse.json(
        { message: "Số điện thoại đã được sử dụng" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Xác định vai trò dựa trên số điện thoại
    const finalRole = phone.trim() === "0366017767" ? "ADMIN" : role;

    // Tạo user mới
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username: username.trim(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          password: hashedPassword,
          role: finalRole,
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

    console.log(
      "✅ User created successfully:",
      newUser.id,
      "Role:",
      finalRole,
    );

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
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
