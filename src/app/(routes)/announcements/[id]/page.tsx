// src/app/(routes)/announcements/[id]/page.tsx
// TRANG CHI TIẾT - HOÀN CHỈNH TỐI ƯU

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncementDetail } from "@/hooks/useAnnouncementDetail";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Pin,
  Send,
  Share2,
  ThumbsUp,
  ThumbsUp as ThumbsUpFilled,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ============================================
// CONSTANTS
// ============================================

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
  };
  return colors[priority] || "bg-gray-500";
};

const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    high: "⚠️ Khẩn cấp",
    medium: "📌 Quan trọng",
    low: "ℹ️ Thông thường",
  };
  return labels[priority] || "Bình thường";
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const announcementId = id as string;

  // State
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Custom hook
  const {
    announcement,
    isLiked,
    comments,
    isLoading,
    isLoadingComments,
    error,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
    handleDownload,
    refetch,
    isTogglingLike,
    isAddingComment,
    isDeletingComment,
  } = useAnnouncementDetail(announcementId);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCommentContent("");
      setIsSubmitting(false);
    };
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmitComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!session?.user) {
        toast.error("Vui lòng đăng nhập để bình luận");
        return;
      }

      if (!commentContent.trim()) {
        toast.error("Vui lòng nhập nội dung bình luận");
        return;
      }

      setIsSubmitting(true);
      try {
        await handleAddComment(commentContent);
        setCommentContent("");
        toast.success("Bình luận thành công!");
      } catch (error) {
        // Error already handled in hook
      } finally {
        setIsSubmitting(false);
      }
    },
    [session?.user, commentContent, handleAddComment],
  );

  const handleShare = useCallback(async () => {
    if (isShared) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: announcement?.title || "Thông báo",
          text: announcement?.content?.replace(/<[^>]*>/g, "") || "",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        toast.success("Đã sao chép link!");
        setTimeout(() => setIsShared(false), 3000);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Không thể chia sẻ");
      }
    }
  }, [announcement, isShared]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error || !announcement) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive bg-card">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive/50" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Không tìm thấy thông báo
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error?.message || "Thông báo không tồn tại hoặc đã bị xóa"}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </Button>
                  <Button onClick={() => refetch()} className="gap-2">
                    Thử lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ============================================
  // SUCCESS STATE
  // ============================================

  return (
    <>
      <Navbar />
      <ScrollProgress variant="circle" />

      <div className="min-h-screen bg-background pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2 mb-4 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* ==========================================
                HEADER CARD
                ========================================== */}
            <Card className="overflow-hidden bg-card border-border shadow-xl">
              <CardContent className="p-6 md:p-8">
                {/* Broadcast ID */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="font-mono text-xs text-muted-foreground">
                    SECURE BROADCAST ID: #{announcement.id.slice(0, 8)}
                  </p>
                </div>

                {/* Author & Meta */}
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-lg">
                      {announcement.author?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {announcement.author || "Admin"}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        {announcement.category || "Chung"}
                      </Badge>
                      {announcement.pinned && (
                        <Badge
                          variant="default"
                          className="text-xs gap-1 bg-gradient-to-r from-primary to-secondary"
                        >
                          <Pin className="w-3 h-3" /> Ghim
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "text-xs text-white",
                          getPriorityColor(announcement.priority),
                        )}
                      >
                        {getPriorityLabel(announcement.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatRelativeTime(announcement.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {announcement.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {announcement.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {announcement.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  {announcement.title}
                </h1>
              </CardContent>
            </Card>

            {/* ==========================================
                CONTENT CARD
                ========================================== */}
            <Card className="bg-card border-border shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div
                  className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </CardContent>
            </Card>

            {/* ==========================================
                ACTIONS CARD
                ========================================== */}
            <Card className="bg-card border-border shadow-xl">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  {/* Like Button */}
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "gap-2 rounded-full",
                      isLiked &&
                        "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
                    )}
                    onClick={handleToggleLike}
                    disabled={isTogglingLike}
                  >
                    {isLiked ? (
                      <ThumbsUpFilled className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                    {announcement.likes > 0 && (
                      <span className="text-sm">{announcement.likes}</span>
                    )}
                  </Button>

                  {/* Comment Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={() =>
                      document
                        .getElementById("comment-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    {announcement.comments > 0 && (
                      <span className="text-sm">{announcement.comments}</span>
                    )}
                  </Button>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full ml-auto"
                    onClick={handleDownload}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Tải xuống</span>
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={handleShare}
                    disabled={isShared}
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">
                      {isShared ? "Đã sao chép!" : "Chia sẻ"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ==========================================
                COMMENTS SECTION
                ========================================== */}
            <div id="comment-section">
              <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Bình luận ({announcement.comments || 0})
                  </h3>

                  {/* Comment Input */}
                  {session?.user ? (
                    <form
                      onSubmit={handleSubmitComment}
                      className="flex gap-3 mb-6"
                    >
                      <Avatar className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Viết bình luận..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                          disabled={isSubmitting || isAddingComment}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-shrink-0"
                          disabled={
                            isSubmitting ||
                            isAddingComment ||
                            !commentContent.trim()
                          }
                        >
                          <Send className="w-4 h-4" />
                          <span className="hidden sm:inline">Gửi</span>
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-4 text-center mb-6">
                      <p className="text-muted-foreground text-sm">
                        <Link
                          href="/login"
                          className="text-primary hover:underline font-medium"
                        >
                          Đăng nhập
                        </Link>{" "}
                        để tham gia bình luận
                      </p>
                    </div>
                  )}

                  {/* Comments List */}
                  {isLoadingComments ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-muted-foreground text-sm">
                        Chưa có bình luận nào
                      </p>
                      <p className="text-muted-foreground/70 text-xs">
                        Hãy là người đầu tiên bình luận!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {comments.map((comment: any) => {
                        const isOwner = session?.user?.id === comment.user_id;
                        return (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-3 p-3 rounded-xl bg-muted/30 group hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs">
                                {comment.user_name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  <span className="font-medium text-foreground text-sm truncate">
                                    {comment.user_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {formatRelativeTime(comment.created_at)}
                                  </span>
                                </div>
                                {isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive flex-shrink-0"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    disabled={isDeletingComment}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-foreground text-sm mt-1 break-words">
                                {comment.content}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
