// src/hooks/use-submissions.ts
// Vai trò: Lấy và quản lý dữ liệu bài nộp từ database

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { useCallback, useEffect, useState } from "react";

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  grade: number;
  feedback: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
  assignment?: {
    title: string;
    subject: string;
    type: string;
    due_date: string;
  };
}

interface UseSubmissionsReturn {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  gradeSubmission: (
    submissionId: string,
    grade: number,
    feedback: string,
  ) => Promise<boolean>;
  getSubmissionsByAssignment: (assignmentId: string) => Promise<Submission[]>;
}

export function useSubmissions(): UseSubmissionsReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        console.warn("Supabase client not initialized");
        setSubmissions([]);
        setError("Supabase client not initialized");
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from("submissions")
        .select(
          `
          *,
          user:users(name, email),
          assignment:assignments(title, subject, type, due_date)
        `,
        )
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Supabase error:", dbError);
        setError(dbError.message);
        setSubmissions([]);
        setLoading(false);
        return;
      }

      setSubmissions(data || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError(err instanceof Error ? err.message : "Không thể tải bài nộp");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubmissionsByAssignment = useCallback(
    async (assignmentId: string): Promise<Submission[]> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { data, error: dbError } = await supabase
          .from("submissions")
          .select(
            `
          *,
          user:users(name, email)
        `,
          )
          .eq("assignment_id", assignmentId)
          .order("created_at", { ascending: false });

        if (dbError) {
          console.error("Supabase error:", dbError);
          throw new Error(dbError.message);
        }

        return data || [];
      } catch (err) {
        console.error("Error fetching submissions by assignment:", err);
        throw err;
      }
    },
    [],
  );

  const gradeSubmission = useCallback(
    async (
      submissionId: string,
      grade: number,
      feedback: string,
    ): Promise<boolean> => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized");
        }

        const { error: dbError } = await supabase
          .from("submissions")
          .update({
            grade: grade,
            feedback: feedback,
            status: "APPROVED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", submissionId);

        if (dbError) {
          console.error("Supabase update error:", dbError);
          throw new Error(dbError.message);
        }

        await fetchSubmissions();
        return true;
      } catch (err) {
        console.error("Error grading submission:", err);
        throw err;
      }
    },
    [fetchSubmissions],
  );

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refresh: fetchSubmissions,
    gradeSubmission,
    getSubmissionsByAssignment,
  };
}
