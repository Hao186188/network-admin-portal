// src/app/(routes)/documents/components/DocumentsCard.tsx
// THÊM onRefresh PROP

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Download,
  Edit2,
  Eye,
  File,
  FileText,
  Heart,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Document } from "../types";

interface DocumentsCardProps {
  document: Document;
  viewMode: "grid" | "list";
  index: number;
  onDownload: (doc: Document) => void;
  onFavorite: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onRefresh?: () => void; // ✅ Thêm onRefresh
}

const getFileIcon = (type: string) => {
  const map: Record<string, any> = {
    pdf: File,
    ppt: File,
    pptx: File,
    doc: FileText,
    docx: FileText,
    xls: File,
    xlsx: File,
  };
  return map[type] || File;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export function DocumentsCard({
  document,
  viewMode,
  index,
  onDownload,
  onFavorite,
  onEdit,
  onRefresh,
}: DocumentsCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(document.is_favorite || false);
  const [localDownloads, setLocalDownloads] = useState(document.downloads || 0);
  const [localRating, setLocalRating] = useState(document.rating || 0);
  const FileIcon = getFileIcon(document.file_type);

  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavorite({ ...document, is_favorite: newState });
  };

  const handleCardClick = () => {
    router.push(`/documents/${document.id}`);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!document.file_url) {
      onDownload(document);
      return;
    }

    try {
      const newCount = (document.downloads || 0) + 1;

      const { error } = await supabase
        .from("documents")
        .update({ downloads: newCount })
        .eq("id", document.id);

      if (!error) {
        setLocalDownloads(newCount);
        document.downloads = newCount;
        // ✅ Refresh danh sách sau khi download
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error incrementing download:", error);
    }

    window.open(document.file_url, "_blank");
    onDownload(document);
  };

  // Grid View
  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer",
            "hover:border-primary/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]",
            isHovered && "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
          )}
          onClick={handleCardClick}
        >
          <CardContent className="p-6 relative">
            {/* Scan Line Effect */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scan" />
              </motion.div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center shadow-lg transition-transform duration-300",
                  isHovered && "scale-110",
                )}
              >
                <FileIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(document);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite();
                  }}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-all",
                      isFavorite && "fill-red-400 text-red-400",
                    )}
                  />
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
              {document.title}
            </h3>
            <p className="text-sm text-white/50 mb-4 line-clamp-2">
              {document.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {document.tags?.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-white/10 text-white/40"
                >
                  #{tag}
                </Badge>
              ))}
              {document.tags && document.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-white/10 text-white/40"
                >
                  +{document.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {localDownloads || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {document.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {document.rating || 0}
                </span>
              </div>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-white border border-cyan-500/20"
                onClick={handleDownload}
              >
                <Download className="w-3 h-3" />
                Tải
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Card
        className={cn(
          "group border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-primary/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]",
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge className="text-xs bg-cyan-500/20 text-cyan-400 border-0">
                  {document.category}
                </Badge>
                <Badge className="text-xs bg-blue-500/20 text-blue-400 border-0">
                  {document.subject}
                </Badge>
                <span className="text-xs text-white/30">
                  {formatFileSize(document.file_size)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-white/50 line-clamp-1">
                {document.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {localDownloads || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {document.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {document.rating || 0}
                </span>
              </div>
            </div>

            <div
              className="flex gap-2 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(document);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite();
                }}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    isFavorite && "fill-red-400 text-red-400",
                  )}
                />
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-white border border-cyan-500/20"
                onClick={handleDownload}
              >
                <Download className="w-3 h-3" />
                Tải xuống
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
