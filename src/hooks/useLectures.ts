// src/hooks/useLectures.ts
// HOÀN CHỈNH - TỐI ƯU, DEBUG LOG

"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { Lecture, LectureFilter, LectureStats } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface CreateLectureData {
  title: string;
  description: string;
  content?: string;
  type: "video" | "slide" | "lab" | "document";
  subject?: string;
  duration: string;
  duration_minutes: number;
  teacher: string;
  tags: string[];
  video_url?: string;
  thumbnail?: string;
  thumbnailFile?: File;
}

// ============================================
// MAIN HOOK
// ============================================

export function useLectures() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const channelIdRef = useRef(
    `lectures-realtime-${Math.random().toString(36).substring(2, 9)}`,
  );
  const fetchInProgressRef = useRef(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isTeacher = session?.user?.role === "TEACHER";
  const canView = isAdmin || isTeacher;

  // ============================================
  // REALTIME SUBSCRIPTION
  // ============================================

  useEffect(() => {
    if (!canView) return;

    // Cleanup existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(channelIdRef.current)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lectures",
        },
        (payload) => {
          console.log(
            "📡 [useLectures] Realtime change received:",
            payload.eventType,
          );
          // Invalidate cache để fetch lại
          queryClient.invalidateQueries({ queryKey: ["lectures"] });
        },
      )
      .subscribe((status) => {
        console.log(`📡 [useLectures] Realtime subscription status: ${status}`);
      });

    channelRef.current = channel;

    return () => {
      console.log("📡 [useLectures] Cleaning up subscription...");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [canView, queryClient]);

  // ============================================
  // QUERY: Fetch all lectures
  // ============================================

  const lecturesQuery = useQuery({
    queryKey: ["lectures"],
    queryFn: async (): Promise<Lecture[]> => {
      // Tránh fetch trùng lặp
      if (fetchInProgressRef.current) {
        console.log("⏭️ [useLectures] Fetch already in progress, skipping...");
        return [];
      }

      fetchInProgressRef.current = true;

      try {
        console.log("🔍 [useLectures] Fetching lectures from API...");
        const response = await fetch("/api/lectures");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Lỗi khi tải dữ liệu");
        }

        console.log(`✅ [useLectures] Fetched ${data?.length || 0} lectures`);
        return data || [];
      } catch (error) {
        console.error("❌ [useLectures] Error fetching lectures:", error);
        throw error;
      } finally {
        fetchInProgressRef.current = false;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!session?.user && canView,
  });

  // ============================================
  // QUERY: Fetch single lecture
  // ============================================

  const useLecture = (id: string) => {
    return useQuery({
      queryKey: ["lecture", id],
      queryFn: async (): Promise<Lecture> => {
        try {
          console.log(`🔍 [useLectures] Fetching lecture ${id}...`);
          const response = await fetch(`/api/lectures?id=${id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Không tìm thấy bài giảng");
          }

          return data;
        } catch (error) {
          console.error(
            `❌ [useLectures] Error fetching lecture ${id}:`,
            error,
          );
          throw error;
        }
      },
      enabled: !!id && !!session?.user && canView,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });
  };

  // ============================================
  // MUTATION: Create lecture
  // ============================================

  const createLectureMutation = useMutation({
    mutationFn: async (data: CreateLectureData) => {
      if (!session?.user) {
        throw new Error("Vui lòng đăng nhập để đăng bài");
      }

      console.log("📝 [useLectures] Creating lecture with data:", {
        ...data,
        thumbnailFile: data.thumbnailFile ? "File present" : "No file",
      });

      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("content", data.content || "");
      formData.append("type", data.type || "video");
      formData.append("subject", data.subject || "");
      formData.append("duration", data.duration || "");
      formData.append(
        "duration_minutes",
        (data.duration_minutes || 0).toString(),
      );
      formData.append("teacher", data.teacher || "");
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("video_url", data.video_url || "");
      formData.append("thumbnail", data.thumbnail || "");

      if (data.thumbnailFile) {
        formData.append("thumbnailFile", data.thumbnailFile);
      }

      const response = await fetch("/api/lectures", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Không thể tạo bài giảng");
      }

      console.log("✅ [useLectures] Lecture created:", result.id);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      toast.success("Đăng bài thành công!");
    },
    onError: (error: any) => {
      console.error("❌ [useLectures] Create lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đăng bài");
    },
  });

  // ============================================
  // MUTATION: Increment view
  // ============================================

  const incrementViewMutation = useMutation({
    mutationFn: async (id: string) => {
      const viewKey = `viewed_lecture_${id}`;
      if (sessionStorage.getItem(viewKey)) {
        return { id, views: 0 };
      }

      try {
        const response = await fetch(`/api/lectures?id=${id}&action=view`, {
          method: "PATCH",
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Không thể tăng lượt xem");
        }

        sessionStorage.setItem(viewKey, "true");
        return result;
      } catch (error) {
        console.error("❌ [useLectures] Error incrementing view:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ["lecture", data.id] });
      }
    },
  });

  // ============================================
  // MUTATION: Toggle like
  // ============================================

  const toggleLikeMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`/api/lectures?id=${id}&action=like`, {
          method: "PATCH",
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Không thể thích bài giảng");
        }

        return result;
      } catch (error) {
        console.error("❌ [useLectures] Error toggling like:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ["lecture", data.id] });
      }
    },
  });

  // ============================================
  // MUTATION: Delete lecture (chỉ Admin)
  // ============================================

  const deleteLectureMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");
      if (!isAdmin) throw new Error("Chỉ admin mới có quyền xóa");

      console.log(`🗑️ [useLectures] Deleting lecture ${id}...`);

      const response = await fetch(`/api/lectures?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Không thể xóa bài giảng");
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture", id] });
      toast.success("Đã xóa bài giảng");
    },
    onError: (error: any) => {
      console.error("❌ [useLectures] Delete lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa");
    },
  });

  // ============================================
  // UTILITIES
  // ============================================

  const getStats = (lectures: Lecture[]): LectureStats => {
    return {
      total: lectures?.length || 0,
      totalViews: lectures?.reduce((sum, l) => sum + (l.views || 0), 0) || 0,
      totalLikes: lectures?.reduce((sum, l) => sum + (l.likes || 0), 0) || 0,
      totalVideos: lectures?.filter((l) => l.type === "video").length || 0,
      totalSlides: lectures?.filter((l) => l.type === "slide").length || 0,
      totalLabs: lectures?.filter((l) => l.type === "lab").length || 0,
      totalDocuments:
        lectures?.filter((l) => l.type === "document").length || 0,
      totalFolders:
        lectures?.filter((l) => l.is_folder === true || l.type === "folder")
          .length || 0,
    };
  };

  const getUniqueTags = (lectures: Lecture[]): string[] => {
    const tagSet = new Set<string>();
    lectures?.forEach((l: Lecture) => {
      if (l.tags) {
        l.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };

  const filterLectures = (
    lectures: Lecture[],
    filter: LectureFilter,
  ): Lecture[] => {
    if (!lectures) return [];

    let filtered = [...lectures];

    // Chỉ lấy file gốc (không phải folder và không có parent)
    filtered = filtered.filter(
      (l) => !(l.is_folder || l.type === "folder") && !l.parent_id,
    );

    // Search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title?.toLowerCase().includes(searchLower) ||
          l.description?.toLowerCase().includes(searchLower) ||
          l.teacher?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by type
    if (filter.type && filter.type !== "all") {
      filtered = filtered.filter((l) => l.type === filter.type);
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((l: Lecture) =>
        filter.tags.some((tag: string) => l.tags?.includes(tag)),
      );
    }

    // Filter by subject
    if (filter.subject) {
      filtered = filtered.filter((l) => l.subject === filter.subject);
    }

    // Sort
    switch (filter.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "most_liked":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      default:
        // Mặc định: mới nhất
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return filtered;
  };

  // ============================================
  // RETURN
  // ============================================

  return {
    // Data
    lectures: lecturesQuery.data || [],
    isLoading: lecturesQuery.isLoading,
    isFetching: lecturesQuery.isFetching,
    error: lecturesQuery.error,
    refresh: () => {
      console.log("🔄 [useLectures] Manual refresh");
      fetchInProgressRef.current = false;
      lecturesQuery.refetch();
    },

    // Single lecture
    useLecture,

    // Mutations
    createLecture: createLectureMutation.mutate,
    createLectureAsync: createLectureMutation.mutateAsync,
    incrementView: incrementViewMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    deleteLecture: deleteLectureMutation.mutate,
    deleteLectureAsync: deleteLectureMutation.mutateAsync,

    // Mutation states
    isCreating: createLectureMutation.isPending,
    isDeleting: deleteLectureMutation.isPending,

    // Utilities
    getStats,
    getUniqueTags,
    filterLectures,
  };
}
