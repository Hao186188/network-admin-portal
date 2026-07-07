// src/lib/auth.ts
// Vai trò: Cấu hình NextAuth - FIX COOKIE

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

          console.log("🔍 Searching for user:", credentials.identifier);

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

          console.log("✅ User found:", user.email);

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
            name: user.name || "User",
            email: user.email,
            username: user.username || "",
            role: user.role || "STUDENT",
            phone: user.phone || "",
            student_id: user.student_id || "",
            image: user.image || "",
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
        token.name = user.name;
        token.email = user.email;
        token.username = user.username || "";
        token.role = user.role || "STUDENT";
        token.phone = user.phone || "";
        token.student_id = user.student_id || "";
        token.picture = user.image || "";
      }
      console.log("🔑 JWT token updated:", token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.username = (token.username as string) || "";
        session.user.role = (token.role as string) || "STUDENT";
        session.user.phone = (token.phone as string) || "";
        session.user.student_id = (token.student_id as string) || "";
        session.user.image = (token.picture as string) || "";
      }
      console.log("📝 Session created:", session.user?.email);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Cấu hình cookie để tránh xung đột
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.callback-url`
          : `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Host-next-auth.csrf-token`
          : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
