// src/app/(routes)/documents/components/FolderTree.tsx
// CẬP NHẬT - THÊM ĐỔI TÊN THƯ MỤC

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronRight,
  DownloadCloud,
  File,
  FileCode,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface FolderNode {
  id: string;
  title: string;
  type: "folder" | "file";
  fileType?: string;
  children?: FolderNode[];
  isOpen?: boolean;
}

interface FolderTreeProps {
  nodes: FolderNode[];
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
  onDeleteFolder?: (node: FolderNode) => void;
  onDownloadFolder?: (node: FolderNode) => void;
  onRenameFolder?: (node: FolderNode, newTitle: string) => Promise<void>;
  className?: string;
}

function TreeNode({
  node,
  onNodeClick,
  onFileClick,
  onDeleteFolder,
  onDownloadFolder,
  onRenameFolder,
  level = 0,
}: {
  node: FolderNode;
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
  onDeleteFolder?: (node: FolderNode) => void;
  onDownloadFolder?: (node: FolderNode) => void;
  onRenameFolder?: (node: FolderNode, newTitle: string) => Promise<void>;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(node.title);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
      onNodeClick(node);
    } else {
      onFileClick(node);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewTitle(node.title);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };

  const handleRenameConfirm = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      toast.error("Tên không được để trống");
      return;
    }
    if (trimmed === node.title) {
      setIsRenaming(false);
      return;
    }

    setIsLoading(true);
    try {
      if (onRenameFolder) {
        await onRenameFolder(node, trimmed);
        toast.success(`Đã đổi tên thành "${trimmed}"`);
        setIsRenaming(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể đổi tên");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewTitle(node.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameConfirm();
    } else if (e.key === "Escape") {
      handleRenameCancel();
    }
  };

  const getFileIcon = () => {
    const type = node.fileType?.toLowerCase() || "";
    if (["pdf"].includes(type))
      return <FileText className="w-4 h-4 text-red-400" />;
    if (["doc", "docx"].includes(type))
      return <FileText className="w-4 h-4 text-blue-400" />;
    if (["xls", "xlsx"].includes(type))
      return <FileText className="w-4 h-4 text-green-400" />;
    if (["ppt", "pptx"].includes(type))
      return <FileText className="w-4 h-4 text-orange-400" />;
    if (["png", "jpg", "jpeg", "gif", "svg"].includes(type))
      return <FileImage className="w-4 h-4 text-purple-400" />;
    if (["zip", "rar", "7z"].includes(type))
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    return <File className="w-4 h-4 text-white/40" />;
  };

  return (
    <div className="select-none">
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group",
          isFolder
            ? "hover:bg-cyan-500/10 hover:text-cyan-400"
            : "hover:bg-white/5",
        )}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={handleClick}
      >
        {isFolder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {isFolder ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-cyan-400" />
          ) : (
            <Folder className="w-4 h-4 text-cyan-400/70" />
          )
        ) : (
          getFileIcon()
        )}

        {/* Tên - hiển thị hoặc input rename */}
        {isRenaming ? (
          <div
            className="flex-1 flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-black/50 border border-cyan-500/50 rounded px-2 py-0.5 text-sm text-white outline-none focus:border-cyan-400"
              disabled={isLoading}
            />
            <button
              onClick={handleRenameConfirm}
              className="p-0.5 text-green-400 hover:text-green-300 transition-colors"
              disabled={isLoading}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleRenameCancel}
              className="p-0.5 text-red-400 hover:text-red-300 transition-colors"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="text-sm text-white/80 truncate flex-1">
              {node.title}
            </span>
            {isFolder && hasChildren && (
              <span className="text-[10px] text-white/30">
                {node.children?.length}
              </span>
            )}
          </>
        )}

        {/* ✅ Actions cho folder - CHỈ HIỆN KHI KHÔNG RENAME */}
        {isFolder && !isRenaming && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleRename}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
              title="Đổi tên"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {onDownloadFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadFolder(node);
                }}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
                title="Tải xuống toàn bộ thư mục"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
              </button>
            )}
            {onDeleteFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(node);
                }}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
                title="Xóa thư mục"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* ✅ Actions cho file */}
        {!isFolder && node.fileType && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle download file
              }}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
              title="Tải xuống"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </motion.div>

      {isOpen && hasChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
              onFileClick={onFileClick}
              onDeleteFolder={onDeleteFolder}
              onDownloadFolder={onDownloadFolder}
              onRenameFolder={onRenameFolder}
              level={level + 1}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function FolderTree({
  nodes,
  onNodeClick,
  onFileClick,
  onDeleteFolder,
  onDownloadFolder,
  onRenameFolder,
  className,
}: FolderTreeProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onNodeClick={onNodeClick}
          onFileClick={onFileClick}
          onDeleteFolder={onDeleteFolder}
          onDownloadFolder={onDownloadFolder}
          onRenameFolder={onRenameFolder}
        />
      ))}
    </div>
  );
}
