// src/app/(routes)/documents/hooks/useFolderNavigation.ts
"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Document } from "../types";

export interface BreadcrumbItem {
  id: string | null;
  title: string;
  path: string[];
}

export function useFolderNavigation() {
  const router = useRouter();
  const params = useParams();
  const folderId = params?.folderId as string | undefined;

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    folderId || null,
  );
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, title: "Gốc", path: [] },
  ]);
  const [folderItems, setFolderItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // 📍 Lấy breadcrumbs từ database
  const fetchBreadcrumbs = useCallback(async (folderId: string | null) => {
    if (!folderId) {
      setBreadcrumbs([{ id: null, title: "Gốc", path: [] }]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, path")
        .eq("id", folderId)
        .single();

      if (error) throw error;

      if (data) {
        const path = data.path || [data.title];
        const crumbs: BreadcrumbItem[] = [{ id: null, title: "Gốc", path: [] }];

        // Lấy từng cấp trong path
        let currentPath: string[] = [];
        for (const segment of path) {
          currentPath = [...currentPath, segment];
          // Tìm folder ID tương ứng
          const { data: folderData } = await supabase
            .from("documents")
            .select("id")
            .eq("path", currentPath)
            .single();

          if (folderData) {
            crumbs.push({
              id: folderData.id,
              title: segment,
              path: currentPath,
            });
          }
        }

        setBreadcrumbs(crumbs);
      }
    } catch (error) {
      console.error("Error fetching breadcrumbs:", error);
    }
  }, []);

  // 📂 Lấy nội dung folder hiện tại
  const fetchFolderContents = useCallback(async (folderId: string | null) => {
    setLoading(true);
    try {
      let query = supabase
        .from("documents")
        .select("*")
        .order("is_folder", { ascending: false })
        .order("title", { ascending: true });

      if (folderId) {
        query = query.eq("parent_id", folderId);
      } else {
        query = query.is("parent_id", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFolderItems(data || []);
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🧭 Điều hướng đến folder
  const navigateToFolder = useCallback(
    (targetId: string | null) => {
      setCurrentFolderId(targetId);
      if (targetId) {
        router.push(`/documents/${targetId}`);
      } else {
        router.push("/documents");
      }
      fetchBreadcrumbs(targetId);
      fetchFolderContents(targetId);
    },
    [router, fetchBreadcrumbs, fetchFolderContents],
  );

  // 🔙 Điều hướng qua breadcrumbs
  const navigateToIndex = useCallback(
    (index: number) => {
      const target = breadcrumbs[index];
      if (target) {
        navigateToFolder(target.id);
      }
    },
    [breadcrumbs, navigateToFolder],
  );

  // 🔄 Refresh nội dung
  const refresh = useCallback(() => {
    fetchFolderContents(currentFolderId);
  }, [currentFolderId, fetchFolderContents]);

  // 🎯 Effect khi folderId thay đổi
  useEffect(() => {
    if (folderId !== undefined) {
      const id = folderId || null;
      setCurrentFolderId(id);
      fetchBreadcrumbs(id);
      fetchFolderContents(id);
    }
  }, [folderId, fetchBreadcrumbs, fetchFolderContents]);

  return {
    currentFolderId,
    breadcrumbs,
    folderItems,
    loading,
    navigateToFolder,
    navigateToIndex,
    refresh,
  };
}
