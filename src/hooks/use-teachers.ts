// src/hooks/use-teachers.ts
// Vai trò: Lấy danh sách giảng viên từ database

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useEffect, useState } from "react";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  specialties: string[];
  bio: string;
  created_at: string;
  updated_at: string;
}

interface UseTeachersReturn {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
}

export function useTeachers(): UseTeachersReturn {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra supabase client
        if (!supabase) {
          console.warn("Supabase client not initialized, using fallback data");
          setTeachers(getFallbackTeachers());
          setLoading(false);
          return;
        }

        // Get teachers from database
        const { data, error: dbError } = await supabase
          .from("users")
          .select("*")
          .in("role", ["TEACHER", "ADMIN"])
          .order("name");

        if (dbError) {
          console.error("Supabase error:", dbError);
          setError(dbError.message);
          setTeachers(getFallbackTeachers());
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const teacherData: Teacher[] = data.map((user) => ({
            id: user.id,
            name: user.name || "Giảng viên",
            email: user.email || "",
            phone: user.phone || "",
            image: user.image || "",
            role: user.role === "ADMIN" ? "Giảng viên chính" : "Giảng viên",
            specialties: user.specialties || [
              "Quản trị mạng",
              "Bảo mật",
              "Cisco",
            ],
            bio:
              user.bio ||
              "Giảng viên giàu kinh nghiệm trong lĩnh vực mạng và công nghệ thông tin",
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
          }));
          setTeachers(teacherData);
        } else {
          setTeachers(getFallbackTeachers());
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách giảng viên",
        );
        setTeachers(getFallbackTeachers());
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return { teachers, loading, error };
}

function getFallbackTeachers(): Teacher[] {
  return [
    {
      id: "1",
      name: "Nguyễn Ngọc Thanh",
      email: "thanh.nn@cdngk.edu.vn",
      phone: "(0297) 3xxx xxx",
      image: "",
      role: "Giảng viên chính",
      specialties: ["Quản trị Mạng", "Bảo mật Mạng", "Cisco CCNA"],
      bio: "10+ năm kinh nghiệm trong lĩnh vực mạng và đào tạo chuyên nghiệp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Trần Văn An",
      email: "an.tv@cdngk.edu.vn",
      phone: "(0297) 3xxx xxx",
      image: "",
      role: "Giảng viên",
      specialties: ["Linux", "Server", "Cloud Computing"],
      bio: "Chuyên gia về hệ thống Linux và các giải pháp Cloud",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
