// src/lib/auth.ts
// Vai trò: Cấu hình xác thực NextAuth

import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db/json-db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Vui lòng nhập đầy đủ thông tin");
          }

          const user = await db.findUserByEmail(credentials.email);

          if (!user || !user.password) {
            throw new Error("Email hoặc mật khẩu không đúng");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Email hoặc mật khẩu không đúng");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  // TẮT DEBUG để không log quá nhiều
  debug: false,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
