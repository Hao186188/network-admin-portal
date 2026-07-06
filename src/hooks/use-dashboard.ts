// src/hooks/use-dashboard.ts
// Vai trò: Lấy dữ liệu cho Dashboard từ database

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useEffect, useState } from "react";

interface DashboardData {
  documents: number;
  lectures: number;
  students: number;
  teachers: number;
  recentAnnouncements: any[];
  upcomingTasks: any[];
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    documents: 0,
    lectures: 0,
    students: 0,
    teachers: 0,
    recentAnnouncements: [],
    upcomingTasks: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true }));

        // Lấy số lượng tài liệu
        const { count: docCount } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true });

        // Lấy số lượng bài giảng
        const { count: lectureCount } = await supabase
          .from("lectures")
          .select("*", { count: "exact", head: true });

        // Lấy số lượng sinh viên
        const { count: studentCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "STUDENT");

        // Lấy số lượng giảng viên
        const { count: teacherCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "TEACHER");

        // Lấy thông báo gần đây
        const { data: announcements } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        // Lấy bài tập sắp đến hạn
        const { data: tasks } = await supabase
          .from("assignments")
          .select("*")
          .order("due_date", { ascending: true })
          .limit(5);

        setData({
          documents: docCount || 0,
          lectures: lectureCount || 0,
          students: studentCount || 0,
          teachers: teacherCount || 0,
          recentAnnouncements: announcements || [],
          upcomingTasks: tasks || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Không thể tải dữ liệu",
        }));
      }
    };

    fetchDashboardData();
  }, []);

  return data;
}
