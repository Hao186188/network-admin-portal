// src/app/api/auth/register/route.ts
// API ĐĂNG KÝ - HOÀN CHỈNH

import { supabaseAdmin } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const ADMIN_PHONE = process.env.ADMIN_PHONE || "0366017767";

export async function POST(request: Request) {
  console.log("🚀 ===== START REGISTER API =====");

  try {
    const body = await request.json();
    console.log("📝 Request body:", { ...body, password: "***" });

    const { username, name, email, phone, password } = body;

    // Validate input
    if (!username || !name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 },
      );
    }

    // Phone format validation (Vietnam)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { success: false, message: "Số điện thoại không hợp lệ" },
        { status: 400 },
      );
    }

    // ✅ DÙNG SUPABASEADMIN ĐỂ BYPASS RLS
    const adminClient = supabaseAdmin;

    // Kiểm tra username
    const { data: existingUsername } = await adminClient
      .from("users")
      .select("username")
      .eq("username", username.trim())
      .maybeSingle();

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Tên đăng nhập đã được sử dụng" },
        { status: 400 },
      );
    }

    // Kiểm tra email
    const { data: existingEmail } = await adminClient
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    // Kiểm tra số điện thoại
    const { data: existingPhone } = await adminClient
      .from("users")
      .select("phone")
      .eq("phone", phone.trim())
      .maybeSingle();

    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Số điện thoại đã được sử dụng" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Xác định role
    const finalRole = phone.trim() === ADMIN_PHONE ? "ADMIN" : "STUDENT";
    console.log("🔑 Role assigned:", finalRole);

    // ✅ Tạo user với supabaseAdmin
    const userData = {
      username: username.trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: finalRole,
      is_verified: false,
      reputation: 0,
      total_lectures: 0,
      total_likes_received: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newUser, error: insertError } = await adminClient
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert error:", insertError);

      if (insertError.code === "23505") {
        return NextResponse.json(
          { success: false, message: "Thông tin đã tồn tại trong hệ thống" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Lỗi tạo tài khoản: ${insertError.message}`,
          code: insertError.code,
        },
        { status: 500 },
      );
    }

    console.log("✅ User created successfully:", newUser.id);

    return NextResponse.json(
      {
        success: true,
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
  } catch (error: any) {
    console.error("❌ Register error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Có lỗi xảy ra khi đăng ký" },
      { status: 500 },
    );
  }
}
