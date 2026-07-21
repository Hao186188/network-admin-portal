// src/components/common/RoleSync.tsx
// Sync session role vào Zustand store

"use client";

import { useRoleStore } from "@/store/useRoleStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function RoleSync() {
  const { data: session } = useSession();
  const { setRole, setCanManage } = useRoleStore();

  useEffect(() => {
    const role = session?.user?.role?.toUpperCase() || "STUDENT";
    setRole(role);
    setCanManage(role === "ADMIN" || role === "TEACHER");
  }, [session?.user?.role, setRole, setCanManage]);

  return null;
}
