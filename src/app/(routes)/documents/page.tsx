// src/app/(routes)/documents/page.tsx
// FIXED: Chỉ refresh 1 lần

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import { useDocumentsStore } from "@/store/documents-store";
import { useEffect, useRef, useState } from "react";
import { DocumentsFilters } from "./components/DocumentsFilters";
import { DocumentsGrid } from "./components/DocumentsGrid";
import { DocumentsHero } from "./components/DocumentsHero";
import { DocumentsPagination } from "./components/DocumentsPagination";
import { DocumentsSearch } from "./components/DocumentsSearch";
import { DocumentsStats } from "./components/DocumentsStats";
import { EditDocumentModal } from "./components/EditDocumentModal";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  // ✅ Refresh khi refreshKey thay đổi - CHỈ 1 LẦN
  useEffect(() => {
    if (refreshKey > 0 && !isRefreshing.current) {
      isRefreshing.current = true;
      console.log("🔄 Refresh triggered from store:", refreshKey);

      refresh().finally(() => {
        // Reset sau khi refresh hoàn tất
        resetRefresh();
        isRefreshing.current = false;
        console.log("🔄 Refresh completed and reset");
      });
    }
  }, [refreshKey, refresh, resetRefresh]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || doc.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags?.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

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
  };

  const handleEditSuccess = () => {
    refresh();
  };

  const handleRefresh = () => {
    refresh();
  };

  const totalPages = Math.ceil(
    (pagination.total || 0) / (pagination.limit || 12),
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
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
          className="max-w-7xl mx-auto px-4 md:px-8 pb-20 relative z-10"
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
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              categories={stats.categories}
              tags={stats.tags}
              subjects={stats.subjects}
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
        </div>
      </div>
      <Footer />

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
