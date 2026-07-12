// src/hooks/use-announcements.ts
// FIX - BỎ RPC, DÙNG UPDATE TRỰC TIẾP

"use client";

import {
  isServiceRoleEnabled,
  supabase,
  supabaseAdmin,
} from "@/lib/db/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
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
  downloads: number;
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
  const queryClient = useQueryClient();

  // ============================================
  // QUERY: Fetch all announcements
  // ============================================

  const announcementsQuery = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error);
        throw error;
      }
      return data as Announcement[];
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // ============================================
  // QUERY: Fetch single announcement
  // ============================================

  const useAnnouncement = (id: string) => {
    return useQuery({
      queryKey: ["announcement", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching announcement:", error);
          throw error;
        }
        return data as Announcement;
      },
      enabled: !!id,
      staleTime: 10 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    });
  };

  // ============================================
  // QUERY: Get like status
  // ============================================

  const useLikeStatus = (announcementId: string) => {
    return useQuery({
      queryKey: ["announcement-like", announcementId, session?.user?.id],
      queryFn: async () => {
        if (!session?.user) return false;

        const { data, error } = await supabase
          .from("announcement_likes")
          .select("id")
          .eq("announcement_id", announcementId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking like status:", error);
          return false;
        }
        return !!data;
      },
      enabled: !!announcementId && !!session?.user,
      staleTime: 30 * 1000,
    });
  };

  // ============================================
  // QUERY: Get comments
  // ============================================

  const useComments = (announcementId: string, limit: number = 50) => {
    return useQuery({
      queryKey: ["announcement-comments", announcementId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("announcement_comments")
          .select("*")
          .eq("announcement_id", announcementId)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Error fetching comments:", error);
          throw error;
        }
        return data as AnnouncementComment[];
      },
      enabled: !!announcementId,
      staleTime: 15 * 1000,
    });
  };

  // ============================================
  // MUTATION: Create announcement
  // ============================================

  const createAnnouncement = useMutation({
    mutationFn: async (data: Partial<Announcement>) => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const insertData = {
        title: data.title?.trim() || "Không có tiêu đề",
        content: data.content?.trim() || "Không có nội dung",
        priority: data.priority || "medium",
        pinned: data.pinned || false,
        category: data.category || "Thông báo",
        author: session.user.name || "Admin",
        author_id: session.user.id,
        views: 0,
        comments: 0,
        likes: 0,
        downloads: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newAnnouncement, error } = await client
        .from("announcements")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating announcement:", error);
        throw error;
      }
      return newAnnouncement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Tạo thông báo thành công");
    },
    onError: (error: any) => {
      console.error("Create announcement error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo thông báo");
    },
  });

  // ============================================
  // MUTATION: Toggle like - FIXED (không dùng RPC)
  // ============================================

  const toggleLike = useMutation({
    mutationFn: async (
      announcementId: string,
    ): Promise<{ liked: boolean; likeCount: number }> => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      // 1. Kiểm tra đã like chưa
      const { data: existingLike, error: checkError } = await client
        .from("announcement_likes")
        .select("id")
        .eq("announcement_id", announcementId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking like:", checkError);
        throw checkError;
      }

      let liked: boolean;
      let likeCount: number;

      // 2. Lấy số like hiện tại
      const { data: current, error: fetchError } = await client
        .from("announcements")
        .select("likes")
        .eq("id", announcementId)
        .single();

      if (fetchError) {
        console.error("Error fetching likes:", fetchError);
        throw fetchError;
      }

      const currentLikes = current?.likes || 0;

      if (existingLike) {
        // 3a. Unlike - Xóa like
        const { error: deleteError } = await client
          .from("announcement_likes")
          .delete()
          .eq("announcement_id", announcementId)
          .eq("user_id", session.user.id);

        if (deleteError) {
          console.error("Error deleting like:", deleteError);
          throw deleteError;
        }

        likeCount = Math.max(currentLikes - 1, 0);
        liked = false;

        // Cập nhật số like
        const { error: updateError } = await client
          .from("announcements")
          .update({ likes: likeCount })
          .eq("id", announcementId);

        if (updateError) {
          console.error("Error updating likes:", updateError);
          throw updateError;
        }
      } else {
        // 3b. Like - Thêm like
        const { error: insertError } = await client
          .from("announcement_likes")
          .insert({
            announcement_id: announcementId,
            user_id: session.user.id,
          });

        if (insertError) {
          console.error("Error inserting like:", insertError);
          throw insertError;
        }

        likeCount = currentLikes + 1;
        liked = true;

        // Cập nhật số like
        const { error: updateError } = await client
          .from("announcements")
          .update({ likes: likeCount })
          .eq("id", announcementId);

        if (updateError) {
          console.error("Error updating likes:", updateError);
          throw updateError;
        }
      }

      return { liked, likeCount };
    },
    onSuccess: (result, announcementId) => {
      // Update cache
      queryClient.setQueryData(
        ["announcement", announcementId],
        (old: any) => ({
          ...old,
          likes: result.likeCount,
        }),
      );

      queryClient.setQueryData(["announcements"], (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === announcementId) {
            return { ...item, likes: result.likeCount };
          }
          return item;
        });
      });

      queryClient.setQueryData(
        ["announcement-like", announcementId, session?.user?.id],
        result.liked,
      );
    },
    onError: (error: any) => {
      console.error("Toggle like error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi like");
    },
  });

  // ============================================
  // MUTATION: Add comment - FIXED
  // ============================================

  const addComment = useMutation({
    mutationFn: async ({
      announcementId,
      content,
    }: {
      announcementId: string;
      content: string;
    }): Promise<AnnouncementComment> => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");
      if (!content.trim())
        throw new Error("Nội dung bình luận không được để trống");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const commentData = {
        announcement_id: announcementId,
        user_id: session.user.id,
        user_name: session.user.name || "Người dùng",
        user_avatar: session.user.image || "",
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert comment
      const { data: newComment, error: insertError } = await client
        .from("announcement_comments")
        .insert(commentData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting comment:", insertError);
        throw insertError;
      }

      // Lấy số comment hiện tại
      const { data: current, error: fetchError } = await client
        .from("announcements")
        .select("comments")
        .eq("id", announcementId)
        .single();

      if (fetchError) {
        console.error("Error fetching comments:", fetchError);
        throw fetchError;
      }

      const newCount = (current?.comments || 0) + 1;

      // Cập nhật số comment
      const { error: updateError } = await client
        .from("announcements")
        .update({ comments: newCount })
        .eq("id", announcementId);

      if (updateError) {
        console.error("Error updating comments:", updateError);
        throw updateError;
      }

      return newComment;
    },
    onSuccess: (newComment, variables) => {
      // ✅ KHÔNG update comments cache trực tiếp
      // ✅ CHỈ invalidate để refetch
      queryClient.invalidateQueries({
        queryKey: ["announcement-comments", variables.announcementId],
      });

      // ✅ Invalidate single announcement để update comment count
      queryClient.invalidateQueries({
        queryKey: ["announcement", variables.announcementId],
      });

      // ✅ Invalidate list
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });

      toast.success("Bình luận thành công");
    },
    onError: (error: any) => {
      console.error("Add comment error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi bình luận");
    },
  });

  // ============================================
  // MUTATION: Delete comment
  // ============================================

  const deleteComment = useMutation({
    mutationFn: async ({
      commentId,
      announcementId,
    }: {
      commentId: string;
      announcementId: string;
    }): Promise<boolean> => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      // Delete comment
      const { error: deleteError } = await client
        .from("announcement_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", session.user.id);

      if (deleteError) {
        console.error("Error deleting comment:", deleteError);
        throw deleteError;
      }

      // Lấy số comment hiện tại
      const { data: current, error: fetchError } = await client
        .from("announcements")
        .select("comments")
        .eq("id", announcementId)
        .single();

      if (fetchError) {
        console.error("Error fetching comments:", fetchError);
        throw fetchError;
      }

      const newCount = Math.max((current?.comments || 0) - 1, 0);

      // Cập nhật số comment
      const { error: updateError } = await client
        .from("announcements")
        .update({ comments: newCount })
        .eq("id", announcementId);

      if (updateError) {
        console.error("Error updating comments:", updateError);
        throw updateError;
      }

      return true;
    },
    onSuccess: (data, variables) => {
      // ✅ KHÔNG update comments cache trực tiếp
      // ✅ CHỈ invalidate để refetch
      queryClient.invalidateQueries({
        queryKey: ["announcement-comments", variables.announcementId],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcement", variables.announcementId],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });

      toast.success("Xóa bình luận thành công");
    },
    onError: (error: any) => {
      console.error("Delete comment error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa bình luận");
    },
  });

  // ============================================
  // MUTATION: Increment view
  // ============================================

  const incrementView = useMutation({
    mutationFn: async (id: string): Promise<{ id: string; views: number }> => {
      const viewKey = `viewed_announcement_${id}`;
      if (sessionStorage.getItem(viewKey)) {
        const { data, error } = await supabase
          .from("announcements")
          .select("views")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching views:", error);
          throw error;
        }
        return { id, views: data?.views || 0 };
      }

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      // Lấy số view hiện tại
      const { data: current, error: fetchError } = await client
        .from("announcements")
        .select("views")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching views:", fetchError);
        throw fetchError;
      }

      const newViews = (current?.views || 0) + 1;

      // Cập nhật số view
      const { error: updateError } = await client
        .from("announcements")
        .update({ views: newViews })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating views:", updateError);
        throw updateError;
      }

      sessionStorage.setItem(viewKey, "true");

      return { id, views: newViews };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["announcement", data.id], (old: any) => ({
        ...old,
        views: data.views,
      }));

      queryClient.setQueryData(["announcements"], (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === data.id) {
            return { ...item, views: data.views };
          }
          return item;
        });
      });
    },
    onError: (error: any) => {
      console.error("Increment view error:", error);
    },
  });

  // ============================================
  // MUTATION: Increment download
  // ============================================

  const incrementDownload = useMutation({
    mutationFn: async (
      id: string,
    ): Promise<{ id: string; downloads: number }> => {
      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      // Lấy số download hiện tại
      const { data: current, error: fetchError } = await client
        .from("announcements")
        .select("downloads")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching downloads:", fetchError);
        throw fetchError;
      }

      const newDownloads = (current?.downloads || 0) + 1;

      // Cập nhật số download
      const { error: updateError } = await client
        .from("announcements")
        .update({ downloads: newDownloads })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating downloads:", updateError);
        throw updateError;
      }

      return { id, downloads: newDownloads };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["announcement", data.id], (old: any) => ({
        ...old,
        downloads: data.downloads,
      }));

      queryClient.setQueryData(["announcements"], (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === data.id) {
            return { ...item, downloads: data.downloads };
          }
          return item;
        });
      });
    },
    onError: (error: any) => {
      console.error("Increment download error:", error);
      toast.error("Có lỗi xảy ra khi tải xuống");
    },
  });

  // ============================================
  // Auto increment view hook
  // ============================================

  const useAutoIncrementView = (announcementId: string | undefined) => {
    const hasIncremented = useRef(false);

    useEffect(() => {
      if (!announcementId || hasIncremented.current) return;

      const viewKey = `viewed_announcement_${announcementId}`;
      if (sessionStorage.getItem(viewKey)) return;

      hasIncremented.current = true;
      incrementView.mutate(announcementId);
    }, [announcementId]);
  };

  return {
    // Queries
    announcements: announcementsQuery.data || [],
    isLoading: announcementsQuery.isLoading,
    isFetching: announcementsQuery.isFetching,
    error: announcementsQuery.error,
    refresh: announcementsQuery.refetch,
    useAnnouncement,
    useLikeStatus,
    useComments,
    useAutoIncrementView,

    // Mutations
    createAnnouncement: createAnnouncement.mutate,
    toggleLike: toggleLike.mutate,
    addComment: addComment.mutate,
    deleteComment: deleteComment.mutate,
    incrementView: incrementView.mutate,
    incrementDownload: incrementDownload.mutate,

    // Mutation states
    isCreating: createAnnouncement.isPending,
    isTogglingLike: toggleLike.isPending,
    isAddingComment: addComment.isPending,
    isDeletingComment: deleteComment.isPending,
    isIncrementingView: incrementView.isPending,
    isIncrementingDownload: incrementDownload.isPending,
  };
}
