// src/lib/auth.ts
// HOÀN CHỈNH - THÊM CORS SUPPORT

import { supabase } from "@/lib/db/supabase-client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function sanitizeIdentifier(input: string): string {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9@._-]/g, "")
    .slice(0, 100);
}

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

          const sanitizedIdentifier = sanitizeIdentifier(
            credentials.identifier,
          );

          if (!sanitizedIdentifier) {
            throw new Error("Tên đăng nhập không hợp lệ");
          }

          const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .or(
              `email.ilike.%${sanitizedIdentifier}%,username.ilike.%${sanitizedIdentifier}%`,
            );

          if (error) {
            console.error("❌ Supabase error:", error);
            throw new Error("Lỗi kết nối database");
          }

          const user = users?.[0];

          if (!user) {
            throw new Error("Email/Tên đăng nhập không tồn tại");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Mật khẩu không đúng");
          }

          console.log("✅ [Auth] User logged in:", {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || "STUDENT",
          });

          return {
            id: user.id,
            name: user.name || user.full_name || "User",
            email: user.email,
            username: user.username || "",
            role: user.role || "STUDENT",
            phone: user.phone || "",
            student_id: user.student_id || "",
            image: user.avatar || user.image || "",
          };
        } catch (error: any) {
          console.error("❌ Auth error:", error);
          throw new Error(error.message || "Đăng nhập thất bại");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username || "";
        token.role = user.role || "STUDENT";
        token.phone = user.phone || "";
        token.student_id = user.student_id || "";
        token.picture = user.image || "";

        console.log("🔄 [JWT] Initial token set with role:", token.role);
      }

      if (trigger === "update" && session?.user) {
        console.log("🔄 [JWT] Updating session with new data:", session.user);
        if (session.user.role) {
          token.role = session.user.role;
        }
        if (session.user.name) {
          token.name = session.user.name;
        }
        if (session.user.username) {
          token.username = session.user.username;
        }
        if (session.user.image) {
          token.picture = session.user.image;
        }
        console.log("🔄 [JWT] Token updated with role:", token.role);
      }

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

        console.log("🔄 [Session] Updated session with role:", {
          id: session.user.id,
          username: session.user.username,
          role: session.user.role,
        });
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // ✅ Cho phép redirect đến các URL hợp lệ
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // ✅ THÊM CORS CONFIG
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
