// src/app/(routes)/documents/components/FileExplorer/types.ts
import { Document } from "../../types";

export interface BreadcrumbItem {
  id: string | null;
  title: string;
}

export interface FileExplorerProps {
  initialFolderId?: string | null;
  onNavigate?: (folderId: string | null) => void;
}

export interface FileItemProps {
  item: Document;
  onFolderClick: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string, ctrlKey: boolean) => void;
}

export interface FileGridProps {
  items: Document[];
  onFolderClick: (id: string) => void;
  onDelete: (id: string) => void;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export interface FileListProps {
  items: Document[];
  onFolderClick: (id: string) => void;
  onDelete: (id: string) => void;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export interface ToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onNewFolder: () => void;
  onUpload: (files: FileList) => void;
  onRefresh: () => void;
  currentFolderId: string | null;
  onNavigateUp?: () => void;
  onNavigateHome?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
}

export interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
}
