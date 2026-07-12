// src/app/(routes)/documents/hooks/useDocuments.ts
// HOÀN CHỈNH

import {
  isServiceRoleEnabled,
  supabase,
  supabaseAdmin,
} from "@/lib/db/supabase-client";
import { useDocumentsStore } from "@/store/documents-store";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Document } from "../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const storageClient =
  supabaseServiceKey && supabaseServiceKey.length > 20
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : supabase;

const DEFAULT_LIMIT = 12;

export function useDocuments() {
  const { data: session } = useSession();
  const store = useDocumentsStore();
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async (page = 1, limit = DEFAULT_LIMIT) => {
    setError(null);

    try {
      const { count: total, error: countError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: docs, error: docsError } = await supabase
        .from("documents")
        .select("*")
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
          );

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

  const uploadDocument = async (file: File, metadata: Partial<Document>) => {
    if (!session?.user?.id) {
      throw new Error("Vui lòng đăng nhập để tải lên tài liệu");
    }

    try {
      const fileExt = file.name.split(".").pop() || "unknown";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } =
        await storageClient.storage.from("documents").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = storageClient.storage
        .from("documents")
        .getPublicUrl(filePath);

      const docData = {
        title: metadata.title || file.name,
        description: metadata.description || "",
        file_type: fileExt,
        file_size: file.size,
        file_url: urlData.publicUrl,
        category: metadata.category || "Tài liệu",
        subject: metadata.subject || "Quản trị Mạng 3",
        tags: metadata.tags || [],
        uploaded_by: session.user.id,
        uploaded_by_name: session.user.name || "Unknown",
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const { data: result, error: dbError } = await client
        .from("documents")
        .insert(docData)
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Không thể lưu thông tin: ${dbError.message}`);
      }

      await fetchDocuments(store.pagination.page, store.pagination.limit);
      return result;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Không thể tải lên tài liệu");
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const client = isServiceRoleEnabled ? supabaseAdmin : supabase;

      const { data, error } = await client
        .from("documents")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Update error:", error);
        throw new Error(`Không thể cập nhật: ${error.message}`);
      }

      if (!data) {
        throw new Error("Không tìm thấy tài liệu để cập nhật");
      }

      await fetchDocuments(store.pagination.page, store.pagination.limit);
      return data;
    } catch (error: any) {
      console.error("Update error:", error);
      throw new Error(error.message || "Không thể cập nhật tài liệu");
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("file_url")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (doc?.file_url) {
        const urlParts = doc.file_url.split("/");
        const filePath = urlParts
          .slice(urlParts.indexOf("documents") + 1)
          .join("/");

        if (filePath) {
          await storageClient.storage.from("documents").remove([filePath]);
        }
      }

      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

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
