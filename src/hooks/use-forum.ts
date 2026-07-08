// src/hooks/use-forum.ts
// Vai trò: Hook quản lý forum - GỌI ĐÚNG THỨ TỰ

import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "./use-toast";

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  likes: number;
  replies: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

export function useForum() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(
    async (filters?: {
      category?: string;
      search?: string;
      tag?: string;
      page?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("forum_posts")
          .select("*", { count: "exact" })
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false });

        if (filters?.category && filters.category !== "Tất cả") {
          query = query.eq("category", filters.category);
        }

        if (filters?.search) {
          query = query.or(
            `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
          );
        }

        if (filters?.tag) {
          query = query.contains("tags", [filters.tag]);
        }

        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const start = (page - 1) * limit;
        query = query.range(start, start + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        setPosts(data || []);
        setTotalPosts(count || 0);
      } catch (err) {
        console.error("Error fetching forum posts:", err);
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getPostDetail = async (postId: string) => {
    try {
      // Kiểm tra UUID hợp lệ
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(postId)) {
        console.error("Invalid UUID:", postId);
        return null;
      }

      console.log("🔍 Fetching post detail:", postId);

      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("❌ Error fetching post detail:", error);
        // Kiểm tra nếu lỗi là do không tìm thấy record
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      console.log("✅ Post detail fetched:", data?.id);
      return data as ForumPost;
    } catch (error) {
      console.error("❌ Error in getPostDetail:", error);
      return null;
    }
  };

  const getReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ForumReply[];
    } catch (error) {
      console.error("Error fetching replies:", error);
      return [];
    }
  };

  // TẠO BÀI VIẾT
  const createPost = async (data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => {
    try {
      if (!session?.user) {
        throw new Error("Vui lòng đăng nhập để tạo bài viết");
      }

      console.log("📝 Creating post with RPC:", data);

      if (!data.title?.trim()) {
        throw new Error("Tiêu đề không được để trống");
      }
      if (!data.content?.trim()) {
        throw new Error("Nội dung không được để trống");
      }
      if (!data.category) {
        throw new Error("Danh mục không được để trống");
      }

      const { data: result, error } = await supabase.rpc("create_forum_post", {
        p_title: data.title.trim(),
        p_content: data.content.trim(),
        p_category: data.category,
        p_author_id: session.user.id,
        p_author_name: session.user.name || session.user.username || "User",
        p_author_avatar: session.user.image || null,
        p_tags: data.tags || [],
      });

      if (error) {
        console.error("❌ RPC error:", error);
        if (
          error.message?.includes("function create_forum_post") &&
          error.message?.includes("does not exist")
        ) {
          throw new Error(
            "Hàm tạo bài viết chưa được cài đặt, vui lòng liên hệ quản trị viên",
          );
        }
        throw new Error(error.message || "Lỗi khi tạo bài viết");
      }

      if (result && result.success === false) {
        throw new Error(result.error || "Lỗi khi tạo bài viết");
      }

      if (!result || !result.id) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      console.log("✅ Post created via RPC:", result);

      await fetchPosts();
      toast.success("✅ Đã tạo bài viết thành công!");
      return result as ForumPost;
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài viết");
      return null;
    }
  };

  // THÊM TRẢ LỜI - THỨ TỰ ĐÚNG
  const addReply = async (postId: string, content: string) => {
    try {
      if (!session?.user) {
        throw new Error("Vui lòng đăng nhập để trả lời");
      }

      if (!content.trim()) {
        throw new Error("Nội dung không được để trống");
      }

      console.log("📝 Adding reply via RPC:", { postId, content });

      // THỨ TỰ: post_id, user_id, user_name, content, user_avatar
      const { data: result, error } = await supabase.rpc("add_forum_reply", {
        p_post_id: postId,
        p_user_id: session.user.id,
        p_user_name: session.user.name || session.user.username || "User",
        p_content: content.trim(),
        p_user_avatar: session.user.image || null,
      });

      if (error) {
        console.error("❌ RPC error:", error);
        throw new Error(error.message || "Lỗi khi thêm trả lời");
      }

      if (result && result.success === false) {
        throw new Error(result.error || "Lỗi khi thêm trả lời");
      }

      if (!result || !result.id) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      console.log("✅ Reply added via RPC:", result);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, replies: post.replies + 1 } : post,
        ),
      );

      toast.success("✅ Đã thêm trả lời!");
      return result as ForumReply;
    } catch (error: any) {
      console.error("❌ Error adding reply:", error);
      toast.error(error?.message || "Có lỗi xảy ra");
      return null;
    }
  };

  const toggleLike = async (postId: string, replyId?: string) => {
    try {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập để thích");
        return null;
      }

      const { data, error } = await supabase.rpc("toggle_forum_like", {
        p_post_id: postId,
        p_user_id: session.user.id,
        p_reply_id: replyId || null,
      });

      if (error) throw error;

      if (data?.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes:
                    data.action === "like" ? post.likes + 1 : post.likes - 1,
                }
              : post,
          ),
        );
      }

      return data;
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error(error?.message || "Có lỗi xảy ra");
      return null;
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      await supabase.rpc("increment_forum_views", {
        p_post_id: postId,
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    totalPosts,
    fetchPosts,
    getPostDetail,
    getReplies,
    createPost,
    addReply,
    toggleLike,
    incrementViews,
  };
}
