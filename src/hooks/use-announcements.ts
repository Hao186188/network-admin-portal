// src/hooks/use-announcements.ts
// Vai trò: Hook quản lý thông báo - SỬ DỤNG RPC

import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  category: string;
  author: string;
  author_id?: string | null;
  views: number;
  comments: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export function useAnnouncements() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Không thể tải danh sách thông báo");
        return;
      }

      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const getAnnouncementDetail = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching announcement detail:", error);
        return null;
      }

      return data as Announcement;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { error } = await supabase.rpc("increment_announcement_views", {
        p_announcement_id: id,
      });

      if (error) {
        console.error("Error incrementing views:", error);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  // SỬ DỤNG RPC THAY VÌ INSERT/DELETE TRỰC TIẾP
  const toggleLike = async (announcementId: string, userId: string) => {
    try {
      console.log("📝 Toggling like via RPC:", { announcementId, userId });

      const { data, error } = await supabase.rpc("toggle_announcement_like", {
        p_announcement_id: announcementId,
        p_user_id: userId,
      });

      if (error) {
        console.error("RPC error:", error);
        throw error;
      }

      console.log("RPC result:", data);

      if (data && data.success) {
        // Cập nhật local state
        setAnnouncements((prev) =>
          prev.map((item) =>
            item.id === announcementId
              ? {
                  ...item,
                  likes:
                    parseInt(data.likes) ||
                    item.likes + (data.action === "like" ? 1 : -1),
                }
              : item,
          ),
        );
        return data.action === "like";
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  const toggleSave = async (announcementId: string, userId: string) => {
    try {
      console.log("📝 Toggling save via RPC:", { announcementId, userId });

      const { data, error } = await supabase.rpc("toggle_announcement_save", {
        p_announcement_id: announcementId,
        p_user_id: userId,
      });

      if (error) {
        console.error("RPC error:", error);
        throw error;
      }

      console.log("RPC result:", data);
      return data && data.success;
    } catch (error: any) {
      console.error("Error toggling save:", error);
      throw error;
    }
  };

  const addComment = async (
    announcementId: string,
    userId: string,
    content: string,
  ) => {
    try {
      console.log("📝 Adding comment via RPC:", {
        announcementId,
        userId,
        content,
      });

      const { data, error } = await supabase.rpc("add_announcement_comment", {
        p_announcement_id: announcementId,
        p_user_id: userId,
        p_content: content,
      });

      if (error) {
        console.error("RPC error:", error);
        throw error;
      }

      console.log("RPC result:", data);

      if (data && data.success) {
        // Cập nhật local state
        setAnnouncements((prev) =>
          prev.map((item) =>
            item.id === announcementId
              ? { ...item, comments: item.comments + 1 }
              : item,
          ),
        );
        return data.comment;
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string, userId: string) => {
    try {
      console.log("📝 Deleting comment via RPC:", { commentId, userId });

      const { data, error } = await supabase.rpc(
        "delete_announcement_comment",
        {
          p_comment_id: commentId,
          p_user_id: userId,
        },
      );

      if (error) {
        console.error("RPC error:", error);
        throw error;
      }

      console.log("RPC result:", data);
      return data && data.success;
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  const createAnnouncement = async (data: {
    title: string;
    content: string;
    priority: "high" | "medium" | "low";
    pinned: boolean;
    category: string;
    author: string;
    author_id?: string | null;
  }) => {
    try {
      const { data: result, error } = await supabase
        .from("announcements")
        .insert({
          title: data.title,
          content: data.content,
          priority: data.priority,
          pinned: data.pinned,
          category: data.category,
          author: data.author,
          author_id: data.author_id,
          views: 0,
          comments: 0,
          likes: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAnnouncements();
      return result;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    refresh: fetchAnnouncements,
    getAnnouncementDetail,
    incrementViews,
    toggleLike,
    toggleSave,
    addComment,
    deleteComment,
    createAnnouncement,
    deleteAnnouncement,
  };
}
