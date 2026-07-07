// src/hooks/use-stats.ts
// Vai trò: Lấy dữ liệu thống kê từ database - CẬP NHẬT

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useEffect, useState } from "react";

export interface StatsData {
  documents: number;
  lectures: number;
  students: number;
  projects: number;
  teachers: number;
  loading: boolean;
  error: string | null;
}

export function useStats(): StatsData {
  const [stats, setStats] = useState<StatsData>({
    documents: 0,
    lectures: 0,
    students: 0,
    projects: 0,
    teachers: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        if (!supabase) {
          console.warn("Supabase client not initialized");
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Supabase client not initialized",
          }));
          return;
        }

        // Lấy tất cả dữ liệu song song
        const [
          { count: docCount, error: docError },
          { count: lectureCount, error: lectureError },
          { count: studentCount, error: studentError },
          { count: teacherCount, error: teacherError },
          { count: projectCount, error: projectError },
        ] = await Promise.all([
          supabase
            .from("documents")
            .select("*", { count: "exact", head: true }),
          supabase.from("lectures").select("*", { count: "exact", head: true }),
          supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "STUDENT"),
          supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .in("role", ["TEACHER", "ADMIN"]),
          supabase.from("projects").select("*", { count: "exact", head: true }),
        ]);

        if (docError) console.warn("Error fetching documents count:", docError);
        if (lectureError)
          console.warn("Error fetching lectures count:", lectureError);
        if (studentError)
          console.warn("Error fetching students count:", studentError);
        if (teacherError)
          console.warn("Error fetching teachers count:", teacherError);
        if (projectError)
          console.warn("Error fetching projects count:", projectError);

        setStats({
          documents: docCount || 0,
          lectures: lectureCount || 0,
          students: studentCount || 0,
          teachers: teacherCount || 0,
          projects: projectCount || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Không thể tải dữ liệu",
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}
