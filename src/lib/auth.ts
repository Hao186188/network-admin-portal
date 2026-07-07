// src/lib/auth.ts
// Vai trò: Cấu hình NextAuth - FIX LỖI TYPE

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Vui lòng nhập email/tên đăng nhập và mật khẩu");
          }

          // Tìm user theo email hoặc username
          const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .or(
              `email.ilike.${credentials.identifier.trim()},username.ilike.${credentials.identifier.trim()}`,
            );

          if (error) {
            console.error("❌ Supabase error:", error);
            throw new Error("Lỗi kết nối database");
          }

          const user = users?.[0];

          if (!user) {
            console.log("❌ User not found:", credentials.identifier);
            throw new Error("Email/Tên đăng nhập không tồn tại");
          }

          // Kiểm tra mật khẩu
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            console.log("❌ Invalid password for:", credentials.identifier);
            throw new Error("Mật khẩu không đúng");
          }

          console.log("✅ Login successful:", user.email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || "",
            username: user.username || "",
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username || "";
        token.email = user.email || "";
        token.name = user.name || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = (token.username as string) || "";
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
