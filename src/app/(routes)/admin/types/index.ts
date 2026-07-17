// src/app/(routes)/admin/types.ts
// Vai trò: Types cho Admin

export interface AdminUser {
  id: string;
  username: string; // ✅ THÊM
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  bio: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  student_id?: string;
  is_verified?: boolean;
  reputation?: number;
  total_lectures?: number;
  total_likes_received?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalTeachers: number;
  totalStudents: number;
  activeUsers: number;
  newUsers: number;
}
