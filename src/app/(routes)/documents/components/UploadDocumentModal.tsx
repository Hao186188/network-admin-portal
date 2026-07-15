// src/app/(routes)/documents/components/UploadDocumentModal.tsx
// FIXED: Xử lý file .rar

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { File, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onUpload: (file: File, metadata: any) => Promise<any>;
}

const CATEGORIES = [
  "Tài liệu",
  "Giáo trình",
  "Bài giảng",
  "Hướng dẫn",
  "Bài tập",
  "Ôn tập",
  "Đề thi",
];

const SUBJECTS = [
  "Quản trị Mạng 3",
  "Bảo mật Mạng",
  "Linux Server",
  "Mạng máy tính",
  "Python",
  "Docker",
];

// ✅ Danh sách extension được hỗ trợ - ĐẦY ĐỦ
const SUPPORTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "rtf",
  "odt",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "js",
  "ts",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "yml",
  "md",
  "py",
  "java",
  "c",
  "cpp",
  "go",
  "rs",
  "sh",
  "bat",
  "pkt",
  "pka",
  "cfg",
  "conf",
  "log",
];

export function UploadDocumentModal({
  isOpen,
  onClose,
  onSuccess,
  onUpload,
}: UploadDocumentModalProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tài liệu");
  const [subject, setSubject] = useState("Quản trị Mạng 3");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!session?.user;

  const validateFile = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    // Kiểm tra extension
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      return `File .${ext} không được hỗ trợ. Các định dạng hỗ trợ: ${SUPPORTED_EXTENSIONS.join(", ")}`;
    }

    // Kiểm tra kích thước (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return "File quá lớn, tối đa 50MB";
    }

    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setFile(file);
      if (!title) setTitle(file.name.split(".")[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setFile(file);
      if (!title) setTitle(file.name.split(".")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tải lên tài liệu");
      return;
    }

    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsUploading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onUpload(file, {
        title: title.trim(),
        description: description.trim(),
        category,
        subject,
        tags: tagsArray,
      });

      toast.success("Đã tải lên tài liệu thành công!");
      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMsg = error.message || "Có lỗi xảy ra khi tải lên";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("Tài liệu");
    setSubject("Quản trị Mạng 3");
    setTags("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-cyan-400" /> Đăng tài liệu mới
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              File <span className="text-red-400">*</span>
            </label>
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300",
                dragActive
                  ? "border-cyan-500 bg-cyan-500/5 scale-[1.02] shadow-lg shadow-cyan-500/20"
                  : "border-white/10 hover:border-cyan-500/50",
                isUploading && "opacity-50 cursor-not-allowed",
                error && "border-red-500/50",
              )}
              onDragEnter={() => !isUploading && setDragActive(true)}
              onDragLeave={() => !isUploading && setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={!isUploading ? handleDrop : undefined}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
                accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <File className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/40">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-white/40 hover:text-red-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setError(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-white/60">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, 7Z,
                    JPG, PNG, MP4, MP3 (tối đa 50MB)
                  </p>
                </>
              )}
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tài liệu..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none"
              disabled={isUploading}
            />
          </div>

          {/* Category & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                disabled={isUploading}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                disabled={isUploading}
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Thẻ (cách nhau bằng dấu phẩy)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="VD: CCNA, Cisco, Mạng máy tính"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              disabled={isUploading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
              onClick={onClose}
              disabled={isUploading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              disabled={isUploading || !file || !isAuthenticated}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Đăng tài liệu
                </>
              )}
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-yellow-400/80 text-center">
              ⚠️ Vui lòng đăng nhập để tải lên tài liệu
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
