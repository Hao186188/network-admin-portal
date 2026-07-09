// src/hooks/use-assignments.ts
// Vai trò: Hook quản lý assignments - THÊM attachment_urls

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  submissions: number;
  total_students: number;
  points: number;
  attachments: number;
  attachment_urls?: string[]; // ✅ Thêm field này
  user_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

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
}

export function useAssignments() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchedRef = useRef(false);
  const fetchingRef = useRef(false);

  // Lấy danh sách bài tập
  const fetchAssignments = useCallback(async () => {
    if (fetchingRef.current || fetchedRef.current) {
      logger.log("⏭️ Skip fetchAssignments - already fetched");
      return;
    }

    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("assignments")
        .select("*")
        .order("due_date", { ascending: true });

      if (fetchError) throw fetchError;

      setAssignments(data || []);
      fetchedRef.current = true;
    } catch (error: any) {
      logger.error("Error fetching assignments:", error);
      setError(error.message || "Có lỗi xảy ra");
      toast.error("Không thể tải bài tập");
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    fetchedRef.current = false;
    fetchingRef.current = false;
    fetchAssignments();
  }, [session?.user?.id]);

  // Lấy chi tiết bài tập
  const getAssignmentDetail = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data as Assignment;
      } catch (error: any) {
        logger.error("Error fetching assignment detail:", error);
        toast.error(error.message || "Không thể tải chi tiết bài tập");
        return null;
      }
    },
    [toast],
  );

  // Lấy danh sách bài nộp
  const getAssignmentSubmissions = useCallback(
    async (assignmentId: string) => {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select(
            `
          *,
          user:user_id(name, email)
        `,
          )
          .eq("assignment_id", assignmentId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Submission[];
      } catch (error: any) {
        logger.error("Error fetching submissions:", error);
        toast.error(error.message || "Không thể tải danh sách bài nộp");
        return [];
      }
    },
    [toast],
  );

  // Tải file
  const downloadFile = useCallback(
    async (url: string, fileName: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        return true;
      } catch (error: any) {
        logger.error("Error downloading file:", error);
        toast.error(error.message || "Không thể tải file");
        return false;
      }
    },
    [toast],
  );

  // Tạo bài tập - ✅ THÊM attachment_urls
  const createAssignment = useCallback(
    async (data: Partial<Assignment>) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      try {
        const insertData = {
          ...data,
          status: "pending" as const,
          user_id: session.user.id,
          created_by: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // ✅ Đảm bảo attachment_urls được lưu
          attachment_urls: data.attachment_urls || [],
        };

        const { data: newAssignment, error } = await supabase
          .from("assignments")
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;

        setAssignments((prev) => [newAssignment, ...prev]);
        toast.success("Tạo bài tập thành công");
        return newAssignment;
      } catch (error: any) {
        logger.error("Error creating assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra");
        return null;
      }
    },
    [session?.user, toast],
  );

  // Nộp bài tập
  const submitAssignment = useCallback(
    async (data: { assignment_id: string; file: File; user_id: string }) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      try {
        const { assignment_id, file, user_id } = data;

        const filePath = `assignments/${assignment_id}/${user_id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("assignments")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("assignments")
          .getPublicUrl(filePath);

        const { error: submitError } = await supabase
          .from("submissions")
          .insert({
            assignment_id,
            user_id,
            file_url: urlData.publicUrl,
            file_name: file.name,
            file_size: file.size,
            status: "PENDING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (submitError) throw submitError;

        setAssignments((prev) =>
          prev.map((a) =>
            a.id === assignment_id
              ? { ...a, status: "submitted", submissions: a.submissions + 1 }
              : a,
          ),
        );

        toast.success("Nộp bài thành công");
        return true;
      } catch (error: any) {
        logger.error("Error submitting assignment:", error);
        toast.error(error.message || "Có lỗi xảy ra");
        return false;
      }
    },
    [session?.user, toast],
  );

  // Refresh
  const refresh = useCallback(() => {
    fetchedRef.current = false;
    fetchingRef.current = false;
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    getAssignmentDetail,
    getAssignmentSubmissions,
    downloadFile,
    createAssignment,
    submitAssignment,
    refresh,
  };
}
