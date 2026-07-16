// src/app/(routes)/lectures/components/FolderExplorer/types.ts
// TYPE DEFINITIONS - FIXED EXPORT

import { Lecture } from "@/types";

// ✅ Export tất cả interfaces
export interface FolderNode {
  id: string;
  title: string;
  type: "folder" | "file";
  fileType?: string;
  children?: FolderNode[];
  isOpen?: boolean;
  lecture?: Lecture;
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
}

export interface FolderBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
}

export interface FolderTreeProps {
  nodes: FolderNode[];
  onNodeClick: (node: FolderNode) => void;
  onFileClick: (node: FolderNode) => void;
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
