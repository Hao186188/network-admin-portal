// src/hooks/use-class-info.ts
// Vai trò: Lấy thông tin chi tiết về lớp học từ database - SỬA LỖI UUID

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { BookOpen, Shield, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  location: string;
  schedule: string;
  room: string;
  semester: string;
  created_at: string;
  updated_at: string;
}

interface UseClassInfoReturn {
  classInfo: ClassInfo | null;
  loading: boolean;
  error: string | null;
}

export function useClassInfo(): UseClassInfoReturn {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          console.warn("Supabase client not initialized");
          setClassInfo(getFallbackData());
          setLoading(false);
          return;
        }

        // Try to get from database - sửa lỗi: không dùng UUID cho id không phải UUID
        const { data, error: dbError } = await supabase
          .from("classes")
          .select("*")
          .eq("name", "Quản trị Mạng 3") // Tìm theo name thay vì id
          .maybeSingle();

        if (dbError) {
          console.error("Supabase error:", dbError);
          setError(dbError.message);
          setClassInfo(getFallbackData());
          setLoading(false);
          return;
        }

        if (data) {
          setClassInfo({
            ...data,
            features: data.features || getDefaultFeatures(),
          });
        } else {
          setClassInfo(getFallbackData());
        }
      } catch (err) {
        console.error("Error fetching class info:", err);
        setError(
          err instanceof Error ? err.message : "Không thể tải thông tin lớp",
        );
        setClassInfo(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchClassInfo();
  }, []);

  return { classInfo, loading, error };
}

// Helper functions
function getDefaultFeatures(): Feature[] {
  return [
    {
      icon: BookOpen,
      title: "Tài liệu phong phú",
      description:
        "Hàng trăm tài liệu, bài giảng và giáo trình được cập nhật liên tục",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Cộng đồng học tập",
      description:
        "Kết nối với giảng viên và sinh viên để cùng học hỏi và phát triển",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Cập nhật công nghệ",
      description: "Luôn cập nhật những công nghệ mới nhất trong lĩnh vực mạng",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Shield,
      title: "Bảo mật cao",
      description: "Hệ thống được bảo vệ với các tiêu chuẩn bảo mật hàng đầu",
      color: "from-red-500 to-red-600",
    },
  ];
}

function getFallbackData(): ClassInfo {
  return {
    id: "class-3",
    name: "Quản trị Mạng 3",
    description:
      "Nơi đào tạo những chuyên gia mạng tương lai với công nghệ hiện đại",
    features: getDefaultFeatures(),
    location: "Trường Cao đẳng Nghề Kiên Giang",
    schedule: "Thứ 2 - Thứ 6, 7:00 - 17:00",
    room: "P.301 - Tòa nhà A",
    semester: "Tháng 9 - Tháng 1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
