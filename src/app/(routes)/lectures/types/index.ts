// src/app/(routes)/lectures/types/index.ts
// TYPE DEFINITIONS CHO LECTURES

export interface Lecture {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: "video" | "slide" | "lab" | "document";
  subject?: string;
  duration: string;
  duration_minutes: number;
  date: string;
  views: number;
  likes: number;
  teacher: string;
  teacher_id?: string;
  author_id?: string;
  tags: string[];
  video_url?: string;
  thumbnail?: string;
  file_url?: string;
  order: number;
  is_published: boolean;
  is_approved: boolean;
  status: "pending" | "approved" | "rejected";
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LectureFilter {
  search: string;
  type: string;
  tags: string[];
  subject: string;
  status: string;
  sortBy: "newest" | "popular" | "oldest" | "most_liked";
}

export interface LectureStats {
  total: number;
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  totalSlides: number;
  totalLabs: number;
  totalDocuments: number;
}

export interface LectureApproval {
  id: string;
  lecture_id: string;
  approved_by: string;
  status: "approved" | "rejected";
  reason?: string;
  created_at: string;
}
