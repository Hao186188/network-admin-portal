// src/types/index.ts
// TYPE DEFINITIONS - HOÀN CHỈNH

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  student_id?: string;
  image?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  specialties?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  phone?: string;
  student_id?: string;
  image?: string;
}

// ============================================
// LECTURE TYPES - CẬP NHẬT
// ============================================

export interface Lecture {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: "video" | "slide" | "lab" | "document" | "folder";
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
  file_size?: number;
  file_type?: string; // ✅ THÊM file_type

  // ✅ Folder Explorer
  parent_id?: string | null;
  path?: string[];
  is_folder?: boolean;
  sort_order: number;

  // ✅ Trạng thái
  is_published: boolean;
  is_approved: boolean;
  status: "pending" | "approved" | "rejected";
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;

  // ✅ Timestamps
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
  totalFolders: number;
}

export interface LectureApproval {
  id: string;
  lecture_id: string;
  approved_by: string;
  status: "approved" | "rejected";
  reason?: string;
  created_at: string;
}

// ============================================
// FOLDER EXPLORER TYPES
// ============================================

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

// ============================================
// FORUM TYPES
// ============================================

export interface ForumAttachment {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  post_id?: string;
  user_id?: string;
  created_at?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  likes: number;
  replies: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  attachments?: ForumAttachment[];
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatFriend {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  status: string;
  is_online?: boolean;
  last_seen?: string;
  last_message?: string;
  last_message_time?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  read: boolean;
  created_at: string;
  sender_name: string;
  sender_image: string;
}

// ============================================
// ASSIGNMENT TYPES
// ============================================

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  submissions: number;
  total_students: number;
  points: number;
  attachments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  grade?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// COURSE TYPES
// ============================================

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  instructor_id: string;
  credits: number;
  students: number;
  schedule: string;
  room: string;
  progress: number;
  status: "active" | "completed" | "pending";
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// ANNOUNCEMENT TYPES
// ============================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  category: string;
  author: string;
  author_id: string;
  views: number;
  comments: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// DOCUMENT TYPES
// ============================================

export interface Document {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  parent_id?: string | null;
  path: string[];
  is_folder: boolean;
  is_published: boolean;
  category: string;
  subject: string;
  tags: string[];
  downloads: number;
  views: number;
  rating: number;
  rating_avg: number;
  likes_count: number;
  comments_count: number;
  uploaded_by: string;
  uploaded_by_name?: string;
  uploaded_by_avatar?: string;
  semester?: string;
  academic_year?: string;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
