// src/app/(routes)/admin/hooks/useAdminUsers.ts
// HOÀN CHỈNH - UPDATE SESSION SAU KHI ĐỔI ROLE

"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminStats, AdminUser } from "../types";

export function useAdminUsers() {
  const { toast } = useToast();
  const { data: session, update } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const fetchUsers = useCallback(async () => {
    if (hasFetched.current) {
      console.log("⏭️ Already fetched, skipping...");
      return;
    }

    console.log("🔄 [useAdminUsers] Fetching users...");
    hasFetched.current = true;
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("📊 Users data:", data?.length || 0, "users");

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log("✅ Users fetched successfully:", data?.length || 0);

      if (isMounted.current) {
        setUsers(data || []);
        setLoading(false);
        setError(null);
      }
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      if (isMounted.current) {
        setError(err.message || "Không thể tải danh sách người dùng");
        setUsers([]);
        setLoading(false);
        toast.error("Không thể tải danh sách người dùng");
      }
    }
  }, [toast]);

  useEffect(() => {
    console.log("🔧 [useAdminUsers] Mounted");
    isMounted.current = true;
    fetchUsers();

    return () => {
      console.log("🔧 [useAdminUsers] Unmounted");
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    console.log("🔄 [useAdminUsers] Refresh called");
    hasFetched.current = false;
    setLoading(true);
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(
    async (id: string, data: Partial<AdminUser>) => {
      try {
        // ✅ Tạo object update với các field hợp lệ
        const updateData: any = {
          ...data,
          updated_at: new Date().toISOString(),
        };

        // ✅ Nếu bio không có trong data, không update
        if (data.bio === undefined) {
          delete updateData.bio;
        }

        const { error } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", id);

        if (error) throw error;

        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, ...data, updated_at: new Date().toISOString() }
              : u,
          ),
        );

        toast.success("Cập nhật thông tin thành công!");
        return true;
      } catch (err: any) {
        toast.error(err.message || "Có lỗi xảy ra khi cập nhật");
        return false;
      }
    },
    [toast],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) throw error;

        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("Đã xóa tài khoản");
        return true;
      } catch (err: any) {
        toast.error(err.message || "Có lỗi xảy ra khi xóa");
        return false;
      }
    },
    [toast],
  );

  // ✅ Đổi role - QUAN TRỌNG: UPDATE SESSION
  const changeRole = useCallback(
    async (id: string, role: string) => {
      try {
        console.log(
          `🔄 [useAdminUsers] Changing role for user ${id} to ${role}`,
        );

        // ✅ 1. Update role trong database
        const { error } = await supabase
          .from("users")
          .update({
            role: role as "ADMIN" | "TEACHER" | "STUDENT",
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;

        // ✅ 2. Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  role: role as "ADMIN" | "TEACHER" | "STUDENT",
                  updated_at: new Date().toISOString(),
                }
              : u,
          ),
        );

        // ✅ 3. QUAN TRỌNG: Nếu đổi role cho chính mình, update session
        if (session?.user?.id === id) {
          console.log(
            `🔄 [useAdminUsers] Updating own session from ${session.user.role} to ${role}`,
          );

          // Update session với role mới
          await update({
            user: {
              ...session.user,
              role: role,
            },
          });

          console.log(`✅ [useAdminUsers] Session updated to role: ${role}`);

          // Force reload để navbar cập nhật
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          // Nếu đổi role cho user khác, vẫn update session để refresh token
          await update();
        }

        toast.success(`Đã chuyển vai trò thành ${role}`);
        return true;
      } catch (err: any) {
        console.error("❌ [useAdminUsers] Error changing role:", err);
        toast.error(err.message || "Có lỗi xảy ra khi thay đổi vai trò");
        return false;
      }
    },
    [toast, update, session],
  );

  const getStats = useCallback((): AdminStats => {
    return {
      totalUsers: users.length,
      totalAdmins: users.filter((u) => u.role === "ADMIN").length,
      totalTeachers: users.filter((u) => u.role === "TEACHER").length,
      totalStudents: users.filter((u) => u.role === "STUDENT").length,
      activeUsers: users.length,
      newUsers: users.filter(
        (u) =>
          new Date(u.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).length,
    };
  }, [users]);

  return {
    users,
    loading,
    error,
    refresh,
    updateUser,
    deleteUser,
    changeRole,
    getStats,
  };
}
