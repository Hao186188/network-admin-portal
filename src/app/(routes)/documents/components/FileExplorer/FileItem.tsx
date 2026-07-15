// src/app/(routes)/documents/components/FileExplorer/FileItem.tsx
"use client";

import { cn } from "@/lib/utils";
import {
    Download,
    Folder,
    FolderOpen,
    Star,
    Trash2
} from "lucide-react";
import { useState } from "react";
import { FileItemProps } from "./types";

const getFileEmoji = (type: string): string => {
  const ext = type.toLowerCase();
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📽️";
  if (["zip", "rar", "7z"].includes(ext)) return "📦";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "🖼️";
  if (["mp4", "avi", "mov", "mkv"].includes(ext)) return "🎬";
  if (["mp3", "wav", "aac", "flac"].includes(ext)) return "🎵";
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(ext))
    return "💻";
  if (["py", "java", "c", "cpp", "go", "rs"].includes(ext)) return "⚙️";
  if (["pkt", "pka"].includes(ext)) return "🌐";
  return "📎";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export function FileItem({
  item,
  onFolderClick,
  onDelete,
  isSelected,
  onSelect,
}: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isFolder = item.is_folder || false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(item.id, e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = () => {
    if (isFolder) {
      onFolderClick(item.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.file_url) {
      window.open(item.file_url, "_blank");
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Call API to save favorite
  };

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
          <div className="w-16 h-16 text-5xl flex items-center justify-center">
            {getFileEmoji(item.file_type)}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="mt-2">
        <p className="text-sm text-white/80 truncate px-1" title={item.title}>
          {item.title}
        </p>
        {!isFolder && (
          <p className="text-[10px] text-white/30">
            {formatFileSize(item.file_size)}
          </p>
        )}
      </div>

      {/* Actions - Hiện khi hover */}
      {isHovered && (
        <div className="absolute top-1 right-1 flex gap-0.5">
          {!isFolder && (
            <button
              className="p-1 rounded-lg bg-black/50 text-white/40 hover:text-cyan-400 transition-colors backdrop-blur-sm"
              onClick={handleDownload}
              title="Tải xuống"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
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
    </div>
  );
}
