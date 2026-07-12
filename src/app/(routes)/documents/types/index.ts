// src/app/(routes)/documents/types/index.ts
// TYPE DEFINITIONS - CẬU NHUẬT

export interface Document {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  downloads: number;
  views: number;
  rating: number;
  rating_avg?: number;
  likes_count?: number;
  comments_count?: number;
  tags: string[];
  category: string;
  subject: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  uploaded_by_avatar?: string;
  is_published: boolean;
  is_favorite?: boolean;
  semester?: string;
  academic_year?: string;
}

export interface DocumentLike {
  id: string;
  document_id: string;
  user_id: string;
  created_at: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  replies?: DocumentComment[];
}

export interface DocumentRating {
  id: string;
  document_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  total: number;
  downloads: number;
  views: number;
  categories: string[];
  subjects: string[];
  tags: string[];
  recent_uploads: number;
  total_size: string;
}

export interface DocumentsFilter {
  search: string;
  category: string;
  tags: string[];
  subject: string;
  sortBy: "newest" | "popular" | "downloads" | "rating";
  viewMode: "grid" | "list";
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
