// src/app/(routes)/assignments/components/SubmitAssignmentModal.tsx
// Vai trò: Modal nộp bài tập - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { File, Upload, X } from "lucide-react";
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
  const { toast } = useToast();
  const { submitAssignment } = useAssignments();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
      if (e.dataTransfer.files[0].size > 50 * 1024 * 1024) {
        toast.error("File quá lớn, tối đa 50MB");
        return;
      }
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    setIsUploading(true);
    try {
      // ✅ Sửa: submitAssignment nhận object
      await submitAssignment({
        assignment_id: assignment.id,
        file: file,
        user_id: "current-user-id", // Sẽ được lấy từ session trong hook
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
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
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
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="font-medium">{assignment.title}</p>
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
              <label className="text-sm font-medium mb-2 block">
                Chọn file <span className="text-destructive">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <File className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-sm text-muted-foreground">
                        Click để chọn file hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hỗ trợ: PDF, DOC, DOCX, ZIP, RAR (tối đa 50MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
                className="flex-1 gap-2"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
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
