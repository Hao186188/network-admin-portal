// src/app/api/auth/[...nextauth]/route.ts
// Vai trò: NextAuth API route

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

