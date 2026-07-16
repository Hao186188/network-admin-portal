// src/app/(routes)/lectures/components/FolderExplorer/FolderTree.tsx
// CẬP NHẬT - THÊM XÓA VÀ TẢI FOLDER

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Download,
  DownloadCloud,
  ExternalLink,
  File,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FolderNode, FolderTreeProps } from "./types";

function TreeNode({
  node,
  onNodeClick,
  onFileClick,
  onDeleteFolder,
  onDownloadFolder,
  level = 0,
}: {
  node: FolderNode;
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
  onDeleteFolder?: (node: FolderNode) => void;
  onDownloadFolder?: (node: FolderNode) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
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

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.lecture?.file_url) {
      window.open(node.lecture.file_url, "_blank");
    } else {
      toast.error("Không có file để tải");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteFolder) {
      onDeleteFolder(node);
    }
  };

  const handleDownloadFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownloadFolder) {
      onDownloadFolder(node);
    }
  };

  const getFileIcon = () => {
    const type = node.fileType?.toLowerCase() || "";
    if (["pdf"].includes(type))
      return <FileText className="w-4 h-4 text-red-400" />;
    if (["doc", "docx"].includes(type))
      return <FileText className="w-4 h-4 text-blue-400" />;
    if (["xls", "xlsx"].includes(type))
      return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
    if (["ppt", "pptx"].includes(type))
      return <FileSpreadsheet className="w-4 h-4 text-orange-400" />;
    if (["png", "jpg", "jpeg", "gif", "svg"].includes(type))
      return <FileImage className="w-4 h-4 text-purple-400" />;
    if (["mp4", "avi", "mov", "mkv"].includes(type))
      return <Video className="w-4 h-4 text-pink-400" />;
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
        <span className="text-sm text-white/80 truncate flex-1">
          {node.title}
        </span>
        {isFolder && hasChildren && (
          <span className="text-[10px] text-white/30">
            {node.children?.length}
          </span>
        )}

        {/* ✅ Actions cho folder */}
        {isFolder && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownloadFolder}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
              title="Tải xuống toàn bộ thư mục"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors"
              title="Xóa thư mục"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ✅ Actions cho file */}
        {!isFolder && node.lecture?.file_url && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
              title="Tải xuống"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (node.lecture?.file_url) {
                  window.open(node.lecture.file_url, "_blank");
                }
              }}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-blue-400 transition-colors"
              title="Mở link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
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
          {node.children?.map((child: FolderNode) => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
              onFileClick={onFileClick}
              onDeleteFolder={onDeleteFolder}
              onDownloadFolder={onDownloadFolder}
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
  className,
}: FolderTreeProps & {
  onDeleteFolder?: (node: FolderNode) => void;
  onDownloadFolder?: (node: FolderNode) => void;
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      {nodes.map((node: FolderNode) => (
        <TreeNode
          key={node.id}
          node={node}
          onNodeClick={onNodeClick}
          onFileClick={onFileClick}
          onDeleteFolder={onDeleteFolder}
          onDownloadFolder={onDownloadFolder}
        />
      ))}
    </div>
  );
}
