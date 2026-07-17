// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: NextAuth API route - HOÀN CHỈNH

export const dynamic = "force-dynamic";

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// ✅ Tạo handler
const handler = NextAuth(authOptions);

// ✅ Export tất cả methods
export { handler as GET, handler as POST };

