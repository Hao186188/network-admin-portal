// src/hooks/use-profile.ts
// Vai trò: Lấy và quản lý dữ liệu hồ sơ người dùng - FIX LỖI TYPE

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  image: string;
  student_id: string;
  specialties: string[];
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  name: string;
  code: string;
  progress: number;
  grade: number;
  status: string;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  created_at: string;
  type: "assignment" | "submission" | "grade" | "login";
}

export interface SavedDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  created_at: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  courses: CourseProgress[];
  activities: Activity[];
  documents: SavedDocument[];
  stats: {
    submissions: number;
    projects: number;
    averageGrade: number;
    certificates: number;
    progress: number;
  };
  loading: boolean;
  error: string | null;
  refresh: () => void;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [stats, setStats] = useState({
    submissions: 0,
    projects: 0,
    averageGrade: 0,
    certificates: 0,
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Kiểm tra session
      if (!session?.user?.id) {
        console.log("No session found, waiting for authentication...");
        setLoading(false);
        return;
      }

      if (!supabase) {
        setError("Không thể kết nối database");
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      console.log("Fetching profile for user:", userId);

      // Lấy thông tin profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }

      if (!profileData) {
        setError("Không tìm thấy hồ sơ");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Lấy danh sách môn học đã đăng ký
      const { data: enrollments, error: enrollError } = await supabase
        .from("course_enrollments")
        .select(
          `
          course_id,
          status,
          enrolled_at,
          courses:course_id (
            id,
            name,
            code,
            progress,
            rating
          )
        `,
        )
        .eq("user_id", userId);

      if (!enrollError && enrollments) {
        const courseData: CourseProgress[] = enrollments.map((enr: any) => ({
          id: enr.courses.id,
          name: enr.courses.name,
          code: enr.courses.code,
          progress: enr.courses.progress || 0,
          grade: enr.courses.rating || 0,
          status: enr.status,
        }));
        setCourses(courseData);
      }

      // Lấy hoạt động gần đây
      const { data: activitiesData, error: actError } = await supabase
        .from("submissions")
        .select(
          `
          id,
          created_at,
          status,
          assignment:assignment_id (
            title
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!actError && activitiesData) {
        const activityList: Activity[] = activitiesData.map((item: any) => ({
          id: item.id,
          action: item.status === "APPROVED" ? "Đã chấm điểm" : "Nộp bài",
          description: item.assignment?.title || "Bài tập",
          created_at: item.created_at,
          type: item.status === "APPROVED" ? "grade" : "submission",
        }));
        setActivities(activityList);
      }

      // Lấy tài liệu đã lưu
      const { data: docsData, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!docsError && docsData) {
        setDocuments(docsData);
      }

      // Tính toán thống kê
      const { count: submissionsCount, error: subError } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: projectsCount, error: projError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // Tính điểm trung bình
      const { data: gradesData, error: gradeError } = await supabase
        .from("submissions")
        .select("grade")
        .eq("user_id", userId)
        .eq("status", "APPROVED")
        .not("grade", "is", null);

      let avgGrade = 0;
      if (!gradeError && gradesData && gradesData.length > 0) {
        const sum = gradesData.reduce(
          (acc: number, curr: any) => acc + (curr.grade || 0),
          0,
        );
        avgGrade = Math.round((sum / gradesData.length) * 10) / 10;
      }

      let totalProgress = 0;
      if (courses.length > 0) {
        totalProgress = Math.round(
          courses.reduce((acc: number, curr) => acc + curr.progress, 0) /
            courses.length,
        );
      }

      setStats({
        submissions: submissionsCount || 0,
        projects: projectsCount || 0,
        averageGrade: avgGrade,
        certificates: 0,
        progress: totalProgress,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Không thể tải hồ sơ");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, courses.length]);

  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      try {
        if (!supabase || !session?.user?.id) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        const { error } = await supabase
          .from("users")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        if (error) throw error;

        await fetchProfile();
        return true;
      } catch (err) {
        console.error("Error updating profile:", err);
        return false;
      }
    },
    [session?.user?.id, fetchProfile],
  );

  useEffect(() => {
    // Chỉ fetch khi có session
    if (session?.user?.id) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id, fetchProfile]);

  return {
    profile,
    courses,
    activities,
    documents,
    stats,
    loading,
    error,
    refresh: fetchProfile,
    updateProfile,
  };
}
