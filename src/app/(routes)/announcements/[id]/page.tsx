// src/app/(routes)/announcements/[id]/page.tsx
// Vai trò: Trang chi tiết thông báo - HOÀN CHỈNH

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
import { useAnnouncements } from "@/hooks/use-announcements";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Eye,
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
import { useCallback, useEffect, useRef, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const headerVariants = {
  hidden: { y: -20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 25 },
  },
};

const isValidUUID = (str: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const {
    getAnnouncementDetail,
    toggleLike,
    getComments,
    addComment,
    deleteComment,
  } = useAnnouncements();

  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const announcementId = params.id as string;
  const hasFetchedRef = useRef(false);

  // ============================================
  // FETCH DATA
  // ============================================

  const fetchData = useCallback(async () => {
    if (hasFetchedRef.current) {
      return;
    }

    if (!announcementId) {
      setError("ID thông báo không hợp lệ");
      setLoading(false);
      return;
    }

    if (!isValidUUID(announcementId)) {
      console.error(`❌ Invalid UUID: ${announcementId}`);
      setError("ID thông báo không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Fetching detail: ${announcementId}`);

      const data = await getAnnouncementDetail(announcementId);

      if (!data) {
        setError("Không tìm thấy thông báo");
        setLoading(false);
        return;
      }

      setAnnouncement(data);
      setLikesCount(data.likes || 0);

      const commentsData = await getComments(announcementId);
      setComments(commentsData || []);

      if (session?.user) {
        const { data: likeData } = await supabase
          .from("announcement_likes")
          .select("*")
          .eq("announcement_id", announcementId)
          .eq("user_id", session.user.id)
          .maybeSingle();
        setIsLiked(!!likeData);
      }

      hasFetchedRef.current = true;
    } catch (err) {
      console.error("Error fetching announcement:", err);
      setError("Có lỗi xảy ra khi tải thông báo");
    } finally {
      setLoading(false);
    }
  }, [announcementId, getAnnouncementDetail, getComments, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    const result = await toggleLike(announcementId);
    if (result) {
      setIsLiked(result.liked);
      setLikesCount((prev) =>
        result.liked ? prev + 1 : Math.max(0, prev - 1),
      );
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    try {
      const newComment = await addComment(announcementId, commentContent);
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setCommentContent("");
        toast.success("Bình luận thành công!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Có lỗi xảy ra khi bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

    const result = await deleteComment(commentId);
    if (result) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: announcement.title,
          text: announcement.content.replace(/<[^>]*>/g, ""),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch (error) {
      toast.error("Không thể chia sẻ");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "⚠️ Khẩn cấp";
      case "medium":
        return "📌 Quan trọng";
      case "low":
        return "ℹ️ Thông thường";
      default:
        return "Bình thường";
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive bg-slate-900/50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-50" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  Không tìm thấy thông báo
                </h2>
                <p className="text-slate-400 mb-4">
                  {error || "Thông báo không tồn tại hoặc đã bị xóa"}
                </p>
                <p className="text-xs text-slate-500 font-mono mb-4">
                  ID: {announcementId}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/announcements">
                    <Button className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại danh sách
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="gap-2 border-slate-700 text-slate-400 hover:text-white"
                    onClick={() => {
                      hasFetchedRef.current = false;
                      window.location.reload();
                    }}
                  >
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Link href="/announcements">
            <Button
              variant="ghost"
              className="gap-2 mb-4 hover:bg-slate-800/50 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Button>
          </Link>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={headerVariants}>
              <Card className="overflow-hidden border-border/50 bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/50">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="font-mono text-xs text-slate-500">
                      SECURE BROADCAST ID: #{announcement.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <Avatar className="w-12 h-12 border-2 border-cyan-500/20">
                      <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg">
                        {announcement.author?.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-200">
                          {announcement.author || "Admin"}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs border-cyan-500/30 text-cyan-400"
                        >
                          {announcement.category || "Chung"}
                        </Badge>
                        {announcement.pinned && (
                          <Badge
                            variant="default"
                            className="text-xs gap-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                          >
                            <Pin className="w-3 h-3" />
                            Ghim
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
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatRelativeTime(announcement.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {announcement.views || 0} lượt xem
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-400"
                  >
                    {announcement.title}
                  </motion.h1>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div
                    className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 rounded-full hover:bg-cyan-500/10",
                        isLiked && "text-cyan-400",
                      )}
                      onClick={handleLike}
                    >
                      {isLiked ? (
                        <ThumbsUpFilled className="w-5 h-5 fill-cyan-400" />
                      ) : (
                        <ThumbsUp className="w-5 h-5" />
                      )}
                      {likesCount > 0 && likesCount}
                    </Button>
                    <Button
                      variant="ghost"
                      className="gap-2 rounded-full hover:bg-cyan-500/10"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {comments.length}
                    </Button>
                    <Button
                      variant="ghost"
                      className="gap-2 rounded-full ml-auto hover:bg-cyan-500/10"
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5" />
                      Chia sẻ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    Bình luận ({comments.length})
                  </h3>

                  {session?.user ? (
                    <form
                      onSubmit={handleAddComment}
                      className="flex gap-3 mb-6"
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                          {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Viết bình luận..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500"
                          disabled={isSubmitting || !commentContent.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-slate-500 text-sm mb-4">
                      <Link
                        href="/login"
                        className="text-cyan-400 hover:underline"
                      >
                        Đăng nhập
                      </Link>{" "}
                      để bình luận
                    </p>
                  )}

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {comments.length === 0 ? (
                      <p className="text-slate-500 text-sm text-center py-4">
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                      </p>
                    ) : (
                      comments.map((comment) => {
                        const isOwner = session?.user?.id === comment.user_id;
                        return (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 p-3 rounded-xl bg-slate-800/50 group"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                                {comment.user_name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-200 text-sm">
                                    {comment.user_name}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {formatRelativeTime(comment.created_at)}
                                  </span>
                                </div>
                                {isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-slate-300 text-sm mt-1">
                                {comment.content}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
