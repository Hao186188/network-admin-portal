// src/app/(routes)/lectures/components/FolderExplorer/types.ts

import { Lecture } from "@/types";

export interface FolderNode {
  id: string;
  title: string;
  type: "folder" | "file";
  fileType?: string;
  children?: FolderNode[];
  isOpen?: boolean;
  lecture?: Lecture;
  isVirtual?: boolean;
}

export interface BreadcrumbItem {
  id: string | null;
  title: string;
  path: string[];
}

export interface FolderExplorerProps {
  initialFolderId?: string | null;
  onNavigate?: (folderId: string | null) => void;
  onLectureClick?: (lecture: Lecture) => void;
  onRefresh?: () => void;
  userRole?: string;
  canManage?: boolean;
}

// ✅ THÊM: Props cho FolderBreadcrumbs
export interface FolderBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
}

export interface FolderTreeProps {
  nodes: FolderNode[];
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
  onDeleteFolder?: (node: FolderNode) => void;
  onDeleteFile?: (node: FolderNode) => void;
  onDownloadFolder?: (node: FolderNode) => void;
  onRenameFolder?: (node: FolderNode, newTitle: string) => Promise<void>;
  canManage?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => Promise<void>;
  isLoading?: boolean;
}
