// src/app/api/auth/register/route.ts
// Vai trò: API đăng ký tài khoản

import db from "@/lib/db/json-db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 },
      );
    }

    const existingUser = await db.findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      image: "",
      studentId: "",
      bio: "",
    });

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng ký" },
      { status: 500 },
    );
  }
}
