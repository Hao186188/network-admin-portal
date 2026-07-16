// src/app/(routes)/documents/hooks/useDocuments.ts
// FIXED: DÙNG supabaseAdmin CHO UPLOAD

import {
  isServiceRoleEnabled,
  supabase,
  supabaseAdmin,
} from "@/lib/db/supabase-client";
import { useDocumentsStore } from "@/store/documents-store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Document } from "../types";

const DEFAULT_LIMIT = 12;

export function useDocuments() {
  const { data: session } = useSession();
  const store = useDocumentsStore();
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (page = 1, limit = DEFAULT_LIMIT) => {
    setError(null);

    try {
      // ✅ Chỉ đếm FILE, không đếm FOLDER
      const { count: total, error: countError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("is_folder", false);

      if (countError) throw countError;

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: docs, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("is_folder", false)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (docsError) throw docsError;

      const docsWithFavorite = (docs || []).map((doc) => ({
        ...doc,
        is_favorite: false,
      }));

      const pagination = {
        page,
        limit,
        total: total || 0,
        hasMore: page * limit < (total || 0),
      };

      let stats = {
        total: 0,
        downloads: 0,
        views: 0,
        categories: [] as string[],
        subjects: [] as string[],
        tags: [] as string[],
        recent_uploads: 0,
        total_size: "0 MB",
      };

      if (page === 1) {
        const { data: statsData, error: statsError } = await supabase
          .from("documents")
          .select(
            "downloads, views, category, subject, tags, file_size, created_at",
          )
          .eq("is_folder", false);

        if (!statsError && statsData) {
          const totalDownloads =
            statsData?.reduce((sum, d) => sum + (d.downloads || 0), 0) || 0;
          const totalViews =
            statsData?.reduce((sum, d) => sum + (d.views || 0), 0) || 0;

          const categories = [
            ...new Set(statsData?.map((d) => d.category).filter(Boolean) || []),
          ];

          const subjects = [
            ...new Set(statsData?.map((d) => d.subject).filter(Boolean) || []),
          ];

          const allTags = statsData?.flatMap((d) => d.tags || []) || [];
          const tagCount: Record<string, number> = {};
          allTags.forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
          const tags = Object.keys(tagCount)
            .sort((a, b) => tagCount[b] - tagCount[a])
            .slice(0, 15);

          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const recentUploads =
            statsData?.filter(
              (d) => d.created_at && new Date(d.created_at) >= sevenDaysAgo,
            ).length || 0;

          const totalSizeBytes =
            statsData?.reduce((sum, d) => sum + (d.file_size || 0), 0) || 0;
          const totalSize =
            totalSizeBytes > 1024 * 1024 * 1024
              ? (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
              : (totalSizeBytes / (1024 * 1024)).toFixed(1) + " MB";

          stats = {
            total: total || 0,
            downloads: totalDownloads,
            views: totalViews,
            categories,
            subjects,
            tags,
            recent_uploads: recentUploads,
            total_size: totalSize,
          };
        }
      }

      store.setDocuments(docsWithFavorite);
      store.setStats(stats);
      store.setPagination(pagination);
      store.setLoading(false);

      return { documents: docsWithFavorite, stats, pagination };
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      setError(err.message || "Không thể tải tài liệu");
      store.setLoading(false);
      throw err;
    }
  };

  const changePage = (page: number) => {
    const totalPages = Math.ceil(
      store.pagination.total / store.pagination.limit,
    );
    if (page >= 1 && page <= totalPages) {
      fetchDocuments(page, store.pagination.limit);
    }
  };

  // ✅ SỬA: CALL API ROUTE /api/documents/upload ĐỂ UPLOAD BẰNG SERVER-SIDE ADMIN CLIENT
  const uploadDocument = async (file: File, metadata: Partial<Document>) => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để tải lên tài liệu");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", metadata.title || file.name);
      formData.append("description", metadata.description || "");
      formData.append("category", metadata.category || "Tài liệu");
      formData.append("subject", metadata.subject || "Quản trị Mạng 3");
      formData.append("tags", JSON.stringify(metadata.tags || []));
      formData.append("parentId", ""); // Mặc định tải lên thư mục gốc

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Không thể tải lên tài liệu");
      }

      await fetchDocuments(store.pagination.page, store.pagination.limit);
      return result;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Không thể tải lên tài liệu");
    }
  };

  // ✅ SỬA: CALL API ROUTE /api/documents ĐỂ CẬP NHẬT BẰNG SERVER-SIDE ADMIN CLIENT
  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Không thể cập nhật tài liệu");
      }

      await fetchDocuments(store.pagination.page, store.pagination.limit);
      return result;
    } catch (error: any) {
      console.error("Update error:", error);
      throw new Error(error.message || "Không thể cập nhật tài liệu");
    }
  };

  // ✅ SỬA: CALL API ROUTE /api/documents ĐỂ XÓA BẰNG SERVER-SIDE ADMIN CLIENT
  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Không thể xóa tài liệu");
      }

      await fetchDocuments(store.pagination.page, store.pagination.limit);
      return true;
    } catch (error: any) {
      throw new Error(error.message || "Không thể xóa tài liệu");
    }
  };

  const refresh = () => {
    console.log("🔄 Refreshing documents...");
    return fetchDocuments(store.pagination.page, store.pagination.limit);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents: store.documents,
    loading: store.loading,
    error,
    stats: store.stats,
    pagination: store.pagination,
    fetchDocuments,
    changePage,
    uploadDocument,
    deleteDocument,
    updateDocument,
    refresh,
  };
}
