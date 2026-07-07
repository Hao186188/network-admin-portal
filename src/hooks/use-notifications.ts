// src/hooks/use-notifications.ts
// Vai trò: Lấy và quản lý thông báo từ database - FIX LOGIC MOCK DATA

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "assignment" | "announcement" | "submission" | "grade";
  read: boolean;
  created_at: string;
  link?: string;
  user_id?: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "created_at">,
  ) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMockNotifications = useCallback(async () => {
    const mockNotifications: Notification[] = [];
    try {
      // Lấy từ announcements
      const { data: announcements } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      announcements?.forEach((item) => {
        mockNotifications.push({
          id: `ann-${item.id}`,
          title: "Thông báo mới",
          message: item.title,
          type: "announcement",
          read: false,
          created_at: item.created_at,
          link: "/announcements",
        });
      });

      // Lấy từ assignments
      const { data: assignments } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      assignments?.forEach((item) => {
        mockNotifications.push({
          id: `assign-${item.id}`,
          title: "Bài tập mới",
          message: item.title,
          type: "assignment",
          read: false,
          created_at: item.created_at,
          link: "/assignments",
        });
      });

      // Lấy từ submissions
      const { data: submissions } = await supabase
        .from("submissions")
        .select(`*, user:users(name), assignment:assignments(title)`)
        .order("created_at", { ascending: false })
        .limit(3);

      submissions?.forEach((item) => {
        mockNotifications.push({
          id: `sub-${item.id}`,
          title: item.status === "APPROVED" ? "Đã chấm điểm" : "Bài nộp mới",
          message: `${item.user?.name} đã nộp bài "${item.assignment?.title}"`,
          type: item.status === "APPROVED" ? "grade" : "submission",
          read: false,
          created_at: item.created_at,
          link: "/submissions",
        });
      });

      // Sắp xếp theo thời gian
      mockNotifications.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      return mockNotifications.filter((n) => n.read === false);
    } catch (err) {
      console.error("Error generating mock notifications:", err);
      return [];
    }
  }, []);

  const fetchNotifications = useCallback(
    async (silent: boolean = false) => {
      try {
        if (!silent) setLoading(true);
        setError(null);

        if (!supabase) {
          console.warn("Supabase client not initialized");
          setNotifications([]);
          setUnreadCount(0);
          if (!silent) setLoading(false);
          return;
        }

        // Lấy thông báo CHƯA ĐỌC từ bảng chính thức
        const { data: unreadData, error: unreadError } = await supabase
          .from("notifications")
          .select("*")
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(20);

        if (unreadError) {
          console.error("Supabase error:", unreadError);
          setError(unreadError.message);
          if (!silent) setLoading(false);
          return;
        }

        // SỬA LOGIC TẠI ĐÂY:
        // Nếu DB thực sự có thông báo chưa đọc -> Dùng dữ liệu DB
        if (unreadData && unreadData.length > 0) {
          setNotifications(unreadData);
          setUnreadCount(unreadData.length);
        } else {
          // Nếu DB trống, tạo mock data hiển thị đỡ trống trải (luôn giữ mock khi DB trống)
          const mockNotifications = await generateMockNotifications();
          setNotifications(mockNotifications);
          setUnreadCount(mockNotifications.length);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          err instanceof Error ? err.message : "Không thể tải thông báo",
        );
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [generateMockNotifications],
  );

  const addNotification = useCallback(
    async (notification: Omit<Notification, "id" | "read" | "created_at">) => {
      try {
        if (!supabase) return;

        const newNotification = {
          ...notification,
          read: false,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("notifications")
          .insert([newNotification])
          .select()
          .single();

        if (error) {
          console.error("Error adding notification:", error);
          return;
        }

        if (data && !data.read) {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error adding notification:", err);
      }
    },
    [],
  );

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        // Xóa ngay lập tức khỏi state để UI mượt
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => Math.max(0, prev - 1));

        if (!supabase) return;

        // Chỉ update DB nếu ID này không phải là mock ID
        if (
          !id.startsWith("ann-") &&
          !id.startsWith("assign-") &&
          !id.startsWith("sub-")
        ) {
          await supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id);
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
        await fetchNotifications(true);
      }
    },
    [fetchNotifications],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.map((n) => n.id);
      setNotifications([]);
      setUnreadCount(0);

      if (!supabase) return;

      // Lọc bỏ các mock ID trước khi gửi lên Supabase để tránh lỗi query
      const realIds = unreadIds.filter(
        (id) =>
          !id.startsWith("ann-") &&
          !id.startsWith("assign-") &&
          !id.startsWith("sub-"),
      );

      if (realIds.length > 0) {
        await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", realIds);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      await fetchNotifications(true);
    }
  }, [notifications, fetchNotifications]);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        if (!supabase) return;

        if (
          !id.startsWith("ann-") &&
          !id.startsWith("assign-") &&
          !id.startsWith("sub-")
        ) {
          await supabase.from("notifications").delete().eq("id", id);
        }
      } catch (err) {
        console.error("Error deleting notification:", err);
        await fetchNotifications(true);
      }
    },
    [fetchNotifications],
  );

  useEffect(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: () => fetchNotifications(true),
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
}
