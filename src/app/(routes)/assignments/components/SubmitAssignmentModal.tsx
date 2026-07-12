// src/app/(routes)/assignments/components/SubmitAssignmentModal.tsx
// FIXED: Xử lý userId có thể undefined

"use client";

import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { File, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

export function SubmitAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: SubmitAssignmentModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { submitAssignment } = useAssignments();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ✅ Lấy user_id từ session với fallback
  const userId = session?.user?.id;
  const isAuthenticated = !!session?.user;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // ✅ Đồng bộ thông báo lỗi với code logic (50MB)
      if (e.target.files[0].size > 50 * 1024 * 1024) {
        toast.error("File quá lớn, tối đa 50MB");
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // ✅ Đồng bộ thông báo lỗi với code logic (50MB)
      if (e.dataTransfer.files[0].size > 50 * 1024 * 1024) {
        toast.error("File quá lớn, tối đa 50MB");
        return;
      }
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để nộp bài");
      return;
    }

    // ✅ Kiểm tra userId tồn tại
    if (!userId) {
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
      );
      return;
    }

    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    setIsUploading(true);
    try {
      // ✅ SỬA: Gửi user_id với type assertion đảm bảo không undefined
      await submitAssignment({
        assignment_id: assignment.id,
        file: file,
        user_id: userId as string, // ✅ Type assertion vì đã kiểm tra ở trên
      });
      toast.success("🎉 Nộp bài thành công!");
      onSuccess();
      onClose();
      setFile(null);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" /> Nộp bài tập
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Assignment Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="font-medium text-foreground">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">
              {assignment.subject}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hạn nộp: {new Date(assignment.due_date).toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-muted-foreground">
              Điểm tối đa: {assignment.points || 10} điểm
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chọn file <span className="text-destructive">*</span>
              </label>
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300",
                  dragActive
                    ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/50 hover:scale-[1.01]",
                )}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {/* Pulse Effect khi drag active */}
                {dragActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-primary/30 pointer-events-none"
                    animate={{
                      scale: [1, 1.02, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block relative"
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <File className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-5xl mb-2">📄</div>
                      <p className="text-sm text-muted-foreground">
                        Click để chọn file hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Hỗ trợ: PDF, DOC, DOCX, ZIP, RAR (tối đa 50MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* File size warning */}
            {file && file.size > 25 * 1024 * 1024 && (
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                ⚠️ File lớn hơn 25MB, thời gian upload có thể lâu hơn
              </p>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Nộp bài
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
