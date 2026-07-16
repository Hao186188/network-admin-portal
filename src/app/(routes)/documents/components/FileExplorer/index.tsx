// src/app/(routes)/documents/components/FileExplorer/index.tsx
// HOÀN CHỈNH - FIX TẤT CẢ LỖI TYPESCRIPT

"use client";

import { supabase, supabaseAdmin } from "@/lib/db/supabase-client";
import { Folder } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Document } from "../../types";
import { Breadcrumbs } from "./Breadcrumbs";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { NewFolderModal } from "./NewFolderModal";
import { Toolbar } from "./Toolbar";
import { BreadcrumbItem, FileExplorerProps } from "./types";

// ============================================
// CONFIRM DIALOG COMPONENT
// ============================================

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xóa",
  cancelText = "Hủy",
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const colors = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all ${colors[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ERROR DIALOG COMPONENT
// ============================================

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  details?: string[];
}

function ErrorDialog({
  isOpen,
  onClose,
  title,
  message,
  details = [],
}: ErrorDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-white/70 mb-4">{message}</p>
        {details && details.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-white/40 font-mono">Định dạng hỗ trợ:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {details.map((ext: string) => (
                <span
                  key={ext}
                  className="px-2 py-0.5 text-[10px] bg-white/5 rounded text-white/40 font-mono"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function FileExplorer({
  initialFolderId = null,
  onNavigate,
}: FileExplorerProps) {
  const { data: session } = useSession();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    initialFolderId,
  );
  const [items, setItems] = useState<Document[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, title: "📁 Thư viện" },
  ]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // ✅ Refs để kiểm soát
  const isNavigating = useRef(false);
  const isInitialized = useRef(false);
  const isFetching = useRef(false);
  const initialFetchDone = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "danger",
  });

  // Error Dialog State
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string[];
  }>({
    isOpen: false,
    title: "",
    message: "",
    details: [],
  });

  // 📂 Lấy nội dung thư mục hiện tại
  const fetchFolderContents = useCallback(async (folderId: string | null) => {
    if (isFetching.current) {
      console.log("⏭️ Already fetching, skipping...");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    isFetching.current = true;

    if (isMounted.current) {
      setLoading(true);
    }

    try {
      console.log(`🔄 Fetching folder contents for: ${folderId}`);

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

      if (abortControllerRef.current?.signal.aborted) {
        console.log("⏭️ Request aborted");
        return;
      }

      if (error) throw error;

      if (isMounted.current) {
        // ✅ FIX: Type assertion cho data
        const documentData = (data || []) as Document[];
        console.log(`📂 Fetched ${documentData.length} items`);
        setItems(documentData);
        initialFetchDone.current = true;
        isInitialized.current = true;
      }
    } catch (error: any) {
      if (error.name === "AbortError" || error.code === "ABORT_ERR") {
        console.log("⏭️ Fetch aborted");
        return;
      }

      console.error("Error fetching folder contents:", error);
      if (isMounted.current) {
        setErrorDialog({
          isOpen: true,
          title: "Lỗi tải dữ liệu",
          message: error.message || "Không thể tải nội dung thư mục",
        });
      }
    } finally {
      if (isMounted.current) {
        console.log("✅ Setting loading to false");
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, []);

  // 🧭 Lấy đường dẫn breadcrumb
  const fetchBreadcrumbs = useCallback(async (folderId: string | null) => {
    if (!folderId) {
      if (isMounted.current) {
        setBreadcrumbs([{ id: null, title: "📁 Thư viện" }]);
      }
      return;
    }

    try {
      const crumbs: BreadcrumbItem[] = [{ id: null, title: "📁 Thư viện" }];
      let currentId: string | null = folderId;

      while (currentId) {
        const { data, error } = await supabase
          .from("documents")
          .select("id, title, parent_id")
          .eq("id", currentId)
          .single();

        if (error) break;

        // ✅ FIX: Type assertion cho data
        const item = data as {
          id: string;
          title: string;
          parent_id: string | null;
        };
        crumbs.splice(1, 0, { id: item.id, title: item.title });
        currentId = item.parent_id;
      }

      if (isMounted.current) {
        setBreadcrumbs(crumbs);
      }
    } catch (error) {
      console.error("Error fetching breadcrumbs:", error);
    }
  }, []);

  // 📍 Điều hướng đến folder
  const navigateToFolder = useCallback(
    async (folderId: string | null) => {
      if (isNavigating.current) {
        console.log("⏭️ Skipping navigation - already navigating");
        return;
      }

      if (isInitialized.current && folderId === currentFolderId) {
        console.log("⏭️ Skipping navigation - already at this folder");
        return;
      }

      console.log(`📂 Navigated to folder: ${folderId}`);

      isNavigating.current = true;

      try {
        setCurrentFolderId(folderId);
        await fetchFolderContents(folderId);
        await fetchBreadcrumbs(folderId);
        if (onNavigate) {
          onNavigate(folderId);
        }
      } catch (error) {
        console.error("Error navigating:", error);
      } finally {
        isNavigating.current = false;
      }
    },
    [currentFolderId, fetchFolderContents, fetchBreadcrumbs, onNavigate],
  );

  // ➕ Tạo folder mới - ✅ SỬ DỤNG supabaseAdmin
  const createFolder = useCallback(
    async (title: string) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      if (!title.trim()) {
        toast.error("Vui lòng nhập tên thư mục");
        return;
      }

      try {
        console.log("📁 Creating folder with supabaseAdmin:", title);

        const { data, error } = await supabaseAdmin
          .from("documents")
          .insert({
            title: title.trim(),
            is_folder: true,
            parent_id: currentFolderId,
            file_type: "folder",
            file_size: 0,
            file_url: null,
            uploaded_by: session.user.id,
            uploaded_by_name: session.user.name || "Unknown",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: "Tài liệu",
            subject: "Quản trị Mạng 3",
            tags: [],
            is_published: true,
          })
          .select()
          .single();

        if (error) {
          console.error("❌ Create folder error:", error);
          throw error;
        }

        console.log("✅ Folder created");
        toast.success(`Đã tạo thư mục "${title}"`);

        await fetchFolderContents(currentFolderId);
        setIsNewFolderModalOpen(false);
      } catch (error: any) {
        console.error("Error creating folder:", error);
        setErrorDialog({
          isOpen: true,
          title: "Không thể tạo thư mục",
          message: error.message || "Có lỗi xảy ra khi tạo thư mục",
        });
      }
    },
    [session, currentFolderId, fetchFolderContents],
  );

  // 🗑️ Xóa item - ✅ SỬ DỤNG supabaseAdmin
  const deleteItem = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      setConfirmDialog({
        isOpen: true,
        title: `Xóa ${item.is_folder ? "thư mục" : "file"}`,
        description: `Bạn có chắc chắn muốn xóa "${item.title}"? Hành động này không thể hoàn tác.`,
        variant: "danger",
        onConfirm: async () => {
          try {
            console.log("🗑️ Deleting item with supabaseAdmin:", id);

            const { error } = await supabaseAdmin
              .from("documents")
              .delete()
              .eq("id", id);

            if (error) {
              console.error("❌ Delete error:", error);
              throw error;
            }

            toast.success(`Đã xóa "${item.title}"`);
            await fetchFolderContents(currentFolderId);
            setSelectedItems([]);
          } catch (error: any) {
            console.error("Error deleting item:", error);
            setErrorDialog({
              isOpen: true,
              title: "Không thể xóa",
              message: error.message || "Có lỗi xảy ra khi xóa",
            });
          }
        },
      });
    },
    [items, currentFolderId, fetchFolderContents],
  );

  // 📤 Upload file - ✅ SỬ DỤNG supabaseAdmin
  const uploadFiles = useCallback(
    async (files: FileList) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      const fileArray = Array.from(files);
      const supportedExtensions = [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "zip",
        "rar",
        "7z",
        "tar",
        "gz",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "svg",
        "webp",
        "mp4",
        "mp3",
        "wav",
        "txt",
        "md",
        "json",
        "xml",
        "yaml",
        "yml",
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "py",
        "java",
        "c",
        "cpp",
        "go",
        "rs",
        "sh",
        "bat",
        "pkt",
        "pka",
        "cfg",
        "conf",
        "log",
      ];

      const invalidFiles = fileArray.filter(
        (file) =>
          !supportedExtensions.includes(
            file.name.split(".").pop()?.toLowerCase() || "",
          ),
      );

      if (invalidFiles.length > 0) {
        const invalidNames = invalidFiles.map((f) => f.name).join(", ");
        setErrorDialog({
          isOpen: true,
          title: "Định dạng file không được hỗ trợ",
          message: `Có ${invalidFiles.length} file không được hỗ trợ: ${invalidNames}`,
          details: supportedExtensions,
        });
        return;
      }

      if (fileArray.length === 0) {
        setErrorDialog({
          isOpen: true,
          title: "Không có file hợp lệ",
          message: "Vui lòng chọn file có định dạng được hỗ trợ",
          details: supportedExtensions,
        });
        return;
      }

      const toastId = toast.loading(`Đang tải lên ${fileArray.length} file...`);

      try {
        for (const file of fileArray) {
          const fileExt = file.name.split(".").pop() || "unknown";
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 8);
          const storagePath = `${session.user.id}/${timestamp}-${random}.${fileExt}`;

          const { error: uploadError } = await supabaseAdmin.storage
            .from("documents")
            .upload(storagePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabaseAdmin.storage
            .from("documents")
            .getPublicUrl(storagePath);

          const { error: dbError } = await supabaseAdmin
            .from("documents")
            .insert({
              title: file.name,
              description: "",
              file_type: fileExt,
              file_size: file.size,
              file_url: urlData.publicUrl,
              parent_id: currentFolderId,
              is_folder: false,
              uploaded_by: session.user.id,
              uploaded_by_name: session.user.name || "Unknown",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              category: "Tài liệu",
              subject: "Quản trị Mạng 3",
              tags: [],
              is_published: true,
            });

          if (dbError) throw dbError;
        }

        toast.success("Tải lên thành công!", { id: toastId });
        await fetchFolderContents(currentFolderId);
      } catch (error: any) {
        console.error("Upload error:", error);
        setErrorDialog({
          isOpen: true,
          title: "Lỗi tải lên",
          message: error.message || "Có lỗi xảy ra khi tải lên file",
        });
      }
    },
    [session, currentFolderId, fetchFolderContents],
  );

  // 🎯 Effect khi component mount
  useEffect(() => {
    isMounted.current = true;

    console.log("🚀 Component mounted, initializing...");

    const init = async () => {
      await navigateToFolder(initialFolderId || null);
    };
    init();

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ✅ Effect debug
  useEffect(() => {
    console.log(`📊 State - items: ${items.length}, loading: ${loading}`);
  }, [items, loading]);

  return (
    <>
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <Toolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewFolder={() => setIsNewFolderModalOpen(true)}
          onUpload={uploadFiles}
          onRefresh={() => {
            console.log("🔄 Manual refresh triggered");
            isFetching.current = false;
            fetchFolderContents(currentFolderId);
          }}
          currentFolderId={currentFolderId}
          onNavigateUp={() => {
            const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
            if (parentBreadcrumb) {
              navigateToFolder(parentBreadcrumb.id);
            }
          }}
          onNavigateHome={() => navigateToFolder(null)}
        />

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} onNavigate={navigateToFolder} />

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Folder className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white/80 mb-2">
                Thư mục trống
              </h3>
              <p className="text-white/40">
                Tạo thư mục mới hoặc tải file lên để bắt đầu
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <FileGrid
              items={items}
              onFolderClick={navigateToFolder}
              onDelete={deleteItem}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ) : (
            <FileList
              items={items}
              onFolderClick={navigateToFolder}
              onDelete={deleteItem}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )}
        </div>

        {/* New Folder Modal */}
        <NewFolderModal
          isOpen={isNewFolderModalOpen}
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={createFolder}
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog((prev) => ({ ...prev, isOpen: false }))}
        title={errorDialog.title}
        message={errorDialog.message}
        details={errorDialog.details}
      />
    </>
  );
}
