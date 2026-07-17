// src/app/(routes)/documents/components/FileExplorer/FileItem.tsx

"use client";

import { cn } from "@/lib/utils";
import {
  Download,
  DownloadCloud,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  Link as LinkIcon,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RenameInput } from "./RenameInput";
import { FileItemProps } from "./types";

// ============================================
// HÀM LẤY EMOJI THEO LOẠI FILE
// ============================================

const getFileEmoji = (type: string): string => {
  const ext = type.toLowerCase();

  // Documents
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📽️";
  if (["txt", "rtf", "odt"].includes(ext)) return "📃";

  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "📦";

  // Images
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"].includes(ext))
    return "🖼️";

  // Videos
  if (
    ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "3gp"].includes(
      ext,
    )
  )
    return "🎬";

  // Audio
  if (["mp3", "wav", "aac", "flac", "ogg", "m4a", "wma"].includes(ext))
    return "🎵";

  // Code
  if (
    [
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
    ].includes(ext)
  )
    return "💻";
  if (["py", "java", "c", "cpp", "h", "hpp", "go", "rs"].includes(ext))
    return "⚙️";
  if (["sh", "bat", "ps1"].includes(ext)) return "🖥️";
  if (["md"].includes(ext)) return "📝";

  // Network
  if (["pkt", "pka"].includes(ext)) return "🌐";
  if (["cfg", "conf", "log"].includes(ext)) return "⚙️";

  // Link/URL
  if (["url", "webloc"].includes(ext)) return "🔗";

  // Default
  return "📎";
};

// ============================================
// HÀM LẤY ICON COMPONENT
// ============================================

const getFileIcon = (type: string) => {
  const ext = type.toLowerCase();

  if (["pdf"].includes(ext)) return FileText;
  if (["doc", "docx"].includes(ext)) return FileText;
  if (["xls", "xlsx"].includes(ext)) return FileSpreadsheet;
  if (["ppt", "pptx"].includes(ext)) return FileSpreadsheet;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return FileArchive;
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
    return FileImage;
  if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext)) return FileVideo;
  if (["mp3", "wav", "aac", "flac", "ogg"].includes(ext)) return FileAudio;
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(ext))
    return FileCode;
  if (["url", "webloc"].includes(ext)) return LinkIcon;
  return File;
};

// ============================================
// ĐỊNH DẠNG KÍCH THƯỚC FILE
// ============================================

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

// ============================================
// FILE ITEM COMPONENT
// ============================================

export function FileItem({
  item,
  onFolderClick,
  onDelete,
  onRename,
  isSelected,
  onSelect,
}: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenamingLoading, setIsRenamingLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isFolder = item.is_folder || false;
  const isUrl = item.file_type === "url" || item.file_type === "webloc";

  // ============================================
  // HANDLERS
  // ============================================

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(item.id, e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = () => {
    if (isFolder) {
      onFolderClick(item.id);
    } else if (isUrl && item.file_url) {
      window.open(item.file_url, "_blank");
    }
  };

  // ✅ HANDLE RENAME START
  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsRenaming(true);
    }
  };

  // ✅ HANDLE RENAME SAVE
  const handleRenameSave = async (newName: string) => {
    if (!onRename) return;
    setIsRenamingLoading(true);
    try {
      await onRename(item.id, newName);
      setIsRenaming(false);
      toast.success(`✅ Đã đổi tên thành "${newName}"`);
    } catch (error: any) {
      toast.error(error.message || "Không thể đổi tên");
    } finally {
      setIsRenamingLoading(false);
    }
  };

  // ✅ HANDLE RENAME CANCEL
  const handleRenameCancel = () => {
    setIsRenaming(false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUrl && item.file_url) {
      window.open(item.file_url, "_blank");
      return;
    }
    if (item.file_url) {
      const link = document.createElement("a");
      link.href = item.file_url;
      link.download = item.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadFolder = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFolder) return;

    setIsDownloading(true);
    const toastId = toast.loading(`Đang nén thư mục "${item.title}"...`);

    try {
      const response = await fetch(
        `/api/documents/download-folder?folderId=${item.id}`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Không thể tải thư mục");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Đã tải xuống thư mục "${item.title}"`, { id: toastId });
    } catch (error: any) {
      console.error("Error downloading folder:", error);
      toast.error(error.message || "Không thể tải thư mục", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const FileIcon = getFileIcon(item.file_type);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className={cn(
        "relative rounded-xl p-3 transition-all duration-200 cursor-pointer text-center group",
        isSelected
          ? "bg-cyan-500/20 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          : "bg-white/5 hover:bg-white/10 border-2 border-transparent",
        isHovered && "scale-[1.02] shadow-lg shadow-black/20",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Icon */}
      <div className="relative flex items-center justify-center">
        {isFolder ? (
          <div className="w-16 h-16 flex items-center justify-center">
            {isHovered ? (
              <FolderOpen className="w-14 h-14 text-cyan-400 transition-colors" />
            ) : (
              <Folder className="w-14 h-14 text-cyan-400/80 transition-colors" />
            )}
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center relative">
            {isUrl ? (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 border-blue-500/30">
                <LinkIcon className="w-7 h-7 text-blue-400" />
              </div>
            ) : (
              <div className="text-5xl relative">
                {getFileEmoji(item.file_type)}
                {isUrl && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-blue-500/30 px-1 rounded-full">
                    🔗
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Name - with rename support */}
      <div className="mt-2 min-h-[3.5rem]">
        {isRenaming && isFolder ? (
          <RenameInput
            initialValue={item.title}
            onSave={handleRenameSave}
            onCancel={handleRenameCancel}
            isLoading={isRenamingLoading}
          />
        ) : (
          <>
            <p
              className="text-sm text-white/80 truncate px-1"
              title={item.title}
            >
              {item.title}
            </p>
            {!isFolder && (
              <p className="text-[10px] text-white/30">
                {isUrl ? "🔗 Shortcut" : formatFileSize(item.file_size)}
              </p>
            )}
            {isFolder && (
              <p className="text-[10px] text-cyan-400/40">📁 Thư mục</p>
            )}
          </>
        )}
      </div>

      {/* Actions - Hiện khi hover và không đang rename */}
      {isHovered && !isRenaming && (
        <div className="absolute top-1 right-1 flex gap-0.5">
          {/* Rename button - Chỉ cho folder */}
          {isFolder && (
            <button
              className="p-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/40 hover:text-cyan-400 transition-colors"
              onClick={handleRenameStart}
              title="Đổi tên thư mục"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}

          {/* Download folder button */}
          {isFolder && (
            <button
              className={cn(
                "p-1 rounded-lg bg-black/50 backdrop-blur-sm transition-colors",
                isDownloading
                  ? "text-cyan-400 animate-pulse"
                  : "text-white/40 hover:text-cyan-400",
              )}
              onClick={handleDownloadFolder}
              title="Tải xuống toàn bộ thư mục (ZIP)"
              disabled={isDownloading}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Download/Open link button */}
          {!isFolder && (
            <button
              className="p-1 rounded-lg bg-black/50 text-white/40 hover:text-cyan-400 transition-colors backdrop-blur-sm"
              onClick={handleDownload}
              title={isUrl ? "Mở link" : "Tải xuống"}
            >
              {isUrl ? (
                <LinkIcon className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Favorite button */}
          <button
            className={cn(
              "p-1 rounded-lg bg-black/50 backdrop-blur-sm transition-colors",
              isFavorite
                ? "text-yellow-400 hover:text-yellow-300"
                : "text-white/40 hover:text-yellow-400",
            )}
            onClick={handleFavorite}
            title="Yêu thích"
          >
            <Star
              className={cn("w-3.5 h-3.5", isFavorite && "fill-yellow-400")}
            />
          </button>

          {/* Delete button */}
          <button
            className="p-1 rounded-lg bg-black/50 text-white/40 hover:text-red-400 transition-colors backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Checkbox khi selected */}
      {isSelected && (
        <div className="absolute top-1 left-1">
          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Folder indicator */}
      {isFolder && (
        <div className="absolute bottom-1 right-1 text-[10px] text-white/20">
          📁
        </div>
      )}

      {/* URL indicator */}
      {isUrl && !isFolder && (
        <div className="absolute bottom-1 right-1 text-[10px] text-blue-400/40">
          🔗
        </div>
      )}

      {/* Loading overlay khi đang nén */}
      {isDownloading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white/60">Đang nén...</span>
          </div>
        </div>
      )}
    </div>
  );
}
