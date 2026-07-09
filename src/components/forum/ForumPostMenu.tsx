// src/components/forum/ForumPostMenu.tsx
// Vai trò: Menu 3 chấm cho bài viết forum

"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import {
    Bookmark,
    Copy,
    Edit,
    Flag,
    Lock,
    MoreHorizontal,
    Pin,
    Trash2,
    Unlock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ForumPostMenuProps {
  postId: string;
  authorId: string;
  isPinned: boolean;
  isLocked: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onLock?: () => void;
  className?: string;
}

export function ForumPostMenu({
  postId,
  authorId,
  isPinned,
  isLocked,
  onEdit,
  onDelete,
  onPin,
  onLock,
  className,
}: ForumPostMenuProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const isAuthor = session?.user?.id === authorId;
  const isAdmin = session?.user?.role === "ADMIN";
  const isTeacher = session?.user?.role === "TEACHER";
  const canModerate = isAdmin || isTeacher;

  // Sao chép link
  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/forum/${postId}`;
      await navigator.clipboard.writeText(url);
      toast.success("📋 Đã sao chép link bài viết");
    } catch (error) {
      toast.error("Không thể sao chép link");
    }
    setIsOpen(false);
  };

  // Lưu bài viết
  const savePost = async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để lưu bài viết");
      return;
    }

    setIsLoading(true);
    try {
      // Kiểm tra đã lưu chưa
      const { data: existing } = await supabase
        .from("saved_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existing) {
        // Bỏ lưu
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.user.id);

        if (error) throw error;
        toast.success("Đã bỏ lưu bài viết");
      } else {
        // Lưu bài viết
        const { error } = await supabase.from("saved_posts").insert({
          post_id: postId,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        toast.success("💾 Đã lưu bài viết");
      }
    } catch (error: any) {
      logger.error("Error saving post:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Báo cáo bài viết
  const reportPost = async () => {
    if (!reportReason.trim()) {
      toast.error("Vui lòng nhập lý do báo cáo");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("reports").insert({
        post_id: postId,
        user_id: session?.user?.id,
        reason: reportReason.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("📩 Đã gửi báo cáo. Cảm ơn bạn!");
      setShowReportDialog(false);
      setReportReason("");
    } catch (error: any) {
      logger.error("Error reporting post:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Xóa bài viết
  const deletePost = async () => {
    setIsLoading(true);
    try {
      // Xóa attachments trước
      const { data: attachments } = await supabase
        .from("forum_attachments")
        .select("file_url")
        .eq("post_id", postId);

      if (attachments && attachments.length > 0) {
        // Xóa file trong storage
        for (const att of attachments) {
          const filePath = att.file_url.split("/").pop();
          if (filePath) {
            await supabase.storage.from("forum-attachments").remove([filePath]);
          }
        }

        // Xóa attachments trong DB
        await supabase.from("forum_attachments").delete().eq("post_id", postId);
      }

      // Xóa replies
      await supabase.from("forum_replies").delete().eq("post_id", postId);

      // Xóa bài viết
      const { error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast.success("🗑️ Đã xóa bài viết");
      onDelete?.();
      router.push("/forum");
    } catch (error: any) {
      logger.error("Error deleting post:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa bài viết");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setIsOpen(false);
    }
  };

  // Pin/Unpin bài viết
  const togglePin = async () => {
    if (!canModerate) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({
          is_pinned: !isPinned,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (error) throw error;

      toast.success(isPinned ? "Đã gỡ ghim bài viết" : "📌 Đã ghim bài viết");
      onPin?.();
    } catch (error: any) {
      logger.error("Error toggling pin:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Lock/Unlock bài viết
  const toggleLock = async () => {
    if (!canModerate) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({
          is_locked: !isLocked,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (error) throw error;

      toast.success(isLocked ? "Đã mở khóa bài viết" : "🔒 Đã khóa bài viết");
      onLock?.();
    } catch (error: any) {
      logger.error("Error toggling lock:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Nếu chưa đăng nhập, không hiển thị gì
  if (!session?.user) return null;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "p-2 rounded-full hover:bg-muted transition-colors",
              className,
            )}
            disabled={isLoading}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Tác giả hoặc Admin mới có quyền chỉnh sửa/xóa */}
          {(isAuthor || canModerate) && (
            <>
              <DropdownMenuItem onClick={onEdit} disabled={isLoading}>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa bài viết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa bài viết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Admin/Teacher chỉ có quyền moderate */}
          {canModerate && (
            <>
              <DropdownMenuItem onClick={togglePin} disabled={isLoading}>
                <Pin
                  className={cn("w-4 h-4 mr-2", isPinned && "text-primary")}
                />
                {isPinned ? "Gỡ ghim" : "Ghim bài viết"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleLock} disabled={isLoading}>
                {isLocked ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Mở khóa
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Khóa bài viết
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Tính năng chung */}
          <DropdownMenuItem onClick={savePost} disabled={isLoading}>
            <Bookmark className="w-4 h-4 mr-2" />
            Lưu bài viết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyLink} disabled={isLoading}>
            <Copy className="w-4 h-4 mr-2" />
            Sao chép link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowReportDialog(true)}
            disabled={isLoading}
          >
            <Flag className="w-4 h-4 mr-2" />
            Báo cáo vi phạm
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
              thể hoàn tác.
              <br />
              <br />
              <span className="font-medium text-destructive">Lưu ý:</span> Tất
              cả phản hồi và file đính kèm sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePost}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Đang xóa..." : "Xóa bài viết"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog báo cáo */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Báo cáo vi phạm</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng mô tả lý do bạn báo cáo bài viết này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do báo cáo..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={reportPost}
              disabled={isLoading || !reportReason.trim()}
            >
              {isLoading ? "Đang gửi..." : "Gửi báo cáo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
