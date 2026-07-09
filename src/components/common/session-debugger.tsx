// src/components/common/session-debugger.tsx
// Vai trò: Debug session - CHỈ RENDER KHI DEVELOPMENT

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const isDev = process.env.NODE_ENV === "development";

export function SessionDebugger() {
  const { data: session, status } = useSession();

  // ✅ CHỈ LOG KHI DEVELOPMENT
  useEffect(() => {
    if (isDev) {
      console.log("🔐 Session Debug:", {
        status,
        session: session
          ? { ...session, user: { ...session.user, ...(session.user as any) } }
          : null,
      });
    }
  }, [session, status]);

  // ✅ CHỈ RENDER KHI DEVELOPMENT
  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-xl text-xs max-w-sm shadow-2xl border border-white/10">
      <div className="font-mono">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-bold">Session Debug</span>
        </div>
        <div className="space-y-1">
          <div>
            <span className="text-gray-400">Status:</span>{" "}
            <span className="text-yellow-400">{status}</span>
          </div>
          {session?.user && (
            <>
              <div>
                <span className="text-gray-400">User:</span>{" "}
                <span className="text-blue-400">{session.user.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Role:</span>{" "}
                <span className="text-purple-400">{session.user.role}</span>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>{" "}
                <span className="text-gray-400 text-[10px]">
                  {session.user.id}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
