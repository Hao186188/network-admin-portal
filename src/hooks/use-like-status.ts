// src/hooks/use-like-status.ts
// Vai trò: Quản lý trạng thái like

import { supabase } from "@/lib/db/supabase-client";
import { useEffect, useState } from "react";

export function useLikeStatus(postId: string, userId?: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!postId || !userId) {
        setLoading(false);
        return;
      }

      try {
        // Lấy số like từ bảng forum_posts
        const { data: postData } = await supabase
          .from("forum_posts")
          .select("likes")
          .eq("id", postId)
          .single();

        if (postData) {
          setLikesCount(postData.likes || 0);
        }

        // Kiểm tra user đã like chưa
        const { data: likeData } = await supabase
          .from("forum_likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", userId)
          .maybeSingle();

        setIsLiked(!!likeData);
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeStatus();
  }, [postId, userId]);

  return { isLiked, setIsLiked, likesCount, setLikesCount, loading };
}
