// src/app/(routes)/lectures/components/FolderExplorer/UploadFileModal.tsx
// MODAL UPLOAD FILE - FIXED

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { File, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadFileModalProps } from "./types";

const SUPPORTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "mp4",
  "mp3",
  "zip",
  "rar",
  "7z",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "txt",
  "md",
  "json",
  "xml",
  "yaml",
];

export function UploadFileModal({
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}: UploadFileModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return SUPPORTED_EXTENSIONS.includes(ext);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateFile);

    if (validFiles.length < droppedFiles.length) {
      const invalidCount = droppedFiles.length - validFiles.length;
      toast.error(`Có ${invalidCount} file không được hỗ trợ`);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(validateFile);
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));
    await onUpload(fileList.files);
    setFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            Tải file lên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
              dragActive
                ? "border-cyan-500 bg-cyan-500/5 scale-[1.02] shadow-lg shadow-cyan-500/20"
                : "border-white/10 hover:border-cyan-500/50",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
            onDragEnter={() => !isLoading && setDragActive(true)}
            onDragLeave={() => !isLoading && setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={!isLoading ? handleDrop : undefined}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
              accept={SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
            />
            <Upload className="w-12 h-12 mx-auto text-white/30 mb-4" />
            <p className="text-white/60">
              Kéo thả file vào đây hoặc{" "}
              <span className="text-cyan-400">click để chọn</span>
            </p>
            <p className="text-xs text-white/30 mt-2">
              Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP4, MP3, ZIP, RAR,
              JPG, PNG, ...
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <File className="w-4 h-4 text-cyan-400" />
                  <span className="flex-1 text-sm text-white truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-white/40">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              onClick={handleSubmit}
              disabled={isLoading || files.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Tải lên ({files.length} file)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
