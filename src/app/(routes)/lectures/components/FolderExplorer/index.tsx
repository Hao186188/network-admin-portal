// src/app/(routes)/lectures/components/FolderExplorer/index.tsx
// HOÀN CHỈNH - NHẬN PROPS TỪ PAGE

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Lecture } from "@/types";
import { Eye, Folder, FolderPlus, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  userRole: propUserRole,
  canManage: propCanManage,
}: FolderExplorerProps) {
  const { data: session, status } = useSession();
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

  // ✅ State cho confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    isLoading: false,
  });

  // ✅ Refs để kiểm soát
  const fetchInProgressRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const isMountedRef = useRef(true);
  const initDoneRef = useRef(false);

  // ✅ ƯU TIÊN DÙNG PROPS TỪ PAGE, FALLBACK TỪ SESSION
  const sessionRole = session?.user?.role?.toUpperCase() || "STUDENT";
  const userRole = propUserRole || sessionRole;
  const canManage =
    propCanManage !== undefined
      ? propCanManage
      : userRole === "ADMIN" || userRole === "TEACHER";

  const isAdmin = userRole === "ADMIN";
  const isTeacher = userRole === "TEACHER";
  const isStudent = userRole === "STUDENT";

  // ✅ Quyền
  const canView = isAdmin || isTeacher || isStudent;
  const canDelete = canManage;
  const canUpload = canManage;
  const canCreateFolder = canManage;
  const canRename = canManage;

  // ✅ Debug - CHỈ 1 LẦN
  useEffect(() => {
    if (!initDoneRef.current) {
      console.log(
        "🔍 [FolderExplorer] Role:",
        userRole,
        "canManage:",
        canManage,
      );
      initDoneRef.current = true;
    }
  }, [userRole, canManage]);

  // 📂 Lấy tất cả bài giảng - CHỈ 1 LẦN
  const fetchAllLectures = useCallback(async () => {
    if (fetchInProgressRef.current || hasFetchedRef.current) {
      return;
    }

    if (!canView) {
      setLoading(false);
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);

    try {
      console.log("🔍 [FolderExplorer] Fetching lectures...");
      const response = await fetch("/api/lectures");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải dữ liệu");
      }

      console.log(`📂 [FolderExplorer] Fetched ${data?.length || 0} lectures`);

      if (isMountedRef.current) {
        setAllLectures(data || []);
        hasFetchedRef.current = true;
      }
    } catch (error: any) {
      console.error("❌ [FolderExplorer] Error:", error);
      toast.error("Không thể tải danh sách");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      fetchInProgressRef.current = false;
    }
  }, [canView]);

  // 📂 Tạo cây thư mục
  useEffect(() => {
    if (allLectures.length === 0) {
      setFolders([]);
      return;
    }

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
        isVirtual: true,
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

  // Lấy nodes hiển thị
  const displayNodes = useCallback(() => {
    if (!currentFolderId) {
      return folders;
    }

    if (currentFolderId === "uncategorized") {
      const virtualFolder = folders.find((f) => f.id === "uncategorized");
      return virtualFolder?.children || [];
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
  }, [folders, currentFolderId]);

  // ✅ CHỈ FETCH 1 LẦN
  useEffect(() => {
    isMountedRef.current = true;

    if (canView && !hasFetchedRef.current) {
      fetchAllLectures();
    }

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ RENAME FOLDER
  const handleRenameFolder = useCallback(
    async (node: FolderNode, newTitle: string) => {
      if (!canRename) {
        toast.error("Bạn không có quyền đổi tên thư mục");
        return;
      }
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }
      if (node.isVirtual || node.id === "uncategorized") {
        toast.error("Không thể đổi tên thư mục này");
        return;
      }

      const isOwner = node.lecture?.teacher_id === session.user.id;
      if (!isAdmin && !isOwner) {
        toast.error("Bạn không có quyền đổi tên thư mục này");
        return;
      }

      try {
        const response = await fetch(`/api/lectures?id=${node.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle.trim() }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Không thể đổi tên thư mục");
        }

        toast.success(`Đã đổi tên thành "${newTitle}"`);
        hasFetchedRef.current = false;
        await fetchAllLectures();
        if (onRefresh) onRefresh();
      } catch (error: any) {
        console.error("❌ [FolderExplorer] Error renaming folder:", error);
        toast.error(error.message || "Không thể đổi tên thư mục");
      }
    },
    [session, canRename, isAdmin, fetchAllLectures, onRefresh],
  );

  // ➕ Tạo folder
  const handleCreateFolder = useCallback(
    async (title: string) => {
      if (!canCreateFolder) {
        toast.error("Bạn không có quyền tạo thư mục");
        return;
      }
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      setIsCreating(true);
      try {
        const formData = new FormData();
        formData.append("isFolder", "true");
        formData.append("title", title.trim());
        if (currentFolderId && currentFolderId !== "uncategorized") {
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
        hasFetchedRef.current = false;
        await fetchAllLectures();
        if (onRefresh) onRefresh();
      } catch (error: any) {
        console.error("❌ [FolderExplorer] Error creating folder:", error);
        toast.error(error.message || "Không thể tạo thư mục");
      } finally {
        setIsCreating(false);
      }
    },
    [session, canCreateFolder, fetchAllLectures, onRefresh, currentFolderId],
  );

  // 🗑️ Xóa folder
  const handleDeleteFolder = useCallback(
    (node: FolderNode) => {
      if (!canDelete) {
        toast.error("Bạn không có quyền xóa");
        return;
      }
      if (node.isVirtual || node.id === "uncategorized") {
        toast.error("Không thể xóa thư mục này");
        return;
      }

      setConfirmDialog({
        isOpen: true,
        title: `Xóa thư mục "${node.title}"`,
        description: `Bạn có chắc chắn muốn xóa thư mục "${node.title}" và tất cả nội dung bên trong? Hành động này không thể hoàn tác.`,
        onConfirm: async () => {
          setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
          try {
            const response = await fetch(`/api/lectures?id=${node.id}`, {
              method: "DELETE",
            });

            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Không thể xóa thư mục");
            }

            toast.success(`Đã xóa thư mục "${node.title}"`);
            hasFetchedRef.current = false;
            await fetchAllLectures();
            if (onRefresh) onRefresh();

            if (currentFolderId === node.id) {
              navigateToFolder(null);
            }
          } catch (error: any) {
            console.error("❌ [FolderExplorer] Error deleting folder:", error);
            toast.error(error.message || "Không thể xóa thư mục");
          } finally {
            setConfirmDialog((prev) => ({
              ...prev,
              isOpen: false,
              isLoading: false,
            }));
          }
        },
      });
    },
    [canDelete, fetchAllLectures, onRefresh, currentFolderId],
  );

  // 🗑️ Xóa file
  const handleDeleteFile = useCallback(
    (node: FolderNode) => {
      if (!canDelete) {
        toast.error("Bạn không có quyền xóa");
        return;
      }

      setConfirmDialog({
        isOpen: true,
        title: `Xóa file "${node.title}"`,
        description: `Bạn có chắc chắn muốn xóa file "${node.title}"? Hành động này không thể hoàn tác.`,
        onConfirm: async () => {
          setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
          try {
            const response = await fetch(`/api/lectures?id=${node.id}`, {
              method: "DELETE",
            });

            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Không thể xóa file");
            }

            toast.success(`Đã xóa file "${node.title}"`);
            hasFetchedRef.current = false;
            await fetchAllLectures();
            if (onRefresh) onRefresh();
          } catch (error: any) {
            console.error("❌ [FolderExplorer] Error deleting file:", error);
            toast.error(error.message || "Không thể xóa file");
          } finally {
            setConfirmDialog((prev) => ({
              ...prev,
              isOpen: false,
              isLoading: false,
            }));
          }
        },
      });
    },
    [canDelete, fetchAllLectures, onRefresh],
  );

  // 📤 Tải xuống folder
  const handleDownloadFolder = useCallback(async (node: FolderNode) => {
    if (node.isVirtual || node.id === "uncategorized") {
      toast.error("Không thể tải thư mục này");
      return;
    }

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
      console.error("❌ [FolderExplorer] Error downloading folder:", error);
      toast.error(error.message || "Không thể tải thư mục");
    }
  }, []);

  // 📤 Upload file
  const handleUploadFiles = useCallback(
    async (files: FileList) => {
      if (!canUpload) {
        toast.error("Bạn không có quyền tải lên file");
        return;
      }
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
          if (currentFolderId && currentFolderId !== "uncategorized") {
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
            { id: toastId },
          );
        }

        hasFetchedRef.current = false;
        await fetchAllLectures();
        if (onRefresh) onRefresh();
      } catch (error: any) {
        console.error("❌ [FolderExplorer] Upload error:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tải lên", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [session, canUpload, fetchAllLectures, onRefresh, currentFolderId],
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

      if (folderId === "uncategorized") {
        setBreadcrumbs([
          { id: null, title: "📁 Thư viện bài giảng", path: [] },
          {
            id: "uncategorized",
            title: "Chưa phân loại",
            path: ["Chưa phân loại"],
          },
        ]);
        if (onNavigate) onNavigate(folderId);
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

  const currentDisplayNodes = displayNodes();

  if (!canView) return null;

  return (
    <div>
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        {canManage && (
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
              onClick={() => {
                hasFetchedRef.current = false;
                fetchAllLectures();
              }}
            >
              <span className="text-xs">🔄 Làm mới</span>
            </Button>
          </div>
        )}

        {isStudent && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">
              👁️ Chế độ xem - Bạn chỉ có thể xem và tải xuống bài giảng
            </span>
          </div>
        )}

        <FolderBreadcrumbs items={breadcrumbs} onNavigate={navigateToFolder} />

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent" />
              <span className="ml-3 text-white/50">Đang tải...</span>
            </div>
          ) : currentDisplayNodes.length === 0 ? (
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
                  : "Chưa có bài giảng nào được tải lên"}
              </p>
              {canManage && (
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
              )}
            </div>
          ) : (
            <FolderTree
              nodes={currentDisplayNodes}
              onNodeClick={handleNodeClick}
              onFileClick={handleFileClick}
              onDeleteFolder={canDelete ? handleDeleteFolder : undefined}
              onDeleteFile={canDelete ? handleDeleteFile : undefined}
              onDownloadFolder={handleDownloadFolder}
              onRenameFolder={canRename ? handleRenameFolder : undefined}
              canManage={canManage}
              isReadOnly={isStudent}
            />
          )}
        </div>
      </div>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      >
        <AlertDialogContent className="bg-slate-900 border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-white">
              {confirmDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.onConfirm}
              disabled={confirmDialog.isLoading}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {confirmDialog.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </div>
  );
}
