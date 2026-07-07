// src/hooks/use-courses.ts
// Vai trò: Lấy và quản lý dữ liệu môn học từ database - CÓ FALLBACK

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

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
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateCourseData {
  name: string;
  code: string;
  description: string;
  instructor_id: string;
  credits: number;
  schedule: string;
  room: string;
  tags: string[];
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createCourse: (data: CreateCourseData) => Promise<Course | null>;
  getCourseDetail: (id: string) => Promise<Course | null>;
  enrollCourse: (courseId: string, userId: string) => Promise<boolean>;
}

// Fallback data khi không có database
const fallbackCourses: Course[] = [
  {
    id: "1",
    name: "Quản trị Mạng 3",
    code: "QTM301",
    description:
      "Kiến thức về quản trị mạng nâng cao, bao gồm VLAN, Routing, NAT, và bảo mật mạng.",
    instructor: "Nguyễn Ngọc Thanh",
    instructor_id: "",
    credits: 4,
    students: 25,
    schedule: "Thứ 2, 07:30 - 10:30",
    room: "Phòng A1.2",
    progress: 75,
    status: "active",
    rating: 4.8,
    tags: ["Mạng", "Cisco", "CCNA"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bảo mật Mạng",
    code: "BMM401",
    description:
      "Các kỹ thuật bảo mật mạng, firewall, IPS, và các biện pháp phòng thủ.",
    instructor: "Nguyễn Ngọc Thanh",
    instructor_id: "",
    credits: 3,
    students: 22,
    schedule: "Thứ 3, 13:00 - 16:00",
    room: "Phòng B2.1",
    progress: 65,
    status: "active",
    rating: 4.6,
    tags: ["Bảo mật", "Firewall", "IPS"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Cisco CCNA",
    code: "CCNA201",
    description:
      "Chứng chỉ CCNA với các kiến thức về routing, switching và networking.",
    instructor: "Nguyễn Ngọc Thanh",
    instructor_id: "",
    credits: 4,
    students: 20,
    schedule: "Thứ 4, 07:30 - 10:30",
    room: "Phòng Lab 3",
    progress: 90,
    status: "active",
    rating: 4.9,
    tags: ["CCNA", "Cisco", "Routing"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.warn("Supabase client not initialized, using fallback data");
        setCourses(fallbackCourses);
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("courses")
        .select(
          `
          *,
          user:users(name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (dbError) {
        // Nếu bảng chưa tồn tại, dùng fallback
        if (dbError.code === "PGRST205") {
          console.warn("Table 'courses' not found, using fallback data");
          setCourses(fallbackCourses);
        } else {
          console.error("Supabase error:", dbError);
          setError(dbError.message);
          setCourses(fallbackCourses);
        }
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setCourses(data);
      } else {
        setCourses(fallbackCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err.message : "Không thể tải môn học");
      setCourses(fallbackCourses);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseDetail = useCallback(
    async (id: string): Promise<Course | null> => {
      try {
        if (!supabase) {
          return fallbackCourses.find((c) => c.id === id) || null;
        }

        const { data, error: dbError } = await supabase
          .from("courses")
          .select(
            `
          *,
          user:users(name, email)
        `,
          )
          .eq("id", id)
          .single();

        if (dbError) {
          console.error("Supabase error:", dbError);
          return fallbackCourses.find((c) => c.id === id) || null;
        }

        return data;
      } catch (err) {
        console.error("Error fetching course detail:", err);
        return fallbackCourses.find((c) => c.id === id) || null;
      }
    },
    [],
  );

  const createCourse = useCallback(
    async (data: CreateCourseData): Promise<Course | null> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const newCourse = {
          ...data,
          students: 0,
          progress: 0,
          status: "pending",
          rating: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: created, error: dbError } = await supabase
          .from("courses")
          .insert([newCourse])
          .select()
          .single();

        if (dbError) {
          console.error("Supabase insert error:", dbError);
          throw new Error(dbError.message);
        }

        await fetchCourses();
        return created;
      } catch (err) {
        console.error("Error creating course:", err);
        throw err;
      }
    },
    [fetchCourses],
  );

  const enrollCourse = useCallback(
    async (courseId: string, userId: string): Promise<boolean> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        // Kiểm tra đã đăng ký chưa
        const { data: existing, error: checkError } = await supabase
          .from("course_enrollments")
          .select("id")
          .eq("course_id", courseId)
          .eq("user_id", userId)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          throw new Error(checkError.message);
        }

        if (existing) {
          throw new Error("Bạn đã đăng ký môn học này rồi!");
        }

        // Đăng ký môn học
        const { error: enrollError } = await supabase
          .from("course_enrollments")
          .insert([
            {
              course_id: courseId,
              user_id: userId,
              status: "active",
              enrolled_at: new Date().toISOString(),
            },
          ]);

        if (enrollError) {
          throw new Error(enrollError.message);
        }

        // Cập nhật số lượng sinh viên
        const { data: courseData } = await supabase
          .from("courses")
          .select("students")
          .eq("id", courseId)
          .single();

        await supabase
          .from("courses")
          .update({ students: (courseData?.students || 0) + 1 })
          .eq("id", courseId);

        await fetchCourses();
        return true;
      } catch (err) {
        console.error("Error enrolling course:", err);
        throw err;
      }
    },
    [fetchCourses],
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refresh: fetchCourses,
    createCourse,
    getCourseDetail,
    enrollCourse,
  };
}
