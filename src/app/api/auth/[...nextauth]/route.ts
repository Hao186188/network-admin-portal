// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: NextAuth API route - FIX ERROR

// QUAN TRỌNG: Ép buộc route này luôn chạy động, không bị cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// Không override GET/POST, để NextAuth tự xử lý
export { handler as GET, handler as POST };

