// src/app/(routes)/forum/[id]/page.tsx
// Vai trò: Trang chi tiết bài viết với ảnh

"use client";

import { ForumImageGallery } from "@/components/forum/ForumImageGallery";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForum } from "@/hooks/use-forum";
import { useLikeStatus } from "@/hooks/use-like-status";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Lock,
  MessageCircle,
  Pin,
  Share2,
  ThumbsUp,
  ThumbsUp as ThumbsUpFilled
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const isValidUUID = (str: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    str,
  );
};

// Hook để kiểm tra đã view chưa
function useHasViewed(postId: string) {
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (postId) {
      setHasViewed(sessionStorage.getItem(`viewed_post_${postId}`) === "true");
    }
  }, [postId]);

  const markAsViewed = useCallback(() => {
    if (postId) {
      sessionStorage.setItem(`viewed_post_${postId}`, "true");
    }
  }, [postId]);

  return { hasViewed, markAsViewed };
}

export default function ForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { getPostDetail, getReplies, addReply, toggleLike, incrementViews } =
    useForum();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const postId = params.id as string;
  const { hasViewed, markAsViewed } = useHasViewed(postId);

  const {
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    loading: likeLoading,
  } = useLikeStatus(postId, session?.user?.id);

  // Lấy danh sách ảnh
  const images = attachments
    .filter((att) => att.file_type?.startsWith("image/"))
    .map((att) => att.file_url);

  useEffect(() => {
    if (postId && !isValidUUID(postId)) {
      setError("ID bài viết không hợp lệ");
      setLoading(false);
      return;
    }
  }, [postId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId || !isValidUUID(postId)) return;

      try {
        setLoading(true);
        setError(null);

        // Chỉ tăng view nếu chưa view
        if (!hasViewed) {
          await incrementViews(postId);
          markAsViewed();
        }

        const postData = await getPostDetail(postId);
        if (!postData) {
          setError("Không tìm thấy bài viết");
          setLoading(false);
          return;
        }
        setPost(postData);

        const repliesData = await getReplies(postId);
        setReplies(repliesData || []);

        const { data: attachmentsData } = await supabase
          .from("forum_attachments")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        setAttachments(attachmentsData || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Có lỗi xảy ra khi tải bài viết");
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, hasViewed, markAsViewed]);

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    const result = await toggleLike(postId);
    if (result?.success) {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addReply(postId, replyContent);
      if (result) {
        setReplies([...replies, result]);
        setReplyContent("");
        toast.success("Đã thêm trả lời!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive opacity-50" />
              <h2 className="text-2xl font-bold mt-4">
                Không tìm thấy bài viết
              </h2>
              <p className="text-muted-foreground mt-2">{error}</p>
              <Link href="/forum">
                <Button className="mt-4 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại diễn đàn
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Link href="/forum">
            <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Quay lại diễn đàn
            </Button>
          </Link>

          {/* Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 p-6"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-lg">
                  {post.author_name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">
                    {post.author_name || "Unknown"}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  {post.is_pinned && (
                    <Badge variant="default" className="text-xs gap-1">
                      <Pin className="w-3 h-3" />
                      Ghim
                    </Badge>
                  )}
                  {post.is_locked && (
                    <Badge variant="destructive" className="text-xs gap-1">
                      <Lock className="w-3 h-3" />
                      Khóa
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatRelativeTime(post.created_at)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views}
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Content */}
            <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
            <div
              className="mt-4 text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="mt-4">
                <ForumImageGallery images={images} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                className={cn("gap-2 rounded-full", isLiked && "text-primary")}
                onClick={handleLike}
                disabled={likeLoading}
              >
                {isLiked ? (
                  <ThumbsUpFilled className="w-5 h-5 fill-primary" />
                ) : (
                  <ThumbsUp className="w-5 h-5" />
                )}
                {likesCount > 0 && likesCount}
              </Button>
              <Button variant="ghost" className="gap-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
                {post.replies}
              </Button>
              <Button variant="ghost" className="gap-2 rounded-full ml-auto">
                <Share2 className="w-5 h-5" />
                Chia sẻ
              </Button>
            </div>
          </motion.div>

          {/* Replies */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {replies.length} phản hồi
            </h3>

            {/* Reply Form */}
            {session?.user && !post.is_locked && (
              <form onSubmit={handleReply} className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Viết phản hồi..."
                      rows={2}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        type="submit"
                        disabled={!replyContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {post.is_locked && (
              <div className="text-center py-4 text-muted-foreground">
                <Lock className="w-6 h-6 mx-auto mb-2" />
                Bài viết đã bị khóa, không thể phản hồi
              </div>
            )}

            {/* Replies List */}
            <div className="space-y-4">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="flex gap-3 p-4 bg-muted/30 rounded-xl"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {reply.user_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{reply.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(reply.created_at)}
                      </span>
                    </div>
                    <p className="mt-1">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
