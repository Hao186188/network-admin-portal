// src/app/(routes)/announcements/[id]/page.tsx
// Vai trò: Trang xem chi tiết thông báo - SỬ DỤNG RPC

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Bookmark,
    Clock,
    Eye,
    Heart,
    MessageCircle,
    Pin,
    Send,
    Share2,
    Trash2,
    Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Announcement {
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

interface Comment {
  id: string;
  announcement_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const priorityLabels: Record<string, string> = {
  high: "Quan trọng",
  medium: "Bình thường",
  low: "Thấp",
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const {
    getAnnouncementDetail,
    incrementViews,
    toggleLike,
    toggleSave,
    addComment,
    deleteComment,
  } = useAnnouncements();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const announcementId = params.id as string;
  const fetchRef = useRef(false);

  // Fetch announcement detail
  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAnnouncementDetail(announcementId);
        if (!data) {
          setError("Không tìm thấy thông báo");
          setLoading(false);
          return;
        }
        setAnnouncement(data);

        // Lấy comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("announcement_comments")
          .select(
            `
            *,
            user:users!announcement_comments_user_id_fkey (
              name,
              email,
              image
            )
          `,
          )
          .eq("announcement_id", announcementId)
          .order("created_at", { ascending: true });

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        } else {
          setComments(commentsData || []);
        }

        // Tăng view
        if (!viewCounted && session?.user) {
          await incrementViews(announcementId);
          setViewCounted(true);
        }

        // Kiểm tra like
        if (session?.user?.id) {
          const { data: likeData } = await supabase
            .from("announcement_likes")
            .select("id")
            .eq("announcement_id", announcementId)
            .eq("user_id", session.user.id)
            .maybeSingle();
          setIsLiked(!!likeData);
        }

        // Kiểm tra save
        if (session?.user?.id) {
          const { data: savedData } = await supabase
            .from("announcement_saves")
            .select("id")
            .eq("announcement_id", announcementId)
            .eq("user_id", session.user.id)
            .maybeSingle();
          setIsSaved(!!savedData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcement:", err);
        setError("Có lỗi xảy ra khi tải thông báo");
        setLoading(false);
      }
    };

    if (announcementId) {
      fetchData();
    }
  }, [announcementId]);

  // Handle comment submit - SỬ DỤNG RPC
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const result = await addComment(
        announcementId,
        session.user.id,
        commentText.trim(),
      );

      if (result) {
        setComments([...comments, result]);
        setCommentText("");
        setAnnouncement((prev) =>
          prev ? { ...prev, comments: prev.comments + 1 } : prev,
        );
        toast.success("Đã thêm bình luận!");
      }
    } catch (error: any) {
      console.error("Comment error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi bình luận");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle like toggle - SỬ DỤNG RPC
  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để thích bài viết");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const result = await toggleLike(announcementId, session.user.id);
      if (result !== undefined) {
        setIsLiked(result);
        setAnnouncement((prev) =>
          prev ? { ...prev, likes: prev.likes + (result ? 1 : -1) } : prev,
        );
        toast.success(result ? "Đã thích bài viết" : "Đã bỏ thích");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle save toggle - SỬ DỤNG RPC
  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để lưu bài viết");
      return;
    }

    if (saveLoading) return;
    setSaveLoading(true);

    try {
      const result = await toggleSave(announcementId, session.user.id);
      if (result) {
        setIsSaved(!isSaved);
        toast.success(!isSaved ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: announcement?.title || "Mạng 3 Hub",
      text: announcement?.content || "",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${announcement?.title}\n${announcement?.content}\n${window.location.href}`,
        );
        toast.success("Đã sao chép liên kết!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Không thể chia sẻ");
      }
    }
  };

  // Handle delete comment - SỬ DỤNG RPC
  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return;

    try {
      const result = await deleteComment(commentId, session.user.id);
      if (result) {
        setComments(comments.filter((c) => c.id !== commentId));
        setAnnouncement((prev) =>
          prev ? { ...prev, comments: prev.comments - 1 } : prev,
        );
        toast.success("Đã xóa bình luận");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !announcement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive opacity-50" />
                <h2 className="text-2xl font-bold mb-2">
                  Không tìm thấy thông báo
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error || "Thông báo không tồn tại hoặc đã bị xóa"}
                </p>
                <Link href="/announcements">
                  <Button className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isAuthor = session?.user?.id === announcement.author_id;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/announcements">
              <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted">
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách
              </Button>
            </Link>
          </motion.div>

          {/* Announcement Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {announcement.pinned && (
                      <Badge variant="secondary" className="gap-1">
                        <Pin className="w-3 h-3" />
                        Ghim
                      </Badge>
                    )}
                    <Badge variant="outline">{announcement.category}</Badge>
                    <div
                      className={`w-2 h-2 rounded-full ${priorityColors[announcement.priority]}`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {priorityLabels[announcement.priority]}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {announcement.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {announcement.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(announcement.created_at).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {announcement.views} lượt xem
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {announcement.likes} lượt thích
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {announcement.comments} bình luận
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p className="whitespace-pre-wrap text-foreground">
                    {announcement.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={handleLike}
                    disabled={likeLoading}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`}
                    />
                    {isLiked ? "Đã thích" : "Thích"}
                  </Button>

                  <Button
                    variant={isSaved ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={handleSave}
                    disabled={saveLoading}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`}
                    />
                    {isSaved ? "Đã lưu" : "Lưu"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </Button>

                  {(isAuthor || isAdmin) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2 ml-auto"
                      onClick={async () => {
                        if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
                          try {
                            const { error } = await supabase
                              .from("announcements")
                              .delete()
                              .eq("id", announcementId);
                            if (error) throw error;
                            toast.success("Đã xóa thông báo");
                            router.push("/announcements");
                          } catch (error: any) {
                            toast.error(error?.message || "Có lỗi xảy ra");
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Bình luận ({comments.length})
                </h3>

                {/* Comment Form */}
                {session?.user ? (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex gap-3">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận..."
                        className="flex-1"
                        disabled={isSubmittingComment}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmittingComment || !commentText.trim()}
                      >
                        {isSubmittingComment ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Đăng nhập
                    </Link>{" "}
                    để bình luận
                  </p>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Chưa có bình luận nào
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {comment.user?.name || "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(comment.created_at).toLocaleString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                            {session?.user?.id === comment.user_id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
