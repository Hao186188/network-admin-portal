// src/app/(routes)/admin/types/index.ts

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  phone: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalTeachers: number;
  totalStudents: number;
  activeUsers: number;
  newUsers: number;
}
