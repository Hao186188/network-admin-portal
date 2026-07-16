// src/app/(routes)/lectures/components/FolderExplorer/index.tsx
// CẬP NHẬT - THÊM XÓA VÀ TẢI FOLDER

"use client";

import { Button } from "@/components/ui/button";
import { Lecture } from "@/types";
import { Folder, FolderPlus, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateFolderModal } from "./CreateFolderModal";
import { FolderBreadcrumbs } from "./FolderBreadcrumbs";
import { FolderTree } from "./FolderTree";
import { UploadFileModal } from "./UploadFileModal";
import { BreadcrumbItem, FolderExplorerProps, FolderNode } from "./types";

export function FolderExplorer({
  initialFolderId = null,
  onNavigate,
  onLectureClick,
  onRefresh,
}: FolderExplorerProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    initialFolderId,
  );
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, title: "📁 Thư viện bài giảng", path: [] },
  ]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const canView =
    session?.user?.role === "ADMIN" || session?.user?.role === "TEACHER";

  // 📂 Lấy tất cả bài giảng
  const fetchAllLectures = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔍 FolderExplorer: Fetching lectures from API...");
      const response = await fetch("/api/lectures");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải dữ liệu");
      }

      console.log(`📂 FolderExplorer: Fetched ${data?.length || 0} lectures`);
      setAllLectures(data || []);
    } catch (error: any) {
      console.error("Error fetching lectures:", error);
      toast.error("Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  // 📂 Tạo cây thư mục
  useEffect(() => {
    console.log(`📂 Building folder tree from ${allLectures.length} items`);

    const rootFolders: FolderNode[] = [];
    const folderMap = new Map<string, FolderNode>();

    allLectures.forEach((lecture: Lecture) => {
      if (lecture.is_folder || lecture.type === "folder") {
        const folderNode: FolderNode = {
          id: lecture.id,
          title: lecture.title,
          type: "folder",
          children: [],
          lecture: lecture,
        };
        folderMap.set(lecture.id, folderNode);
      }
    });

    folderMap.forEach((folderNode) => {
      const parentId = folderNode.lecture?.parent_id;
      if (parentId && folderMap.has(parentId)) {
        folderMap.get(parentId)?.children?.push(folderNode);
      } else {
        rootFolders.push(folderNode);
      }
    });

    const filesWithoutFolder: Lecture[] = [];

    allLectures.forEach((lecture: Lecture) => {
      if (!lecture.is_folder && lecture.type !== "folder") {
        const fileNode: FolderNode = {
          id: lecture.id,
          title: lecture.title,
          type: "file",
          fileType: lecture.file_type || lecture.type || "document",
          lecture: lecture,
        };

        const parentId = lecture.parent_id;
        if (parentId && folderMap.has(parentId)) {
          folderMap.get(parentId)?.children?.push(fileNode);
        } else {
          filesWithoutFolder.push(lecture);
        }
      }
    });

    if (filesWithoutFolder.length > 0) {
      const virtualFolder: FolderNode = {
        id: "uncategorized",
        title: "Chưa phân loại",
        type: "folder",
        children: [],
      };

      filesWithoutFolder.forEach((lecture) => {
        virtualFolder.children?.push({
          id: lecture.id,
          title: lecture.title,
          type: "file",
          fileType: lecture.file_type || lecture.type || "document",
          lecture: lecture,
        });
      });

      rootFolders.push(virtualFolder);
    }

    setFolders(rootFolders);
  }, [allLectures]);

  const displayNodes = (() => {
    if (!currentFolderId) {
      return folders;
    }

    const findFolder = (nodes: FolderNode[]): FolderNode | null => {
      for (const node of nodes) {
        if (node.id === currentFolderId) return node;
        if (node.children) {
          const found = findFolder(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const folder = findFolder(folders);
    return folder?.children || [];
  })();

  useEffect(() => {
    if (canView) {
      fetchAllLectures();
    }
  }, [canView, fetchAllLectures]);

  // ➕ Tạo folder
  const handleCreateFolder = useCallback(
    async (title: string) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      setIsCreating(true);
      try {
        const formData = new FormData();
        formData.append("isFolder", "true");
        formData.append("title", title.trim());
        if (currentFolderId) {
          formData.append("parentId", currentFolderId);
        }

        const response = await fetch("/api/lectures", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Không thể tạo thư mục");
        }

        toast.success(`Đã tạo thư mục "${title}"`);
        await fetchAllLectures();
        if (onRefresh) onRefresh();
      } catch (error: any) {
        console.error("Error creating folder:", error);
        toast.error(error.message || "Không thể tạo thư mục");
      } finally {
        setIsCreating(false);
      }
    },
    [session, fetchAllLectures, onRefresh, currentFolderId],
  );

  // 🗑️ Xóa folder
  const handleDeleteFolder = useCallback(
    async (node: FolderNode) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      if (
        !confirm(
          `Bạn có chắc muốn xóa thư mục "${node.title}" và tất cả nội dung bên trong?`,
        )
      ) {
        return;
      }

      try {
        const response = await fetch(`/api/lectures?id=${node.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Không thể xóa thư mục");
        }

        toast.success(`Đã xóa thư mục "${node.title}"`);
        await fetchAllLectures();
        if (onRefresh) onRefresh();

        // Nếu đang ở trong folder bị xóa, quay về root
        if (currentFolderId === node.id) {
          navigateToFolder(null);
        }
      } catch (error: any) {
        console.error("Error deleting folder:", error);
        toast.error(error.message || "Không thể xóa thư mục");
      }
    },
    [session, fetchAllLectures, onRefresh, currentFolderId],
  );

  // 📤 Tải xuống folder
  const handleDownloadFolder = useCallback(async (node: FolderNode) => {
    try {
      const toastId = toast.loading(`Đang nén thư mục "${node.title}"...`);

      const response = await fetch(
        `/api/lectures/download-folder?folderId=${node.id}`,
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không thể tải thư mục");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${node.title}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Đã tải xuống thư mục "${node.title}"`, { id: toastId });
    } catch (error: any) {
      console.error("Error downloading folder:", error);
      toast.error(error.message || "Không thể tải thư mục");
    }
  }, []);

  // 📤 Upload file
  const handleUploadFiles = useCallback(
    async (files: FileList) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading(`Đang tải lên ${files.length} file...`);

      try {
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", file.name);
          formData.append("type", "document");
          formData.append("teacher", session.user.name || "Giảng viên");
          formData.append("subject", "Chưa phân loại");
          formData.append("tags", JSON.stringify([]));
          if (currentFolderId) {
            formData.append("parentId", currentFolderId);
          }

          const response = await fetch("/api/lectures", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        }

        if (failCount === 0) {
          toast.success(`Tải lên thành công ${successCount} file!`, {
            id: toastId,
          });
        } else {
          toast.warning(
            `Tải lên: ${successCount} thành công, ${failCount} thất bại`,
            {
              id: toastId,
            },
          );
        }

        await fetchAllLectures();
        if (onRefresh) onRefresh();
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tải lên", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [session, fetchAllLectures, onRefresh, currentFolderId],
  );

  // 🧭 Điều hướng
  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      setCurrentFolderId(folderId);

      if (!folderId) {
        setBreadcrumbs([
          { id: null, title: "📁 Thư viện bài giảng", path: [] },
        ]);
        if (onNavigate) onNavigate(null);
        return;
      }

      const findFolder = (
        nodes: FolderNode[],
        id: string,
      ): FolderNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findFolder(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const folder = findFolder(folders, folderId);
      if (folder) {
        setBreadcrumbs([
          { id: null, title: "📁 Thư viện bài giảng", path: [] },
          { id: folder.id, title: folder.title, path: [folder.title] },
        ]);
        if (onNavigate) onNavigate(folderId);
      }
    },
    [folders, onNavigate],
  );

  const handleNodeClick = useCallback(
    (node: FolderNode) => {
      if (node.type === "folder") {
        navigateToFolder(node.id);
      }
    },
    [navigateToFolder],
  );

  const handleFileClick = useCallback(
    (node: FolderNode) => {
      if (node.lecture && onLectureClick) {
        if (node.lecture.file_url) {
          window.open(node.lecture.file_url, "_blank");
          return;
        }
        onLectureClick(node.lecture);
      }
    },
    [onLectureClick],
  );

  if (!canView) return null;

  return (
    <>
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/5 bg-black/40">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setIsCreateFolderOpen(true)}
            disabled={isCreating}
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Thư mục mới</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-white/70 hover:text-white hover:bg-white/5"
            onClick={() => setIsUploadFileOpen(true)}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isUploading ? "Đang tải..." : "Tải lên"}
            </span>
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-white/40 hover:text-white hover:bg-white/5"
            onClick={fetchAllLectures}
          >
            <span className="text-xs">🔄 Làm mới</span>
          </Button>
        </div>

        <FolderBreadcrumbs items={breadcrumbs} onNavigate={navigateToFolder} />

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent" />
              <span className="ml-3 text-white/50">Đang tải...</span>
            </div>
          ) : displayNodes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Folder className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white/80 mb-2">
                {currentFolderId ? "Thư mục trống" : "Chưa có bài giảng"}
              </h3>
              <p className="text-white/40">
                {currentFolderId
                  ? "Thư mục này chưa có nội dung"
                  : "Tạo thư mục mới hoặc tải file lên để bắt đầu"}
              </p>
              <div className="flex gap-3 mt-4 justify-center">
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500"
                  onClick={() => setIsCreateFolderOpen(true)}
                >
                  <FolderPlus className="w-4 h-4" />
                  Tạo thư mục
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-white/20 text-white/60 hover:text-white"
                  onClick={() => setIsUploadFileOpen(true)}
                >
                  <Upload className="w-4 h-4" />
                  Tải lên
                </Button>
              </div>
            </div>
          ) : (
            <FolderTree
              nodes={displayNodes}
              onNodeClick={handleNodeClick}
              onFileClick={handleFileClick}
              onDeleteFolder={handleDeleteFolder}
              onDownloadFolder={handleDownloadFolder}
            />
          )}
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreate={handleCreateFolder}
        isLoading={isCreating}
      />

      <UploadFileModal
        isOpen={isUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
        onUpload={handleUploadFiles}
        isLoading={isUploading}
      />
    </>
  );
}
