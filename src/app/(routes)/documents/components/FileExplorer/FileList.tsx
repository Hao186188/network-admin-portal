// src/app/(routes)/documents/components/FileExplorer/FileList.tsx

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Download,
  DownloadCloud,
  File,
  Folder,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Document } from "../../types";
import { RenameInput } from "./RenameInput";
import { FileListProps } from "./types";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export function FileList({
  items,
  onFolderClick,
  onDelete,
  onRename,
  selectedItems,
  setSelectedItems,
}: FileListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [isRenamingLoading, setIsRenamingLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [downloadingFolders, setDownloadingFolders] = useState<Set<string>>(
    new Set(),
  );

  const handleSelect = (id: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelectedItems(
        selectedItems.includes(id)
          ? selectedItems.filter((i) => i !== id)
          : [...selectedItems, id],
      );
    } else {
      setSelectedItems([id]);
    }
  };

  // ✅ HANDLE RENAME START
  const handleRenameStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === id);
    if (item?.is_folder) {
      setRenamingId(id);
    }
  };

  // ✅ HANDLE RENAME SAVE
  const handleRenameSave = async (id: string, newName: string) => {
    if (!onRename) return;
    setIsRenamingLoading(true);
    try {
      await onRename(id, newName);
      setRenamingId(null);
      toast.success(`✅ Đã đổi tên thành "${newName}"`);
    } catch (error: any) {
      toast.error(error.message || "Không thể đổi tên");
    } finally {
      setIsRenamingLoading(false);
    }
  };

  // ✅ HANDLE RENAME CANCEL
  const handleRenameCancel = () => {
    setRenamingId(null);
  };

  const handleDownload = (e: React.MouseEvent, item: Document) => {
    e.stopPropagation();
    if (item.file_url) {
      window.open(item.file_url, "_blank");
    }
  };

  const handleDownloadFolder = async (e: React.MouseEvent, item: Document) => {
    e.stopPropagation();
    if (!item.is_folder) return;

    setDownloadingFolders((prev) => new Set(prev).add(item.id));
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
      setDownloadingFolders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-white/40">
        <p>Thư mục trống</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-white/40 border-b border-white/5">
            <th className="pb-2 px-3 font-medium">Tên</th>
            <th className="pb-2 px-3 font-medium hidden sm:table-cell">
              Kích thước
            </th>
            <th className="pb-2 px-3 font-medium hidden md:table-cell">
              Ngày tạo
            </th>
            <th className="pb-2 px-3 font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const isFolder = item.is_folder || false;
            const isSelected = selectedItems.includes(item.id);
            const isFavorite = favorites.has(item.id);
            const isDownloading = downloadingFolders.has(item.id);
            const isRenamingThis = renamingId === item.id;

            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.02, 0.3),
                }}
                className={cn(
                  "border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
                  isSelected && "bg-cyan-500/10",
                )}
                onClick={(e) => handleSelect(item.id, e.ctrlKey || e.metaKey)}
                onDoubleClick={() => {
                  if (isFolder) {
                    onFolderClick(item.id);
                  }
                }}
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-3">
                    {isFolder ? (
                      <Folder className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    )}

                    {/* Name với rename support */}
                    {isRenamingThis && isFolder ? (
                      <RenameInput
                        initialValue={item.title}
                        onSave={(newName) => handleRenameSave(item.id, newName)}
                        onCancel={handleRenameCancel}
                        isLoading={isRenamingLoading}
                      />
                    ) : (
                      <span className="text-sm text-white truncate max-w-[200px]">
                        {item.title}
                      </span>
                    )}

                    {isFolder && !isRenamingThis && (
                      <span className="text-[10px] text-cyan-400/50 font-mono">
                        📁
                      </span>
                    )}
                    {isDownloading && (
                      <span className="text-[10px] text-cyan-400 animate-pulse">
                        Đang nén...
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-sm text-white/40 hidden sm:table-cell">
                  {isFolder ? "—" : formatFileSize(item.file_size)}
                </td>
                <td className="py-2.5 px-3 text-sm text-white/40 hidden md:table-cell">
                  {new Date(item.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Rename button - Chỉ cho folder */}
                    {isFolder && !isRenamingThis && (
                      <button
                        className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                        onClick={(e) => handleRenameStart(e, item.id)}
                        title="Đổi tên thư mục"
                      >
                        <svg
                          className="w-4 h-4"
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
                          "p-1.5 rounded-lg transition-colors",
                          isDownloading
                            ? "text-cyan-400 animate-pulse"
                            : "text-white/30 hover:text-cyan-400 hover:bg-cyan-400/10",
                        )}
                        onClick={(e) => handleDownloadFolder(e, item)}
                        title="Tải xuống toàn bộ thư mục (ZIP)"
                        disabled={isDownloading}
                      >
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download file button */}
                    {!isFolder && (
                      <button
                        className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                        onClick={(e) => handleDownload(e, item)}
                        title="Tải xuống"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    {/* Favorite button */}
                    <button
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isFavorite
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-white/30 hover:text-yellow-400 hover:bg-yellow-400/10",
                      )}
                      onClick={(e) => handleFavorite(e, item.id)}
                      title="Yêu thích"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          isFavorite && "fill-yellow-400",
                        )}
                      />
                    </button>

                    {/* Delete button */}
                    <button
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
