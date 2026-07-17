// src/hooks/use-submissions.ts
// Vai trò: Hook quản lý bài nộp - HOÀN CHỈNH

import { supabase } from "@/lib/db/supabase-client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: SubmissionStatus;
  grade: number;
  feedback: string;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
  assignment?: {
    id: string;
    title: string;
    subject: string;
    type: string;
    due_date: string;
  };
}

export function useSubmissions() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching submissions...");

      const { data, error: fetchError } = await supabase
        .from("submissions")
        .select(
          `
          *,
          user:users!submissions_user_id_fkey (
            name,
            email
          ),
          assignment:assignments!submissions_assignment_id_fkey (
            id,
            title,
            subject,
            type,
            due_date
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        setError("Không thể tải danh sách bài nộp");
        return;
      }

      console.log("📥 Fetched submissions:", data?.length || 0);
      setSubmissions(data || []);
    } catch (err) {
      console.error("❌ Error fetching submissions:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Sử dụng RPC để bypass RLS
  const gradeSubmission = async (
    id: string,
    grade: number,
    feedback: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("========================================");
      console.log("📝 BẮT ĐẦU CHẤM ĐIỂM (RPC)");
      console.log("📝 ID:", id);
      console.log("📝 Grade:", grade);
      console.log("📝 Feedback:", feedback);
      console.log("🔍 Current user:", session?.user?.email);
      console.log("🔍 User role:", session?.user?.role);
      console.log("========================================");

      if (!id) {
        return { success: false, error: "Không tìm thấy bài nộp" };
      }

      if (grade < 0 || grade > 10) {
        return { success: false, error: "Điểm phải từ 0 đến 10" };
      }

      // Xác định status
      const status: SubmissionStatus = grade >= 5 ? "APPROVED" : "REJECTED";

      // SỬ DỤNG RPC THAY VÌ UPDATE TRỰC TIẾP
      console.log("📝 Gọi RPC grade_submission_rpc...");
      const { data, error } = await supabase.rpc("grade_submission_rpc", {
        p_submission_id: id,
        p_grade: grade,
        p_feedback: feedback || "",
      });

      if (error) {
        console.error("❌ RPC error:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ RPC thành công:", data);

      // Cập nhật local state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                grade: grade,
                feedback: feedback || "",
                status: status,
                updated_at: new Date().toISOString(),
              }
            : sub,
        ),
      );

      // Fetch lại để đồng bộ
      await fetchSubmissions();

      console.log("✅ CHẤM ĐIỂM THÀNH CÔNG!");
      console.log("========================================");

      return { success: true, data: { id, grade, feedback, status } };
    } catch (error: any) {
      console.error("❌ Grade error:", error);
      return {
        success: false,
        error: error.message || "Có lỗi xảy ra khi chấm điểm",
      };
    }
  };

  const deleteSubmission = async (
    id: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // ✅ Lấy assignment_id trước khi xóa
      const { data: submission } = await supabase
        .from("submissions")
        .select("assignment_id")
        .eq("id", id)
        .single();

      const { error: deleteError } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return { success: false, error: deleteError.message };
      }

      // ✅ Cập nhật count sau khi xóa
      if (submission?.assignment_id) {
        const { count: actualCount, error: countError } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("assignment_id", submission.assignment_id);

        if (!countError && actualCount !== null) {
          await supabase
            .from("assignments")
            .update({
              submissions: actualCount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", submission.assignment_id);
        }
      }

      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      return { success: true };
    } catch (error: any) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }
  };

  const downloadFile = async (
    url: string,
    fileName: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error("Download error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchSubmissions();
    }
  }, [session]);

  return {
    submissions,
    loading,
    error,
    refresh: fetchSubmissions,
    gradeSubmission,
    deleteSubmission,
    downloadFile,
  };
}
