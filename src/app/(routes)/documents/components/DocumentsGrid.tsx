// src/app/(routes)/documents/components/DocumentsGrid.tsx
// THÊM onRefresh PROP

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { File, Loader2, Plus } from "lucide-react";
import { Document } from "../types";
import { DocumentsCard } from "./DocumentsCard";

interface DocumentsGridProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  onDownload: (doc: Document) => void;
  onFavorite: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onRetry: () => void;
  onUpload?: () => void;
  onRefresh?: () => void; // ✅ Thêm onRefresh
}

export function DocumentsGrid({
  documents,
  loading,
  error,
  viewMode,
  onDownload,
  onFavorite,
  onEdit,
  onRetry,
  onUpload,
  onRefresh,
}: DocumentsGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="ml-3 text-white/50">Đang tải tài liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
          <File className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-xl font-semibold text-white/80 mb-2">
          Không tìm thấy tài liệu
        </h3>
        <p className="text-white/40">
          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
        </p>
        {onUpload && (
          <button
            onClick={onUpload}
            className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Đăng tài liệu đầu tiên
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewMode}
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {documents.map((doc, index) => (
          <DocumentsCard
            key={doc.id}
            document={doc}
            viewMode={viewMode}
            index={index}
            onDownload={onDownload}
            onFavorite={onFavorite}
            onEdit={onEdit}
            onRefresh={onRefresh} // ✅ Truyền xuống DocumentsCard
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
