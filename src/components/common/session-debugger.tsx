// src/components/common/session-debugger.tsx
// Vai trò: Debug session

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionDebugger() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔄 SessionDebugger:", {
      status,
      hasSession: !!session,
      user: session?.user?.email,
      role: session?.user?.role,
      fullSession: session,
    });
  }, [session, status]);

  return null;
}
