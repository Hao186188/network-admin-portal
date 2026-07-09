// src/app/api/auth/register/route.ts
// Vai trò: API đăng ký - FIXED

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// ✅ Lấy admin phone từ environment variable
const ADMIN_PHONE = process.env.ADMIN_PHONE || "0366017767";

// ✅ Helper function cho error responses
function sendErrorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, email, phone, password } = body;

    // Validate input
    if (!username || !name || !email || !phone || !password) {
      return sendErrorResponse("Vui lòng điền đầy đủ thông tin", 400);
    }

    if (password.length < 6) {
      return sendErrorResponse("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendErrorResponse("Email không hợp lệ", 400);
    }

    // Phone format validation (Vietnam)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phone.trim())) {
      return sendErrorResponse("Số điện thoại không hợp lệ", 400);
    }

    // Kiểm tra username
    const { data: existingUsername, error: checkUsernameError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username.trim())
      .maybeSingle();

    if (checkUsernameError) {
      logger.error("Check username error:", checkUsernameError);
      return sendErrorResponse("Lỗi kiểm tra tên đăng nhập", 500);
    }

    if (existingUsername) {
      return sendErrorResponse("Tên đăng nhập đã được sử dụng", 400);
    }

    // Kiểm tra email
    const { data: existingEmail, error: checkEmailError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (checkEmailError) {
      logger.error("Check email error:", checkEmailError);
      return sendErrorResponse("Lỗi kiểm tra email", 500);
    }

    if (existingEmail) {
      return sendErrorResponse("Email đã được sử dụng", 400);
    }

    // Kiểm tra số điện thoại
    const { data: existingPhone, error: checkPhoneError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone.trim())
      .maybeSingle();

    if (checkPhoneError) {
      logger.error("Check phone error:", checkPhoneError);
      return sendErrorResponse("Lỗi kiểm tra số điện thoại", 500);
    }

    if (existingPhone) {
      return sendErrorResponse("Số điện thoại đã được sử dụng", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Xác định vai trò từ env variable
    const finalRole = phone.trim() === ADMIN_PHONE ? "ADMIN" : "STUDENT";

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
      logger.error("Insert user error:", insertError);
      return sendErrorResponse("Lỗi tạo tài khoản", 500);
    }

    logger.log("✅ User created:", newUser.id, "Role:", finalRole);

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
    logger.error("Register error:", error);
    return sendErrorResponse("Có lỗi xảy ra khi đăng ký", 500);
  }
}
