// src/components/common/session-checker.tsx
// Vai trò: Debug session - CHỈ DÙNG CHO DEVELOPMENT

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionChecker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔄 SessionChecker:", {
      status,
      hasSession: !!session,
      user: session?.user,
      email: session?.user?.email,
      role: session?.user?.role,
    });
  }, [session, status]);

  return null;
}
