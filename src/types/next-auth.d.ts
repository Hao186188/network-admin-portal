// src/types/next-auth.d.ts
// Vai trò: Type definitions for NextAuth

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      phone: string;
      student_id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    username: string;
    phone: string;
    student_id: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username: string;
    phone: string;
    student_id: string;
    picture?: string;
  }
}
