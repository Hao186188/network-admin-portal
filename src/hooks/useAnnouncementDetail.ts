// src/hooks/useAnnouncementDetail.ts
// HOOK QUẢN LÝ CHI TIẾT - FIX DUPLICATE COMMENTS

"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useAnnouncements } from "./use-announcements";
import { useToast } from "./use-toast";

export function useAnnouncementDetail(id: string) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const {
    useAnnouncement,
    useLikeStatus,
    useComments,
    useAutoIncrementView,
    toggleLike,
    addComment,
    deleteComment,
    incrementDownload,
    isTogglingLike,
    isAddingComment,
    isDeletingComment,
  } = useAnnouncements();

  // Fetch data
  const { data: announcement, isLoading, error, refetch } = useAnnouncement(id);
  const { data: isLiked, refetch: refetchLikeStatus } = useLikeStatus(id);
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useComments(id);

  // Auto increment view
  useAutoIncrementView(id);

  // Handlers
  const handleToggleLike = useCallback(async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để like");
      return;
    }

    try {
      await toggleLike(id);
      await Promise.all([refetchLikeStatus(), refetch()]);
    } catch (error: any) {
      // Error handled in mutation
    }
  }, [id, session?.user, toggleLike, refetchLikeStatus, refetch, toast]);

  const handleAddComment = useCallback(
    async (content: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập để bình luận");
        return;
      }

      if (!content.trim()) {
        toast.error("Vui lòng nhập nội dung bình luận");
        return;
      }

      try {
        // ✅ CHỈ GỌI addComment, KHÔNG refetch comments ngay
        await addComment({ announcementId: id, content });

        // ✅ Sau khi thành công, refetch để lấy dữ liệu mới
        await Promise.all([refetchComments(), refetch()]);
      } catch (error: any) {
        // Error handled in mutation
      }
    },
    [id, session?.user, addComment, refetchComments, refetch, toast],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!session?.user) return;

      try {
        await deleteComment({ commentId, announcementId: id });
        await Promise.all([refetchComments(), refetch()]);
      } catch (error: any) {
        // Error handled in mutation
      }
    },
    [id, session?.user, deleteComment, refetchComments, refetch],
  );

  const handleDownload = useCallback(async () => {
    try {
      await incrementDownload(id);
      await refetch();
      toast.success("Đã tải xuống");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  }, [id, incrementDownload, refetch, toast]);

  return {
    // Data
    announcement,
    isLiked: isLiked || false,
    comments: comments || [],
    isLoading,
    isLoadingComments,
    error,

    // Actions
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
    handleDownload,
    refetch,

    // States
    isTogglingLike,
    isAddingComment,
    isDeletingComment,
  };
}
