// src/types/index.ts
// Vai trò: Type definitions cho toàn bộ dự án

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
// FORUM TYPES - ĐỒNG BỘ VỚI HOOK
// ============================================

export interface ForumAttachment {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  // Các field optional cho hook
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
