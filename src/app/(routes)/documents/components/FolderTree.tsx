// src/app/(routes)/documents/components/FolderTree.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    File,
    FileCode,
    FileImage,
    FileText,
    Folder,
    FolderOpen,
} from "lucide-react";
import { useState } from "react";

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
  className?: string;
}

function TreeNode({
  node,
  onNodeClick,
  onFileClick,
  level = 0,
}: {
  node: FolderNode;
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
      onNodeClick(node);
    } else {
      onFileClick(node);
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
          "flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200",
          node.type === "folder"
            ? "hover:bg-cyan-500/10 hover:text-cyan-400"
            : "hover:bg-white/5",
        )}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" && (
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
        {node.type === "folder" ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-cyan-400" />
          ) : (
            <Folder className="w-4 h-4 text-cyan-400/70" />
          )
        ) : (
          getFileIcon()
        )}
        <span className="text-sm text-white/80 truncate">{node.title}</span>
        {node.type === "folder" && hasChildren && (
          <span className="text-[10px] text-white/30 ml-auto">
            {node.children?.length}
          </span>
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
        />
      ))}
    </div>
  );
}
