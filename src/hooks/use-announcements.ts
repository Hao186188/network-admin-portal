// src/hooks/use-announcements.ts
// Vai trò: Hook quản lý announcements - FIXED

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

export interface AnnouncementComment {
  id: string;
  announcement_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useAnnouncements() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchedRef = useRef(false);
  const fetchingRef = useRef(false);

  // ============================================
  // FETCH ANNOUNCEMENTS
  // ============================================

  const fetchAnnouncements = useCallback(
    async (pageNum: number = 0, limit: number = 10) => {
      if (fetchingRef.current || fetchedRef.current) {
        return;
      }

      try {
        fetchingRef.current = true;
        setLoading(true);
        setError(null);

        const from = pageNum * limit;
        const to = from + limit - 1;

        const {
          data,
          error: fetchError,
          count,
        } = await supabase
          .from("announcements")
          .select("*", { count: "exact" })
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;

        if (pageNum === 0) {
          setAnnouncements(data || []);
        } else {
          setAnnouncements((prev) => [...prev, ...(data || [])]);
        }

        setTotal(count || 0);
        setHasMore((data?.length || 0) === limit);
        fetchedRef.current = true;
      } catch (error: any) {
        console.error("Error fetching announcements:", error);
        setError(error.message || "Có lỗi xảy ra");
        if (error.message?.includes("relation")) {
          setAnnouncements([]);
          setTotal(0);
        }
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchedRef.current = false;
    fetchingRef.current = false;
    fetchAnnouncements(0);
  }, []);

  // ============================================
  // GET DETAIL
  // ============================================

  const getAnnouncementDetail = useCallback(
    async (id: string) => {
      if (!id) {
        console.error("❌ No ID provided");
        return null;
      }

      try {
        console.log(`📥 Fetching detail: ${id}`);

        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("❌ Detail error:", {
            message: error.message || "No message",
            code: error.code || "No code",
            details: error.details || "No details",
            hint: error.hint || "No hint",
          });

          if (error.code === "PGRST116") {
            console.warn(`⚠️ No announcement found with id: ${id}`);
            return null;
          }
          throw error;
        }

        if (!data) {
          console.warn(`⚠️ No data for id: ${id}`);
          return null;
        }

        console.log(`✅ Detail fetched: ${data.title}`);

        // Tăng lượt xem
        try {
          await supabase
            .from("announcements")
            .update({ views: (data.views || 0) + 1 })
            .eq("id", id);
          console.log(`📊 Views updated for ${id}`);
        } catch (updateError: any) {
          console.error("Error updating views:", updateError);
        }

        return data as Announcement;
      } catch (error: any) {
        console.error("Error fetching detail:", {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        toast.error(error.message || "Không thể tải chi tiết thông báo");
        return null;
      }
    },
    [toast],
  );

  // ============================================
  // CREATE ANNOUNCEMENT
  // ============================================

  const createAnnouncement = useCallback(
    async (data: Partial<Announcement>) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      if (!data.title?.trim()) {
        toast.error("Vui lòng nhập tiêu đề");
        return null;
      }
      if (!data.content?.trim()) {
        toast.error("Vui lòng nhập nội dung");
        return null;
      }

      try {
        const insertData = {
          title: data.title.trim(),
          content: data.content.trim(),
          priority: data.priority || "medium",
          pinned: data.pinned || false,
          category: data.category || "Thông báo",
          author: session.user.name || "Admin",
          views: 0,
          comments: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("📝 Inserting announcement:", insertData);

        const { data: newAnnouncement, error } = await supabase
          .from("announcements")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;

        setAnnouncements((prev) => [newAnnouncement, ...prev]);
        toast.success("Tạo thông báo thành công");
        return newAnnouncement;
      } catch (error: any) {
        console.error("Error creating announcement:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tạo thông báo");
        return null;
      }
    },
    [session, toast],
  );

  // ============================================
  // ✅ TOGGLE LIKE - KHÔNG CẬP NHẬT STATE TRONG HOOK
  // ============================================

  const toggleLike = useCallback(
    async (announcementId: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      try {
        console.log(`📝 Toggling like for: ${announcementId}`);

        // Kiểm tra đã like chưa
        const { data: existingLike, error: checkError } = await supabase
          .from("announcement_likes")
          .select("*")
          .eq("announcement_id", announcementId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (checkError) {
          console.error("❌ Check like error:", checkError);
          throw checkError;
        }

        if (existingLike) {
          // Bỏ like
          console.log("📝 Removing like");
          const { error: deleteError } = await supabase
            .from("announcement_likes")
            .delete()
            .eq("announcement_id", announcementId)
            .eq("user_id", session.user.id);

          if (deleteError) {
            console.error("❌ Delete like error:", deleteError);
            throw deleteError;
          }

          toast.success("Đã bỏ thích");
          return { liked: false };
        } else {
          // Thêm like
          console.log("📝 Adding like");
          const { error: insertError } = await supabase
            .from("announcement_likes")
            .insert({
              announcement_id: announcementId,
              user_id: session.user.id,
            });

          if (insertError) {
            console.error("❌ Insert like error:", insertError);

            if (insertError.message?.includes("row-level security")) {
              toast.error("Bạn không có quyền thích bài viết");
              return null;
            }

            throw insertError;
          }

          toast.success("Đã thích bài viết");
          return { liked: true };
        }
      } catch (error: any) {
        console.error("Error toggling like:", error);
        toast.error(error.message || "Có lỗi xảy ra");
        return null;
      }
    },
    [session, toast],
  );

  // ============================================
  // CHECK USER LIKED
  // ============================================

  const checkUserLiked = useCallback(
    async (announcementId: string) => {
      if (!session?.user) return false;

      try {
        const { data } = await supabase
          .from("announcement_likes")
          .select("*")
          .eq("announcement_id", announcementId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        return !!data;
      } catch (error) {
        console.error("Error checking like:", error);
        return false;
      }
    },
    [session],
  );

  // ============================================
  // GET COMMENTS
  // ============================================

  const getComments = useCallback(
    async (announcementId: string) => {
      try {
        const { data, error } = await supabase
          .from("announcement_comments")
          .select("*")
          .eq("announcement_id", announcementId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("❌ Comments error:", error);
          throw error;
        }
        return data as AnnouncementComment[];
      } catch (error: any) {
        console.error("Error fetching comments:", error);
        toast.error(error.message || "Không thể tải bình luận");
        return [];
      }
    },
    [toast],
  );

  // ============================================
  // ADD COMMENT
  // ============================================

  const addComment = useCallback(
    async (announcementId: string, content: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      if (!content.trim()) {
        toast.error("Vui lòng nhập nội dung bình luận");
        return null;
      }

      try {
        console.log(`📝 Adding comment for: ${announcementId}`);

        const { data: announcement, error: checkError } = await supabase
          .from("announcements")
          .select("id")
          .eq("id", announcementId)
          .single();

        if (checkError || !announcement) {
          toast.error("Bài viết không tồn tại");
          return null;
        }

        const commentData = {
          announcement_id: announcementId,
          user_id: session.user.id,
          user_name: session.user.name || "Người dùng",
          user_avatar: session.user.image || "",
          content: content.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: newComment, error } = await supabase
          .from("announcement_comments")
          .insert(commentData)
          .select()
          .single();

        if (error) {
          console.error("❌ Insert comment error:", error);

          if (error.message?.includes("row-level security")) {
            toast.error("Bạn không có quyền bình luận");
            return null;
          }

          throw error;
        }

        toast.success("Bình luận thành công");
        return newComment;
      } catch (error: any) {
        console.error("Error adding comment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi bình luận");
        return null;
      }
    },
    [session, toast],
  );

  // ============================================
  // DELETE COMMENT
  // ============================================

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      try {
        const { error } = await supabase
          .from("announcement_comments")
          .delete()
          .eq("id", commentId)
          .eq("user_id", session.user.id);

        if (error) throw error;

        toast.success("Xóa bình luận thành công");
        return true;
      } catch (error: any) {
        console.error("Error deleting comment:", error);
        toast.error(error.message || "Có lỗi xảy ra");
        return false;
      }
    },
    [session, toast],
  );

  // ============================================
  // DELETE ANNOUNCEMENT
  // ============================================

  const deleteAnnouncement = useCallback(
    async (id: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      try {
        const { error } = await supabase
          .from("announcements")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        toast.success("Xóa thông báo thành công");
        return true;
      } catch (error: any) {
        console.error("Error deleting announcement:", error);
        toast.error(error.message || "Có lỗi xảy ra");
        return false;
      }
    },
    [session?.user, toast],
  );

  // ============================================
  // REFRESH
  // ============================================

  const refresh = useCallback(() => {
    fetchedRef.current = false;
    fetchingRef.current = false;
    setAnnouncements([]);
    setHasMore(true);
    setLoading(true);
    fetchAnnouncements(0);
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    total,
    hasMore,
    fetchAnnouncements,
    getAnnouncementDetail,
    createAnnouncement,
    toggleLike,
    checkUserLiked,
    getComments,
    addComment,
    deleteComment,
    deleteAnnouncement,
    refresh,
  };
}
