// src/components/common/session-checker.tsx
// Vai trò: Kiểm tra session - CHỈ RENDER KHI DEVELOPMENT

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const isDev = process.env.NODE_ENV === "development";

export function SessionChecker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (isDev) {
      console.log("🔍 Session Checker:", {
        status,
        hasSession: !!session,
        user: session?.user?.email || "No user",
      });
    }
  }, [session, status]);

  if (!isDev) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-2 rounded-lg text-xs">
      <span
        className={
          status === "authenticated" ? "text-green-400" : "text-red-400"
        }
      >
        {status === "authenticated" ? "🟢" : "🔴"} {status}
      </span>
    </div>
  );
}
