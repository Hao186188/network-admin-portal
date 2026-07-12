// src/store/documents-store.ts
// FIXED: Đơn giản hóa

import { Document } from "@/app/(routes)/documents/types";
import { create } from "zustand";

interface DocumentsStore {
  documents: Document[];
  loading: boolean;
  stats: {
    total: number;
    downloads: number;
    views: number;
    categories: string[];
    subjects: string[];
    tags: string[];
    recent_uploads: number;
    total_size: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  refreshKey: number;
  setDocuments: (docs: Document[]) => void;
  setLoading: (loading: boolean) => void;
  setStats: (stats: any) => void;
  setPagination: (pagination: any) => void;
  triggerRefresh: () => void;
  resetRefresh: () => void;
}

const defaultStats = {
  total: 0,
  downloads: 0,
  views: 0,
  categories: [],
  subjects: [],
  tags: [],
  recent_uploads: 0,
  total_size: "0 MB",
};

const defaultPagination = {
  page: 1,
  limit: 12,
  total: 0,
  hasMore: false,
};

export const useDocumentsStore = create<DocumentsStore>((set) => ({
  documents: [],
  loading: true,
  stats: defaultStats,
  pagination: defaultPagination,
  refreshKey: 0,
  setDocuments: (docs) => set({ documents: docs }),
  setLoading: (loading) => set({ loading }),
  setStats: (stats) => set({ stats }),
  setPagination: (pagination) => set({ pagination }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  resetRefresh: () => set({ refreshKey: 0 }),
}));
