// src/app/(routes)/documents/hooks/useDocumentInteractions.ts
// FIXED - THÊM TYPE CHO PARAMETERS

"use client";

import {
  isServiceRoleEnabled,
  supabase,
  supabaseAdmin
} from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { DocumentComment } from "../types";

export function useDocumentInteractions(documentId: string) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingAvg, setRatingAvg] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);

  const hasIncrementedView = useRef(false);
  const isFetching = useRef(false);
  const isMounted = useRef(true);

  const getClient = () => {
    return isServiceRoleEnabled ? supabaseAdmin : supabase;
  };

  // ✅ Fetch interactions
  const fetchInteractions = async (forceRefresh = false) => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    isFetching.current = true;
    setLoading(true);

    try {
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .maybeSingle();

      if (!docError && docData && isMounted.current) {
        setDocument(docData);
      }

      const { count: likesCount, error: likesError } = await supabase
        .from("document_likes")
        .select("*", { count: "exact", head: true })
        .eq("document_id", documentId);

      if (!likesError && isMounted.current) {
        setLikes(likesCount || 0);
      }

      if (session?.user?.id && isMounted.current) {
        const { data: userLike, error: userLikeError } = await supabase
          .from("document_likes")
          .select("*")
          .eq("document_id", documentId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!userLikeError) {
          setIsLiked(!!userLike);
        }
      }

      if (isMounted.current) {
        const { data: commentsData, error: commentsError } = await supabase
          .from("document_comments")
          .select(
            `
            *,
            user:users(name, email, image)
          `,
          )
          .eq("document_id", documentId)
          .is("parent_id", null)
          .order("created_at", { ascending: false });

        if (!commentsError) {
          const commentsWithReplies = await Promise.all(
            (commentsData || []).map(async (comment: any) => {
              const { data: replies, error: repliesError } = await supabase
                .from("document_comments")
                .select(
                  `
                  *,
                  user:users(name, email, image)
                `,
                )
                .eq("parent_id", comment.id)
                .order("created_at", { ascending: true });

              return {
                ...comment,
                replies: repliesError ? [] : replies || [],
              };
            }),
          );
          setComments(commentsWithReplies);
          setCommentsCount(commentsData?.length || 0);
        }
      }

      if (session?.user?.id && isMounted.current) {
        const { data: userRatingData, error: userRatingError } = await supabase
          .from("document_ratings")
          .select("rating")
          .eq("document_id", documentId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!userRatingError) {
          setUserRating(userRatingData?.rating || null);
        }
      }

      if (isMounted.current) {
        const { data: ratingData, error: ratingError } = await supabase
          .from("document_ratings")
          .select("rating")
          .eq("document_id", documentId);

        if (!ratingError && ratingData && ratingData.length > 0) {
          // ✅ FIX: Thêm type cho parameters
          const avg =
            ratingData.reduce((sum: number, r: any) => sum + r.rating, 0) /
            ratingData.length;
          setRatingAvg(Math.round(avg * 10) / 10);
        } else {
          setRatingAvg(0);
        }
      }
    } catch (error) {
      console.error("Error fetching interactions:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  };

  // ✅ Toggle like
  const toggleLike = async () => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để like");
    }

    try {
      const client = getClient();

      if (isLiked) {
        const { error } = await client
          .from("document_likes")
          .delete()
          .eq("document_id", documentId)
          .eq("user_id", session.user.id);

        if (error) throw error;
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      } else {
        const { error } = await client.from("document_likes").insert({
          document_id: documentId,
          user_id: session.user.id,
        });

        if (error) throw error;
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }

      await fetchInteractions(true);
      return true;
    } catch (error: any) {
      throw new Error(error.message || "Không thể thực hiện hành động");
    }
  };

  // ✅ Add comment
  const addComment = async (content: string, parentId?: string) => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để bình luận");
    }

    if (!content.trim()) {
      throw new Error("Vui lòng nhập nội dung bình luận");
    }

    try {
      const client = getClient();

      const { data, error } = await client
        .from("document_comments")
        .insert({
          document_id: documentId,
          user_id: session.user.id,
          content: content.trim(),
          parent_id: parentId || null,
        })
        .select(
          `
          *,
          user:users(name, email, image)
        `,
        )
        .single();

      if (error) throw error;

      if (parentId) {
        setComments((prev: DocumentComment[]) =>
          prev.map((comment: DocumentComment) =>
            comment.id === parentId
              ? { ...comment, replies: [...(comment.replies || []), data] }
              : comment,
          ),
        );
      } else {
        setComments((prev: DocumentComment[]) => [data, ...prev]);
        setCommentsCount((prev: number) => prev + 1);
      }

      await fetchInteractions(true);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Không thể thêm bình luận");
    }
  };

  // ✅ Delete comment
  const deleteComment = async (commentId: string) => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để xóa bình luận");
    }

    try {
      const client = getClient();

      const { error } = await client
        .from("document_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", session.user.id);

      if (error) throw error;

      setComments((prev: DocumentComment[]) => {
        const hasTopLevel = prev.some(
          (c: DocumentComment) => c.id === commentId,
        );
        if (hasTopLevel) {
          return prev.filter((c: DocumentComment) => c.id !== commentId);
        }
        return prev.map((comment: DocumentComment) => ({
          ...comment,
          replies: (comment.replies || []).filter(
            (r: DocumentComment) => r.id !== commentId,
          ),
        }));
      });
      setCommentsCount((prev: number) => prev - 1);

      await fetchInteractions(true);
      return true;
    } catch (error: any) {
      throw new Error(error.message || "Không thể xóa bình luận");
    }
  };

  // ✅ Rate document
  const rateDocument = async (rating: number) => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để đánh giá");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Đánh giá phải từ 1 đến 5 sao");
    }

    try {
      const client = getClient();

      const { data: existing, error: checkError } = await client
        .from("document_ratings")
        .select("*")
        .eq("document_id", documentId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Check existing rating error:", checkError);
        throw checkError;
      }

      if (existing) {
        const { data, error } = await client
          .from("document_ratings")
          .update({
            rating,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          console.error("Update rating error:", error);
          throw error;
        }
      } else {
        const { data, error } = await client
          .from("document_ratings")
          .insert({
            document_id: documentId,
            user_id: session.user.id,
            rating,
          })
          .select()
          .single();

        if (error) {
          console.error("Insert rating error:", error);
          throw error;
        }
      }

      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .maybeSingle();

      if (!docError && docData) {
        setDocument(docData);
        setRatingAvg(docData.rating_avg || 0);
      }

      const { data: ratingData, error: ratingError } = await client
        .from("document_ratings")
        .select("rating")
        .eq("document_id", documentId);

      if (!ratingError && ratingData && ratingData.length > 0) {
        // ✅ FIX: Thêm type cho parameters
        const avg =
          ratingData.reduce((sum: number, r: any) => sum + r.rating, 0) /
          ratingData.length;
        const newAvg = Math.round(avg * 10) / 10;
        setRatingAvg(newAvg);
      }

      setUserRating(rating);
      await fetchInteractions(true);

      return rating;
    } catch (error: any) {
      console.error("Rate error:", error);
      throw new Error(error.message || "Không thể đánh giá");
    }
  };

  // ✅ Increment view count
  const incrementView = async () => {
    if (hasIncrementedView.current) {
      return;
    }

    try {
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("views")
        .eq("id", documentId)
        .maybeSingle();

      if (fetchError) {
        console.error("Fetch views error:", fetchError);
        return;
      }

      const currentViews = doc?.views || 0;
      const newViews = currentViews + 1;

      const { error: updateError } = await supabase
        .from("documents")
        .update({ views: newViews })
        .eq("id", documentId);

      if (updateError) {
        console.error("Update views error:", updateError);
        return;
      }

      hasIncrementedView.current = true;
      setDocument((prev: any) => ({ ...prev, views: newViews }));

      await fetchInteractions(true);
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  // ✅ Increment download count
  const incrementDownload = async () => {
    try {
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("downloads")
        .eq("id", documentId)
        .maybeSingle();

      if (fetchError) {
        console.error("Fetch downloads error:", fetchError);
        return;
      }

      const currentDownloads = doc?.downloads || 0;
      const newDownloads = currentDownloads + 1;

      const { error: updateError } = await supabase
        .from("documents")
        .update({ downloads: newDownloads })
        .eq("id", documentId);

      if (updateError) {
        console.error("Update downloads error:", updateError);
        return;
      }

      setDocument((prev: any) => ({ ...prev, downloads: newDownloads }));

      await fetchInteractions(true);
    } catch (error) {
      console.error("Error incrementing download:", error);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (documentId) {
      hasIncrementedView.current = false;
      fetchInteractions();
    }
  }, [documentId]);

  return {
    document,
    likes,
    isLiked,
    comments,
    commentsCount,
    userRating,
    ratingAvg,
    loading,
    toggleLike,
    addComment,
    deleteComment,
    rateDocument,
    incrementView,
    incrementDownload,
    refresh: () => fetchInteractions(true),
  };
}
