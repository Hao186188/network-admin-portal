// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: API route cho NextAuth

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

