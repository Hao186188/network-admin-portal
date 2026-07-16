// src/hooks/use-notifications.ts
// Vai trò: Hook quản lý thông báo - REALTIME BẬT

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type:
    | "assignment"
    | "announcement"
    | "submission"
    | "grade"
    | "course"
    | "default";
  link?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const channelRef = useRef<any>(null);
  const channelIdRef = useRef(
    `notifications-realtime-${Math.random().toString(36).substring(2, 9)}`,
  );

  const fetchNotifications = useCallback(
    async (force?: boolean) => {
      if (isFetchingRef.current) return;
      if (initialFetchDoneRef.current && !force) return;
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          if (
            fetchError.message?.includes("relation") ||
            fetchError.code === "42P01"
          ) {
            setNotifications([]);
            setUnreadCount(0);
          } else {
            throw fetchError;
          }
        } else {
          setNotifications(data || []);
          setUnreadCount((data || []).filter((n) => !n.read).length);
        }

        initialFetchDoneRef.current = true;
      } catch (error: any) {
        logger.error("Error fetching notifications:", error);
        setError(error.message || "Không thể tải thông báo");
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [session?.user?.id],
  );

  // ✅ Effect cho fetch data - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    isFetchingRef.current = false;
    initialFetchDoneRef.current = false;
    setLoading(true);
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  // ✅ BẬT REALTIME
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }

    // First clean up existing channel before creating new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(channelIdRef.current)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        async (payload) => {
          console.log("Notification change received:", payload);
          // Refetch notifications when there is a change
          fetchNotifications(true);
          if (payload.eventType === "INSERT") {
            // Show a toast for new notifications
            const newNotification = payload.new as Notification;
            if (!newNotification.read) {
              toast.info(
                `${newNotification.title}: ${newNotification.message}`,
              );
            }
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [session?.user?.id, fetchNotifications, toast]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!session?.user?.id) return;

      try {
        const { error } = await supabase
          .from("notifications")
          .update({ read: true, updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) throw error;

        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        logger.error("Error marking notification as read:", error);
        toast.error("Không thể đánh dấu đã đọc");
      }
    },
    [session?.user?.id, toast],
  );

  const markAllAsRead = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq("user_id", session.user.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("Đã đánh dấu tất cả thông báo đã đọc");
    } catch (error) {
      logger.error("Error marking all notifications as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc");
    }
  }, [session?.user?.id, toast]);

  const deleteNotification = useCallback(
    async (id: string) => {
      if (!session?.user?.id) return;

      try {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) throw error;

        const deleted = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (deleted && !deleted.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        logger.error("Error deleting notification:", error);
        toast.error("Không thể xóa thông báo");
      }
    },
    [session?.user?.id, notifications, toast],
  );

  const refresh = useCallback(() => {
    isFetchingRef.current = false;
    initialFetchDoneRef.current = false;
    fetchNotifications(true);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
}
