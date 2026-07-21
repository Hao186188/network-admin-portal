// src/hooks/use-dashboard.ts
// Vai trò: Lấy dữ liệu cho Dashboard từ database

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

interface DashboardData {
  documents: number;
  lectures: number;
  students: number;
  teachers: number;
  recentAnnouncements: any[];
  upcomingTasks: any[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard() {
  const [data, setData] = useState<Omit<DashboardData, "refresh">>({
    documents: 0,
    lectures: 0,
    students: 0,
    teachers: 0,
    recentAnnouncements: [],
    upcomingTasks: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));

      const [docRes, lectureRes, studentRes, teacherRes, announcementsRes, tasksRes] =
        await Promise.all([
          supabase.from("documents").select("*", { count: "exact", head: true }),
          supabase.from("lectures").select("*", { count: "exact", head: true }),
          supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "STUDENT"),
          supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "TEACHER"),
          supabase
            .from("announcements")
            .select("id, title, category, created_at")
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("assignments")
            .select("*")
            .gte("due_date", new Date().toISOString()) // chỉ lấy bài chưa quá hạn
            .order("due_date", { ascending: true })
            .limit(5),
        ]);

      setData({
        documents: docRes.count || 0,
        lectures: lectureRes.count || 0,
        students: studentRes.count || 0,
        teachers: teacherRes.count || 0,
        recentAnnouncements: announcementsRes.data || [],
        upcomingTasks: tasksRes.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Không thể tải dữ liệu",
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { ...data, refresh: fetchDashboardData };
}
