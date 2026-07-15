// src/app/(routes)/documents/[id]/page.tsx
// HOÀN CHỈNH - HỖ TRỢ CẢ DOCUMENT DETAIL VÀ FOLDER VIEW

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { useDocumentsStore } from "@/store/documents-store";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Download,
  Edit2,
  Eye,
  File,
  Folder,
  FolderOpen,
  Heart,
  Home,
  MessageCircle,
  Reply,
  Share2,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DocumentsFilters } from "../components/DocumentsFilters";
import { DocumentsGrid } from "../components/DocumentsGrid";
import { DocumentsPagination } from "../components/DocumentsPagination";
import { DocumentsSearch } from "../components/DocumentsSearch";
import { DocumentsStats } from "../components/DocumentsStats";
import { ExtractedFile, GlobalDropZone } from "../components/GlobalDropZone";
import { useDocumentInteractions } from "../hooks/useDocumentInteractions";
import { useDocuments } from "../hooks/useDocuments";
import { useFolderNavigation } from "../hooks/useFolderNavigation";
import { Document } from "../types";

// ============================================
// COMPONENT CHÍNH
// ============================================

export default function DynamicDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isFolder, setIsFolder] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra loại nội dung
  useEffect(() => {
    const checkType = async () => {
      if (!id) {
        router.push("/documents");
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          console.error("Error fetching document:", fetchError);
          setError("Không tìm thấy tài liệu");
          toast.error("Không tìm thấy tài liệu");
          setTimeout(() => router.push("/documents"), 2000);
          return;
        }

        if (data) {
          setDocumentData(data);
          setIsFolder(data.is_folder || false);
        } else {
          setError("Không tìm thấy dữ liệu");
          router.push("/documents");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        toast.error("Có lỗi xảy ra");
        router.push("/documents");
      } finally {
        setLoading(false);
      }
    };

    checkType();
  }, [id, router]);

  // Loading skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error || !documentData) {
    return <ErrorState error={error} />;
  }

  // Render dựa vào loại
  if (isFolder) {
    return <FolderView folderId={id} folderData={documentData} />;
  }

  return <DocumentDetailView documentId={id} />;
}

// ============================================
// LOADING SKELETON
// ============================================

function LoadingSkeleton() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/3" />
            <div className="h-12 bg-white/10 rounded w-3/4" />
            <div className="h-64 bg-white/10 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-4/6" />
            </div>
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

function ErrorState({ error }: { error: string | null }) {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <File className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {error || "Không tìm thấy tài liệu"}
          </h2>
          <p className="text-white/40 mb-4">
            Tài liệu có thể đã bị xóa hoặc di chuyển
          </p>
          <button
            onClick={() => router.push("/documents")}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            Quay lại thư viện
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ============================================
// DOCUMENT DETAIL VIEW
// ============================================

function DocumentDetailView({ documentId }: { documentId: string }) {
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
  } = useDocumentInteractions(documentId);

  // Increment view
  useEffect(() => {
    if (document && !hasIncrementedView.current && !loading) {
      incrementView();
      hasIncrementedView.current = true;
    }
  }, [document, loading, incrementView]);

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

  const handleRate = async (rating: number) => {
    try {
      await rateDocument(rating);
      await refreshInteractions();

      if (!hasTriggeredRefresh.current) {
        triggerRefresh();
        hasTriggeredRefresh.current = true;
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
        toast.success("Đã sao chép link");
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success("Đã sao chép link");
          setTimeout(() => setCopied(false), 3000);
        } catch {
          toast.error("Không thể chia sẻ hoặc sao chép link");
        }
      }
    }
  };

  if (loading || !document) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/documents")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
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
                    className="border-white/10 hover:border-primary/50"
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
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {document.uploaded_by_name || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(document.created_at).toLocaleDateString("vi-VN")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {document.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {document.downloads || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {commentsCount}
                </span>
              </div>
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">
                {document.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500"
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
            className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {ratingAvg ? ratingAvg.toFixed(1) : "0.0"}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
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
                <div className="text-sm text-white/60 mb-2">
                  Đánh giá tài liệu này
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={cn(
                        "p-2 rounded-lg transition-all hover:scale-110",
                        userRating === star
                          ? "bg-yellow-500/20 border-yellow-500/30"
                          : "hover:bg-white/5",
                      )}
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
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
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Bình luận ({commentsCount})
            </h2>

            {session?.user ? (
              <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1"
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 whitespace-nowrap"
                >
                  Gửi
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 text-white/40 border border-white/10 rounded-xl mb-6">
                <p>
                  Vui lòng{" "}
                  <a href="/login" className="text-cyan-400 hover:underline">
                    đăng nhập
                  </a>{" "}
                  để bình luận
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {comment.user?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-white text-sm">
                            {comment.user?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(comment.created_at).toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                          {comment.is_edited && (
                            <span className="text-xs text-white/30">
                              (đã chỉnh sửa)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/80 mt-1 break-words">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id,
                              )
                            }
                            className="text-xs text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" /> Phản hồi
                          </button>
                          {session?.user?.id === comment.user_id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Xóa
                            </button>
                          )}
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex flex-col sm:flex-row gap-2">
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
                                className="bg-gradient-to-r from-cyan-500 to-blue-500"
                              >
                                Phản hồi
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReplyingTo(null)}
                                className="border-white/10"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-3">
                            {comment.replies.map((reply: any) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                                  {reply.user?.name?.[0] || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-white text-xs">
                                      {reply.user?.name || "Unknown"}
                                    </span>
                                    <span className="text-[10px] text-white/40">
                                      {new Date(
                                        reply.created_at,
                                      ).toLocaleString("vi-VN")}
                                    </span>
                                  </div>
                                  <p className="text-xs text-white/70 mt-0.5 break-words">
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
                                    <Trash2 className="w-3 h-3" />
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

// ============================================
// FOLDER VIEW
// ============================================

function FolderView({
  folderId,
  folderData,
}: {
  folderId: string;
  folderData: Document;
}) {
  const router = useRouter();

  const {
    currentFolderId,
    breadcrumbs,
    folderItems,
    loading: folderLoading,
    navigateToIndex,
    refresh: refreshFolder,
  } = useFolderNavigation();

  const {
    documents,
    loading: docLoading,
    error,
    stats,
    pagination,
    changePage,
    refresh,
    uploadDocument,
    updateDocument,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedFileType, setSelectedFileType] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  // Xử lý upload folder
  const handleFolderUpload = useCallback(
    async (files: ExtractedFile[], folderId: string | null) => {
      const fileData = await Promise.all(
        files.map(async (f) => {
          const buffer = await f.file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          return {
            file: base64,
            relativePath: f.relativePath,
            fileName: f.fileName,
            folderPath: f.folderPath,
          };
        }),
      );

      const response = await fetch("/api/documents/upload-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: fileData, parentId: folderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      if (result.failCount > 0) {
        toast.warning(
          `Upload: ${result.successCount} thành công, ${result.failCount} thất bại`,
        );
      }
      return result;
    },
    [],
  );

  const handleUploadSuccess = useCallback(() => {
    toast.success("Đã tải lên thành công!");
    refresh();
    refreshFolder();
  }, [refresh, refreshFolder]);

  const handleDownload = useCallback((doc: Document) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
      toast.success(`Đang tải xuống: ${doc.title}`);
    } else {
      toast.error("File không khả dụng");
    }
  }, []);

  const handleFavorite = useCallback((doc: Document) => {
    const isFavorite = doc.is_favorite || false;
    toast.success(`Đã ${isFavorite ? "bỏ" : "thêm"} yêu thích`);
  }, []);

  const handleEdit = useCallback((doc: Document) => {
    setSelectedDocument(doc);
    setIsEditModalOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refresh();
    refreshFolder();
  }, [refresh, refreshFolder]);

  // Lọc dữ liệu
  const displayItems = folderItems.length > 0 ? folderItems : documents;

  const filteredDocuments = displayItems.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "Tất cả" || doc.category === selectedCategory;

    const matchesSubject =
      selectedSubject === "Tất cả" || doc.subject === selectedSubject;

    const matchesFileType =
      selectedFileType === "Tất cả" ||
      doc.file_type?.toLowerCase() === selectedFileType.toLowerCase();

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags?.includes(tag));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubject &&
      matchesFileType &&
      matchesTags
    );
  });

  const loading = folderLoading || docLoading;
  const totalPages = Math.ceil(
    (pagination.total || 0) / (pagination.limit || 12),
  );

  return (
    <GlobalDropZone
      currentFolderId={folderId}
      onUpload={handleFolderUpload}
      onUploadComplete={handleUploadSuccess}
    >
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* Folder Hero */}
        <div className="relative pt-20 pb-8 px-4 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/documents")}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {folderData.title}
                    </h1>
                    {folderData.description && (
                      <p className="text-white/40 text-sm">
                        {folderData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          {/* Breadcrumbs */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm text-white/60 bg-black/40 p-3 rounded-xl border border-white/5">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <div key={crumb.id || "root"} className="flex items-center">
                    {idx > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 mx-1" />
                    )}
                    <button
                      onClick={() => navigateToIndex(idx)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all",
                        isLast
                          ? "text-cyan-400 font-semibold bg-cyan-500/10 cursor-default"
                          : "hover:text-white hover:bg-white/5",
                      )}
                      disabled={isLast}
                    >
                      {idx === 0 ? (
                        <Home className="w-3.5 h-3.5" />
                      ) : isLast ? (
                        <FolderOpen className="w-3.5 h-3.5" />
                      ) : (
                        <Folder className="w-3.5 h-3.5" />
                      )}
                      <span className="truncate max-w-[120px] sm:max-w-[200px]">
                        {crumb.title}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6">
            <DocumentsStats
              total={stats.total}
              downloads={stats.downloads}
              views={stats.views}
              recentUploads={stats.recent_uploads}
              totalSize={stats.total_size}
              loading={loading}
            />
          </div>

          {/* Search */}
          <div className="mt-6">
            <DocumentsSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm trong thư mục..."
            />
          </div>

          {/* Filters */}
          <div className="mt-6">
            <DocumentsFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedFileType={selectedFileType}
              setSelectedFileType={setSelectedFileType}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              categories={stats.categories || []}
              tags={stats.tags || []}
              subjects={stats.subjects || []}
            />
          </div>

          {/* Grid */}
          <div className="mt-6">
            <DocumentsGrid
              documents={filteredDocuments}
              loading={loading}
              error={error}
              viewMode={viewMode}
              onDownload={handleDownload}
              onFavorite={handleFavorite}
              onEdit={handleEdit}
              onRetry={refresh}
              onUpload={() => {}}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Pagination */}
          {!loading && filteredDocuments.length > 0 && (
            <DocumentsPagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={changePage}
              className="mt-8"
            />
          )}

          {/* Empty state */}
          {!loading && filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Folder className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white/80 mb-2">
                Thư mục trống
              </h3>
              <p className="text-white/40">
                Kéo thả file hoặc thư mục vào đây để tải lên
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </GlobalDropZone>
  );
}
