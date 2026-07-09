// src/hooks/use-forum-infinity.ts
// Vai trò: Hook quản lý infinite scroll - FIXED INFINITE REQUEST

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import type { ForumPost } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export type { ForumPost };

interface UseForumInfinityProps {
  category?: string;
  search?: string;
  limit?: number;
}

export function useForumInfinity({
  category,
  search,
  limit = 10,
}: UseForumInfinityProps = {}) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const initialFetchRef = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCategoryRef = useRef(category);
  const currentSearchRef = useRef(search);

  const sanitizeSearch = useCallback((input: string) => {
    return input.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  }, []);

  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean = true) => {
      if (loadingRef.current) {
        logger.log("⏭️ Skip fetch - already loading");
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const from = pageNum * limit;
        const to = from + limit - 1;

        logger.log(`📥 Fetching posts: page ${pageNum}, from ${from} to ${to}`);

        let query = supabase
          .from("forum_posts")
          .select("*", { count: "exact" })
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (category && category !== "Tất cả") {
          query = query.eq("category", category);
        }

        if (search && search.trim()) {
          const sanitized = sanitizeSearch(search);
          if (sanitized) {
            query = query.or(
              `title.ilike.%${sanitized}%,content.ilike.%${sanitized}%`,
            );
          }
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) {
          logger.error("❌ Fetch error:", fetchError);
          throw fetchError;
        }

        logger.log(`✅ Fetched ${data?.length || 0} posts, total: ${count}`);

        const formattedPosts: ForumPost[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled",
          content: item.content || "",
          category: item.category || "Thảo luận",
          author_id: item.author_id || "",
          author_name: item.author_name || "Unknown",
          author_avatar: item.author_avatar || "",
          is_pinned: item.is_pinned || false,
          is_locked: item.is_locked || false,
          views: item.views || 0,
          likes: item.likes || 0,
          replies: item.replies || 0,
          tags: item.tags || [],
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
          attachments: [],
        }));

        if (formattedPosts.length > 0) {
          const postIds = formattedPosts.map((p) => p.id);
          const { data: attachmentsData } = await supabase
            .from("forum_attachments")
            .select("*")
            .in("post_id", postIds);

          if (attachmentsData) {
            formattedPosts.forEach((post) => {
              post.attachments = attachmentsData
                .filter((att) => att.post_id === post.id)
                .map((att) => ({
                  id: att.id,
                  file_url: att.file_url,
                  file_name: att.file_name,
                  file_type: att.file_type,
                  file_size: att.file_size,
                }));
            });
          }
        }

        if (append) {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPosts = formattedPosts.filter(
              (p) => !existingIds.has(p.id),
            );
            return [...prev, ...newPosts];
          });
        } else {
          setPosts(formattedPosts);
        }

        setTotal(count || 0);
        setHasMore((data?.length || 0) === limit);
        setPage(pageNum);
        initialFetchRef.current = true;
      } catch (err: any) {
        logger.error("❌ Error fetching posts:", err);
        setError(err.message || "Có lỗi xảy ra khi tải bài viết");
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, search, limit, sanitizeSearch],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current && initialFetchRef.current) {
      logger.log(`📥 Load more: page ${page + 1}`);
      fetchPosts(page + 1, true);
    }
  }, [page, loading, hasMore, fetchPosts]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setPosts([]);
    setPage(0);
    setHasMore(true);
    initialFetchRef.current = false;
    fetchPosts(0, false);
  }, [fetchPosts]);

  // ✅ Setup Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMore &&
          !loading &&
          !loadingRef.current &&
          initialFetchRef.current
        ) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    const currentElement = lastElementRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  // ✅ Initial fetch với debounce
  useEffect(() => {
    const categoryChanged = currentCategoryRef.current !== category;
    const searchChanged = currentSearchRef.current !== search;

    if (!categoryChanged && !searchChanged && initialFetchRef.current) {
      return;
    }

    currentCategoryRef.current = category;
    currentSearchRef.current = search;

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    setPosts([]);
    setPage(0);
    setHasMore(true);
    initialFetchRef.current = false;
    setError(null);

    fetchTimeoutRef.current = setTimeout(() => {
      logger.log("🔄 Fetching posts after debounce");
      fetchPosts(0, false);
      fetchTimeoutRef.current = null;
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [category, search, fetchPosts]);

  return {
    posts,
    loading,
    hasMore,
    total,
    error,
    refreshing,
    loadMore,
    refresh,
    lastElementRef,
  };
}
