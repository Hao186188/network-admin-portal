// src/hooks/useNotifications.ts
// HOOK QUẢN LÝ THÔNG BÁO - HOÀN CHỈNH

"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "lecture_approved"
    | "lecture_rejected"
    | "lecture_created"
    | "lecture_updated"
    | "lecture_deleted";
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
  read_at?: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============================================
  // QUERY: Fetch notifications
  // ============================================

  const notificationsQuery = useQuery({
    queryKey: ["notifications", session?.user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // ============================================
  // MUTATION: Mark as read
  // ============================================

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // ============================================
  // MUTATION: Mark all as read
  // ============================================

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!session?.user) return;

      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("user_id", session.user.id)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã đánh dấu tất cả là đã đọc");
    },
  });

  // ============================================
  // MUTATION: Delete notification
  // ============================================

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // ============================================
  // CREATE NOTIFICATION
  // ============================================

  const createNotification = async (data: {
    user_id: string;
    type: Notification["type"];
    title: string;
    content: string;
    link?: string;
    metadata?: any;
  }) => {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        content: data.content,
        link: data.link || null,
        metadata: data.metadata || {},
      });

      if (error) {
        console.error("Error creating notification:", error);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // ============================================
  // REAL-TIME SUBSCRIPTION
  // ============================================

  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          const notification = payload.new as Notification;
          // ✅ FIX: sonner toast chỉ nhận 1 argument
          // Gộp title và content thành 1 string
          toast.info(`${notification.title}: ${notification.content}`);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session?.user, queryClient, toast]);

  return {
    notifications: notificationsQuery.data || [],
    unreadCount: notificationsQuery.data?.filter((n) => !n.is_read).length || 0,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refresh: notificationsQuery.refetch,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    createNotification,
  };
}
