// src/components/common/file-upload.tsx
// Vai trò: Component upload file với drag & drop - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { File, FileText, Image, Upload, Video, X } from "lucide-react";
import { useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: Record<string, string[]>;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "video/*": [".mp4", ".webm", ".avi"],
  },
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Xử lý rejected files
      if (rejectedFiles.length > 0) {
        const errorMessages = rejectedFiles.map((rejection) => {
          const file = rejection.file;
          const errors = rejection.errors.map((e) => e.message).join(", ");
          return `${file.name}: ${errors}`;
        });
        setErrors(errorMessages);
        // Tự động xóa lỗi sau 3 giây
        setTimeout(() => setErrors([]), 3000);
      }

      if (acceptedFiles.length > 0) {
        setFiles((prev) => [...prev, ...acceptedFiles]);
        onFileUpload(acceptedFiles);
        setErrors([]);
      }
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (file.type === "application/pdf") return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          className,
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Kéo thả file vào đây
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              hoặc click để chọn file (tối đa {maxFiles} file, tối đa{" "}
              {formatFileSize(maxSize)})
            </p>
          </div>
          <Button variant="outline" size="sm" type="button">
            Chọn file
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500">
              ⚠️ {error}
            </p>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeFile(index)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
