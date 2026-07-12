// src/hooks/useLectures.ts
// HOÀN CHỈNH - FIX ALL ERRORS

"use client";

import { useToast } from "@/hooks/use-toast";
import {
  isServiceRoleEnabled,
  supabase,
  supabaseAdmin,
} from "@/lib/db/supabase-client";
import { Lecture, LectureFilter, LectureStats } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useLectures() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============================================
  // QUERY: Fetch all lectures
  // ============================================

  const lecturesQuery = useQuery({
    queryKey: ["lectures"],
    queryFn: async (): Promise<Lecture[]> => {
      try {
        let query = supabase
          .from("lectures")
          .select("*")
          .order("created_at", { ascending: false });

        if (session?.user?.role !== "admin") {
          query = query.eq("status", "approved");
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message || "Lỗi khi tải dữ liệu");
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching lectures:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // ============================================
  // QUERY: Fetch single lecture
  // ============================================

  const useLecture = (id: string) => {
    return useQuery({
      queryKey: ["lecture", id],
      queryFn: async (): Promise<Lecture> => {
        try {
          const { data, error } = await supabase
            .from("lectures")
            .select("*")
            .eq("id", id)
            .single();

          if (error) {
            console.error("Supabase error:", error);
            throw new Error(error.message || "Không tìm thấy bài giảng");
          }
          return data;
        } catch (error) {
          console.error("Error fetching lecture:", error);
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });
  };

  // ============================================
  // QUERY: Fetch pending lectures
  // ============================================

  const pendingLecturesQuery = useQuery({
    queryKey: ["lectures", "pending"],
    queryFn: async (): Promise<Lecture[]> => {
      try {
        const { data, error } = await supabase
          .from("lectures")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message || "Lỗi khi tải dữ liệu");
        }

        return data || [];
      } catch (error) {
        console.error("Error fetching pending lectures:", error);
        throw error;
      }
    },
    enabled: session?.user?.role === "admin",
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // ============================================
  // MUTATION: Create lecture
  // ============================================

  const createLecture = useMutation({
    mutationFn: async (data: Partial<Lecture>) => {
      if (!session?.user) {
        throw new Error("Vui lòng đăng nhập để đăng bài");
      }

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      // Kiểm tra user có tồn tại không
      const { data: userData, error: userError } = await client
        .from("users")
        .select("id, role")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        const { error: insertUserError } = await client.from("users").insert({
          id: session.user.id,
          email: session.user.email,
          username: session.user.username || session.user.email?.split("@")[0],
          name: session.user.name || "User",
          role: session.user.role?.toLowerCase() || "student",
        });

        if (insertUserError) {
          console.error("Failed to create user:", insertUserError);
          throw new Error("Không thể tạo tài khoản. Vui lòng liên hệ admin.");
        }
      }

      const insertData = {
        title: data.title?.trim() || "Bài giảng mới",
        description: data.description?.trim() || "",
        content: data.content?.trim() || "",
        type: data.type || "video",
        subject: data.subject || "",
        duration: data.duration || "",
        duration_minutes: data.duration_minutes || 0,
        date: new Date().toISOString().split("T")[0],
        teacher: data.teacher || session.user.name || "Giảng viên",
        teacher_id: session.user.id,
        author_id: session.user.id,
        tags: data.tags || [],
        video_url: data.video_url || "",
        thumbnail: data.thumbnail || "",
        views: 0,
        likes: 0,
        order: 0,
        status: "pending",
        is_approved: false,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: newLecture, error: insertError } = await client
        .from("lectures")
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        if (insertError.code === "42501") {
          throw new Error("Lỗi bảo mật. Vui lòng đăng xuất và đăng nhập lại.");
        }
        throw new Error(insertError.message || "Không thể tạo bài giảng");
      }

      return newLecture;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lectures", "pending"] });
      toast.success("Đăng bài thành công! Bài giảng đang chờ kiểm duyệt.");
    },
    onError: (error: any) => {
      console.error("Create lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đăng bài");
    },
  });

  // ============================================
  // MUTATION: Increment view
  // ============================================

  const incrementView = useMutation({
    mutationFn: async (id: string) => {
      const viewKey = `viewed_lecture_${id}`;
      if (sessionStorage.getItem(viewKey)) {
        return { id, views: 0 };
      }

      try {
        const { data: current, error: fetchError } = await supabase
          .from("lectures")
          .select("views")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        const newViews = (current?.views || 0) + 1;

        const { error: updateError } = await supabase
          .from("lectures")
          .update({ views: newViews })
          .eq("id", id);

        if (updateError) throw updateError;

        sessionStorage.setItem(viewKey, "true");
        return { id, views: newViews };
      } catch (error) {
        console.error("Error incrementing view:", error);
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

  const toggleLike = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data: current, error: fetchError } = await supabase
          .from("lectures")
          .select("likes")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        const newLikes = (current?.likes || 0) + 1;

        const { error: updateError } = await supabase
          .from("lectures")
          .update({ likes: newLikes })
          .eq("id", id);

        if (updateError) throw updateError;

        return { id, likes: newLikes };
      } catch (error) {
        console.error("Error toggling like:", error);
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
  // MUTATION: Approve lecture
  // ============================================

  const approveLecture = useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: "approved" | "rejected";
      reason?: string;
    }) => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");
      if (session.user.role !== "admin")
        throw new Error("Chỉ admin mới có quyền duyệt");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const updateData = {
        status,
        is_approved: status === "approved",
        is_published: status === "approved",
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from("lectures")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lectures", "pending"] });
      toast.success("Cập nhật trạng thái bài giảng thành công");
    },
    onError: (error: any) => {
      console.error("Approve lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi duyệt bài");
    },
  });

  // ============================================
  // MUTATION: Delete lecture
  // ============================================

  const deleteLecture = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");
      if (session.user.role !== "admin")
        throw new Error("Chỉ admin mới có quyền xóa");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const { error } = await client
        .from("lectures")
        .update({
          deleted_by: session.user.id,
          deleted_at: new Date().toISOString(),
          is_published: false,
          is_approved: false,
          status: "rejected",
        })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lectures", "pending"] });
      toast.success("Đã xóa bài giảng");
    },
    onError: (error: any) => {
      console.error("Delete lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa");
    },
  });

  // ============================================
  // MUTATION: Update lecture
  // ============================================

  const updateLecture = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Lecture>;
    }) => {
      if (!session?.user) throw new Error("Vui lòng đăng nhập");

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const updateData: any = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        content: data.content?.trim(),
        type: data.type,
        subject: data.subject,
        duration: data.duration,
        duration_minutes: data.duration_minutes,
        teacher: data.teacher,
        tags: data.tags,
        video_url: data.video_url,
        thumbnail: data.thumbnail,
        updated_at: new Date().toISOString(),
      };

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data: updated, error } = await client
        .from("lectures")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture", data.id] });
      toast.success("Cập nhật bài giảng thành công");
    },
    onError: (error: any) => {
      console.error("Update lecture error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật");
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

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title?.toLowerCase().includes(searchLower) ||
          l.description?.toLowerCase().includes(searchLower) ||
          l.teacher?.toLowerCase().includes(searchLower),
      );
    }

    if (filter.type && filter.type !== "all") {
      filtered = filtered.filter((l) => l.type === filter.type);
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((l: Lecture) =>
        filter.tags.some((tag: string) => l.tags?.includes(tag)),
      );
    }

    if (filter.subject) {
      filtered = filtered.filter((l) => l.subject === filter.subject);
    }

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
    }

    return filtered;
  };

  // ============================================
  // RETURN
  // ============================================

  // src/hooks/useLectures.ts
  // PHẦN RETURN - ĐẢM BẢO EXPORT ĐÚNG

  return {
    // Data
    lectures: lecturesQuery.data || [],
    pendingLectures: pendingLecturesQuery.data || [],
    isLoading: lecturesQuery.isLoading,
    isPendingLoading: pendingLecturesQuery.isLoading,
    isFetching: lecturesQuery.isFetching,
    error: lecturesQuery.error,
    refresh: lecturesQuery.refetch,

    // Single lecture
    useLecture,

    // Mutations - ✅ ĐẢM BẢO LÀ FUNCTIONS
    createLecture: createLecture.mutate,
    incrementView: incrementView.mutate,
    toggleLike: toggleLike.mutate,
    approveLecture: approveLecture.mutate, // ✅ Phải là function
    deleteLecture: deleteLecture.mutate, // ✅ Phải là function
    updateLecture: updateLecture.mutate,

    // Utilities
    getStats,
    getUniqueTags,
    filterLectures,
  };
}
