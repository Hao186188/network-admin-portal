// src/app/(routes)/documents/page.tsx
// FIXED: Không gây re-render không cần thiết

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import { useDocumentsStore } from "@/store/documents-store";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileArchive, FolderOpen } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentsFilters } from "./components/DocumentsFilters";
import { DocumentsGrid } from "./components/DocumentsGrid";
import { DocumentsHero } from "./components/DocumentsHero";
import { DocumentsPagination } from "./components/DocumentsPagination";
import { DocumentsSearch } from "./components/DocumentsSearch";
import { DocumentsStats } from "./components/DocumentsStats";
import { EditDocumentModal } from "./components/EditDocumentModal";
import { FileExplorer } from "./components/FileExplorer";
import { UploadDocumentModal } from "./components/UploadDocumentModal";
import { useDocuments } from "./hooks/useDocuments";
import { Document } from "./types";

export default function DocumentsPage() {
  const { toast } = useToast();
  const {
    documents,
    loading,
    error,
    stats,
    pagination,
    changePage,
    refresh,
    uploadDocument,
    updateDocument,
  } = useDocuments();

  const { refreshKey, resetRefresh } = useDocumentsStore();
  const isRefreshing = useRef(false);

  // 🔍 Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedFileType, setSelectedFileType] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // View & UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  // Phần 2: File Explorer State
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [explorerFolderId, setExplorerFolderId] = useState<string | null>(null);
  const explorerKey = useRef(0);

  // ✅ Refresh khi refreshKey thay đổi
  useEffect(() => {
    if (refreshKey > 0 && !isRefreshing.current) {
      isRefreshing.current = true;
      console.log("🔄 Refresh triggered from store:", refreshKey);

      refresh().finally(() => {
        resetRefresh();
        isRefreshing.current = false;
        console.log("🔄 Refresh completed and reset");
      });
    }
  }, [refreshKey, refresh, resetRefresh]);

  // 🔍 Logic lọc dữ liệu
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "Tất cả" || doc.category === selectedCategory;

    const matchesSubject =
      selectedSubject === "Tất cả" || doc.subject === selectedSubject;

    const matchesFileType =
      selectedFileType === "Tất cả" ||
      doc.file_type?.toLowerCase() === selectedFileType.toLowerCase();

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags?.includes(tag));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubject &&
      matchesFileType &&
      matchesTags
    );
  });

  // ✅ Handle navigate - Không force re-render
  const handleNavigateFolder = useCallback((folderId: string | null) => {
    setExplorerFolderId(folderId);
    explorerKey.current += 1;
    if (process.env.NODE_ENV === "development") {
      console.log("📂 Folder changed:", folderId);
    }
  }, []);

  // Handlers
  const handleDownload = (doc: Document) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank");
      toast.success(`Đang tải xuống: ${doc.title}`);
    } else {
      toast.error("File không khả dụng");
    }
  };

  const handleFavorite = (doc: Document) => {
    const isFavorite = doc.is_favorite || false;
    toast.success(`Đã ${isFavorite ? "bỏ" : "thêm"} yêu thích: ${doc.title}`);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditModalOpen(true);
  };

  const handleUploadSuccess = () => {
    toast.success("Đã tải lên tài liệu thành công!");
    refresh();
    explorerKey.current += 1;
  };

  const handleEditSuccess = () => {
    refresh();
    explorerKey.current += 1;
  };

  const handleRefresh = () => {
    refresh();
    explorerKey.current += 1;
  };

  const totalPages = Math.ceil(
    (pagination.total || 0) / (pagination.limit || 12),
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* ============================================ */}
        {/* PHẦN 1: TÀI LIỆU THÔNG THƯỜNG */}
        {/* ============================================ */}
        <section id="documents-section">
          <DocumentsHero
            onUploadClick={() => setIsUploadModalOpen(true)}
            stats={{
              total: stats.total,
              downloads: stats.downloads,
              views: stats.views,
              recent_uploads: stats.recent_uploads,
              total_size: stats.total_size,
            }}
          />

          <div
            id="documents-content"
            className="max-w-7xl mx-auto px-4 md:px-8 pb-12 relative z-10"
          >
            <div className="mt-16 md:mt-24 lg:mt-32">
              <DocumentsStats
                total={stats.total}
                downloads={stats.downloads}
                views={stats.views}
                recentUploads={stats.recent_uploads}
                totalSize={stats.total_size}
                loading={loading}
              />
            </div>

            <div className="mt-8 md:mt-10">
              <DocumentsSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm kiếm tài liệu theo tên, mô tả, thẻ..."
              />
            </div>

            <div className="mt-6">
              <DocumentsFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedFileType={selectedFileType}
                setSelectedFileType={setSelectedFileType}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                viewMode={viewMode}
                setViewMode={setViewMode}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                categories={stats.categories || []}
                tags={stats.tags || []}
                subjects={stats.subjects || []}
                fileTypes={["pdf", "docx", "pptx", "xlsx", "zip", "rar"]}
              />
            </div>

            <div className="mt-6 md:mt-8">
              <DocumentsGrid
                documents={filteredDocuments}
                loading={loading}
                error={error}
                viewMode={viewMode}
                onDownload={handleDownload}
                onFavorite={handleFavorite}
                onEdit={handleEdit}
                onRetry={refresh}
                onUpload={() => setIsUploadModalOpen(true)}
                onRefresh={handleRefresh}
              />
            </div>

            {!loading && filteredDocuments.length > 0 && (
              <DocumentsPagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={changePage}
                className="mt-8"
              />
            )}

            {/* Divider + Toggle Button */}
            <div className="mt-12 md:mt-16 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowFileExplorer(!showFileExplorer);
                    explorerKey.current += 1;
                  }}
                  className="px-6 py-2.5 bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/10 text-white/80 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2 text-sm"
                >
                  {showFileExplorer ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Ẩn File Explorer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Hiển thị File Explorer
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PHẦN 2: FILE EXPLORER (WINDOWS STYLE) */}
        {/* ============================================ */}
        {showFileExplorer && (
          <motion.section
            id="file-explorer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 md:px-8 pb-20 relative z-10"
          >
            <div className="mt-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      📂 Quản lý File & Thư mục
                    </h2>
                    <p className="text-sm text-white/40">
                      Tạo thư mục, tải lên file, tổ chức tài liệu như Windows
                      Explorer
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <FileArchive className="w-3.5 h-3.5" />
                    Quản lý dễ dàng
                  </span>
                  <span className="w-px h-4 bg-white/10" />
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Tạo thư mục con
                  </span>
                </div>
              </div>

              {/* File Explorer Component - Với key để force re-render khi cần */}
              <FileExplorer
                key={explorerKey.current}
                initialFolderId={explorerFolderId}
                onNavigate={handleNavigateFolder}
              />

              {/* Hướng dẫn sử dụng */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl mb-1">📁</div>
                  <p className="text-xs text-white/40">Tạo thư mục mới</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl mb-1">📤</div>
                  <p className="text-xs text-white/40">Tải file lên</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <p className="text-xs text-white/40">
                    Double-click để vào thư mục
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-2xl mb-1">⌨️</div>
                  <p className="text-xs text-white/40">
                    Ctrl+Click để chọn nhiều
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
      <Footer />

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        onUpload={uploadDocument}
      />

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSuccess={handleEditSuccess}
        onUpdate={updateDocument}
      />
    </>
  );
}
