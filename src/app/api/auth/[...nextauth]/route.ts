// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: API route cho NextAuth - QUAN TRỌNG: PHẢI ĐÚNG ĐƯỜNG DẪN

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

