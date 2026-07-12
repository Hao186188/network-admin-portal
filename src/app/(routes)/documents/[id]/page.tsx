// src/app/(routes)/documents/[id]/page.tsx
// HOÀN CHỈNH - FIX SKELETON COMMENTS & RATING SYNC

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDocumentsStore } from "@/store/documents-store";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Download,
  Edit2,
  Eye,
  Heart,
  MessageCircle,
  Reply,
  Share2,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDocumentInteractions } from "../hooks/useDocumentInteractions";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasIncrementedView = useRef(false);
  const hasTriggeredRefresh = useRef(false);

  const { triggerRefresh } = useDocumentsStore();

  const {
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
    refresh: refreshInteractions,
  } = useDocumentInteractions(id as string);

  // ✅ Increment view 1 lần
  useEffect(() => {
    if (document && !hasIncrementedView.current && !loading) {
      console.log("📊 Incrementing view for document:", document.id);
      incrementView();
      hasIncrementedView.current = true;
    }
  }, [document, loading]);

  const handleDownload = async () => {
    if (document?.file_url) {
      window.open(document.file_url, "_blank");
      await incrementDownload();
      toast.success("Đang tải xuống...");
    } else {
      toast.error("File không khả dụng");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
      toast.success("Đã thêm bình luận");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      await addComment(replyContent, parentId);
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Đã thêm phản hồi");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setDeleteCommentId(commentId);
    setIsConfirmOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      await deleteComment(deleteCommentId);
      toast.success("Đã xóa bình luận");
    } catch (error: any) {
      toast.error(error.message);
    }
    setDeleteCommentId(null);
  };

  // ✅ Rate document - trigger refresh từ đây
  const handleRate = async (rating: number) => {
    try {
      await rateDocument(rating);
      await refreshInteractions();

      // ✅ Trigger refresh từ store (CHỈ 1 LẦN)
      if (!hasTriggeredRefresh.current) {
        triggerRefresh();
        hasTriggeredRefresh.current = true;
        console.log("🔄 Triggered refresh from detail page");
      }

      toast.success("Đã đánh giá tài liệu");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = () => {
    router.push(`/documents/${document?.id}/edit`);
  };

  const handleLike = async () => {
    try {
      await toggleLike();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.innerWidth < 768) {
        await navigator.share({
          title: document?.title || "Tài liệu",
          text: `Xem tài liệu: ${document?.title}`,
          url: url,
        });
        toast.success("Đã chia sẻ thành công!");
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Đã sao chép link vào clipboard");
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success("Đã sao chép link vào clipboard");
          setTimeout(() => setCopied(false), 3000);
        } catch (clipError) {
          toast.error("Không thể chia sẻ hoặc sao chép link");
        }
      }
    }
  };

  // ✅ Hiển thị skeleton khi loading
  if (loading || !document) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
            <div className="animate-pulse space-y-6 md:space-y-8">
              <div className="h-8 md:h-12 bg-white/10 rounded w-3/4" />
              <div className="h-48 md:h-64 bg-white/10 rounded" />
              <div className="space-y-3 md:space-y-4">
                <div className="h-3 md:h-4 bg-white/10 rounded w-full" />
                <div className="h-3 md:h-4 bg-white/10 rounded w-5/6" />
                <div className="h-3 md:h-4 bg-white/10 rounded w-4/6" />
              </div>
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-4/6" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/documents")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 md:mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </motion.button>

          {/* Document Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {document.title}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  {session?.user?.id === document.uploaded_by && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="border-white/10 hover:border-cyan-500/50"
                    >
                      <Edit2 className="w-4 h-4 text-cyan-400" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={cn(
                      "border-white/10 hover:border-primary/50",
                      isLiked && "bg-red-500/20 border-red-500/30 text-red-500",
                    )}
                  >
                    <Heart
                      className={cn("w-4 h-4", isLiked && "fill-red-500")}
                    />
                    <span className="hidden sm:inline ml-1">{likes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="border-white/10 hover:border-primary/50 relative"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-4 text-xs sm:text-sm text-white/60">
                <span className="flex items-center gap-1 min-w-0">
                  <User className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">
                    {document.uploaded_by_name || "Unknown"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  {new Date(document.created_at).toLocaleDateString("vi-VN")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  {document.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  {document.downloads || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 md:w-4 md:h-4" />
                  {likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {commentsCount}
                </span>
              </div>
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {document.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {document.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button
                onClick={handleDownload}
                className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                Tải xuống
              </Button>
            </div>
          </motion.div>

          {/* Rating Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 md:mt-8 p-4 md:p-6 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {ratingAvg ? ratingAvg.toFixed(1) : "0.0"}
                  </div>
                  <div className="flex gap-0.5 md:gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-3 h-3 md:w-4 md:h-4",
                          star <= (ratingAvg || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/20",
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-white/40">
                    {ratingAvg
                      ? `${ratingAvg.toFixed(1)}/5`
                      : "Chưa có đánh giá"}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs md:text-sm text-white/60 mb-2">
                  Đánh giá tài liệu này
                </div>
                <div className="flex gap-1 md:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={cn(
                        "p-1.5 md:p-2 rounded-lg transition-all hover:scale-110",
                        userRating === star
                          ? "bg-yellow-500/20 border-yellow-500/30"
                          : "hover:bg-white/5",
                      )}
                    >
                      <Star
                        className={cn(
                          "w-5 h-5 md:w-6 md:h-6 transition-colors",
                          userRating !== null && star <= userRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30",
                        )}
                      />
                    </button>
                  ))}
                </div>
                {userRating && (
                  <div className="text-xs text-white/40 mt-1">
                    Bạn đã đánh giá {userRating} sao
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 md:mt-8"
          >
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              Bình luận ({commentsCount})
            </h2>

            {session?.user ? (
              <form
                onSubmit={handleAddComment}
                className="flex gap-2 md:gap-3 mb-4 md:mb-6"
              >
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1 text-sm md:text-base"
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-sm md:text-base whitespace-nowrap"
                >
                  Gửi
                </Button>
              </form>
            ) : (
              <div className="text-center py-3 md:py-4 text-white/40 border border-white/10 rounded-xl mb-4 md:mb-6">
                <p className="text-sm md:text-base">
                  Vui lòng{" "}
                  <a href="/login" className="text-cyan-400 hover:underline">
                    đăng nhập
                  </a>{" "}
                  để bình luận
                </p>
              </div>
            )}

            {/* Comments List - FIXED Skeleton */}
            <div className="space-y-3 md:space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="p-3 md:p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-[10px] md:text-sm font-medium flex-shrink-0">
                        {comment.user?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 md:gap-2">
                          <span className="font-medium text-white text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                            {comment.user?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] md:text-xs text-white/40">
                            {new Date(comment.created_at).toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                          {comment.is_edited && (
                            <span className="text-[10px] md:text-xs text-white/30">
                              (đã chỉnh sửa)
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-white/80 mt-1 break-words">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id,
                              )
                            }
                            className="text-[10px] md:text-xs text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1"
                          >
                            <Reply className="w-2.5 h-2.5 md:w-3 md:h-3" /> Phản
                            hồi
                          </button>
                          {session?.user?.id === comment.user_id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-[10px] md:text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />{" "}
                              Xóa
                            </button>
                          )}
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-2 md:mt-3 flex flex-col sm:flex-row gap-2">
                            <Input
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Viết phản hồi..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1 text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-sm"
                              >
                                Phản hồi
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReplyingTo(null)}
                                className="border-white/10 text-sm"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-2 md:mt-3 pl-2 md:pl-4 border-l-2 border-white/10 space-y-2 md:space-y-3">
                            {comment.replies.map((reply: any) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2 md:gap-3"
                              >
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[8px] md:text-[10px] font-medium flex-shrink-0">
                                  {reply.user?.name?.[0] || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                                    <span className="font-medium text-white text-[10px] md:text-xs truncate max-w-[80px] md:max-w-none">
                                      {reply.user?.name || "Unknown"}
                                    </span>
                                    <span className="text-[8px] md:text-[10px] text-white/40">
                                      {new Date(
                                        reply.created_at,
                                      ).toLocaleString("vi-VN")}
                                    </span>
                                  </div>
                                  <p className="text-[10px] md:text-xs text-white/70 mt-0.5 break-words">
                                    {reply.content}
                                  </p>
                                </div>
                                {session?.user?.id === reply.user_id && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(reply.id)
                                    }
                                    className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                                  >
                                    <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>Chưa có bình luận nào</p>
                  <p className="text-xs mt-1">
                    Hãy là người đầu tiên bình luận
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteCommentId(null);
        }}
        onConfirm={confirmDeleteComment}
        title="Xóa bình luận"
        description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </>
  );
}
