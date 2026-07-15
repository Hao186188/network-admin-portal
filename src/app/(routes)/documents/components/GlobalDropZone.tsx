// src/app/(routes)/documents/components/GlobalDropZone.tsx
// FIXED: Xử lý folder và file .rar

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { File, Folder, FolderUp, UploadCloud } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface GlobalDropZoneProps {
  children: React.ReactNode;
  currentFolderId: string | null;
  onUpload: (files: ExtractedFile[], folderId: string | null) => Promise<void>;
  onUploadComplete: () => void;
}

export interface ExtractedFile {
  file: File;
  relativePath: string;
  fileName: string;
  folderPath: string;
}

// ✅ Danh sách extension được hỗ trợ - ĐẦY ĐỦ
const SUPPORTED_EXTENSIONS = [
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "rtf",
  "odt",
  // Archives - QUAN TRỌNG: thêm RAR
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
  "tiff",
  "tif",
  // Videos
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "m4v",
  "3gp",
  // Audio
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "m4a",
  "wma",
  // Code
  "js",
  "ts",
  "jsx",
  "tsx",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "yml",
  "md",
  "py",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "go",
  "rs",
  "sh",
  "bat",
  "ps1",
  // Network
  "pkt",
  "pka",
  "cfg",
  "conf",
  "log",
];

export function GlobalDropZone({
  children,
  currentFolderId,
  onUpload,
  onUploadComplete,
}: GlobalDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{
    total: number;
    current: number;
  } | null>(null);
  const isUploading = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Chỉ render trên client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Kiểm tra file có hợp lệ không
  const isValidFile = useCallback((fileName: string): boolean => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return SUPPORTED_EXTENSIONS.includes(ext);
  }, []);

  // ✅ Đệ quy duyệt cây thư mục - BỎ QUA FOLDER KHÔNG CÓ FILE HỢP LỆ
  const traverseFileTree = useCallback(
    async (entry: any, path = ""): Promise<ExtractedFile[]> => {
      const files: ExtractedFile[] = [];

      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => entry.file(resolve));
        const fileName = entry.name;

        // ✅ Chỉ lấy file có extension hợp lệ
        if (isValidFile(fileName)) {
          const relativePath = path + fileName;
          const folderPath = path.endsWith("/") ? path.slice(0, -1) : path;
          files.push({
            file,
            relativePath,
            fileName,
            folderPath: folderPath || "",
          });
        } else {
          console.log(`⏭️ Skipping unsupported file: ${fileName}`);
        }
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        // Đọc tất cả entries trong thư mục
        const entries = await new Promise<any[]>((resolve, reject) => {
          const allEntries: any[] = [];
          const readEntries = () => {
            dirReader.readEntries((results: any[]) => {
              if (results.length === 0) {
                resolve(allEntries);
              } else {
                allEntries.push(...results);
                readEntries();
              }
            }, reject);
          };
          readEntries();
        });

        for (const childEntry of entries) {
          const childFiles = await traverseFileTree(
            childEntry,
            path + entry.name + "/",
          );
          files.push(...childFiles);
        }
      }
      return files;
    },
    [isValidFile],
  );

  // Xử lý drop
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setDragCounter(0);

      if (isUploading.current) {
        toast.warning("Đang có quá trình tải lên, vui lòng đợi!");
        return;
      }

      const items = e.dataTransfer.items;
      if (!items || items.length === 0) {
        toast.error("Không tìm thấy file hoặc thư mục");
        return;
      }

      // Kiểm tra xem có dùng webkitGetAsEntry không
      const firstItem = items[0];
      if (!firstItem.webkitGetAsEntry) {
        toast.error("Trình duyệt không hỗ trợ kéo thả thư mục");
        return;
      }

      const uploadPromises: Promise<ExtractedFile[]>[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            try {
              const files = await traverseFileTree(entry);
              if (files.length > 0) {
                uploadPromises.push(Promise.resolve(files));
              }
            } catch (error) {
              console.error("Error traversing file tree:", error);
              toast.error(`Lỗi đọc thư mục: ${entry.name}`);
            }
          }
        }
      }

      if (uploadPromises.length === 0) {
        toast.error("Không có file hợp lệ để tải lên");
        return;
      }

      const results = await Promise.all(uploadPromises);
      const allFiles = results.flat();

      if (allFiles.length === 0) {
        toast.error("Không có file nào được hỗ trợ");
        return;
      }

      const toastId = toast.loading(`Đang xử lý ${allFiles.length} file...`);

      try {
        isUploading.current = true;
        setUploadProgress({ total: allFiles.length, current: 0 });

        // Chia nhỏ file để upload (mỗi lần 10 file)
        const chunkSize = 10;
        for (let i = 0; i < allFiles.length; i += chunkSize) {
          const chunk = allFiles.slice(i, i + chunkSize);
          await onUpload(chunk, currentFolderId);
          setUploadProgress((prev) => ({
            total: allFiles.length,
            current: Math.min(i + chunkSize, allFiles.length),
          }));
        }

        toast.success("Tải lên thành công!", { id: toastId });
        onUploadComplete();
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tải lên", {
          id: toastId,
        });
      } finally {
        isUploading.current = false;
        setUploadProgress(null);
      }
    },
    [currentFolderId, onUpload, onUploadComplete, traverseFileTree],
  );

  // Xử lý drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsDragActive(false);
        return 0;
      }
      return newCount;
    });
  }, []);

  // Nếu không phải client, chỉ render children
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative min-h-screen w-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      {/* Progress Bar */}
      {uploadProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-4 min-w-[280px] shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Đang tải lên...</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-white/40 mt-1">
                {uploadProgress.current} / {uploadProgress.total} file
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md border-4 border-dashed border-cyan-500/50 m-4 rounded-2xl pointer-events-none"
          >
            <div className="text-center p-8 max-w-md">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400"
              >
                <UploadCloud className="w-12 h-12" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mt-4 tracking-tight">
                Thả vào đây để tải lên!
              </h3>

              <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto">
                Hệ thống tự động phân tích cấu trúc thư mục và giữ nguyên tổ
                chức file
              </p>

              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/40">
                <span className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-cyan-400" />
                  Hỗ trợ thư mục
                </span>
                <span className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-400" />
                  Hỗ trợ đơn file
                </span>
                <span className="flex items-center gap-2">
                  <FolderUp className="w-4 h-4 text-purple-400" />
                  Tự động tạo cấu trúc
                </span>
              </div>

              <div className="mt-6 text-[10px] text-white/20 font-mono">
                {currentFolderId
                  ? `📁 Đang tải lên vào thư mục hiện tại`
                  : `📁 Tải lên thư mục gốc`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
